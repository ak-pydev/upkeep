# Supabase boundary

This repo ships with a demo-first in-memory store and SQL artifacts for the eventual Supabase migration.

## Tables

- `machines` stores the equipment selector state.
- `manuals` stores uploaded manuals and their indexing status.
- `manual_chunks` stores chunked manual text plus optional pgvector embeddings.
- `maintenance_logs` stores resolved fixes and the parts used.

## Swap-in path

- Keep the API contract in `app/api/**`.
- Replace the write helpers in `lib/upkeep/store.ts` with Supabase insert/update calls.
- Use `lib/integrations/supabase.ts` row mappers to shape the payloads.
- Use `supabase/schema.sql` as the production schema starting point.

## Demo mode

- The seeded in-memory store powers the local API immediately.
- Chat uses ranked manual chunks first and only falls back to Claude if `UPKEEP_AI_MODE=claude` and `ANTHROPIC_API_KEY` is set.

