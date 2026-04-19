package handlers

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/upkeep/api/internal/auth"
	"github.com/upkeep/api/internal/http/httpx"
	"github.com/upkeep/api/internal/middleware"
)

// writeAudit is a fire-and-forget audit log write.
// Any failure is logged but not returned so it can't break the main action.
func writeAudit(ctx context.Context, fs *firestore.Client, orgID, actorUID, action, target string, meta map[string]any) {
	if orgID == "" {
		return
	}
	id := uuid.NewString()
	_, err := fs.Collection("orgs").Doc(orgID).Collection("audit_logs").Doc(id).Set(ctx, map[string]any{
		"actorUid": actorUID,
		"action":   action,
		"target":   target,
		"meta":     meta,
		"at":       time.Now().UTC(),
	})
	if err != nil {
		slog.Warn("audit write failed", "err", err, "action", action)
	}
}

// requireOrg ensures the caller has an orgId claim and returns it.
func requireOrg(w http.ResponseWriter, r *http.Request) (auth.Principal, bool) {
	p := middleware.Principal(r.Context())
	if p.OrgID == "" {
		httpx.Error(w, http.StatusForbidden, "no_org", "user is not a member of an org")
		return p, false
	}
	return p, true
}

// urlParam is a small helper so handler files can live without importing chi directly.
func urlParam(r *http.Request, name string) string {
	return chi.URLParam(r, name)
}
