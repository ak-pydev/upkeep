package handlers

import (
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/google/uuid"
	"google.golang.org/api/iterator"

	"github.com/upkeep/api/internal/auth"
	"github.com/upkeep/api/internal/config"
	"github.com/upkeep/api/internal/http/httpx"
)

type MachinesHandler struct {
	fs  *firestore.Client
	cfg config.Config
}

func NewMachinesHandler(fs *firestore.Client, cfg config.Config) *MachinesHandler {
	return &MachinesHandler{fs: fs, cfg: cfg}
}

type machineDoc struct {
	Name             string    `firestore:"name"`
	Make             string    `firestore:"make"`
	Model            string    `firestore:"model"`
	SerialNumber     string    `firestore:"serialNumber,omitempty"`
	HoursRun         float64   `firestore:"hoursRun"`
	NextServiceHours float64   `firestore:"nextServiceHours,omitempty"`
	InstalledAt      time.Time `firestore:"installedAt,omitempty"`
	PhotoURL         string    `firestore:"photoUrl,omitempty"`
	CreatedAt        time.Time `firestore:"createdAt"`
	UpdatedAt        time.Time `firestore:"updatedAt"`
}

func (h *MachinesHandler) List(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	col := h.fs.Collection("orgs").Doc(p.OrgID).Collection("machines")
	iter := col.OrderBy("name", firestore.Asc).Documents(r.Context())
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
	httpx.JSON(w, http.StatusOK, map[string]any{"machines": out})
}

func (h *MachinesHandler) Create(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	if !p.HasRole(auth.RoleOwner, auth.RoleSupervisor) {
		httpx.Error(w, http.StatusForbidden, "forbidden", "supervisors or owners only")
		return
	}
	var req machineDoc
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", err.Error())
		return
	}
	if req.Name == "" || req.Make == "" || req.Model == "" {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "name, make, model required")
		return
	}
	req.CreatedAt = time.Now().UTC()
	req.UpdatedAt = req.CreatedAt
	id := uuid.NewString()
	_, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("machines").Doc(id).Set(r.Context(), req)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "machine.create", "machines/"+id, nil)
	httpx.JSON(w, http.StatusCreated, map[string]any{"id": id})
}

func (h *MachinesHandler) Get(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	id := urlParam(r, "id")
	doc, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("machines").Doc(id).Get(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "not_found", err.Error())
		return
	}
	data := doc.Data()
	data["id"] = id
	httpx.JSON(w, http.StatusOK, data)
}

func (h *MachinesHandler) Update(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	if !p.HasRole(auth.RoleOwner, auth.RoleSupervisor) {
		httpx.Error(w, http.StatusForbidden, "forbidden", "supervisors or owners only")
		return
	}
	id := urlParam(r, "id")
	var patch map[string]any
	if err := httpx.Decode(r, &patch); err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", err.Error())
		return
	}
	patch["updatedAt"] = time.Now().UTC()
	updates := make([]firestore.Update, 0, len(patch))
	for k, v := range patch {
		updates = append(updates, firestore.Update{Path: k, Value: v})
	}
	_, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("machines").Doc(id).Update(r.Context(), updates)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "machine.update", "machines/"+id, nil)
	httpx.JSON(w, http.StatusOK, map[string]any{"ok": true})
}

func (h *MachinesHandler) Delete(w http.ResponseWriter, r *http.Request) {
	p, ok := requireOrg(w, r)
	if !ok {
		return
	}
	if !p.HasRole(auth.RoleOwner) {
		httpx.Error(w, http.StatusForbidden, "forbidden", "owners only")
		return
	}
	id := urlParam(r, "id")
	_, err := h.fs.Collection("orgs").Doc(p.OrgID).Collection("machines").Doc(id).Delete(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, p.OrgID, p.UID, "machine.delete", "machines/"+id, nil)
	httpx.JSON(w, http.StatusOK, map[string]any{"ok": true})
}
