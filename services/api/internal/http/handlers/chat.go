package handlers

import (
	"net/http"
	"net/url"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/google/uuid"
	"google.golang.org/api/iterator"

	"github.com/upkeep/api/internal/ai"
	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/http/httpx"
	"github.com/upkeep/api/internal/vectorsearch"
)

type ChatHandler struct {
	fs     *firestore.Client
	ai     ai.Client
	vstore vectorsearch.Store
	cfg    config.Config
}

func NewChatHandler(fs *firestore.Client, a ai.Client, v vectorsearch.Store, cfg config.Config) *ChatHandler {
	return &ChatHandler{fs: fs, ai: a, vstore: v, cfg: cfg}
}

type askReq struct {
	MachineID string   `json:"machineId,omitempty"`
	ThreadID  string   `json:"threadId,omitempty"`
	Question  string   `json:"question"`
	ImageURLs []string `json:"imageUrls,omitempty"`
}

type partOut struct {
	PartNumber  string `json:"partNumber"`
	Description string `json:"description,omitempty"`
	McMasterURL string `json:"mcmasterUrl,omitempty"`
	GraingerURL string `json:"graingerUrl,omitempty"`
}

type messageDoc struct {
	Role      string      `firestore:"role"`
	Text      string      `firestore:"text"`
	Citations interface{} `firestore:"citations,omitempty"`
	Parts     interface{} `firestore:"parts,omitempty"`
	ImageURLs []string    `firestore:"imageUrls,omitempty"`
	CreatedAt time.Time   `firestore:"createdAt"`
}

type threadDoc struct {
	MachineID string    `firestore:"machineId,omitempty"`
	Title     string    `firestore:"title"`
	CreatedBy string    `firestore:"createdBy"`
	CreatedAt time.Time `firestore:"createdAt"`
	UpdatedAt time.Time `firestore:"updatedAt"`
}

func (h *ChatHandler) Ask(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	var req askReq
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", err.Error())
		return
	}
	if req.Question == "" {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "question required")
		return
	}

	// 1. embed the query
	qvec, err := h.ai.EmbedQuery(r.Context(), req.Question)
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "embed_failed", err.Error())
		return
	}

	// 2. vector search
	hits, err := h.vstore.Search(r.Context(), p.OrgID, req.MachineID, qvec, 6)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "search_failed", err.Error())
		return
	}
	grounding := make([]ai.GroundingChunk, 0, len(hits))
	for _, h2 := range hits {
		grounding = append(grounding, ai.GroundingChunk{
			ManualID:    h2.Chunk.ManualID,
			ManualTitle: h2.Chunk.ManualTitle,
			Page:        h2.Chunk.Page,
			Text:        h2.Chunk.Text,
			Score:       h2.Score,
		})
	}

	// 3. grounded answer
	answer, err := h.ai.AnswerGrounded(r.Context(), req.Question, grounding, req.ImageURLs)
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "ai_failed", err.Error())
		return
	}

	// 4. enrich parts with McMaster / Grainger URL templates
	partsHelper := NewPartsHandler(h.ai, h.cfg)
	partsOut := make([]partOut, 0, len(answer.Parts))
	for _, pt := range answer.Parts {
		entry := partLookup{
			PartNumber:  pt.PartNumber,
			Description: pt.Description,
			McMasterURL: "https://www.mcmaster.com/" + url.PathEscape(pt.PartNumber),
			GraingerURL: "https://www.grainger.com/search?searchQuery=" + url.QueryEscape(pt.PartNumber),
		}
		if h.cfg.PartsRealAPI {
			entry = partsHelper.enrichGrainger(r.Context(), entry)
		}
		partsOut = append(partsOut, partOut{
			PartNumber:  entry.PartNumber,
			Description: entry.Description,
			McMasterURL: entry.McMasterURL,
			GraingerURL: entry.GraingerURL,
		})
	}

	// 5. persist thread + user + assistant messages
	now := time.Now().UTC()
	threadID := req.ThreadID
	threadCol := h.fs.Collection("orgs").Doc(p.OrgID).Collection("threads")
	if threadID == "" {
		threadID = uuid.NewString()
		title := req.Question
		if len(title) > 80 {
			title = title[:80] + "…"
		}
		_, err := threadCol.Doc(threadID).Set(r.Context(), threadDoc{
			MachineID: req.MachineID,
			Title:     title,
			CreatedBy: p.UID,
			CreatedAt: now,
			UpdatedAt: now,
		})
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
			return
		}
	} else {
		if _, err := threadCol.Doc(threadID).Update(r.Context(), []firestore.Update{{Path: "updatedAt", Value: now}}); err != nil {
			httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
			return
		}
	}

	messages := threadCol.Doc(threadID).Collection("messages")

	if _, err := messages.NewDoc().Set(r.Context(), messageDoc{
		Role:      "user",
		Text:      req.Question,
		ImageURLs: req.ImageURLs,
		CreatedAt: now,
	}); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}

	assistantID := uuid.NewString()
	_, err = messages.Doc(assistantID).Set(r.Context(), messageDoc{
		Role:      "assistant",
		Text:      answer.Text,
		Citations: answer.Citations,
		Parts:     partsOut,
		CreatedAt: time.Now().UTC(),
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}

	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "chat.ask", "threads/"+threadID, map[string]any{"question_len": len(req.Question)})

	httpx.JSON(w, http.StatusOK, map[string]any{
		"threadId": threadID,
		"message": map[string]any{
			"id":        assistantID,
			"role":      "assistant",
			"text":      answer.Text,
			"citations": answer.Citations,
			"parts":     partsOut,
			"createdAt": time.Now().UTC(),
		},
	})
}

func (h *ChatHandler) ListThreads(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	iter := h.fs.Collection("orgs").Doc(p.OrgID).Collection("threads").
		OrderBy("updatedAt", firestore.Desc).Limit(50).Documents(r.Context())
	defer iter.Stop()
	var out []map[string]any
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
			return
		}
		d := doc.Data()
		d["id"] = doc.Ref.ID
		out = append(out, d)
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"threads": out})
}

func (h *ChatHandler) GetThread(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	id := urlParam(r, "id")
	msgIter := h.fs.Collection("orgs").Doc(p.OrgID).Collection("threads").Doc(id).
		Collection("messages").OrderBy("createdAt", firestore.Asc).Documents(r.Context())
	defer msgIter.Stop()
	var msgs []map[string]any
	for {
		doc, err := msgIter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
			return
		}
		d := doc.Data()
		d["id"] = doc.Ref.ID
		msgs = append(msgs, d)
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"threadId": id, "messages": msgs})
}
