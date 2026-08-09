# System Design Handbook

This is the master map for backend, distributed-systems, platform, and AI
system-design interviews. It connects the detailed scenarios in
[ENTERPRISE_SYSTEM_DESIGN_CURRICULUM.md](./ENTERPRISE_SYSTEM_DESIGN_CURRICULUM.md)
to executable primitives under `src/node-concepts/system-design/`.

The goal is not to memorize one architecture. The goal is to make requirements,
numbers, invariants, failure behavior, and trade-offs explicit enough that a
different prompt still feels familiar.

## How To Use This Handbook

For each design:

1. Answer from a blank page for 35-45 minutes.
2. Use the scorecard at the end.
3. Run the closest executable primitive.
4. Redesign one failure path: region loss, hot key, duplicate delivery, stale
   read, overloaded dependency, or compromised tenant.
5. Repeat after 1, 3, 7, and 14 days until the structure is automatic.

Do not begin by naming products. Begin with the user-visible contract and the
load. A database, queue, cache, CDN, model, or orchestrator is a consequence of
those requirements.

## The 45-Minute Answer Frame

### 0-5 Minutes: Clarify The Contract

Ask:

- Who uses the system and what is the critical journey?
- Which operations are reads, writes, streams, searches, or background work?
- What is in scope and explicitly out of scope?
- Which guarantees matter: ordering, freshness, durability, uniqueness,
  privacy, or exactly-once business effects?
- What are the latency, availability, recovery, and cost goals?
- Is the system single-region, multi-region, or globally active-active?

State two or three functional requirements and two or three non-functional
requirements. This prevents an impressive design for the wrong problem.

### 5-10 Minutes: Estimate Scale

Use round numbers and state assumptions:

```text
average QPS = daily operations / 86,400
peak QPS = average QPS x peak factor (often 3-10)
bandwidth = QPS x average payload bytes
storage/year = writes/second x bytes/write x 31,536,000
cache memory = hot objects x average object bytes x replication overhead
availability budget = period x (1 - target availability)
```

Numbers do not need false precision. They need to change a decision. Say what
breaks first if traffic is ten times higher.

### 10-15 Minutes: Define APIs And Data

For every important endpoint or event, specify:

- identity and authorization boundary;
- request and response shape;
- idempotency key and deduplication scope for writes;
- pagination and stable ordering;
- versioning and compatibility;
- rate-limit identity and quota behavior;
- error model, retryability, and timeout budget.

Sketch the entities, primary keys, indexes, ownership, retention, and deletion
path. Include tenant identity in keys when isolation depends on it.

### 15-25 Minutes: Draw The Smallest Viable Architecture

Start with a client, edge/gateway, stateless service, source of truth, and the
one asynchronous or cache layer the requirements justify. Walk one write and
one read end to end before adding more boxes.

For every component, say:

- what state it owns;
- how it scales;
- what happens when it is slow or unavailable;
- whether failure is fail-open or fail-closed;
- which signal shows that it is unhealthy.

### 25-35 Minutes: Deep Dive Into The Hard Part

Choose the part that carries the strongest requirement: partitioning, cache
coherence, feed fanout, queue semantics, ranking, payment correctness,
multi-region writes, search indexing, real-time presence, or model serving.

State an invariant. Examples:

- a captured payment has one durable ledger effect for one idempotency key;
- an acknowledged message is not lost after the broker's documented failure
  threshold;
- a tenant cannot consume more than its scheduled share;
- every acknowledged quorum write intersects the configured read quorum;
- permission checks happen after retrieval and before model context assembly.

### 35-42 Minutes: Failure, Security, And Operations

Cover:

- timeouts, retry budgets, exponential backoff, jitter, and circuit breakers;
- overload, bounded queues, load shedding, and backpressure;
- replica lag, stale reads, conflict resolution, and repair;
- dead letters, poison messages, replay, and idempotent consumers;
- authentication, authorization, encryption, secrets, abuse, and audit;
- SLI/SLO, traces, metrics, logs, profiles, dashboards, and alerts;
- backups, restore tests, RPO, RTO, regional failover, and runbooks.

### 42-45 Minutes: Trade-Off Summary

End with three decisions, why they fit the stated scale, and what would trigger
the next redesign. Strong answers expose their own limits.

## Master Concept Map

| Area | You should be able to explain | Executable material |
| --- | --- | --- |
| Traffic | DNS, CDN, L4/L7 proxies, round robin, least connections, health checks, stickiness, load shedding | `load-balancer.ts`, `rate-limiter.ts` |
| API contracts | REST/RPC/GraphQL trade-offs, pagination, idempotency, versioning, auth, quotas | `idempotency-store.ts` |
| Caching | cache-aside, read/write-through, TTL, invalidation, stampedes, hot keys, negative cache, CDN | `lru-cache.ts`, `bloom-filter.ts` |
| Storage | relational, document, key-value, wide-column, graph, search, time series, object storage, vector indexes | `sqlite.ts`, SQL discussion in Bun guide |
| Partitioning | range/hash/directory sharding, consistent hashing, resharding, skew, tenant placement | `consistent-hash.ts` |
| Replication | leader/follower, multi-leader, leaderless, quorum, lag, repair, conflicts | `replication-quorum.ts` |
| Identity | UUID, UUIDv7, Base62, Snowflake, collision and enumeration risks | `id-generation.ts` |
| Messaging | queue vs log vs pub/sub, delivery semantics, ordering, visibility, retries, DLQ, replay | `at-least-once-queue.ts`, `pub-sub.ts` |
| Scheduling | delay queues, cron, leases, fairness, retries, heartbeats, work stealing | `weighted-fair-queue.ts`, `modern-apis.ts` |
| Resilience | timeout budgets, retry classification, jitter, circuit breakers, bulkheads, fallback | `resilience.ts`, `circuit-breaker.ts` |
| Consistency | linearizable, serializable, causal, read-your-writes, monotonic reads, eventual | quorum and idempotency labs |
| Observability | user-centered SLIs, SLOs, error budgets, trace context, RED/USE, cardinality | server metrics and curriculum prompts |
| Security | threat modeling, least privilege, tenant isolation, supply chain, CSRF, SSRF, abuse | `security.ts`, `modern-apis.ts` |
| AI systems | RAG, inference gateways, batching, semantic cache, evaluation, guardrails, tool permissions | AI scenario and question bank below |

## Networking And The Edge

A backend design starts before the application process:

```text
client -> DNS/anycast -> CDN/WAF -> L4/L7 load balancer -> gateway/service
```

Know the boundaries:

- DNS maps names to endpoints and has cached TTL behavior; it is not an
  instant, per-request failover switch.
- Anycast can route clients toward a nearby edge, but path changes and regional
  withdrawal still need testing.
- A CDN serves cacheable content near users and protects origins; cache-key
  mistakes can leak personalized or tenant data.
- L4 balancing sees connections; L7 balancing understands HTTP routes,
  headers, identities, and richer policies at higher processing cost.
- TLS termination decides where plaintext begins, which identity is verified,
  and where certificates/keys rotate.
- HTTP/2 multiplexes streams on a connection; HTTP/3 uses QUIC over UDP to
  reduce transport head-of-line blocking, but deployment and observability
  support must be verified.
- Keep-alive and connection pools reduce setup cost but can pin load unevenly
  and exhaust file descriptors or upstream connection limits.

Choose real-time transport by contract:

| Transport | Best fit | Main trade-off |
| --- | --- | --- |
| Polling | Simple, infrequent updates | Repeated empty requests and freshness interval |
| Long polling | Broad compatibility with fewer empty polls | Connection churn and retry coordination |
| Server-Sent Events | One-way server stream over HTTP | No native bidirectional channel |
| WebSocket | Low-latency bidirectional messages | Connection state, routing, backpressure, reconnect |
| WebTransport/QUIC | Advanced multiplexed bidirectional transport | Ecosystem, proxy, and operational maturity |

Always cover maximum request/header/body sizes, idle/request timeouts, slow
clients, connection drain, proxy trust, forwarded-header validation, and DDoS
or bot controls.

## Data And Storage Decisions

### Choose By Access Pattern

| Need | Good starting model | Questions that can reverse the choice |
| --- | --- | --- |
| Transactions, constraints, joins | Relational database | Is write throughput dominated by one partition? Are cross-region writes required? |
| Primary-key lookup at very high scale | Key-value store | Are range scans, secondary indexes, or multi-record transactions central? |
| Flexible aggregates/documents | Document store | Which invariants are now enforced only in application code? |
| Huge ordered sparse datasets | Wide-column store | What partition key prevents hot tablets and unbounded rows? |
| Text relevance and faceting | Search index | What is the source of truth and how is the index rebuilt? |
| Relationship traversal | Graph store | Can adjacency lists in a relational/key-value model satisfy the real depth and scale? |
| Metrics and time windows | Time-series store | What are retention, downsampling, label-cardinality, and late-data rules? |
| Large immutable blobs | Object storage | Where do metadata, authorization, multipart state, and lifecycle policies live? |
| Semantic nearest-neighbor lookup | Vector index | How are tenant filters, freshness, recall, evaluation, and deletion handled? |

### Index Checklist

- Which query needs the index and in what sort order?
- Is the index covering or does it require random table lookups?
- How much write amplification and storage does it add?
- Does a low-cardinality prefix make it ineffective?
- How will pagination remain stable during concurrent writes?
- How are online creation, backfill, and rollback performed?

### Partition Checklist

- Choose a key with high cardinality and load distribution.
- Name the hottest possible tenant, user, object, or time bucket.
- Decide whether one entity must stay on one partition.
- Explain resharding without a stop-the-world migration.
- Track partition size, QPS, throttling, and skew.
- Keep a plan for tenant moves, tombstones, and deleted data.

## Distributed Systems Fundamentals

### Consistency Is A Product Requirement

| Guarantee | Meaning | Typical use |
| --- | --- | --- |
| Linearizability | Each operation appears atomic and respects real-time order | Locks, leader election, balances, critical configuration |
| Serializability | Concurrent transactions behave like some serial order | Multi-row business invariants |
| Snapshot isolation | A transaction sees a consistent snapshot; write skew may remain | Many relational workloads |
| Causal consistency | Cause is observed before effect | Collaboration, conversations, social interactions |
| Read-your-writes | A user sees their own accepted changes | Profiles, settings, created content |
| Monotonic reads | A client does not move backward in observed versions | Replicated user sessions |
| Eventual consistency | Replicas converge if writes stop | Feeds, counters, caches where staleness is acceptable |

CAP applies when a network partition exists: the system must choose whether a
given operation preserves consistency or availability. PACELC adds the normal
case: even without a partition, latency and consistency trade off. Do not use
either acronym as a substitute for naming the operation and failure behavior.

### Replication Models

- Leader/follower simplifies write ordering but needs failover, fencing, and a
  stale-read policy.
- Multi-leader improves regional write availability but creates conflicts that
  need domain-aware resolution.
- Leaderless replication uses configurable quorums and repair, but sloppy
  quorums, hinted handoff, versions, and concurrent writes complicate reasoning.
- Consensus is for agreeing on ordered state despite faults; it is not a fast
  path around latency or a replacement for application invariants.

Run:

```bash
bun test src/node-concepts/test/system-design.test.ts -t "Replication quorum"
```

Try `N=3, R=1, W=3`, `N=3, R=2, W=2`, and `N=5, R=3, W=3`.
Explain read/write availability, intersection, latency, and what the equations
still do not guarantee.

### Time, Ordering, And Identity

- Wall clocks can move backward and differ between machines.
- Monotonic clocks are suitable for elapsed time, not globally meaningful
  timestamps.
- Logical clocks capture ordering, not physical time.
- Hybrid logical clocks combine approximate time and causality.
- UUIDv7 gives rough time order without worker coordination.
- Snowflake-style IDs give compact sortable IDs but require worker identity and
  a clock-rollback policy.
- A database sequence is simple and strongly ordered but centralized.

Never infer authorization, tenancy, or secrecy from an unguessable-looking ID.

## Architecture And Data-Change Patterns

| Pattern | Use it when | Failure or misuse to discuss |
| --- | --- | --- |
| Modular monolith | One deployable can preserve clear internal ownership | Hidden coupling and one shared database schema |
| Microservices | Independent ownership/scale/release justify distribution | Network failure, data duplication, tracing, testing, operational cost |
| Saga | A business workflow spans services without one ACID transaction | Compensation is not rollback; steps and retries must be idempotent |
| Transactional outbox | Database state and an event must not diverge | Relay duplication, ordering, cleanup, lag, and schema evolution |
| CQRS | Read and write models have genuinely different needs | Projection lag, duplicated models, repair and backfill complexity |
| Event sourcing | Event history is the authoritative model and replay is valuable | Schema evolution, privacy deletion, snapshotting, debugging projections |
| Change data capture | Existing database changes must feed downstream systems | DDL changes, ordering, offsets, initial snapshot, reprocessing |
| Strangler migration | A legacy system must be replaced incrementally | Routing ambiguity, dual behavior, data ownership, rollback |
| Cell architecture | Blast radius and tenant scale need isolated copies | Placement, capacity fragmentation, cross-cell features, migrations |

For zero-downtime data changes, use expand/migrate/contract:

1. add backward-compatible schema/API support;
2. deploy writers/readers that tolerate both forms;
3. backfill with checkpoints, throttling, and verification;
4. switch reads and observe;
5. stop old writes;
6. remove the old representation only after rollback is no longer needed.

## Caching And Content Delivery

### Cache Patterns

- Cache-aside: application reads cache, falls back to source, then fills cache.
- Read-through: cache abstraction owns the miss load.
- Write-through: write cache and backing store synchronously.
- Write-behind: buffer writes for throughput; durability and ordering become
  explicit risks.
- Refresh-ahead: refresh hot items before expiry.
- Stale-while-revalidate: serve bounded stale data while one refresh runs.

Every cache answer should cover:

- key shape and tenant boundary;
- TTL and freshness contract;
- eviction and memory limit;
- invalidation after writes;
- stampede prevention with single-flight, jitter, or leases;
- negative caching and Bloom filter false positives;
- hot-key replication or request coalescing;
- fallback when cache is unavailable;
- hit rate, miss latency, evictions, and fill errors.

A cache is not harmless if it is optional: a cache outage can transfer all load
to the database and cause a second outage.

## Queues, Logs, Streams, And Schedulers

### Pick The Right Primitive

| Primitive | Best fit | Central question |
| --- | --- | --- |
| Work queue | One consumer should process each job | Visibility, redelivery, ack, retries, DLQ |
| Pub/sub | Live fanout where subscribers receive new events | What happens to offline or slow subscribers? |
| Durable log/stream | Replay, multiple consumer groups, ordered partition history | Partition key, offsets, retention, reprocessing |
| Delay queue | Work becomes eligible later | Clock, precision, cancellation, duplicate timers |
| Scheduler | Recurring or one-time orchestration | Single ownership, misfires, overlap, history, fairness |

### Delivery Semantics

- At-most-once can lose work but avoids broker redelivery.
- At-least-once can duplicate work; idempotent effects are required.
- Exactly-once usually describes a bounded system or transaction, not every
  external side effect. Ask where the guarantee begins and ends.

The reliable-consumer recipe is:

1. receive with a visibility lease;
2. perform an idempotent transaction or dedupe by event identity;
3. commit the business effect and processed marker atomically;
4. acknowledge after commit;
5. retry transient errors with bounded exponential backoff and jitter;
6. dead-letter poison work with a replay and ownership process.

Run:

```bash
bun test src/node-concepts/test/system-design.test.ts -t AtLeastOnceQueue
```

### Event-Driven Correctness

- Use a transactional outbox to avoid a database-write/message-publish dual
  write when the database is the source of truth.
- Use an inbox/processed-events table to deduplicate consumer effects.
- Version event schemas; preserve old readers during rollout.
- Keep ordering requirements local to a partition/key where possible.
- Measure consumer lag, oldest-message age, retry rate, DLQ growth, duplicate
  rate, and end-to-end freshness.

## Reliability And Overload

### Timeout And Retry Budget

If an incoming request has 800 ms remaining, three downstream calls cannot each
receive an independent 800 ms timeout. Allocate a decreasing deadline and leave
time to return a useful failure.

Retry only when:

- the failure is plausibly transient;
- the operation is read-only or idempotent;
- the next attempt has enough deadline left;
- the retry budget is bounded globally and per request;
- backoff includes jitter;
- the dependency is not already protected by a circuit breaker or load shedder
  that says stop.

### Stability Patterns

- Backpressure slows producers when consumers cannot keep up.
- Load shedding rejects low-priority work before the system collapses.
- Bulkheads isolate pools so one dependency or tenant cannot consume all
  concurrency.
- Circuit breakers stop repeated calls to a persistently failing dependency.
- Admission control rejects work before expensive allocation.
- Hedged reads can reduce tail latency but add load and need a strict budget.
- Graceful degradation preserves the critical journey with reduced features.

## Observability, SLOs, And Incident Readiness

Define user-centered SLIs before component metrics:

- serving systems: availability, latency distribution, throughput, correctness;
- storage: durability, availability, read/write latency, freshness;
- pipelines: throughput, end-to-end freshness, backlog age, correctness;
- AI: task success, groundedness/quality, time to first token, total latency,
  tokens/cost, safety-policy outcomes.

Use percentiles, not only averages. Connect traces, metrics, logs, and profiles
with controlled-cardinality attributes. OpenTelemetry baggage crosses process
boundaries and may be sent over the network; never place secrets or unbounded
user input in it.

Every design should name:

- one availability or correctness SLO;
- one latency/freshness SLO;
- the error budget and release response;
- dashboards for traffic, errors, saturation, and dependency health;
- actionable paging conditions;
- a runbook, owner, and rollback/failover action;
- backup restoration and disaster-recovery exercises.

## Security, Privacy, And Multi-Tenancy

Threat-model identities, assets, trust boundaries, entry points, abuse cases,
and mitigations. Cover:

- authentication versus authorization;
- object-level and tenant-level access checks;
- least-privilege service identities and short-lived credentials;
- encryption in transit and at rest, plus key rotation;
- secret storage and redaction;
- validation, output encoding, SSRF, CSRF, injection, and file/path safety;
- rate limits, fraud, scraping, enumeration, and resource exhaustion;
- audit trails with integrity and retention;
- data classification, residency, retention, export, and deletion;
- software supply chain, lockfiles, provenance, and dependency policy.

Multi-tenant designs also need per-tenant quotas, noisy-neighbor isolation,
tenant-aware cache keys, row/object authorization, encryption-key strategy,
support-access auditing, and a migration path for very large tenants.

## AI And Agentic System Design

### RAG Path

```text
authorize -> classify/query rewrite -> retrieve with tenant filters -> rerank
-> assemble bounded context -> generate -> validate/cite -> evaluate/observe
```

Discuss ingestion ownership, chunking, embeddings, index freshness, source
deletion, permission changes, hybrid search, reranking, citation quality, prompt
injection from retrieved content, evaluation datasets, and fallback.

### Inference Gateway

Cover model routing, admission control, tenant quotas, batching, token streaming,
context limits, semantic/exact caching, provider timeouts, circuit breakers,
fallback quality, cost budgets, regional capacity, and request privacy.

### Agent Safety Boundary

- Treat model text as untrusted input.
- Give tools narrow schemas and least-privilege credentials.
- Enforce authorization in the tool, not in the prompt.
- Separate read and write capabilities.
- Require confirmation for consequential, irreversible, or external actions.
- Cap steps, tokens, spend, concurrency, and wall-clock time.
- Isolate code execution and network/filesystem access.
- Log decisions and tool calls without leaking sensitive context.
- Evaluate prompt injection, data exfiltration, excessive agency, and denial of
  wallet/service.

NIST frames AI risk work as a continuous govern-map-measure-manage lifecycle.
That is a useful system-design frame: define ownership, map impact and trust
boundaries, measure quality/security, and manage failures throughout the
product lifecycle.

## Important Question Bank

Use the "hard focus" column to choose the deep dive. The detailed curriculum
already provides full walkthroughs for rate limiting, distributed cache, ID
service, object metadata, feed fanout, RAG, job scheduling, and checkout.

### Product And Consumer Systems

| Prompt | Hard focus |
| --- | --- |
| Design a URL shortener | key generation, redirect latency, cache, abuse, analytics |
| Design a social feed | fanout-on-write/read hybrid, celebrity skew, ranking, freshness |
| Design chat/messaging | connection routing, message order, offline sync, receipts, presence |
| Design notifications | preferences, channel routing, dedupe, provider failure, quiet hours |
| Design video streaming | upload/transcode pipeline, manifests, CDN, adaptive bitrate |
| Design photo sharing | object storage, thumbnails, metadata, privacy, CDN invalidation |
| Design collaborative documents | operation order, conflict resolution/CRDT, snapshots, presence |
| Design a ticketing system | hot inventory, fairness, reservations, idempotent payment |
| Design ride sharing | geospatial index, matching, live location, surge, trip state |
| Design food delivery | marketplace matching, ETA, state machine, compensation |
| Design a calendar | recurrence, time zones, conflict rules, fanout, reminders |
| Design an e-commerce checkout | inventory, payment, saga, idempotency, reconciliation |

### Infrastructure And Data Systems

| Prompt | Hard focus |
| --- | --- |
| Design an API gateway | routing, auth, quotas, retries, observability, config rollout |
| Design a rate limiter | algorithm, atomic distributed state, hot keys, fail-open/closed |
| Design a distributed cache | partitioning, replication, TTL, eviction, consistency |
| Design a CDN | placement, cache keys, invalidation, origin protection, purge |
| Design object storage | metadata/data split, multipart upload, erasure coding, durability |
| Design a distributed queue | visibility, ordering, partitioning, DLQ, consumer groups |
| Design pub/sub | subscription state, fanout, replay, slow consumers, retention |
| Design a stream-processing system | partitions, checkpoints, watermarks, late events, state |
| Design a task scheduler | leases, delay, fairness, retries, history, exactly-one owner |
| Design a unique ID service | UUIDv7/Snowflake/sequence, availability, clock failure |
| Design service discovery | health, leases, watches, stale config, control-plane quorum |
| Design a feature-flag service | low-latency reads, streaming updates, audit, kill switch |
| Design configuration management | versioning, validation, staged rollout, secret boundary |
| Design distributed locks | leases, fencing tokens, clock assumptions, client pauses |
| Design a metrics system | ingestion, label cardinality, time-series storage, downsampling |
| Design distributed tracing | sampling, context propagation, storage, tail-based decisions |
| Design log aggregation | buffering, parsing, indexing, retention, tenant isolation |
| Design a web crawler | frontier, politeness, dedupe, content change, retries |
| Design search/autocomplete | indexing, ranking, prefix/top-k, freshness, typo tolerance |

### Enterprise And Platform Systems

| Prompt | Hard focus |
| --- | --- |
| Design a multi-tenant SaaS platform | isolation, quotas, placement, noisy neighbors, audit |
| Design an internal developer platform | paved paths, self-service, policy, golden signals, adoption |
| Design CI/CD | build isolation, cache, artifact provenance, rollout, rollback |
| Design a webhook platform | signatures, retries, ordering, dedupe, endpoint isolation |
| Design audit logging | tamper evidence, access, retention, search, privacy |
| Design secrets management | envelope encryption, identity, rotation, audit, break glass |
| Design cross-region failover | RPO/RTO, replication, DNS/traffic, failback, drills |
| Design data export/deletion | ownership graph, async orchestration, evidence, retries |
| Design billing/metering | event accuracy, dedupe, aggregation, corrections, reconciliation |
| Design fraud/risk evaluation | online latency, feature freshness, rules/models, feedback |

### Low-Level Design And Machine Coding

These prompts test object boundaries, state machines, extensibility, concurrency,
and executable correctness. Do not force design patterns by name; make the
invariant and change points visible.

| Prompt | Hard focus |
| --- | --- |
| Design a parking lot | spot allocation, vehicle rules, tickets, pricing, concurrency |
| Design an elevator controller | requests, scheduling policy, direction/state, safety |
| Design a vending machine | explicit state machine, inventory, payment/change, cancellation |
| Design a library system | copy vs title, loans, holds, fines, search, notifications |
| Design Splitwise/expense sharing | split strategies, precision, balances, settlement |
| Design chess or cards | rules, turns, valid moves, state/history, clock |
| Design a filesystem | tree, paths, permissions, links, storage metadata, locking |
| Design a logger | levels, sinks, formatting, buffering, rotation, backpressure |
| Design an in-memory cache | eviction, TTL, concurrency, loading, metrics |
| Design pub/sub | subscription lifecycle, delivery, errors, slow listeners |
| Design a task executor | queue, worker limit, cancellation, retries, shutdown |
| Design a meeting-room scheduler | intervals, recurrence, conflicts, time zones |
| Design a payment state machine | allowed transitions, idempotency, reconciliation |
| Design an API client SDK | retries, deadlines, pagination, auth refresh, telemetry |
| Design a feature-rule evaluator | typed rules, precedence, context, deterministic results |

LLD answer checklist:

- entities versus value objects;
- public interfaces and dependency direction;
- legal state transitions and invariants;
- strategy points likely to change;
- thread/async safety and resource lifecycle;
- errors, cancellation, idempotency, and persistence boundary;
- unit, property, and concurrency tests;
- complexity and memory bounds.

### AI Systems

| Prompt | Hard focus |
| --- | --- |
| Design a RAG assistant | ACL-aware retrieval, freshness, evaluation, injection, citations |
| Design an inference gateway | routing, batching, quotas, streaming, fallback, cost |
| Design semantic search | embeddings, hybrid retrieval, filters, recall, reindexing |
| Design an agent platform | tool permissions, sandboxing, budgets, checkpoints, approval |
| Design model evaluation | datasets, graders, drift, slices, human review, release gates |
| Design prompt/model registry | versioning, lineage, rollout, rollback, access, audit |
| Design GPU job scheduling | bin packing, fairness, preemption, topology, checkpoints |
| Design AI observability | traces, tokens/cost, quality, safety, privacy, sampling |

## Rapid Follow-Up Questions

Use these against every answer:

1. What is the source of truth?
2. What is the partition key and hottest key?
3. What happens during a network partition?
4. Can a client safely retry every write?
5. Where can duplicates appear?
6. What ordering is required and at what scope?
7. How stale may a read be?
8. What happens when the cache disappears?
9. What happens when the queue is full?
10. How is backpressure propagated?
11. Which operation fails open and which fails closed?
12. What is the timeout budget across dependencies?
13. How does a region fail and recover?
14. How are schemas and clients upgraded compatibly?
15. How are large tenants isolated or moved?
16. How is deletion proven across replicas, caches, indexes, and backups?
17. Which metric wakes a human, and what can that human do?
18. How is the design tested under fault, overload, and replay?
19. What is the dominant cost at ten times the load?
20. What simpler design would work at one tenth the load?

## Correctness Review Checklist

Before calling a design complete, name:

- safety invariant: what must never happen;
- liveness property: what must eventually happen;
- ownership: which component is authoritative;
- atomic boundary: what commits together;
- retry boundary: what can be repeated safely;
- ordering scope: global, per tenant, per entity, or none;
- dedupe identity and retention window;
- clock assumptions and expiry semantics;
- overload bound for queues, concurrency, memory, and tenants;
- recovery method for replay, repair, reconciliation, and restore.

## Interview Scorecard

Score each category 0-4:

| Category | A score of 4 means |
| --- | --- |
| Requirements | Critical journey, scope, guarantees, scale, and SLOs are explicit |
| Estimation | Numbers are plausible and drive partition/capacity choices |
| API/data | Contracts, keys, indexes, pagination, auth, and idempotency are clear |
| Architecture | Read/write paths are coherent and every component has ownership |
| Distributed reasoning | Consistency, partitions, ordering, retries, and duplicates are precise |
| Reliability | Deadlines, overload, degradation, DR, and recovery are credible |
| Security/privacy | Trust boundaries, tenant isolation, abuse, retention, and audit are covered |
| Observability | User SLIs, SLO, trace/metric/log signals, alerts, and runbooks are named |
| Trade-offs | Alternatives and redesign triggers are stated without hand-waving |
| Communication | The answer is structured, corrected openly, and finishes on time |

Readiness target: no category below 2, at least 30/40 overall, and every safety
invariant explained without notes.

## Current Research Signals Behind The Curriculum

- [Google SRE's SLO guidance](https://sre.google/sre-book/service-level-objectives/)
  centers service design on user-relevant indicators, objectives, percentiles,
  and error budgets.
- [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/)
  evaluates systems across operational excellence, security, reliability,
  performance efficiency, cost optimization, and sustainability.
- [Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/patterns/)
  maintains current distributed-system patterns and antipatterns such as
  cache-aside, competing consumers, retries, circuit breakers, and retry storms.
- [OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/)
  now frame traces, metrics, logs, baggage, and emerging profiles as connected
  views of runtime behavior.
- [GitHub Agentic Workflows](https://github.blog/changelog/2026-02-13-github-agentic-workflows-are-now-in-technical-preview/)
  and the [July 2026 MCP Server update](https://github.blog/changelog/2026-07-23-github-mcp-server-supports-the-next-mcp-specification/)
  make repository-native agents, explicit tool contracts, scoped permissions,
  review gates, and auditability current system-design concerns.
- CNCF's [January 2026 cloud-native survey announcement](https://www.cncf.io/announcements/2026/01/20/kubernetes-established-as-the-de-facto-operating-system-for-ai-as-production-use-hits-82-in-2025-cncf-annual-cloud-native-survey/)
  connects production cloud-native maturity with AI inference, platform
  engineering, security, observability, and profiling.
- [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) and its
  Generative AI profile organize AI risk around continuous governance,
  mapping, measurement, and management.
- [OWASP GenAI Security](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
  keeps prompt injection, unsafe output handling, sensitive information,
  supply chain, denial of service, and excessive agency in the design threat
  model. The currently published general web baseline is the
  [OWASP Web Top 10](https://owasp.org/www-project-top-ten/).

Research changes what receives emphasis, not the standard of proof. Survey
popularity does not make Kubernetes, microservices, AI, or a specific database
the right answer for every system.
