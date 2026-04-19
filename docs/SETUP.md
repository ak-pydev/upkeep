# Upkeep — Manual GCP Setup Punch List

Run through this the first time you deploy Upkeep. Steps that must be done in the
Google Cloud Console are marked **Console**; everything else has a script or CLI
invocation.

## 1. GCP project + billing
- Console: create a new project (`upkeep-dev`, `upkeep-staging`, `upkeep-prod`).
- Console: attach a billing account.
- Note: without billing, Google will reject enabling `run.googleapis.com`,
  `cloudbuild.googleapis.com`, `artifactregistry.googleapis.com`,
  `cloudscheduler.googleapis.com`, and `secretmanager.googleapis.com`.

## 2. Enable APIs
```bash
gcloud services enable \
  firestore.googleapis.com \
  firebase.googleapis.com \
  firebasehosting.googleapis.com \
  identitytoolkit.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  documentai.googleapis.com \
  aiplatform.googleapis.com \
  secretmanager.googleapis.com \
  cloudscheduler.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  --project=$PROJECT_ID
```

## 3. Firestore (Native mode)
- Console → Firestore → Create database → Native mode → your region.
- CLI also works once `firestore.googleapis.com` is enabled, for example:
  `gcloud firestore databases create --database="(default)" --location=nam5 --type=firestore-native --project=$PROJECT_ID`
- Deploy rules + indexes from this repo:
  ```bash
  firebase deploy --only firestore:rules,firestore:indexes --project $PROJECT_ID
  ```
- The vector field override on `manual_chunks.embedding` (dim 768) is in
  `firestore/firestore.indexes.json` and is deployed with the normal index sync.

## 4. Firebase Auth
- CLI can attach Firebase to an existing GCP project:
  ```bash
  firebase projects:addfirebase $PROJECT_ID
  ```
- Console → Authentication → Sign-in method → enable **Email/Password** and **Google**.
- For SSO/SAML (Phase 4 enterprise): upgrade the project to **Google Cloud Identity
  Platform** (same console). Then add a SAML provider per tenant — see
  `docs/SSO.md`.

## 5. Service accounts + IAM
```bash
PROJECT_ID=$PROJECT_ID ./scripts/provision-iam.sh
```
This creates `upkeep-api@PROJECT.iam.gserviceaccount.com` with least-privilege roles.

## 6. Artifact Registry
Console or CLI:
```bash
gcloud artifacts repositories create upkeep \
  --repository-format=docker --location=us-central1 --project=$PROJECT_ID
```

## 7. Document AI processor
```bash
PROJECT_ID=$PROJECT_ID LOCATION=us ./scripts/setup-document-ai.sh
```
The script prints the processor ID — save it for the Cloud Run env.

## 8. Vector Search (only if switching off Firestore)
```bash
PROJECT_ID=$PROJECT_ID BUCKET=gs://$PROJECT_ID-vs \
  ./scripts/setup-vector-search.sh
```
First-time index creation takes ~30 minutes. See `docs/VECTOR_SEARCH.md` for
when to make this switch — TL;DR: stay on Firestore until a tenant exceeds ~1M
chunks or P99 latency on search exceeds 500ms.

For the current dev project (`upkeep-dev-493800`), the provisioned Vertex AI
resources are:
- `VERTEX_INDEX_ENDPOINT_ID=projects/908428850871/locations/us-central1/indexEndpoints/2668921539914629120`
- `VERTEX_DEPLOYED_INDEX_ID=upkeep_deployed_1776563730`
- `VERTEX_REGION=us-central1`

## 9. Secrets
```bash
printf '%s' "$GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY --data-file=- --project=$PROJECT_ID
printf '%s' "$MCMASTER_API_KEY" | gcloud secrets create MCMASTER_API_KEY --data-file=- --project=$PROJECT_ID
printf '%s' "$GRAINGER_API_KEY" | gcloud secrets create GRAINGER_API_KEY --data-file=- --project=$PROJECT_ID
printf '%s' "$OXYLABS_USERNAME" | gcloud secrets create OXYLABS_USERNAME --data-file=- --project=$PROJECT_ID
printf '%s' "$OXYLABS_PASSWORD" | gcloud secrets create OXYLABS_PASSWORD --data-file=- --project=$PROJECT_ID
printf '%s' "$(openssl rand -hex 32)" | gcloud secrets create INTERNAL_TOKEN --data-file=- --project=$PROJECT_ID

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:upkeep-api@$PROJECT_ID.iam.gserviceaccount.com" \
  --role=roles/secretmanager.secretAccessor --project=$PROJECT_ID
# repeat for MCMASTER_API_KEY, GRAINGER_API_KEY, OXYLABS_USERNAME,
# OXYLABS_PASSWORD, INTERNAL_TOKEN
```

If you want live Grainger product lookups through Oxylabs Web Scraper API,
add these app env vars as well:
- `OXYLABS_USERNAME`
- `OXYLABS_PASSWORD`
- `OXYLABS_GRAINGER_DOMAIN` (`com`, `com.mx`, or `ca`)
- `PARTS_REAL_API=true`

## 10. Deploy the API
```bash
gcloud builds submit --config=infra/cloudbuild/api.yaml --substitutions=_REGION=us-central1,_ENV=prod
```

## 11. Configure Cloud Scheduler (predictive alerts)
```bash
PROJECT_ID=$PROJECT_ID \
API_URL=https://upkeep-api-xxxx-uc.a.run.app \
INTERNAL_TOKEN=<the secret you created above> \
  ./scripts/create-scheduler-alerts.sh
```

## 12. Deploy the web app
```bash
cd apps/web
npm ci
npm run build -- --configuration=production
firebase deploy --only hosting --project $PROJECT_ID
```

## 13. Wire CI/CD via GitHub Actions (optional but recommended)
See `docs/CI.md` for Workload Identity Federation setup — no service account
keys in GitHub secrets.

## 14. Configure the web app environment
Create a Firebase Web app if you do not already have one:
```bash
firebase apps:create WEB upkeep-web --project $PROJECT_ID
firebase apps:sdkconfig WEB <APP_ID> --project $PROJECT_ID
```

Then edit `apps/web/src/environments/environment.prod.ts` with the Firebase web
SDK config and the Cloud Run URL of `upkeep-api`.

For the current dev project, the deployed API URL is:
- `https://upkeep-api-ralrkrbdfa-uc.a.run.app`
