package auth

import (
	"context"
	"errors"
	"fmt"
	"strings"

	fbauth "firebase.google.com/go/v4/auth"
)

type Role string

const (
	RoleOwner      Role = "owner"
	RoleSupervisor Role = "supervisor"
	RoleTechnician Role = "technician"
)

// Principal is the authenticated caller extracted from a Firebase ID token.
type Principal struct {
	UID   string
	Email string
	OrgID string
	Role  Role
}

func (p Principal) HasRole(required ...Role) bool {
	for _, r := range required {
		if p.Role == r {
			return true
		}
	}
	return false
}

type Verifier struct {
	auth *fbauth.Client
}

func NewVerifier(a *fbauth.Client) *Verifier {
	return &Verifier{auth: a}
}

// Verify parses an "Authorization: Bearer <token>" header and returns the Principal.
func (v *Verifier) Verify(ctx context.Context, authHeader string) (Principal, error) {
	if v == nil || v.auth == nil {
		return Principal{}, errors.New("auth not configured")
	}
	tok := strings.TrimPrefix(authHeader, "Bearer ")
	tok = strings.TrimSpace(tok)
	if tok == "" {
		return Principal{}, errors.New("missing bearer token")
	}
	decoded, err := v.auth.VerifyIDToken(ctx, tok)
	if err != nil {
		return Principal{}, fmt.Errorf("verify id token: %w", err)
	}

	p := Principal{
		UID: decoded.UID,
	}
	if email, ok := decoded.Claims["email"].(string); ok {
		p.Email = email
	}
	if orgID, ok := decoded.Claims["orgId"].(string); ok {
		p.OrgID = orgID
	}
	if role, ok := decoded.Claims["role"].(string); ok {
		p.Role = Role(role)
	}
	return p, nil
}

// SetOrgClaims assigns orgId + role via Firebase custom claims.
// Called from the API once a user is added to an org.
func (v *Verifier) SetOrgClaims(ctx context.Context, uid, orgID string, role Role) error {
	claims := map[string]interface{}{
		"orgId": orgID,
		"role":  string(role),
	}
	return v.auth.SetCustomUserClaims(ctx, uid, claims)
}
