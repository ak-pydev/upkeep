package handlers

import (
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/http/httpx"
)

type AlertsHandler struct {
	fs  *firestore.Client
	cfg config.Config
}

func NewAlertsHandler(fs *firestore.Client, cfg config.Config) *AlertsHandler {
	return &AlertsHandler{fs: fs, cfg: cfg}
}

func (h *AlertsHandler) List(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	iter := h.fs.Collection("orgs").Doc(p.OrgID).Collection("alerts").
		OrderBy("dueAt", firestore.Asc).Limit(200).Documents(r.Context())
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
	httpx.JSON(w, http.StatusOK, map[string]any{"alerts": out})
}

func (h *AlertsHandler) Ack(w http.ResponseWriter, r *http.Request) {
	h.setStatus(w, r, "acknowledged")
}
func (h *AlertsHandler) Dismiss(w http.ResponseWriter, r *http.Request) {
	h.setStatus(w, r, "dismissed")
}

func (h *AlertsHandler) setStatus(w http.ResponseWriter, r *http.Request, status string) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	id := urlParam(r, "id")
	// rules deny client writes to /alerts; server writes pass through admin SDK
	_, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("alerts").Doc(id).Update(r.Context(), []firestore.Update{
		{Path: "status", Value: status},
		{Path: "updatedAt", Value: time.Now().UTC()},
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "alert."+status, "alerts/"+id, nil)
	httpx.JSON(w, http.StatusOK, map[string]any{"ok": true})
}
