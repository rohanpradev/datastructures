# Node System Design Building Blocks

This folder contains small executable versions of common system design components. The goal is not to replace Redis, Envoy, NGINX, Kafka, or a database. The goal is to understand the core algorithm well enough to explain it in an interview.

## Folder Structure

| File | Concept | What to practice |
|---|---|---|
| `rate-limiter.ts` | Token bucket and sliding window limiters | API gateway throttling, fairness, Redis atomic updates |
| `lru-cache.ts` | LRU cache | Cache eviction, recency tracking, hit/miss metrics |
| `id-generation.ts` | Bun UUID v7, Base62, and Snowflake-style IDs | URL shorteners, sortable distributed IDs, clock rollback |
| `consistent-hash.ts` | Consistent hashing with virtual nodes | Sharding, cache rings, partial rebalancing |
| `bloom-filter.ts` | Bloom filter | Negative cache, memory/probability trade-offs |
| `weighted-fair-queue.ts` | Weighted fair queuing | Multi-tenant fairness, noisy-neighbor control, work cost |
| `idempotency-store.ts` | Idempotency-key state machine | Retry-safe writes, duplicate suppression, TTL trade-offs |
| `load-balancer.ts` | Round robin and least connections | Backend selection, lifecycle accounting, health and retry discussion |
| `replication-quorum.ts` | N/R/W quorum analysis | Replica overlap, stale reads, failure tolerance, consistency limits |
| `at-least-once-queue.ts` | Visibility-timeout work queue | Redelivery, acknowledgements, idempotent effects, delayed retry, DLQ |

## Advanced Problem Set

Use these prompts after you can explain the basic implementation.

| Problem | Required building block | Follow-up |
|---|---|---|
| Design a URL shortener | Base62, cache, rate limiter | Prevent enumeration and abuse. |
| Design a distributed cache | LRU, consistent hashing | Add node health, replication, and hot-key handling. |
| Design API rate limiting | Token bucket, sliding window | Make it work across multiple app servers with Redis. |
| Design a feed fan-out service | pub/sub, queues, cache | Handle celebrity users and retry storms. |
| Design an object metadata service | Bloom filter, cache, SQL | Avoid database hits for missing objects. |
| Design a globally unique ID service | Snowflake-style IDs | Handle worker assignment and clock rollback. |
| Design a multi-tenant job scheduler | Weighted fair queue | Prevent noisy neighbors without starving low-volume tenants. |
| Design a payment or checkout API | Idempotency key store | Replay completed writes and handle stuck in-flight attempts. |
| Design an AI inference gateway | Rate limiter, weighted queue, idempotency | Separate admission control, fair scheduling, and duplicate request handling. |
| Design a webhook delivery service | Idempotency, queues, circuit breaker | Retry safely, dedupe provider events, and isolate bad receivers. |
| Design a distributed work queue | At-least-once queue, idempotency | Partition ordering, durable leases, redelivery, poison work, and replay. |
| Design a global read/write store | Replication quorums, consistent hashing | Explain stale reads, conflicts, repair, failover, and regional latency. |
| Design an L7 service proxy | Load balancing, rate limiter, circuit breaker | Add health, draining, locality, outlier ejection, and retry budgets. |

## Bun Runtime Tie-In

Use Bun primitives where they reduce course overhead:

- `bun:test` keeps the examples executable without Jest/Vitest setup.
- `bunfig.toml` keeps preload and coverage behavior in one place.
- `Bun.file`, `Bun.write`, `Bun.Glob`, Bun Shell, `Bun.randomUUIDv7()`, and `bun:sqlite` are covered in the Bun runtime guide for local system-design exercises.
- `Bun.sql` and `Bun.redis` are useful production discussion points, but this repo keeps tests self-contained and avoids requiring external services in CI.
- `Bun.JSONL`, `Bun.Archive`, and `Bun.cron` provide useful ingestion,
  export, and scheduling primitives, but do not replace validation, safe path
  handling, durable workflow history, leases, or idempotency.

Use [the system design handbook](../../../docs/SYSTEM_DESIGN_HANDBOOK.md) for
the complete concept map and important question bank.

## How To Discuss A System Design Component

Use this order:

1. Requirements: what should it do?
2. Scale: how many users, requests, keys, or events?
3. Data model: what needs to be stored?
4. Algorithm: how does it decide?
5. Failure modes: what can go wrong?
6. Production upgrade: what changes when it becomes distributed?

## Token Bucket Rate Limiter

File: `rate-limiter.ts`  
Class: `TokenBucketRateLimiter`

Use case:

- API gateway request throttling
- User/IP request limits
- Allowing short bursts while enforcing an average rate

Beginner explanation:

Imagine a bucket that holds tokens. Every request must spend one token. Tokens refill over time. If the bucket is empty, the request is rejected.

Step-by-step:

1. Start with a full bucket.
2. Before each request, calculate how many tokens should have refilled.
3. Cap tokens at bucket capacity.
4. If enough tokens exist, allow the request and subtract tokens.
5. Otherwise reject and return how long the caller should wait.

Production notes:

- In one Node process, an in-memory limiter works only for that process.
- In a distributed system, use Redis or another shared store.
- Use atomic operations or Lua scripts to prevent race conditions.

## Sliding Window Rate Limiter

File: `rate-limiter.ts`  
Class: `SlidingWindowRateLimiter`

Use case:

- Hard limit of `N` requests per rolling time window
- Fairer than a fixed window at boundaries

Beginner explanation:

Keep timestamps for recent requests. A request is allowed only if fewer than `limit` timestamps exist inside the current rolling window.

Step-by-step:

1. Remove timestamps older than `now - windowMs`.
2. If the remaining count is already at the limit, reject.
3. Otherwise append the current timestamp and allow.

Production notes:

- In memory, timestamp arrays can grow if keys are never cleaned.
- At scale, use Redis sorted sets or approximate counters.
- Sliding window is fair but can be more expensive than token bucket.

## LRU Cache

File: `lru-cache.ts`  
Class: `LRUCache`

Use case:

- URL shortener hot redirects
- API response caching
- User/session/config cache
- Feed or profile cache

Beginner explanation:

LRU means least recently used. When cache capacity is full, remove the item that has not been used for the longest time.

Data structures:

- `Map` gives O(1) lookup by key.
- Doubly linked list gives O(1) move-to-front and remove-tail.

Step-by-step:

1. On `get(key)`, return the value and move the entry to the front.
2. On `set(key, value)`:
   - update existing entry and move it to the front, or
   - insert a new entry at the front.
3. If capacity is exceeded, evict the tail.

Production notes:

- Add TTL when freshness matters.
- Use Redis/Memcached for shared cache across processes.
- Track hit rate, miss rate, evictions, and memory usage.

## Bun UUID v7

File: `id-generation.ts`  
Function: `createSortableUuid`

Use case:

- Sortable database primary keys
- Event IDs that need rough creation-time ordering
- Application IDs where a standard UUID format is preferred

Beginner explanation:

`Bun.randomUUIDv7()` creates a UUID v7 with timestamp ordering built in. Prefer it over a custom Snowflake implementation unless the interview or production system specifically needs custom bit fields, worker IDs, or sequence control.

## Base62 Encoding

File: `id-generation.ts`  
Functions: `encodeBase62`, `decodeBase62`

Use case:

- URL shortener codes
- Compact public IDs
- Turning numeric database IDs into shorter strings

Beginner explanation:

Base62 uses digits, lowercase letters, and uppercase letters. That gives 62 possible characters for each position, which makes IDs shorter than decimal.

Step-by-step:

1. Divide the number by 62.
2. Use the remainder to pick one Base62 character.
3. Repeat with the quotient.
4. Reverse the collected characters.

Production notes:

- Sequential IDs are easy to encode but predictable.
- Add authorization and abuse controls if IDs expose resources.
- Use collision checks if IDs are generated randomly instead of from counters.

## Snowflake-Style IDs

File: `id-generation.ts`  
Class: `SnowflakeIdGenerator`

Use case:

- Distributed unique IDs without a central database counter
- Sortable IDs for logs, events, messages, and records

Beginner explanation:

A Snowflake-style ID packs multiple fields into one integer:

- timestamp
- worker ID
- sequence number inside the same millisecond

Step-by-step:

1. Read the current timestamp.
2. Subtract a custom epoch to keep the number smaller.
3. Add the worker ID so different machines do not collide.
4. Add a sequence counter for multiple IDs in the same millisecond.
5. Shift fields into fixed bit positions and combine them.

Production notes:

- Worker IDs must be unique across instances.
- Clock rollback must be handled.
- Sequence overflow can happen under extreme same-millisecond load.

## Consistent Hashing

File: `consistent-hash.ts`  
Class: `ConsistentHashRing`

Use case:

- Distributed cache sharding
- Partitioning users, tenants, videos, or documents across storage nodes
- Reducing key movement when nodes join or leave

Beginner explanation:

Normal modulo sharding uses `hash(key) % nodeCount`. When `nodeCount` changes, most keys move. Consistent hashing places both keys and nodes on a hash ring. A key belongs to the first node clockwise from the key hash. When a node joins or leaves, only nearby keys move.

Data structures:

- Sorted array of virtual node hashes.
- Set of physical nodes.
- Binary search for the first virtual node at or after the key hash.

Step-by-step:

1. Hash each physical node many times to create virtual nodes.
2. Sort the virtual nodes by hash.
3. Hash the key.
4. Binary-search the ring for the first node with hash greater than or equal to the key hash.
5. Wrap around to the first node when the key hash is larger than every virtual node.

Production notes:

- Use many virtual nodes to smooth distribution.
- Add replicas so one node failure does not make data unavailable.
- Track hot keys separately; consistent hashing does not solve skew by itself.
- Use stable node IDs, not ephemeral container hostnames.

## Bloom Filter

File: `bloom-filter.ts`  
Class: `BloomFilter`

Use case:

- Avoiding database reads for definitely missing keys
- Protecting a cache from penetration by random IDs
- Fast pre-check before expensive object metadata lookups

Beginner explanation:

A Bloom filter is a compact bit array. To add a value, hash it several ways and set those bit positions. To check a value, hash it the same ways. If any bit is unset, the value definitely was not added. If all bits are set, the value might have been added.

Trade-off:

- False negatives: no, if values are only added and the filter is not corrupted.
- False positives: yes, controlled by bit count and hash count.
- Deletes: not supported by a standard Bloom filter. Use counting Bloom filters if deletes are required.

Step-by-step:

1. Pick expected item count and acceptable false-positive rate.
2. Compute the bit-array size.
3. Compute the number of hash functions.
4. Add known keys during startup or from a stream.
5. On reads, skip the expensive lookup when the filter says "definitely not present".

Production notes:

- Rebuild periodically when the data set changes heavily.
- Version filters during deploys so old and new processes agree.
- Monitor false-positive rate; it rises as the filter becomes overfilled.
- Never use it as an authorization check because "might contain" is not proof.

## Weighted Fair Queue

File: `weighted-fair-queue.ts`  
Class: `WeightedFairQueue`

Use case:

- Multi-tenant job execution
- Shared AI inference workers
- Webhook delivery across customers
- Background task queues where work has different cost

Beginner explanation:

Priority queues can starve low-priority users. Plain FIFO lets one tenant flood the queue. Weighted fair queuing gives each tenant a proportional share by assigning every item a virtual finish time. Higher-weight tenants move through virtual time more slowly, so they receive more service over time without making other tenants disappear.

Step-by-step:

1. Assign each tenant a weight.
2. Estimate each work item's cost.
3. Compute `virtualFinish = max(currentVirtualTime, tenantLastFinish) + cost / weight`.
4. Dequeue the item with the lowest virtual finish time.
5. Advance virtual time to the dequeued item's finish time.

Production notes:

- Use measured cost when possible: tokens, bytes, CPU milliseconds, rows scanned, or downstream calls.
- Store queued work durably when losing jobs is unacceptable.
- Pair fairness with admission control; a fair queue does not protect memory by itself.
- Track per-tenant queued items, wait time, service time, rejects, and effective share.

## Idempotency Key Store

File: `idempotency-store.ts`  
Class: `IdempotencyKeyStore`

Use case:

- Payment and checkout APIs
- Order creation
- Webhook processing
- Any write that clients may retry after a timeout

Beginner explanation:

An idempotency key lets the server tell "this retry is the same write attempt." The first request claims the key and performs the write. A concurrent duplicate gets a conflict/retry response. After the write completes, later duplicates receive the same response instead of creating a second order or charge.

Step-by-step:

1. Client sends a stable idempotency key with the write request.
2. Server atomically claims the key before doing side effects.
3. Concurrent duplicates are rejected or told to retry later.
4. On success, store the response for a replay TTL.
5. On failure, release the in-flight key when retrying is safe.

Production notes:

- Use Redis `SET NX PX`, SQL unique constraints, or another atomic store; process memory is only a teaching model.
- Scope keys by user, tenant, endpoint, and request shape so unrelated writes cannot collide.
- Store a request hash with the key to reject mismatched retries.
- Tune in-flight TTL and replay TTL separately.
- Log claim, conflict, replay, completion, expiration, and mismatch counts.

## Round Robin And Least Connections

File: `load-balancer.ts`

Classes: `RoundRobinLoadBalancer`, `LeastConnectionsLoadBalancer`

Use case:

- Stateless API replicas
- Long-lived or uneven-duration requests
- Service-proxy and gateway interviews

Beginner explanation:

Round robin rotates through healthy backends and works well when requests cost
roughly the same. Least connections chooses the backend with the fewest active
requests and adapts better when one request can run much longer than another.

Invariant:

- Round robin advances exactly once for each successful selection.
- Least connections increments on acquire and decrements exactly once on
  release. The disposable lease makes cleanup safe when code returns or throws.

Production notes:

- Selection happens only among healthy, non-draining endpoints.
- Passive outlier ejection must not remove every endpoint during a shared
  dependency failure.
- Session affinity improves locality but can create uneven load and failover
  bursts.
- Retries need a shared budget; otherwise the load balancer amplifies an outage.
- Add locality, connection warmup, circuit state, endpoint weight, and overload
  signals before treating active-connection count as complete capacity.

## Replication Quorums

File: `replication-quorum.ts`

Functions: `analyzeQuorum`, `majorityQuorum`

Use case:

- Dynamo-style replicated stores
- Multi-replica read/write trade-offs
- Consistency and availability follow-ups

Beginner explanation:

`N` replicas store the data, a read waits for `R`, and a write waits for `W`.
If `R + W > N`, every possible read set intersects every acknowledged write
set. If `2W > N`, any two acknowledged write sets intersect.

The crucial limit:

Overlap does not automatically mean a linearizable database. The coordinator
still needs version ordering, conflict rules, read repair, failure detection,
and a protocol that prevents stale or concurrent versions from winning.

Production notes:

- Lower `R` improves read availability/latency but may increase stale reads.
- Lower `W` improves write availability/latency but weakens write overlap.
- Sloppy quorums can preserve availability without intersecting the replicas
  that normally own the key.
- Multi-region quorum latency is bounded by slow cross-region acknowledgements.
- Track replica lag, divergent versions, repairs, conflicts, unavailable
  quorums, and coordinator latency.

## At-Least-Once Work Queue

File: `at-least-once-queue.ts`

Class: `AtLeastOnceQueue`

Use case:

- Email, webhook, image, and report jobs
- Background workflows with consumer crashes
- Queue delivery-semantics interviews

Beginner explanation:

Receiving a job hides it for a visibility timeout. The consumer acknowledges
after the business effect commits. If it crashes before acknowledgement, the
lease expires and another consumer receives the same job. Redelivery is the
reason consumer effects must be idempotent.

State transitions:

```text
queued -> delivered/invisible -> acknowledged/deleted
                  | timeout or nack
                  v
               queued again -> dead letter after max attempts
```

Production notes:

- Persist and replicate queue state before acknowledging the producer.
- Use unique message IDs and reject stale delivery receipts.
- Extend visibility with heartbeats only while the consumer still owns work.
- Define ordering per partition/entity instead of promising global order.
- Pair exponential backoff and jitter with retry classification.
- A DLQ needs an owner, alert, inspection/redaction policy, replay tool, and
  retention limit; it is not a place to forget failed data.
- Track oldest queued age, delivery latency, attempts, timeouts, duplicate
  effects, DLQ growth, consumer saturation, and end-to-end completion.
