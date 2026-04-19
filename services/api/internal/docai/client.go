package docai

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/upkeep/api/internal/config"
	"golang.org/x/oauth2/google"
)

// Page is a parsed page from a manual.
type Page struct {
	PageNumber int    `json:"pageNumber"`
	Text       string `json:"text"`
}

type Result struct {
	Pages []Page `json:"pages"`
}

type Client interface {
	Parse(ctx context.Context, pdfBytes []byte, mimeType string) (Result, error)
}

func New(ctx context.Context, cfg config.Config) Client {
	if cfg.DocAIProcessorID == "" {
		return &stubClient{}
	}
	return &liveClient{
		projectID:   cfg.ProjectID,
		location:    cfg.DocAILocation,
		processorID: cfg.DocAIProcessorID,
	}
}

// ---- stub ----

type stubClient struct{}

// Parse returns a naive page split of the uploaded PDF-as-text. Real Doc AI
// requires GCP creds; the stub lets the full pipeline run offline with a
// synthetic text file.
func (s *stubClient) Parse(_ context.Context, raw []byte, mimeType string) (Result, error) {
	text := string(raw)
	if strings.HasPrefix(mimeType, "text/") {
		// already plain text
	} else {
		// Very rough PDF fallback: strip binary, keep ASCII spans.
		text = stripBinary(raw)
	}
	pages := splitIntoSyntheticPages(text, 1800) // approx words per page
	out := make([]Page, 0, len(pages))
	for i, p := range pages {
		out = append(out, Page{PageNumber: i + 1, Text: p})
	}
	if len(out) == 0 {
		return Result{}, errors.New("no text extracted (stub mode)")
	}
	return Result{Pages: out}, nil
}

func stripBinary(b []byte) string {
	var out strings.Builder
	run := 0
	for _, c := range b {
		if c == '\n' || c == '\t' || (c >= 32 && c < 127) {
			out.WriteByte(c)
			run++
		} else if run > 0 {
			out.WriteByte(' ')
			run = 0
		}
	}
	return out.String()
}

func splitIntoSyntheticPages(text string, chunkChars int) []string {
	text = strings.TrimSpace(text)
	if text == "" {
		return nil
	}
	var pages []string
	for len(text) > chunkChars {
		cut := chunkChars
		// break on nearest newline/space
		for cut < len(text) && text[cut] != ' ' && text[cut] != '\n' && cut < chunkChars+200 {
			cut++
		}
		pages = append(pages, text[:cut])
		text = text[cut:]
	}
	if len(text) > 0 {
		pages = append(pages, text)
	}
	return pages
}

// ---- live ----

type liveClient struct {
	projectID   string
	location    string
	processorID string
}

type processReq struct {
	RawDocument struct {
		Content  string `json:"content"`
		MimeType string `json:"mimeType"`
	} `json:"rawDocument"`
}

type processResp struct {
	Document struct {
		Text  string `json:"text"`
		Pages []struct {
			PageNumber int `json:"pageNumber"`
			Layout     struct {
				TextAnchor struct {
					TextSegments []struct {
						StartIndex string `json:"startIndex"`
						EndIndex   string `json:"endIndex"`
					} `json:"textSegments"`
				} `json:"textAnchor"`
			} `json:"layout"`
		} `json:"pages"`
	} `json:"document"`
}

func (c *liveClient) Parse(ctx context.Context, raw []byte, mimeType string) (Result, error) {
	endpoint := fmt.Sprintf("https://%s-documentai.googleapis.com/v1/projects/%s/locations/%s/processors/%s:process",
		c.location, c.projectID, c.location, c.processorID)

	body := processReq{}
	body.RawDocument.Content = base64.StdEncoding.EncodeToString(raw)
	if mimeType == "" {
		mimeType = "application/pdf"
	}
	body.RawDocument.MimeType = mimeType

	tokSrc, err := google.DefaultTokenSource(ctx, "https://www.googleapis.com/auth/cloud-platform")
	if err != nil {
		return Result{}, fmt.Errorf("docai auth: %w", err)
	}
	tok, err := tokSrc.Token()
	if err != nil {
		return Result{}, fmt.Errorf("docai token: %w", err)
	}

	payload, _ := json.Marshal(body)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(payload))
	if err != nil {
		return Result{}, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+tok.AccessToken)

	httpc := &http.Client{Timeout: 120 * time.Second}
	resp, err := httpc.Do(req)
	if err != nil {
		return Result{}, err
	}
	defer resp.Body.Close()
	rb, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return Result{}, fmt.Errorf("docai http %d: %s", resp.StatusCode, string(rb))
	}
	var pr processResp
	if err := json.Unmarshal(rb, &pr); err != nil {
		return Result{}, fmt.Errorf("docai decode: %w", err)
	}

	pages := make([]Page, 0, len(pr.Document.Pages))
	text := pr.Document.Text
	for _, p := range pr.Document.Pages {
		var sb strings.Builder
		for _, seg := range p.Layout.TextAnchor.TextSegments {
			start := parseIdx(seg.StartIndex)
			end := parseIdx(seg.EndIndex)
			if end > len(text) {
				end = len(text)
			}
			if start < end {
				sb.WriteString(text[start:end])
			}
		}
		pages = append(pages, Page{PageNumber: p.PageNumber, Text: sb.String()})
	}
	return Result{Pages: pages}, nil
}

func parseIdx(s string) int {
	n := 0
	for _, r := range s {
		if r < '0' || r > '9' {
			return n
		}
		n = n*10 + int(r-'0')
	}
	return n
}
