# Vector Search — Firestore vs Vertex AI

## Default: Firestore-backed search

The current implementation stores chunks and embeddings in Firestore and does
ranking in-process. For a typical Upkeep tenant (hundreds of manuals, tens of
thousands of chunks), this is the right default for four reasons:

1. **Single system.** Chunks, metadata, and embeddings all live in Firestore,
   written atomically. No "was my upsert replicated to the vector index yet?"
   race window.
2. **Cost.** Firestore is pay-per-op. No always-on endpoint you rent per hour.
3. **Simpler ops.** No separate index lifecycle, no `contentsDeltaUri`, no
   deployed-index redeploys.
4. **Lower latency for small corpora.** The in-process cosine scan in
   `vectorsearch/store.go` is acceptable up to modest corpus sizes. Native
   Firestore vector queries are prepared for future use, but are not the active
   default query path in this repo today.

## When to switch to Vertex AI Vector Search

Switch when you hit **any one of**:

- A single tenant exceeds ~1M chunks. Firestore handles it but latency drifts.
- You need multi-million-scale ANN with sub-100ms P99.
- You want to run embeddings at batch-insert scale (>100k/min).

The `VectorStore` interface is written so you can swap backends without
touching handlers. Today, `VECTOR_BACKEND=vertex` is still a stubbed path and
falls back to the Firestore-backed implementation.

For the current dev project (`upkeep-dev-493800`), the Vertex AI resources are
already provisioned:
- Index: `projects/908428850871/locations/us-central1/indexes/1898612489587785728`
- Endpoint: `projects/908428850871/locations/us-central1/indexEndpoints/2668921539914629120`
- Deployed index ID: `upkeep_deployed_1776563730`
- Region: `us-central1`

That means infra is ready, but the application code path still intentionally
falls back to Firestore until a real `vertexVectorStore` implementation lands.

## Provisioning (Vertex)

`scripts/setup-vector-search.sh` handles this end-to-end. The `vertexVectorStore`
implementation itself is a TODO — it currently falls back to Firestore. The
fallback is deliberate: the scale at which you actually need Vertex is a
deployment milestone, not a hackathon one.
