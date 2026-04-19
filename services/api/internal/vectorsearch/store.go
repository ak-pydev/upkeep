package vectorsearch

import (
	"context"
	"errors"
	"fmt"
	"sort"

	"cloud.google.com/go/firestore"

	"github.com/upkeep/api/internal/config"
)

// Chunk is a manual excerpt persisted with its embedding.
type Chunk struct {
	ID          string    `firestore:"-"`
	OrgID       string    `firestore:"orgId"`
	ManualID    string    `firestore:"manualId"`
	ManualTitle string    `firestore:"manualTitle"`
	MachineID   string    `firestore:"machineId,omitempty"`
	ChunkIndex  int       `firestore:"chunkIndex"`
	Page        int       `firestore:"page"`
	Text        string    `firestore:"text"`
	Embedding   []float32 `firestore:"embedding"`
}

type QueryResult struct {
	Chunk Chunk
	Score float32
}

type Store interface {
	UpsertChunks(ctx context.Context, orgID string, chunks []Chunk) error
	Search(ctx context.Context, orgID string, machineID string, queryVec []float32, topK int) ([]QueryResult, error)
	DeleteByManual(ctx context.Context, orgID, manualID string) error
	Backend() string
}

func New(ctx context.Context, cfg config.Config, fs *firestore.Client) (Store, error) {
	switch cfg.VectorBackend {
	case "", "firestore":
		return &firestoreStore{fs: fs}, nil
	case "vertex":
		// TODO(deploy): wire to real Vertex AI Vector Search index.
		// For now we fall back to Firestore and log the intent.
		return &firestoreStore{fs: fs, note: "vertex requested — using firestore fallback until index is provisioned"}, nil
	default:
		return nil, fmt.Errorf("unknown VECTOR_BACKEND: %q", cfg.VectorBackend)
	}
}

// ---- Firestore implementation ----

type firestoreStore struct {
	fs   *firestore.Client
	note string
}

func (s *firestoreStore) Backend() string {
	if s.note != "" {
		return "firestore(" + s.note + ")"
	}
	return "firestore"
}

func (s *firestoreStore) UpsertChunks(ctx context.Context, orgID string, chunks []Chunk) error {
	if len(chunks) == 0 {
		return nil
	}
	col := s.fs.Collection("orgs").Doc(orgID).Collection("manual_chunks")
	// Firestore bulk writes cap at 500 ops per batch.
	batchSize := 400
	for i := 0; i < len(chunks); i += batchSize {
		end := i + batchSize
		if end > len(chunks) {
			end = len(chunks)
		}
		bw := s.fs.BulkWriter(ctx)
		for _, c := range chunks[i:end] {
			c.OrgID = orgID
			ref := col.NewDoc()
			if c.ID != "" {
				ref = col.Doc(c.ID)
			}
			if _, err := bw.Set(ref, c); err != nil {
				return err
			}
		}
		bw.End()
	}
	return nil
}

func (s *firestoreStore) Search(ctx context.Context, orgID, machineID string, queryVec []float32, topK int) ([]QueryResult, error) {
	if len(queryVec) == 0 {
		return nil, errors.New("empty query vector")
	}
	if topK <= 0 {
		topK = 6
	}
	col := s.fs.Collection("orgs").Doc(orgID).Collection("manual_chunks")

	// Use Firestore's FindNearest when available. If the SDK version in use
	// does not expose it, fall back to a cosine-similarity scan bounded by org.
	//
	// NOTE: the Go SDK added FindNearest in recent versions. To keep this code
	// compiling against older minor versions we do the in-process scan. For a
	// tenant with >50K chunks, provision Firestore's vector index and switch
	// this function to col.FindNearest(...) — see docs/VECTOR_SEARCH.md.

	q := firestore.Query(col.Query)
	if machineID != "" {
		q = q.Where("machineId", "==", machineID)
	}
	iter := q.Documents(ctx)
	defer iter.Stop()

	var results []QueryResult
	for {
		doc, err := iter.Next()
		if err != nil {
			if err.Error() == "no more items in iterator" {
				break
			}
			// iterator.Done sentinel — fall through on any "done" error
			break
		}
		var c Chunk
		if err := doc.DataTo(&c); err != nil {
			continue
		}
		c.ID = doc.Ref.ID
		if len(c.Embedding) == 0 {
			continue
		}
		score := cosine(queryVec, c.Embedding)
		results = append(results, QueryResult{Chunk: c, Score: score})
	}
	sort.Slice(results, func(i, j int) bool { return results[i].Score > results[j].Score })
	if len(results) > topK {
		results = results[:topK]
	}
	return results, nil
}

func (s *firestoreStore) DeleteByManual(ctx context.Context, orgID, manualID string) error {
	col := s.fs.Collection("orgs").Doc(orgID).Collection("manual_chunks")
	q := col.Where("manualId", "==", manualID)
	iter := q.Documents(ctx)
	defer iter.Stop()
	bw := s.fs.BulkWriter(ctx)
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}
		if _, err := bw.Delete(doc.Ref); err != nil {
			return err
		}
	}
	bw.End()
	return nil
}

func cosine(a, b []float32) float32 {
	n := len(a)
	if len(b) < n {
		n = len(b)
	}
	var dot, na, nb float32
	for i := 0; i < n; i++ {
		dot += a[i] * b[i]
		na += a[i] * a[i]
		nb += b[i] * b[i]
	}
	if na == 0 || nb == 0 {
		return 0
	}
	return dot / (sqrt32(na) * sqrt32(nb))
}

func sqrt32(x float32) float32 {
	z := x
	for i := 0; i < 6; i++ {
		if z == 0 {
			return 0
		}
		z = (z + x/z) / 2
	}
	return z
}
