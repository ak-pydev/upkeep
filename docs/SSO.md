# SSO / SAML — Identity Platform wiring

Upkeep uses **Firebase Auth** for consumer-style login (email/password + Google
SSO). For enterprise SSO (Phase 4), upgrade the project to **Google Cloud
Identity Platform** — same Auth codebase, adds:

- SAML 2.0 providers (Okta, Azure AD, OneLogin, ADFS)
- OIDC providers
- Multi-tenancy (one tenant per customer org)
- Custom email link handling

## Upgrade

1. Console → Identity Platform → Upgrade.
2. Enable **Multi-tenancy** if you want isolated tenants per customer org.

## Add a SAML provider per tenant

```bash
gcloud identity-platform providers create saml my-customer-saml \
  --display-name="Customer X" \
  --idp-entity-id=https://idp.customer.com \
  --sso-url=https://idp.customer.com/sso \
  --idp-certificates=/path/to/cert.pem \
  --sp-entity-id=https://upkeep.example.com \
  --rp-callback-url=https://$PROJECT_ID.firebaseapp.com/__/auth/handler \
  --project=$PROJECT_ID \
  --tenant=TENANT_ID
```

## Apply

This is planned enterprise wiring, not a shipped end-to-end flow in the current
repo. The Angular app and API currently use Firebase Auth email/password +
Google sign-in. When SAML is added, the post-login path should still call
`/v1/orgs/me` to fetch org mapping and role claims.

## Custom claims

`upkeep-api` sets `orgId` and `role` custom claims when a user is added to an
org. These claims drive `firestore.rules` access. Forcing a token refresh from
the Angular side (`auth.currentUser.getIdToken(true)`) is required after role
changes.
