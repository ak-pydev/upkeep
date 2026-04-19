#!/usr/bin/env bash
# Creates a Cloud Scheduler job that pings /internal/alerts/scan nightly.
# Scheduler uses an OIDC token signed by upkeep-scheduler@PROJECT.iam.gserviceaccount.com.
set -euo pipefail

: "${PROJECT_ID:?PROJECT_ID required}"
: "${REGION:=us-central1}"
: "${API_URL:?API_URL required (https://upkeep-api-xxxx-uc.a.run.app)}"
: "${INTERNAL_TOKEN:?INTERNAL_TOKEN required (secret string matching INTERNAL_TOKEN on API)}"

SA="upkeep-scheduler@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts create upkeep-scheduler \
  --display-name="Upkeep Scheduler" --project="$PROJECT_ID" || true

gcloud run services add-iam-policy-binding upkeep-api \
  --region="$REGION" --project="$PROJECT_ID" \
  --member="serviceAccount:$SA" --role="roles/run.invoker"

gcloud scheduler jobs create http upkeep-alerts-nightly \
  --schedule="0 6 * * *" \
  --time-zone="America/New_York" \
  --uri="${API_URL}/internal/alerts/scan" \
  --http-method=POST \
  --headers="X-Upkeep-Internal-Token=${INTERNAL_TOKEN}" \
  --oidc-service-account-email="$SA" \
  --oidc-token-audience="$API_URL" \
  --location="$REGION" \
  --project="$PROJECT_ID" || \
gcloud scheduler jobs update http upkeep-alerts-nightly \
  --schedule="0 6 * * *" \
  --uri="${API_URL}/internal/alerts/scan" \
  --location="$REGION" --project="$PROJECT_ID"

echo "✅ scheduler ready"
