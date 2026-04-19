package handlers

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/google/uuid"
	"google.golang.org/api/iterator"

	"github.com/upkeep/api/internal/ai"
	"github.com/upkeep/api/internal/auth"
	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/docai"
	"github.com/upkeep/api/internal/http/httpx"
	"github.com/upkeep/api/internal/vectorsearch"
)

type ManualsHandler struct {
	fs     *firestore.Client
	docai  docai.Client
	ai     ai.Client
	vstore vectorsearch.Store
	cfg    config.Config
}

func NewManualsHandler(fs *firestore.Client, d docai.Client, a ai.Client, v vectorsearch.Store, cfg config.Config) *ManualsHandler {
	return &ManualsHandler{fs: fs, docai: d, ai: a, vstore: v, cfg: cfg}
}

type manualDoc struct {
	Title       string    `firestore:"title"`
	MachineID   string    `firestore:"machineId,omitempty"`
	Source      string    `firestore:"source"` // oem | internal
	Status      string    `firestore:"status"` // uploaded | parsing | indexed | failed
	PageCount   int       `firestore:"pageCount"`
	ChunkCount  int       `firestore:"chunkCount"`
	Error       string    `firestore:"error,omitempty"`
	UploadedBy  string    `firestore:"uploadedBy"`
	UploadedAt  time.Time `firestore:"uploadedAt"`
	IndexedAt   time.Time `firestore:"indexedAt,omitempty"`
	StoragePath string    `firestore:"storagePath,omitempty"`
}

// Upload accepts multipart/form-data with fields: file, title, machineId, source.
// We parse → chunk → embed → upsert synchronously. For large manuals, move this
// into a Cloud Tasks queue — see TODO(deploy) below.
func (h *ManualsHandler) Upload(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	if !p.HasRole(auth.RoleOwner, auth.RoleSupervisor) {
		httpx.Error(w, http.StatusForbidden, "forbidden", "supervisors or owners only")
		return
	}

	if err := r.ParseMultipartForm(50 << 20); err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "expected multipart (max 50MB): "+err.Error())
		return
	}
	file, header, err := r.FormFile("file")
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "missing file field")
		return
	}
	defer file.Close()

	title := r.FormValue("title")
	if title == "" {
		title = header.Filename
	}
	machineID := r.FormValue("machineId")
	source := r.FormValue("source")
	if source == "" {
		source = "oem"
	}

	raw, err := io.ReadAll(file)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", err.Error())
		return
	}

	manualID := uuid.NewString()
	now := time.Now().UTC()
	md := manualDoc{
		Title:      title,
		MachineID:  machineID,
		Source:     source,
		Status:     "parsing",
		UploadedBy: p.UID,
		UploadedAt: now,
	}
	manualRef := h.fs.Collection("orgs").Doc(p.OrgID).Collection("manuals").Doc(manualID)
	if _, err := manualRef.Set(r.Context(), md); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}

	// Parse
	result, err := h.docai.Parse(r.Context(), raw, header.Header.Get("Content-Type"))
	if err != nil {
		h.markFailed(r, manualRef, "parse: "+err.Error())
		httpx.Error(w, http.StatusUnprocessableEntity, "parse_failed", err.Error())
		return
	}

	// Chunk
	chunks := chunkPages(result.Pages, 900, 120)

	// Embed
	texts := make([]string, len(chunks))
	for i, c := range chunks {
		texts[i] = c.Text
	}
	embeds, err := h.ai.Embed(r.Context(), texts)
	if err != nil {
		h.markFailed(r, manualRef, "embed: "+err.Error())
		httpx.Error(w, http.StatusBadGateway, "embed_failed", err.Error())
		return
	}
	if len(embeds) != len(chunks) {
		h.markFailed(r, manualRef, "embedding count mismatch")
		httpx.Error(w, http.StatusInternalServerError, "embed_failed", "count mismatch")
		return
	}

	// Store
	vsChunks := make([]vectorsearch.Chunk, len(chunks))
	for i, c := range chunks {
		vsChunks[i] = vectorsearch.Chunk{
			OrgID:       p.OrgID,
			ManualID:    manualID,
			ManualTitle: title,
			MachineID:   machineID,
			ChunkIndex:  i,
			Page:        c.Page,
			Text:        c.Text,
			Embedding:   embeds[i],
		}
	}
	if err := h.vstore.UpsertChunks(r.Context(), p.OrgID, vsChunks); err != nil {
		h.markFailed(r, manualRef, "upsert: "+err.Error())
		httpx.Error(w, http.StatusInternalServerError, "index_failed", err.Error())
		return
	}

	_, _ = manualRef.Update(r.Context(), []firestore.Update{
		{Path: "status", Value: "indexed"},
		{Path: "pageCount", Value: len(result.Pages)},
		{Path: "chunkCount", Value: len(chunks)},
		{Path: "indexedAt", Value: time.Now().UTC()},
	})
	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "manual.upload", "manuals/"+manualID, map[string]any{
		"title": title, "pages": len(result.Pages), "chunks": len(chunks),
	})
	httpx.JSON(w, http.StatusCreated, map[string]any{
		"id":         manualID,
		"title":      title,
		"pageCount":  len(result.Pages),
		"chunkCount": len(chunks),
		"status":     "indexed",
	})
}

func (h *ManualsHandler) markFailed(r *http.Request, ref *firestore.DocumentRef, msg string) {
	slog.Error("manual upload failed", "err", msg)
	_, _ = ref.Update(r.Context(), []firestore.Update{
		{Path: "status", Value: "failed"},
		{Path: "error", Value: msg},
	})
}

func (h *ManualsHandler) List(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	iter := h.fs.Collection("orgs").Doc(p.OrgID).Collection("manuals").OrderBy("uploadedAt", firestore.Desc).Documents(r.Context())
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
	httpx.JSON(w, http.StatusOK, map[string]any{"manuals": out})
}

func (h *ManualsHandler) Get(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	id := urlParam(r, "id")
	doc, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("manuals").Doc(id).Get(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "not_found", err.Error())
		return
	}
	d := doc.Data()
	d["id"] = id
	httpx.JSON(w, http.StatusOK, d)
}

func (h *ManualsHandler) Delete(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	if !p.HasRole(auth.RoleOwner) {
		httpx.Error(w, http.StatusForbidden, "forbidden", "owners only")
		return
	}
	id := urlParam(r, "id")
	if err := h.vstore.DeleteByManual(r.Context(), p.OrgID, id); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", "chunks: "+err.Error())
		return
	}
	_, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("manuals").Doc(id).Delete(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "manual.delete", "manuals/"+id, nil)
	httpx.JSON(w, http.StatusOK, map[string]any{"ok": true})
}

// chunk is the local struct produced by chunkPages — mirrors vectorsearch.Chunk fields we care about.
type chunk struct {
	Page int
	Text string
}

// chunkPages splits pages into overlapping word-windows for better retrieval.
func chunkPages(pages []docai.Page, targetChars, overlapChars int) []chunk {
	var out []chunk
	for _, p := range pages {
		text := normalize(p.Text)
		if text == "" {
			continue
		}
		for start := 0; start < len(text); {
			end := start + targetChars
			if end >= len(text) {
				out = append(out, chunk{Page: p.PageNumber, Text: text[start:]})
				break
			}
			// break on nearest whitespace
			breakAt := end
			for breakAt > start && !isWS(text[breakAt]) {
				breakAt--
			}
			if breakAt == start {
				breakAt = end
			}
			out = append(out, chunk{Page: p.PageNumber, Text: text[start:breakAt]})
			start = breakAt - overlapChars
			if start < 0 {
				start = 0
			}
		}
	}
	return out
}

func normalize(s string) string {
	s = strings.ReplaceAll(s, "\r", "")
	// collapse whitespace
	var b strings.Builder
	b.Grow(len(s))
	prevWS := false
	for _, r := range s {
		if r == ' ' || r == '\t' || r == '\n' {
			if !prevWS {
				b.WriteRune(' ')
			}
			prevWS = true
		} else {
			b.WriteRune(r)
			prevWS = false
		}
	}
	return strings.TrimSpace(b.String())
}

func isWS(c byte) bool { return c == ' ' || c == '\t' || c == '\n' }

var _ = fmt.Sprintf // keep fmt import if unused in future
