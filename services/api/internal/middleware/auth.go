package middleware

import (
	"context"
	"crypto/subtle"
	"net/http"

	"github.com/upkeep/api/internal/auth"
	"github.com/upkeep/api/internal/config"
	httpx "github.com/upkeep/api/internal/http/httpx"
)

type ctxKey int

const principalKey ctxKey = 1

// RequireAuth verifies a Firebase ID token and attaches the Principal to ctx.
func RequireAuth(v *auth.Verifier) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			p, err := v.Verify(r.Context(), r.Header.Get("Authorization"))
			if err != nil {
				httpx.Error(w, http.StatusUnauthorized, "unauthorized", err.Error())
				return
			}
			ctx := context.WithValue(r.Context(), principalKey, p)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// Principal extracts the Principal from context. Returns zero value if missing.
func Principal(ctx context.Context) auth.Principal {
	p, _ := ctx.Value(principalKey).(auth.Principal)
	return p
}

// RequireInternalAuth guards internal endpoints with a shared secret (OIDC-preferred
// in production — this is a fallback for cron calls without OIDC configured).
func RequireInternalAuth(cfg config.Config) func(http.Handler) http.Handler {
	internalToken := []byte(getInternalToken(cfg))
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			got := []byte(r.Header.Get("X-Upkeep-Internal-Token"))
			if len(internalToken) == 0 {
				// Dev convenience: if not set, skip check
				next.ServeHTTP(w, r)
				return
			}
			if subtle.ConstantTimeCompare(got, internalToken) != 1 {
				httpx.Error(w, http.StatusForbidden, "forbidden", "internal token mismatch")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func getInternalToken(cfg config.Config) string {
	// The token is read at request time via os.Getenv directly to avoid passing
	// secrets around — in prod set INTERNAL_TOKEN via Secret Manager mount.
	return getEnv("INTERNAL_TOKEN")
}

func getEnv(k string) string {
	// indirection so tests can stub
	return envLookup(k)
}
