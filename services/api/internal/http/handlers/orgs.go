package handlers

import (
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/google/uuid"

	"github.com/upkeep/api/internal/auth"
	"github.com/upkeep/api/internal/http/httpx"
	"github.com/upkeep/api/internal/middleware"
)

type OrgsHandler struct {
	fs *firestore.Client
	v  *auth.Verifier
}

func NewOrgsHandler(fs *firestore.Client, v *auth.Verifier) *OrgsHandler {
	return &OrgsHandler{fs: fs, v: v}
}

type orgCreateReq struct {
	Name string `json:"name"`
}

type orgDoc struct {
	Name       string    `firestore:"name"`
	Plan       string    `firestore:"plan"`
	SSOEnabled bool      `firestore:"ssoEnabled"`
	CreatedAt  time.Time `firestore:"createdAt"`
}

type memberDoc struct {
	Email       string    `firestore:"email"`
	DisplayName string    `firestore:"displayName,omitempty"`
	Role        string    `firestore:"role"`
	JoinedAt    time.Time `firestore:"joinedAt"`
}

// Create creates a new org and makes the caller its owner.
func (h *OrgsHandler) Create(w http.ResponseWriter, r *http.Request) {
	p := middleware.Principal(r.Context())
	var req orgCreateReq
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", err.Error())
		return
	}
	if req.Name == "" {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "name required")
		return
	}

	orgID := uuid.NewString()
	now := time.Now().UTC()
	_, err := h.fs.Collection("orgs").Doc(orgID).Set(r.Context(), orgDoc{
		Name:      req.Name,
		Plan:      "trial",
		CreatedAt: now,
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	_, err = h.fs.Collection("orgs").Doc(orgID).Collection("members").Doc(p.UID).Set(r.Context(), memberDoc{
		Email:    p.Email,
		Role:     string(auth.RoleOwner),
		JoinedAt: now,
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	if err := h.v.SetOrgClaims(r.Context(), p.UID, orgID, auth.RoleOwner); err != nil {
		_, _ = h.fs.Collection("orgs").Doc(orgID).Collection("members").Doc(p.UID).Delete(r.Context())
		_, _ = h.fs.Collection("orgs").Doc(orgID).Delete(r.Context())
		httpx.Error(w, http.StatusInternalServerError, "claims", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, orgID, p.UID, "org.create", "orgs/"+orgID, nil)
	httpx.JSON(w, http.StatusCreated, map[string]any{"orgId": orgID})
}

// Me returns the caller's org profile.
func (h *OrgsHandler) Me(w http.ResponseWriter, r *http.Request) {
	p := middleware.Principal(r.Context())
	if p.OrgID == "" {
		httpx.JSON(w, http.StatusOK, map[string]any{"orgId": nil, "needsOrg": true})
		return
	}
	doc, err := h.fs.Collection("orgs").Doc(p.OrgID).Get(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusNotFound, "not_found", err.Error())
		return
	}
	data := doc.Data()
	data["orgId"] = p.OrgID
	data["role"] = string(p.Role)
	httpx.JSON(w, http.StatusOK, data)
}

type addMemberReq struct {
	UID   string    `json:"uid"`
	Email string    `json:"email"`
	Role  auth.Role `json:"role"`
}

// AddMember is owner-only. Caller must already own the org.
func (h *OrgsHandler) AddMember(w http.ResponseWriter, r *http.Request) {
	p := middleware.Principal(r.Context())
	orgID := urlParam(r, "orgId")
	if p.OrgID != orgID || p.Role != auth.RoleOwner {
		httpx.Error(w, http.StatusForbidden, "forbidden", "only owners can add members")
		return
	}
	var req addMemberReq
	if err := httpx.Decode(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "bad_request", err.Error())
		return
	}
	if req.UID == "" || req.Role == "" {
		httpx.Error(w, http.StatusBadRequest, "bad_request", "uid and role required")
		return
	}
	now := time.Now().UTC()
	_, err := h.fs.Collection("orgs").Doc(orgID).Collection("members").Doc(req.UID).Set(r.Context(), memberDoc{
		Email:    req.Email,
		Role:     string(req.Role),
		JoinedAt: now,
	})
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "firestore", err.Error())
		return
	}
	if err := h.v.SetOrgClaims(r.Context(), req.UID, orgID, req.Role); err != nil {
		_, _ = h.fs.Collection("orgs").Doc(orgID).Collection("members").Doc(req.UID).Delete(r.Context())
		httpx.Error(w, http.StatusInternalServerError, "claims", err.Error())
		return
	}
	writeAudit(r.Context(), h.fs, orgID, p.UID, "member.add", "orgs/"+orgID+"/members/"+req.UID, map[string]any{"role": string(req.Role)})
	httpx.JSON(w, http.StatusOK, map[string]any{"ok": true})
}
