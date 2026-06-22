# Enterprise System Design Curriculum

This guide turns the runnable Node/Bun primitives into interview-ready system
design lessons. Use it after you understand the code in
`src/node-concepts/system-design`.

## The Answer Template

Use this structure for every system design prompt:

1. Requirements: functional and non-functional.
2. Scale: users, requests per second, data volume, latency target, retention.
3. API: external contract and idempotency behavior.
4. Data model: entities, keys, indexes, ownership, retention.
5. Architecture: request path, write path, async path, failure boundaries.
6. Deep dive: one core component, algorithm, or datastore decision.
7. Failure modes: dependency failures, retries, overload, data loss, hot keys.
8. Observability: metrics, traces, logs, profiles, dashboards, alerts.
9. Security: authentication, authorization, abuse, privacy, tenant isolation.
10. Evolution: single-node prototype, distributed version, multi-region version.

## Rubric

| Level | What the answer sounds like |
| --- | --- |
| Beginner | Draws boxes and explains the happy path. |
| Intermediate | Adds API, data model, cache, queue, and bottlenecks. |
| Advanced | Quantifies scale, explains consistency, failure handling, and trade-offs. |
| Expert | Connects design to SLOs, operations, security, cost, migrations, and incident response. |

## Scenario 1: API Rate Limiter

Related code: `rate-limiter.ts`

### Prompt

Design an API rate limiter for a public SaaS API.

### Teaching Notes

Start with one process:

- Token bucket allows bursts while enforcing average rate.
- Sliding window gives stricter fairness over a rolling interval.
- The in-memory implementation is correct only inside one process.

Production upgrade:

- Store counters in Redis or another shared low-latency store.
- Use atomic operations or Lua scripts so concurrent requests cannot overrun
  the limit.
- Add separate limits for IP, user, API key, tenant, and endpoint.
- Return `429` with `Retry-After`.
- In Bun, discuss `Bun.redis` or `RedisClient` as the native client boundary;
  still call out atomicity, Redis availability, and fail-open/fail-closed
  policy.

### Sample Answer Skeleton

```text
Functional: allow or reject each request based on tenant/API key policy.
Scale: 50k RPS global, p99 limiter decision under 5 ms.
API: middleware returns allow/deny plus retryAfterMs.
Data: key = tenant:endpoint:window, value = token count or timestamp bucket.
Architecture: gateway -> auth -> limiter -> service.
Failure: fail-open for internal dashboards, fail-closed for paid write APIs.
Observability: allowed, rejected, Redis latency, limiter errors, hot keys.
Security: per-tenant isolation, bypass protection, admin override audit logs.
```

### Follow-Ups

- How do you support burst credits for enterprise customers?
- How do you avoid Redis becoming the bottleneck?
- What happens if the limiter store is unavailable?
- How do you keep limits consistent across regions?

## Scenario 2: Distributed Cache

Related code: `lru-cache.ts`, `consistent-hash.ts`

### Prompt

Design a distributed cache for product pages.

### Teaching Notes

The local LRU cache teaches O(1) get/set/evict through `Map` plus a doubly linked
list. Production adds:

- Consistent hashing to place keys across nodes.
- Replication for availability.
- TTL for freshness.
- Single-flight or request coalescing to prevent cache stampede.
- Hot-key detection and replication.

### Example Read Path

```text
client -> edge -> product service -> cache ring -> primary database
```

1. Hash product ID to cache node.
2. Read cache.
3. On miss, fetch DB row.
4. Populate cache with TTL and version.
5. Return product.

Bun implementation hook:

- Use `Bun.redis` for the distributed cache discussion.
- Keep in-memory `LRUCache` only as a local process optimization or teaching
  primitive.

### Observability

- Cache hit rate by endpoint and tenant.
- Eviction rate, memory pressure, hot keys.
- DB fallback rate and fallback latency.
- Rebalance events when cache nodes join or leave.

### Follow-Ups

- Cache-aside vs write-through vs write-behind.
- How to invalidate on product update.
- How to prevent stale prices.
- How to rebuild after node loss.

## Scenario 3: Globally Unique ID Service

Related code: `id-generation.ts`

### Prompt

Design an ID generator for orders, events, and public links.

### Teaching Notes

Compare three options:

| Option | Use when | Risk |
| --- | --- | --- |
| Database sequence | Strong central ordering is acceptable. | Central bottleneck and regional dependency. |
| UUID v7 | Standard sortable IDs are enough. | Larger ID string, no custom worker fields. |
| Snowflake-style | Need compact sortable IDs with worker and sequence fields. | Clock rollback and worker ID assignment. |

### Sample Deep Dive

```text
64-bit ID:
timestamp bits | worker bits | sequence bits
```

Explain:

- What epoch is used.
- How many workers are supported.
- How many IDs per millisecond per worker are supported.
- What happens when the clock moves backward.
- How worker IDs are assigned and recycled.

### Follow-Ups

- Can IDs reveal creation time?
- Can users enumerate resources?
- How do you migrate from integer IDs to public IDs?
- How do you preserve sort order across regions?

Bun implementation hook:

- Use `Bun.randomUUIDv7()` when standard sortable UUIDs are enough.
- Use the Snowflake-style implementation only when the interview requires
  custom worker and sequence fields.

## Scenario 4: Object Metadata Service

Related code: `bloom-filter.ts`, `lru-cache.ts`

### Prompt

Design metadata lookup for an object storage system.

### Teaching Notes

Use a Bloom filter to protect the database from random missing-key lookups:

1. If Bloom filter says "definitely not present", skip DB.
2. If it says "might be present", check cache.
3. On cache miss, read database.
4. Return metadata or not found.

Bun implementation hook:

- Use `Bun.SQL` for the production SQL path when discussing PostgreSQL/MySQL.
- Use `bun:sqlite` only for local-first tools and CI-safe exercises.

The core teaching point: Bloom filters trade false positives for memory savings,
but should never be used as authorization proof.

### Failure Modes

- Overfilled filter raises false positives.
- Stale filter misses newly added keys unless it is updated.
- Rebuilds must be versioned so old and new services agree.
- Deletes need counting Bloom filters or periodic rebuilds.

### Observability

- Bloom negative rate.
- False-positive estimate.
- DB read avoidance.
- Cache hit rate.
- Not-found request rate by tenant and IP.

## Scenario 5: Feed Fanout Service

Related code: `pub-sub.ts`, `concurrent-operations.ts`, `resilience.ts`

### Prompt

Design a social feed delivery service.

### Teaching Notes

Two common strategies:

| Strategy | Best for | Trade-off |
| --- | --- | --- |
| Fanout on write | Normal users with moderate follower count. | More writes, faster reads. |
| Fanout on read | Celebrity accounts and huge fanout. | Slower reads, lower write explosion. |

Hybrid:

- Fanout normal users on write.
- Store celebrity posts separately.
- Merge celebrity posts at read time.

### System Pieces

- Post service writes canonical post.
- Queue distributes fanout jobs.
- Worker writes per-user feed entries.
- Cache stores recent feed pages.
- Read service merges ranked results.

### Follow-Ups

- How do you handle retry storms?
- How do you dedupe fanout jobs?
- How do you rebuild a user's feed?
- How do you rank content without blocking writes?

## Scenario 6: AI/RAG Knowledge Assistant

Related concepts: OWASP LLM risks, rate limiting, observability, cache, queues.

### Prompt

Design an enterprise knowledge assistant that answers questions from internal
documents.

### Teaching Notes

Core path:

```text
user -> auth -> query rewrite -> retrieval -> rerank -> model -> policy check -> answer
```

Minimum components:

- Document ingestion pipeline.
- Chunking and embedding jobs.
- Vector index plus source-of-truth document store.
- Retrieval service with tenant and ACL filtering.
- LLM gateway with model fallback and cost controls.
- Evaluation set for answer quality and safety.

### Security And Safety

- Enforce document ACLs before retrieval and before citation display.
- Treat retrieved text as untrusted input.
- Defend against prompt injection inside documents.
- Validate tool calls and model output.
- Log policy decisions without leaking sensitive content.

### Observability

- Query latency by stage.
- Retrieval hit rate and empty-result rate.
- Model latency, token cost, fallback rate.
- Policy block rate.
- Human feedback and evaluation-set regressions.

### Follow-Ups

- How do you prevent cross-tenant data leakage?
- How do you evaluate answer quality?
- How do you handle stale documents?
- How do you degrade when the model provider is down?

## Mock Interview Drills

### 35-Minute Mid-Level Drill

Prompt: design a notification service.

Expected coverage:

- API for enqueueing notification.
- User preference data model.
- Queue and worker path.
- Email/SMS/push provider retries.
- Idempotency key.
- Dead-letter queue.
- Metrics for send success, provider latency, retry count.

### 45-Minute Senior Drill

Prompt: design a distributed cache for a multi-tenant API.

Expected coverage:

- Per-tenant key namespace.
- Consistent hashing.
- TTL and invalidation.
- Hot-key mitigation.
- Cache stampede protection.
- Regional failover.
- Security and audit boundaries.

### 60-Minute Staff Drill

Prompt: design a global AI support assistant.

Expected coverage:

- RAG ingestion and retrieval.
- Tenant-aware auth and ACL checks.
- Prompt-injection defenses.
- Evaluation and rollout strategy.
- Cost and latency budgets.
- Model fallback.
- Incident response for data leakage.

## What To Say When You Are Stuck

Use these pivots instead of going silent:

- "I will start with a single-region version, then call out the multi-region changes."
- "The core risk is the write path, so I will deep dive on idempotency and queue retries."
- "The read path is latency-sensitive, so I will define the cache and fallback behavior first."
- "I need to choose consistency. For this product, stale reads are acceptable for feed items but not for billing."
- "I will add the observability signals now so we can detect when this design fails in production."
