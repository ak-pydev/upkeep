package ai

import (
	"context"
	"crypto/sha256"
	"encoding/binary"
	"fmt"
	"regexp"
	"strings"
)

// stubClient returns deterministic, offline-friendly answers and embeddings so the
// full app can run without a Gemini API key.
type stubClient struct{}

func newStubClient() Client { return &stubClient{} }

func (s *stubClient) Embed(_ context.Context, texts []string) ([][]float32, error) {
	out := make([][]float32, len(texts))
	for i, t := range texts {
		out[i] = deterministicVector(t)
	}
	return out, nil
}

func (s *stubClient) EmbedQuery(_ context.Context, text string) ([]float32, error) {
	return deterministicVector(text), nil
}

func (s *stubClient) AnswerGrounded(_ context.Context, question string, grounding []GroundingChunk, _ []string) (Answer, error) {
	// Synthesize an answer that references grounding chunks so citations render end-to-end.
	var b strings.Builder
	fmt.Fprintf(&b, "Based on the indexed manuals, here is what I found for: %q.\n\n", question)
	if len(grounding) == 0 {
		b.WriteString("No manual chunks matched this query. Try uploading the relevant manual first.\n")
	} else {
		for i, g := range grounding {
			if i >= 3 {
				break
			}
			fmt.Fprintf(&b, "- (from %s, p.%d): %s\n", g.ManualTitle, g.Page, firstSentence(g.Text))
		}
		b.WriteString("\nRecommended next steps: verify the diagnosis against the cited pages, then follow your shop's repair SOP.\n")
	}
	text := b.String()
	cits := make([]Citation, 0, len(grounding))
	for i, g := range grounding {
		if i >= 3 {
			break
		}
		cits = append(cits, Citation{
			ManualID:    g.ManualID,
			ManualTitle: g.ManualTitle,
			Page:        g.Page,
			Snippet:     firstSentence(g.Text),
		})
	}
	parts, _ := s.ExtractParts(nil, text+"\n"+joinChunks(grounding))
	return Answer{Text: text, Citations: cits, Parts: parts}, nil
}

func (s *stubClient) ExtractParts(_ context.Context, text string) ([]PartRef, error) {
	return extractPartsRegex(text), nil
}

// extractPartsRegex finds likely part numbers (used both in stub mode and as
// a cheap fallback for the live client).
func extractPartsRegex(text string) []PartRef {
	// Common patterns: 8 digits, alpha-dash-digits, McMaster-style
	re := regexp.MustCompile(`\b([A-Z]{1,3}[- ]?\d{2,}[-A-Z0-9]*|\d{4,}[A-Z]?\d*)\b`)
	seen := map[string]bool{}
	out := []PartRef{}
	for _, m := range re.FindAllString(text, -1) {
		m = strings.TrimSpace(m)
		if len(m) < 5 || len(m) > 24 {
			continue
		}
		if seen[m] {
			continue
		}
		seen[m] = true
		out = append(out, PartRef{PartNumber: m})
		if len(out) >= 8 {
			break
		}
	}
	return out
}

func deterministicVector(text string) []float32 {
	out := make([]float32, EmbeddingDim)
	// Hash the text into 32-byte blocks, cycle to fill 768 floats.
	seed := []byte(strings.ToLower(text))
	block := sha256.Sum256(seed)
	for i := 0; i < EmbeddingDim; i++ {
		off := (i * 4) % (len(block) - 4)
		u := binary.LittleEndian.Uint32(block[off : off+4])
		// map to [-1, 1]
		out[i] = (float32(u%20000) / 10000.0) - 1.0
		if i%32 == 31 {
			// rehash to avoid pure repetition
			block = sha256.Sum256(append(block[:], byte(i)))
		}
	}
	// L2 normalize
	var norm float32
	for _, v := range out {
		norm += v * v
	}
	if norm > 0 {
		inv := 1.0 / sqrt32(norm)
		for i := range out {
			out[i] *= inv
		}
	}
	return out
}

func sqrt32(x float32) float32 {
	// Newton's method, good enough for unit-vector normalization.
	z := x
	for i := 0; i < 6; i++ {
		if z == 0 {
			return 0
		}
		z = (z + x/z) / 2
	}
	return z
}

func firstSentence(s string) string {
	s = strings.TrimSpace(s)
	for i, r := range s {
		if r == '.' || r == '\n' {
			return s[:i+1]
		}
		if i > 200 {
			return s[:i] + "…"
		}
	}
	return s
}

func joinChunks(cs []GroundingChunk) string {
	out := make([]string, 0, len(cs))
	for _, c := range cs {
		out = append(out, c.Text)
	}
	return strings.Join(out, " ")
}
