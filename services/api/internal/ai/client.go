package ai

import (
	"context"
	"fmt"

	"github.com/upkeep/api/internal/config"
)

// EmbeddingDim is the dimension used for gemini-embedding-001 output truncated
// to Firestore vector-search index size (see firestore/firestore.indexes.json).
const EmbeddingDim = 768

// GroundingChunk is a single manual chunk the LLM can ground its answer in.
type GroundingChunk struct {
	ManualID    string
	ManualTitle string
	Page        int
	Text        string
	Score       float32
}

// Citation emitted by the model.
type Citation struct {
	ManualID    string `json:"manualId"`
	ManualTitle string `json:"manualTitle"`
	Page        int    `json:"page"`
	Snippet     string `json:"snippet"`
}

// PartRef extracted by the model.
type PartRef struct {
	PartNumber  string `json:"partNumber"`
	Description string `json:"description,omitempty"`
}

type Answer struct {
	Text      string     `json:"text"`
	Citations []Citation `json:"citations"`
	Parts     []PartRef  `json:"parts"`
}

// Client is the narrow AI interface the rest of the API depends on.
// Two implementations: liveClient (Gemini REST API) and stubClient (offline).
type Client interface {
	Embed(ctx context.Context, texts []string) ([][]float32, error)
	EmbedQuery(ctx context.Context, text string) ([]float32, error)
	AnswerGrounded(ctx context.Context, question string, grounding []GroundingChunk, imageURLs []string) (Answer, error)
	ExtractParts(ctx context.Context, answer string) ([]PartRef, error)
}

// New returns a live Gemini client if an API key is set, otherwise a deterministic stub.
func New(ctx context.Context, cfg config.Config) Client {
	if cfg.GeminiAPIKey == "" {
		return newStubClient()
	}
	return newLiveClient(cfg.GeminiAPIKey)
}

// Truncate embedding to the configured dimension. Gemini's embedding model can
// output larger vectors; we truncate deterministically to 768 for Firestore.
func truncateEmbedding(v []float32) []float32 {
	if len(v) <= EmbeddingDim {
		out := make([]float32, EmbeddingDim)
		copy(out, v)
		return out
	}
	return v[:EmbeddingDim]
}

// ErrTransient signals a retryable upstream failure (rate limit, 5xx).
type TransientError struct{ Err error }

func (e *TransientError) Error() string { return fmt.Sprintf("transient: %v", e.Err) }
func (e *TransientError) Unwrap() error { return e.Err }
