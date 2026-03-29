# Upkeep backend slice

This repository currently contains the API and data layer for the Upkeep MVP described in `roadmap.md`.

## What is included

- Machine selector data and CRUD endpoints.
- Manual upload and indexing endpoints that accept extracted text or chunked content.
- Grounded chat that retrieves from seeded manual chunks first.
- Maintenance log creation and lookup.
- Supabase schema artifacts for the future pgvector-backed implementation.

## Local runtime

- `npm install`
- `npm run dev`

## Environment flags

- `UPKEEP_AI_MODE=claude` enables the Claude boundary if `ANTHROPIC_API_KEY` is present.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` mark the Supabase boundary as configured.

## API surface

- `GET /api/health`
- `GET|POST /api/machines`
- `GET|PATCH /api/machines/[machineId]`
- `GET|POST /api/manuals`
- `GET /api/manuals/[manualId]`
- `POST /api/chat`
- `GET|POST /api/logs`

## Payload notes

- `POST /api/manuals` accepts extracted manual text through `sourceText`, or structured chunk data through `chunks`.
- `POST /api/chat` expects `{ question, machineId?, manualIds?, limit? }` and returns grounded sources, part links, and a log draft.
- `POST /api/logs` accepts the one-click fix log payload from chat, including `issue`, `resolution`, `partNumbers`, and `sourceManualIds`.
- `GET /api/machines?query=` uses the local ranked search path for machine tagging and selector filtering.
