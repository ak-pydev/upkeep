package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strings"
	"time"
)

const (
	ModelChat      = "gemini-2.5-pro"
	ModelCheap     = "gemini-2.5-flash"
	ModelEmbedding = "gemini-embedding-001"

	generativeBase = "https://generativelanguage.googleapis.com/v1beta"
)

type liveClient struct {
	apiKey string
	httpc  *http.Client
}

func newLiveClient(key string) Client {
	return &liveClient{
		apiKey: key,
		httpc:  &http.Client{Timeout: 60 * time.Second},
	}
}

// ----- Embeddings -----

type embedReq struct {
	Model   string `json:"model"`
	Content struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"content"`
	TaskType             string `json:"taskType,omitempty"`
	OutputDimensionality int    `json:"outputDimensionality,omitempty"`
}

type embedResp struct {
	Embedding struct {
		Values []float32 `json:"values"`
	} `json:"embedding"`
}

func (c *liveClient) Embed(ctx context.Context, texts []string) ([][]float32, error) {
	out := make([][]float32, len(texts))
	for i, t := range texts {
		v, err := c.embedOne(ctx, t, "RETRIEVAL_DOCUMENT")
		if err != nil {
			return nil, fmt.Errorf("embed[%d]: %w", i, err)
		}
		out[i] = truncateEmbedding(v)
	}
	return out, nil
}

func (c *liveClient) EmbedQuery(ctx context.Context, text string) ([]float32, error) {
	v, err := c.embedOne(ctx, text, "RETRIEVAL_QUERY")
	if err != nil {
		return nil, err
	}
	return truncateEmbedding(v), nil
}

func (c *liveClient) embedOne(ctx context.Context, text, taskType string) ([]float32, error) {
	url := fmt.Sprintf("%s/models/%s:embedContent?key=%s", generativeBase, ModelEmbedding, c.apiKey)
	body := embedReq{
		Model:                "models/" + ModelEmbedding,
		TaskType:             taskType,
		OutputDimensionality: EmbeddingDim,
	}
	body.Content.Parts = []struct {
		Text string `json:"text"`
	}{{Text: text}}

	var resp embedResp
	if err := c.doJSON(ctx, http.MethodPost, url, body, &resp); err != nil {
		return nil, err
	}
	if len(resp.Embedding.Values) == 0 {
		return nil, errors.New("empty embedding")
	}
	return resp.Embedding.Values, nil
}

// ----- Grounded answer -----

type genPart struct {
	Text       string             `json:"text,omitempty"`
	InlineData *inlineBlobPayload `json:"inlineData,omitempty"`
	FileData   *fileDataPayload   `json:"fileData,omitempty"`
}

type inlineBlobPayload struct {
	MimeType string `json:"mimeType"`
	Data     string `json:"data"`
}

type fileDataPayload struct {
	MimeType string `json:"mimeType"`
	FileURI  string `json:"fileUri"`
}

type genContent struct {
	Role  string    `json:"role,omitempty"`
	Parts []genPart `json:"parts"`
}

type genReq struct {
	Contents          []genContent `json:"contents"`
	SystemInstruction *genContent  `json:"systemInstruction,omitempty"`
	GenerationConfig  struct {
		ResponseMimeType string  `json:"responseMimeType,omitempty"`
		Temperature      float64 `json:"temperature,omitempty"`
	} `json:"generationConfig,omitempty"`
}

type genResp struct {
	Candidates []struct {
		Content genContent `json:"content"`
	} `json:"candidates"`
	Error *struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
		Status  string `json:"status"`
	} `json:"error,omitempty"`
}

func (c *liveClient) AnswerGrounded(ctx context.Context, question string, grounding []GroundingChunk, imageURLs []string) (Answer, error) {
	sys := `You are Upkeep, an expert industrial maintenance assistant for small manufacturers.
Rules:
1. ONLY use the provided manual excerpts as source-of-truth. If they don't answer the question, say so plainly.
2. Respond in this exact JSON format: {"text": string, "citations": [{"manualId","manualTitle","page","snippet"}], "parts":[{"partNumber","description"}]}
3. Cite every factual claim with at least one citation indexing the supporting excerpt.
4. Never prescribe an action that could injure someone without calling out safety steps.
5. Extract part numbers mentioned in the answer into the parts array.`

	var promptBuf bytes.Buffer
	fmt.Fprintf(&promptBuf, "Question: %s\n\n", question)
	if len(grounding) == 0 {
		promptBuf.WriteString("(No manual excerpts were found for this query.)\n")
	} else {
		promptBuf.WriteString("Manual excerpts (use ONLY these for grounding):\n")
		for i, g := range grounding {
			fmt.Fprintf(&promptBuf, "\n[#%d] manualId=%s manualTitle=%q page=%d\n%s\n",
				i+1, g.ManualID, g.ManualTitle, g.Page, g.Text)
		}
	}

	req := genReq{
		SystemInstruction: &genContent{Parts: []genPart{{Text: sys}}},
		Contents: []genContent{{
			Role:  "user",
			Parts: []genPart{{Text: promptBuf.String()}},
		}},
	}
	req.GenerationConfig.ResponseMimeType = "application/json"
	req.GenerationConfig.Temperature = 0.2

	// Attach images as fileData (expects Gemini-accessible URL).
	for _, url := range imageURLs {
		req.Contents[0].Parts = append(req.Contents[0].Parts, genPart{
			FileData: &fileDataPayload{MimeType: "image/jpeg", FileURI: url},
		})
	}

	url := fmt.Sprintf("%s/models/%s:generateContent?key=%s", generativeBase, ModelChat, c.apiKey)
	var resp genResp
	if err := c.doJSON(ctx, http.MethodPost, url, req, &resp); err != nil {
		return Answer{}, err
	}
	if resp.Error != nil {
		return Answer{}, fmt.Errorf("gemini: %s", resp.Error.Message)
	}
	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return Answer{}, errors.New("gemini returned no candidates")
	}
	raw := strings.TrimSpace(resp.Candidates[0].Content.Parts[0].Text)
	// sometimes wrapped in ```json
	raw = strings.TrimPrefix(raw, "```json")
	raw = strings.TrimPrefix(raw, "```")
	raw = strings.TrimSuffix(raw, "```")
	raw = strings.TrimSpace(raw)

	var ans Answer
	if err := json.Unmarshal([]byte(raw), &ans); err != nil {
		// Fallback: treat whole response as text, extract parts heuristically.
		slog.Warn("gemini response not valid json, falling back", "err", err)
		ans = Answer{Text: raw, Citations: toCits(grounding)}
	}
	if len(ans.Parts) == 0 {
		ans.Parts = extractPartsRegex(ans.Text)
	}
	return ans, nil
}

func (c *liveClient) ExtractParts(ctx context.Context, text string) ([]PartRef, error) {
	// Use the cheap flash model for part extraction.
	sys := `Extract any industrial part numbers mentioned in the text. Respond as JSON: {"parts":[{"partNumber","description"}]}. Only include strings that look like actual part numbers (alphanumeric codes, not sentences).`
	req := genReq{
		SystemInstruction: &genContent{Parts: []genPart{{Text: sys}}},
		Contents:          []genContent{{Role: "user", Parts: []genPart{{Text: text}}}},
	}
	req.GenerationConfig.ResponseMimeType = "application/json"
	req.GenerationConfig.Temperature = 0.0

	url := fmt.Sprintf("%s/models/%s:generateContent?key=%s", generativeBase, ModelCheap, c.apiKey)
	var resp genResp
	if err := c.doJSON(ctx, http.MethodPost, url, req, &resp); err != nil {
		// fallback to regex
		return extractPartsRegex(text), nil
	}
	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return extractPartsRegex(text), nil
	}
	raw := strings.TrimSpace(resp.Candidates[0].Content.Parts[0].Text)
	raw = strings.TrimPrefix(raw, "```json")
	raw = strings.TrimPrefix(raw, "```")
	raw = strings.TrimSuffix(raw, "```")
	var out struct {
		Parts []PartRef `json:"parts"`
	}
	if err := json.Unmarshal([]byte(raw), &out); err != nil {
		return extractPartsRegex(text), nil
	}
	if len(out.Parts) == 0 {
		return extractPartsRegex(text), nil
	}
	return out.Parts, nil
}

func (c *liveClient) doJSON(ctx context.Context, method, url string, body any, into any) error {
	const maxAttempts = 3
	var lastErr error
	for attempt := 1; attempt <= maxAttempts; attempt++ {
		payload, _ := json.Marshal(body)
		req, err := http.NewRequestWithContext(ctx, method, url, bytes.NewReader(payload))
		if err != nil {
			return err
		}
		req.Header.Set("Content-Type", "application/json")
		resp, err := c.httpc.Do(req)
		if err != nil {
			lastErr = err
			time.Sleep(backoff(attempt))
			continue
		}
		b, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		if resp.StatusCode == http.StatusTooManyRequests || resp.StatusCode >= 500 {
			lastErr = fmt.Errorf("gemini http %d: %s", resp.StatusCode, string(b))
			time.Sleep(backoff(attempt))
			continue
		}
		if resp.StatusCode >= 400 {
			return fmt.Errorf("gemini http %d: %s", resp.StatusCode, string(b))
		}
		return json.Unmarshal(b, into)
	}
	return &TransientError{Err: lastErr}
}

func backoff(attempt int) time.Duration {
	return time.Duration(200*attempt*attempt) * time.Millisecond
}

func toCits(g []GroundingChunk) []Citation {
	out := make([]Citation, 0, len(g))
	for _, c := range g {
		out = append(out, Citation{
			ManualID: c.ManualID, ManualTitle: c.ManualTitle, Page: c.Page, Snippet: firstSentence(c.Text),
		})
	}
	return out
}
