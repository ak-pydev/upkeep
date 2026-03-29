# RAG Chatbot Implementation

## Current State

- The app already has a basic retrieval-plus-generation flow.
- User questions are matched against machines, manual chunks, and maintenance logs in [`lib/upkeep/chat.ts`](/Users/aadityakhanal/Desktop/revolutionUC/lib/upkeep/chat.ts).
- Retrieval is currently lexical, using token overlap and simple error-code boosting in [`lib/upkeep/search.ts`](/Users/aadityakhanal/Desktop/revolutionUC/lib/upkeep/search.ts).
- The top-ranked chunks and logs are packed into a Claude prompt.
- Manual content is chunked and stored, but not embedded for semantic retrieval.
- Supabase integration exists, and `manual_vectors` rows are already shaped in [`lib/integrations/supabase.ts`](/Users/aadityakhanal/Desktop/revolutionUC/lib/integrations/supabase.ts), but vector search is not active yet.

## What This Means

- The product is already "RAG-like" because it retrieves source chunks before generation.
- It is not a production-grade RAG chatbot yet because retrieval is not semantic, chat is not conversational across turns, and there is no ranking fusion across lexical and vector results.

## High-Value Upgrade Path

### Phase 1: Real Semantic Retrieval

- Add embeddings for every manual chunk at ingest time.
- Store embeddings in Supabase `pgvector`.
- Add a retrieval RPC or SQL function that returns the nearest chunks for a user query embedding.
- Combine semantic retrieval with the current keyword/error-code ranking so exact alarm codes still score well.

### Phase 2: Better Grounding

- Retrieve both manual chunks and related maintenance logs.
- Add machine metadata, recent repair history, and uploaded PDF title to the prompt separately instead of flattening everything into one context blob.
- Add source thresholds so low-confidence retrieval returns "not enough supporting context" instead of a weak answer.

### Phase 3: Conversational Chatbot

- Persist chat sessions and messages.
- Summarize prior turns into machine-specific context.
- Carry forward the active machine, current PDF, and previously cited chunks.
- Add follow-up prompts like "show the exact page" or "what changed from last time?"

### Phase 4: Safer Production Behavior

- Add citation requirements to every answer.
- Add retrieval diagnostics in logs: matched chunks, scores, query embedding latency, Claude latency.
- Add answer fallback rules when retrieval is weak or missing.
- Add evaluation sets for common alarms and known fixes.

## Recommended Architecture

### Ingest

- User uploads PDF.
- PDF text is extracted and chunked.
- Each chunk is embedded.
- Chunk text, metadata, and embedding are stored in Supabase.

### Query

- User asks a question.
- System resolves the active machine and attached PDFs.
- Query is embedded.
- Retrieve top semantic matches from `pgvector`.
- Retrieve lexical matches for exact codes and part numbers.
- Merge, deduplicate, rerank, and pass the best context to Claude.

### Response

- Claude returns a grounded answer.
- UI shows the answer, citations, likely parts, and a log draft.
- User can save the fix back into the repair history.

## Gaps In This Repo

- No embedding provider is wired yet.
- No vector column or vector similarity query is used during retrieval.
- No persisted chat sessions exist.
- No hybrid reranking exists.
- No evaluation harness exists for answer quality.

## Recommended Build Order

1. Add embeddings at manual-ingest time.
2. Add `pgvector` retrieval in Supabase.
3. Switch `answerQuestion` to hybrid retrieval.
4. Add chat session persistence.
5. Add retrieval and answer observability.

## Bottom Line

- Yes, this codebase is a good candidate for a real RAG chatbot.
- The current app already has the right shape: chunked documents, retrieval hooks, Claude generation, and a persistence layer.
- The biggest missing piece is semantic retrieval. Once embeddings and hybrid ranking are added, the chatbot becomes substantially stronger without needing a full rewrite.
