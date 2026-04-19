#!/usr/bin/env bash
# Creates the upkeep-api service account with least-privilege roles.
set -euo pipefail

: "${PROJECT_ID:?PROJECT_ID required}"

SA="upkeep-api@${PROJECT_ID}.iam.gserviceaccount.com"

echo "==> creating service account (idempotent)"
gcloud iam service-accounts create upkeep-api \
  --display-name="Upkeep API" \
  --project="$PROJECT_ID" || true

for role in \
  roles/datastore.user \
  roles/aiplatform.user \
  roles/documentai.apiUser \
  roles/secretmanager.secretAccessor \
  roles/storage.objectViewer \
  roles/firebase.sdkAdminServiceAgent \
  roles/run.invoker
do
  echo "==> granting $role to $SA"
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA" --role="$role" --condition=None
done

echo ""
echo "✅ IAM provisioned. Service account: $SA"
