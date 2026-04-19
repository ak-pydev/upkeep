# CI/CD — GitHub Actions + Workload Identity Federation

Do NOT store service account keys in GitHub secrets. Use Workload Identity
Federation.

## One-time setup

```bash
PROJECT_ID=upkeep-dev-493800
POOL=github-pool
PROVIDER=github
REPO=yourorg/revolutionUC
SA=upkeep-ci@$PROJECT_ID.iam.gserviceaccount.com

gcloud iam service-accounts create upkeep-ci \
  --display-name="Upkeep CI" --project=$PROJECT_ID

gcloud iam workload-identity-pools create $POOL \
  --location=global --project=$PROJECT_ID --display-name="GitHub"

gcloud iam workload-identity-pools providers create-oidc $PROVIDER \
  --location=global --workload-identity-pool=$POOL \
  --project=$PROJECT_ID \
  --issuer-uri=https://token.actions.githubusercontent.com \
  --attribute-mapping=google.subject=assertion.sub,attribute.repository=assertion.repository \
  --attribute-condition="attribute.repository == '$REPO'"

PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud iam service-accounts add-iam-policy-binding $SA \
  --project=$PROJECT_ID \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL/attribute.repository/$REPO"

# grant CI deploy rights
for role in roles/run.admin roles/cloudbuild.builds.editor roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA" --role=$role --condition=None
done
```

## Example workflow

See `.github/workflows/deploy.yml` — not included in this repo starter; copy
this template:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github
          service_account: upkeep-ci@$PROJECT_ID.iam.gserviceaccount.com
      - uses: google-github-actions/setup-gcloud@v2
      - run: gcloud builds submit --config=infra/cloudbuild/api.yaml services/api
      - run: gcloud builds submit --config=infra/cloudbuild/web.yaml .
```
