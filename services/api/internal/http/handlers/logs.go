package handlers

import (
	"net/http"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/google/uuid"
	"google.golang.org/api/iterator"

	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/http/httpx"
)

type LogsHandler struct {
	fs  *firestore.Client
	cfg config.Config
}

func NewLogsHandler(fs *firestore.Client, cfg config.Config) *LogsHandler {
	return &LogsHandler{fs: fs, cfg: cfg}
}

type logDoc struct {
	MachineID     string    `firestore:"machineId"`
	Title         string    `firestore:"title"`
	Issue         string    `firestore:"issue"`
	Resolution    string    `firestore:"resolution"`
	Parts         any       `firestore:"parts,omitempty"`
	TechnicianUID string    `firestore:"technicianUid"`
	TicketID      string    `firestore:"ticketId,omitempty"`
	ThreadID      string    `firestore:"threadId,omitempty"`
	OccurredAt    time.Time `firestore:"occurredAt"`
	CreatedAt     time.Time `firestore:"createdAt"`
}

func (h *LogsHandler) List(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	col := h.fs.Collection("orgs").Doc(p.OrgID).Collection("maintenance_log")
	var q firestore.Query = col.Query
	if mid := r.URL.Query().Get("machineId"); mid != "" {
		q = col.Where("machineId", "==", mid)
	}
	q = q.OrderBy("occurredAt", firestore.Desc).Limit(200)
	iter := q.Documents(r.Context())
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
	httpx.JSON(w, http.StatusOK, map[string]any{"entries": out})
}

type createLogReq struct {
	MachineID  string `json:"machineId"`
	Title      string `json:"title"`
	Issue      string `json:"issue"`
	Resolution string `json:"resolution"`
	Parts      any    `json:"parts,omitempty"`
	TicketID   string `json:"ticketId,omitempty"`
	ThreadID   string `json:"threadId,omitempty"`
	OccurredAt string `json:"occurredAt,omitempty"`
}

func (h *LogsHandler) Create(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	var req createLogReq
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", err.Error())
		return
	}
	if req.MachineID == "" || req.Resolution == "" {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "machineId + resolution required")
		return
	}
	occurred := time.Now().UTC()
	if req.OccurredAt != "" {
		if t, err := time.Parse(time.RFC3339, req.OccurredAt); err == nil {
			occurred = t
		}
	}
	id := uuid.NewString()
	_, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("maintenance_log").Doc(id).Set(r.Context(), logDoc{
		MachineID:     req.MachineID,
		Title:         req.Title,
		Issue:         req.Issue,
		Resolution:    req.Resolution,
		Parts:         req.Parts,
		TechnicianUID: p.UID,
		TicketID:      req.TicketID,
		ThreadID:      req.ThreadID,
		OccurredAt:    occurred,
		CreatedAt:     time.Now().UTC(),
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "log.create", "maintenance_log/"+id, nil)
	httpx.JSON(w, http.StatusCreated, map[string]any{"id": id})
}

// Search does a simple case-insensitive substring match on title/issue/resolution.
// For proper full-text, wire in Algolia / Typesense / BigQuery — noted in README.
func (h *LogsHandler) Search(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	q := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("q")))
	if q == "" {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "q required")
		return
	}
	iter := h.fs.Collection("orgs").Doc(p.OrgID).Collection("maintenance_log").
		OrderBy("occurredAt", firestore.Desc).Limit(500).Documents(r.Context())
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
		hay := strings.ToLower(
			toStr(d["title"]) + " " + toStr(d["issue"]) + " " + toStr(d["resolution"]),
		)
		if strings.Contains(hay, q) {
			d["id"] = doc.Ref.ID
			out = append(out, d)
		}
		if len(out) >= 50 {
			break
		}
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"results": out})
}

func toStr(v any) string {
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}
