# Document AI — setup and choice of processor

## Which processor?

Upkeep's manuals break into two classes:

| Manual type | Processor | Why |
|---|---|---|
| Born-digital OEM PDFs (Haas, Mazak, Okuma) | **Document OCR** (`OCR_PROCESSOR`) | Fastest, cheapest, preserves reading order and page layout well enough for RAG. |
| Scanned paper manuals and internal SOPs | **Document OCR** + OCR-on by default | Same processor; Doc AI's OCR handles scanned PDFs. Upload at ≥300 DPI. |
| Forms-heavy machinery datasheets | **Form Parser** (`FORM_PARSER_PROCESSOR`) | Future extension path if you later add form-specific extraction. |

The default `scripts/setup-document-ai.sh` creates a single Document OCR
processor because it covers the current repo implementation. Form Parser is not
wired in the current codebase; adding it later would require extending
`docai/client.go` and the upload pipeline.

## Quotas

- Sync `process` endpoint: up to 15 MB / 15 pages per call on OCR. For bigger
  manuals use `batchProcess` (async, reads from GCS). Upkeep's upload handler
  currently uses sync; large-manual async is a TODO.
- Billing is per-page ($1.50/1K for OCR at writing time — always check pricing).

## Fallback

With no processor ID configured, `docai.New` returns a stub that extracts plain
text from the uploaded file (byte-filter for PDFs — rough, but enough to
demonstrate the pipeline without GCP credentials).
