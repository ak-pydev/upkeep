package handlers

import (
	"context"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/google/uuid"
	"google.golang.org/api/iterator"

	"github.com/upkeep/api/internal/auth"
	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/http/httpx"
)

type TicketsHandler struct {
	fs  *firestore.Client
	cfg config.Config
}

func NewTicketsHandler(fs *firestore.Client, cfg config.Config) *TicketsHandler {
	return &TicketsHandler{fs: fs, cfg: cfg}
}

type ticketDoc struct {
	MachineID   string    `firestore:"machineId"`
	Title       string    `firestore:"title"`
	Description string    `firestore:"description"`
	Status      string    `firestore:"status"`
	Priority    string    `firestore:"priority"`
	ReporterUID string    `firestore:"reporterUid"`
	AssigneeUID string    `firestore:"assigneeUid,omitempty"`
	Parts       any       `firestore:"parts,omitempty"`
	ThreadID    string    `firestore:"threadId,omitempty"`
	CreatedAt   time.Time `firestore:"createdAt"`
	OpenedAt    time.Time `firestore:"openedAt"`
	ResolvedAt  time.Time `firestore:"resolvedAt,omitempty"`
	ClosedAt    time.Time `firestore:"closedAt,omitempty"`
	MTTRMinutes int       `firestore:"mttrMinutes,omitempty"`
}

func (h *TicketsHandler) List(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	col := h.fs.Collection("orgs").Doc(p.OrgID).Collection("tickets")
	q := col.OrderBy("createdAt", firestore.Desc).Limit(200)
	if status := r.URL.Query().Get("status"); status != "" {
		q = col.Where("status", "==", status).OrderBy("createdAt", firestore.Desc).Limit(200)
	}
	if mid := r.URL.Query().Get("machineId"); mid != "" {
		q = col.Where("machineId", "==", mid).OrderBy("createdAt", firestore.Desc).Limit(200)
	}
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
	httpx.JSON(w, http.StatusOK, map[string]any{"tickets": out})
}

type createTicketReq struct {
	MachineID   string `json:"machineId"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Priority    string `json:"priority"`
	AssigneeUID string `json:"assigneeUid,omitempty"`
	ThreadID    string `json:"threadId,omitempty"`
	Parts       any    `json:"parts,omitempty"`
}

type updateTicketReq struct {
	Title       *string `json:"title,omitempty"`
	Description *string `json:"description,omitempty"`
	Priority    *string `json:"priority,omitempty"`
	AssigneeUID *string `json:"assigneeUid,omitempty"`
	ThreadID    *string `json:"threadId,omitempty"`
	Parts       any     `json:"parts,omitempty"`
}

func (h *TicketsHandler) Create(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	var req createTicketReq
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", err.Error())
		return
	}
	if req.MachineID == "" || req.Title == "" {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "machineId + title required")
		return
	}
	now := time.Now().UTC()
	t := ticketDoc{
		MachineID:   req.MachineID,
		Title:       req.Title,
		Description: req.Description,
		Status:      "open",
		Priority:    coalesce(req.Priority, "normal"),
		ReporterUID: p.UID,
		AssigneeUID: req.AssigneeUID,
		ThreadID:    req.ThreadID,
		Parts:       req.Parts,
		CreatedAt:   now,
		OpenedAt:    now,
	}
	id := uuid.NewString()
	_, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("tickets").Doc(id).Set(r.Context(), t)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "ticket.create", "tickets/"+id, nil)
	httpx.JSON(w, http.StatusCreated, map[string]any{"id": id})
}

func (h *TicketsHandler) Get(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	id := urlParam(r, "id")
	doc, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("tickets").Doc(id).Get(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "not_found", err.Error())
		return
	}
	d := doc.Data()
	d["id"] = id
	httpx.JSON(w, http.StatusOK, d)
}

func (h *TicketsHandler) Update(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	id := urlParam(r, "id")
	var req updateTicketReq
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", err.Error())
		return
	}
	updates := make([]firestore.Update, 0, 6)
	auditPatch := make(map[string]any, 6)
	if req.Title != nil {
		updates = append(updates, firestore.Update{Path: "title", Value: *req.Title})
		auditPatch["title"] = *req.Title
	}
	if req.Description != nil {
		updates = append(updates, firestore.Update{Path: "description", Value: *req.Description})
		auditPatch["description"] = *req.Description
	}
	if req.Priority != nil {
		updates = append(updates, firestore.Update{Path: "priority", Value: *req.Priority})
		auditPatch["priority"] = *req.Priority
	}
	if req.AssigneeUID != nil {
		updates = append(updates, firestore.Update{Path: "assigneeUid", Value: *req.AssigneeUID})
		auditPatch["assigneeUid"] = *req.AssigneeUID
	}
	if req.ThreadID != nil {
		updates = append(updates, firestore.Update{Path: "threadId", Value: *req.ThreadID})
		auditPatch["threadId"] = *req.ThreadID
	}
	if req.Parts != nil {
		updates = append(updates, firestore.Update{Path: "parts", Value: req.Parts})
		auditPatch["parts"] = req.Parts
	}
	if len(updates) == 0 {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "no updatable fields provided")
		return
	}
	_, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("tickets").Doc(id).Update(r.Context(), updates)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "ticket.update", "tickets/"+id, auditPatch)
	httpx.JSON(w, http.StatusOK, map[string]any{"ok": true})
}

type closeReq struct {
	Resolution   string `json:"resolution"`
	Parts        any    `json:"parts,omitempty"`
	LogToHistory bool   `json:"logToHistory"`
}

// Close transitions a ticket to resolved/closed, computes MTTR, and optionally
// writes a maintenance_log entry (the "Log this fix" button).
func (h *TicketsHandler) Close(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	if !p.HasRole(auth.RoleOwner, auth.RoleSupervisor, auth.RoleTechnician) {
		httpx.Error(w, http.StatusForbidden, "forbidden", "not allowed")
		return
	}
	id := urlParam(r, "id")
	var req closeReq
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", err.Error())
		return
	}

	now := time.Now().UTC()
	ref := h.fs.Collection("orgs").Doc(p.OrgID).Collection("tickets").Doc(id)

	err := h.fs.RunTransaction(r.Context(), func(ctx context.Context, tx *firestore.Transaction) error {
		snap, err := tx.Get(ref)
		if err != nil {
			return err
		}
		data := snap.Data()
		opened, _ := data["openedAt"].(time.Time)
		if opened.IsZero() {
			if t, ok := data["createdAt"].(time.Time); ok {
				opened = t
			}
		}
		mttr := int(now.Sub(opened).Minutes())
		if err := tx.Update(ref, []firestore.Update{
			{Path: "status", Value: "closed"},
			{Path: "resolvedAt", Value: now},
			{Path: "closedAt", Value: now},
			{Path: "mttrMinutes", Value: mttr},
		}); err != nil {
			return err
		}

		if req.LogToHistory {
			machineID, _ := data["machineId"].(string)
			title, _ := data["title"].(string)
			desc, _ := data["description"].(string)
			logID := uuid.NewString()
			logRef := h.fs.Collection("orgs").Doc(p.OrgID).Collection("maintenance_log").Doc(logID)
			if err := tx.Set(logRef, map[string]any{
				"machineId":     machineID,
				"title":         title,
				"issue":         desc,
				"resolution":    req.Resolution,
				"parts":         req.Parts,
				"technicianUid": p.UID,
				"ticketId":      id,
				"occurredAt":    now,
				"createdAt":     now,
			}); err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "ticket.close", "tickets/"+id, map[string]any{"logged": req.LogToHistory})
	httpx.JSON(w, http.StatusOK, map[string]any{"ok": true})
}

func coalesce(s, def string) string {
	if s == "" {
		return def
	}
	return s
}
