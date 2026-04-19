#!/usr/bin/env bash
# Provisions a Document AI OCR processor for Upkeep.
#
# Upkeep uses the "Document OCR" processor (type DOCUMENT_OCR_PROCESSOR) since
# most shop manuals are text-heavy PDFs where layout preservation is enough.
# If you want richer extraction of tables + key/value pairs from scanned
# manuals, create a "Form Parser" processor (FORM_PARSER_PROCESSOR) instead.
set -euo pipefail

: "${PROJECT_ID:?PROJECT_ID required}"
: "${LOCATION:=us}"

echo "==> enabling documentai.googleapis.com"
gcloud services enable documentai.googleapis.com --project="$PROJECT_ID"

echo "==> creating Document OCR processor in $LOCATION"
TOKEN=$(gcloud auth print-access-token)
curl -sS -X POST \
  "https://${LOCATION}-documentai.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/processors" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "OCR_PROCESSOR",
    "displayName": "upkeep-manual-ocr"
  }' | tee /tmp/docai.json

PROC=$(jq -r .name < /tmp/docai.json)
PROC_ID=${PROC##*/}

echo ""
echo "✅ Done."
echo "Set these env vars on upkeep-api in Cloud Run:"
echo "  DOC_AI_PROCESSOR_ID=$PROC_ID"
echo "  DOC_AI_LOCATION=$LOCATION"
