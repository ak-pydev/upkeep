#!/usr/bin/env bash
# Provisions a Vertex AI Vector Search index + endpoint for Upkeep.
#
# You only need this if you're switching from the default Firestore vector
# backend to Vertex for scale (see docs/VECTOR_SEARCH.md for when to switch).
#
# Required env:
#   PROJECT_ID       — your GCP project
#   REGION           — e.g. us-central1
#   INDEX_NAME       — e.g. upkeep-manual-chunks
#   ENDPOINT_NAME    — e.g. upkeep-endpoint
set -euo pipefail

: "${PROJECT_ID:?PROJECT_ID required}"
: "${REGION:=us-central1}"
: "${INDEX_NAME:=upkeep-manual-chunks}"
: "${ENDPOINT_NAME:=upkeep-endpoint}"
: "${BUCKET:?set BUCKET=gs://your-bucket-for-index-metadata}"

echo "Using: project=$PROJECT_ID region=$REGION"

echo "==> enabling aiplatform.googleapis.com"
gcloud services enable aiplatform.googleapis.com --project="$PROJECT_ID"

echo "==> creating empty index metadata file"
TMP=$(mktemp)
cat > "$TMP" <<JSON
{
  "contentsDeltaUri": "${BUCKET}/empty",
  "config": {
    "dimensions": 768,
    "approximateNeighborsCount": 20,
    "distanceMeasureType": "COSINE_DISTANCE",
    "algorithmConfig": {
      "treeAhConfig": { "leafNodeEmbeddingCount": 500, "leafNodesToSearchPercent": 7 }
    }
  }
}
JSON

echo "==> creating vector index (this takes ~30 min first time)"
gcloud ai indexes create \
  --display-name="$INDEX_NAME" \
  --metadata-file="$TMP" \
  --region="$REGION" \
  --project="$PROJECT_ID"

INDEX_ID=$(gcloud ai indexes list --region="$REGION" --project="$PROJECT_ID" \
  --filter="displayName=$INDEX_NAME" --format="value(name)" | head -n1)
echo "INDEX_ID=$INDEX_ID"

echo "==> creating index endpoint"
gcloud ai index-endpoints create \
  --display-name="$ENDPOINT_NAME" \
  --region="$REGION" \
  --project="$PROJECT_ID" \
  --public-endpoint-enabled

ENDPOINT_ID=$(gcloud ai index-endpoints list --region="$REGION" --project="$PROJECT_ID" \
  --filter="displayName=$ENDPOINT_NAME" --format="value(name)" | head -n1)
echo "ENDPOINT_ID=$ENDPOINT_ID"

echo "==> deploying the index to the endpoint"
DEPLOYED_ID="upkeep_deployed_$(date +%s)"
gcloud ai index-endpoints deploy-index "$ENDPOINT_ID" \
  --deployed-index-id="$DEPLOYED_ID" \
  --display-name="$INDEX_NAME-deployed" \
  --index="$INDEX_ID" \
  --region="$REGION" \
  --project="$PROJECT_ID"

echo ""
echo "✅ Done."
echo "Set these env vars on upkeep-api in Cloud Run:"
echo "  VECTOR_BACKEND=vertex"
echo "  VERTEX_INDEX_ENDPOINT_ID=$ENDPOINT_ID"
echo "  VERTEX_DEPLOYED_INDEX_ID=$DEPLOYED_ID"
echo "  VERTEX_REGION=$REGION"
