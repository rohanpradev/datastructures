# Interview practice refresh — September 22, 2026

This is a focused extension to the existing course: five executable problems,
six architecture drills, and a two-week route that connects coding to failure
analysis. These are original practice scenarios, not claims about leaked
questions or company-specific question frequency.

## What the current sources support

Checked on September 22, 2026:

- [Amazon's SDE II preparation](https://amazon.jobs/content/en/how-we-hire/sde-ii-interview-prep)
  explicitly includes system design and evaluates working, tested code. Its
  design criteria include reliability, practicality and scalability. Preparation
  should therefore include implementation, edge cases and defensible trade-offs.
- [Microsoft's technical interview guidance](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing)
  emphasizes problem solving, design, coding and testing. Practice clarifying
  assumptions and explaining decisions within a timed round.
- [AWS's transactional outbox guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
  explains the database/message dual-write problem and duplicate delivery. Use
  a database transaction for state plus event, and deduplicate consumers.
- [Kleppmann's distributed locking analysis](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
  is a foundational correctness reference, not a new hiring trend. A paused
  lease holder can resume after expiry; the storage boundary must enforce fencing.

The practice priorities below are our interpretation of those sources. They
do not establish a universal 2026 interview format. Confirm the role's format
and AI-tool policy with the recruiter; retain both assisted and unassisted drills.

## Five executable problems

Generate one target at a time, implement it, then run the active tests:

```bash
bun run practice --problem SingleFlight
bun run practice:run
# Repeat with FencedRegister, TransactionalOutbox,
# shortestSubarrayAtLeastK, and maxScheduledProfit.
```

### 1. Cache stampede: SingleFlight

[Implementation](../src/node-concepts/system-design/single-flight.ts)

**Prompt:** One hundred requests miss the same product cache simultaneously.
Return one shared in-flight result, without retaining completed results.

**Invariant:** Each key has at most one unsettled promise. Both success and
failure remove that promise. Different keys make progress independently.

**Trace:** A registers a load, B joins it, the load rejects, both see the error,
and C can start a new attempt. Defer the loader until registration so a
synchronous exception follows the same cleanup path as an async rejection.

**Complexity:** Expected O(1) bookkeeping per call; O(k) active-key space,
excluding loader work and promise subscribers.

**Traps:** Caching rejected promises forever; invoking the loader before
registration; mixing tenants in a key; cancelling shared work because one
subscriber leaves. A loader awaiting its own key deadlocks. A hung loader keeps
its key occupied, so the caller must give upstream work a deadline.

**Production follow-up:** This only coalesces within one process. Compare
stale-while-revalidate, TTL jitter and per-replica coalescing before adding a
distributed lock. Explain bounded admission when distinct-key cardinality grows.

### 2. Paused worker: FencedRegister

[Implementation](../src/node-concepts/system-design/fenced-register.ts)

**Prompt:** A worker acquires a lease, pauses past expiry, then resumes after a
replacement worker has written a newer result. Protect the stored value.

**Invariant:** Only the current unexpired token may write or release the lease.
Successful acquisitions advance a bigint token, including after early release.

**Trace:** A owns token 1 until time 10; B acquires token 2 at time 10 and writes;
A's late write and release both fail. Expiry is exclusive: time 10 is expired.

**Complexity:** O(1) operations and metadata for one protected resource.

**Traps:** Checking ownership only before doing work; deleting another worker's
lock; trusting a caller-editable lease object; resetting tokens on restart.

**Production follow-up:** This exercise colocates the lease authority and storage
and requires explicit nondecreasing time. A separate storage system enforcing
highest-seen tokens does not automatically know that a lease expired. Explain
durable token allocation, atomic compare-and-write, authority failover and why
wall-clock synchronization alone does not prove safety. Values are stored by
reference; use immutable values or serialization at a real storage boundary.

### 3. Database and broker: TransactionalOutbox

[Implementation](../src/node-concepts/system-design/transactional-outbox.ts)

**Prompt:** Commit an order change and its event together. A publisher can crash
after sending an event but before recording success. Support safe recovery.

**Invariant:** State and event commit together, or neither commits. A unique
event-ID conflict must roll back even an already-issued record update.

**Trace:** Write order=paid and e1 in SQLite; read e1; publish; crash; read e1 again;
publish again; mark e1 published. The consumer may receive e1 twice.

**Complexity:** Indexed writes O(log n); a bounded pending batch O(log n + b);
O(n) retained database storage. Payload bytes add serialization/storage costs.

**Traps:** Sending to the broker inside the SQL transaction does not make the
broker transactional. Marking before publish loses events; marking afterward
permits duplicates. Retrying a duplicate event ID here raises an error and
rolls back; this API does not implement request-response idempotency replay.

**Production follow-up:** Default storage is in-memory; a filename persists it.
Tests cover close/reopen, not a machine power loss. Publication requires a
positive broker acknowledgement. The sample has one relay and no claim API;
multiple relays need coordination and per-key ordering. Consumer dedupe and its
database effect must share a transaction. An external payment/email effect needs
its own idempotency contract. Plan retention without forgetting live dedupe IDs.

### 4. Signed windows: shortestSubarrayAtLeastK

[Implementation](../src/algorithms/interview-patterns/advanced-interview-patterns.ts)

**Prompt:** Find the shortest nonempty subarray with sum at least k. Values can
be negative; return -1 if none exists. Input numbers and sums must be finite
and representable in JavaScript's number type.

**Invariant:** Candidate prefix sums increase along a deque. A later smaller
prefix dominates an earlier larger one: it produces a shorter, no-smaller sum.
Once a front index produces a valid answer, later ends cannot improve that start.

**Trace:** For [2,-1,2], prefixes are [0,2,1,3]. Prefix 1 removes prefix 2 from
the back; at prefix 3, subtract prefix 0 to obtain the length-3 answer.

**Complexity:** O(n) time and space; each index enters and leaves once.

**Traps:** Assuming positive-only sliding-window behavior; using Array.shift
repeatedly; accepting an empty subarray when k is zero; removing candidates
before checking valid nonempty ranges for negative k.

**Verification:** Exhaustive signed arrays up to length five are compared with
an independent quadratic oracle. Explain how streaming changes retained state.

### 5. Weighted scheduling: maxScheduledProfit

[Implementation](../src/algorithms/interview-patterns/advanced-interview-patterns.ts)

**Prompt:** Pick nonoverlapping [start,end) jobs for maximum total profit. Jobs
may touch, input order is arbitrary, and choosing no jobs yields zero.

**Invariant:** dp[i] is the best profit using the first i jobs sorted by end.
Binary search finds the count p of previous jobs ending at or before this start;
dp[i+1] = max(dp[i], profit[i] + dp[p]).

**Trace:** (1,3,5), (2,4,6), (3,5,5) gives dp=[0,5,6,10]. Taking the largest
single profit would return six, missing the compatible pair worth ten.

**Complexity:** O(n log n) time and O(n) space, without mutating input.

**Traps:** Confusing weighted scheduling with greedy interval removal; treating
touching jobs as overlapping; off-by-one indices with duplicate end times.
Reject zero-duration/reversed jobs and nonfinite fields; keep totals representable.

**Verification:** Compare against subset enumeration. Follow up by reconstructing
selected jobs, defining tie-breaking, or introducing a limit on selected jobs.

## Six system-design mock interviews

All quantities below are synthetic practice assumptions, not company workloads.
Spend 5 minutes on requirements, 5 on sizing, 10 on API/data/architecture,
15 on a failure deep dive, and 10 on operations, security and trade-offs.

| Scenario and starting load | API and data decisions | Failure injection and required evidence |
|---|---|---|
| Inventory reservation: 5k writes/s, 15-minute holds | Reserve/confirm/release APIs; inventory version, reservation ID, expiry, order event | Payment succeeds after reservation expiry. State the no-oversell invariant, atomic conditional update, reconciliation, and outbox boundary. |
| Webhook delivery: 20k events/s, 24-hour retry budget | Event ID, endpoint version, attempts, next attempt, tenant partition | Receiver succeeds but ACK is lost. Show dedupe, bounded retries with jitter, DLQ replay, per-tenant quotas and oldest-event-age metrics. |
| Flash-sale product cache: 200k reads/s, 100 hot keys | Cache key includes tenant/version; define stale data allowance | Entire cache expires together. Estimate database fallback load, coalesce requests, bound refresh concurrency, and degrade optional fields. |
| Durable job scheduler: 50k tenants, 1M due jobs/hour | Job state machine, due-time index, attempt ID, lease token | Worker resumes after takeover. Enforce fencing at the sink, explain cancellation races, noisy-neighbor fairness and queue-age SLOs. |
| Collaborative document: 10k active documents, 20 editors each | Document ID, operation ID, revision, reconnect cursor; choose OT or CRDT with a reason | Disconnect during edit, duplicate replay, permission revoked mid-session. Separate durable document state from ephemeral presence; define convergence and snapshot recovery. |
| AI retrieval gateway: 1k requests/s, 8-second deadline | Tenant-scoped retrieval, document ACL/version, model and tool budgets, trace ID | Model times out after a tool side effect; document is deleted after indexing. Enforce authorization before retrieval/tool execution, bounded retries, dedupe and deletion propagation; measure quality alongside latency/cost. |

For the webhook exercise: 20,000 events/s × 1 KB = approximately 20 MB/s,
or 1.728 TB/day before indexes, replicas and retries (decimal units). At 10%
retry probability with at most one retry, expect 22,000 delivery attempts/s.
If a worker averages 100 ms per attempt, Little's Law gives roughly 2,200
concurrent attempts at that rate. Add headroom and examine p99 latency and skew;
these averages alone do not determine safe worker limits.

Deliver one diagram, three API contracts, a key/index sketch, a capacity estimate,
one failure timeline and one rejected alternative. State RPO/RTO and tenant
boundaries. Prefer justified components over a longer technology list.

## Two-week deliberate-practice route

| Days | Work | Observable exit condition |
|---|---|---|
| 1–2 | Baseline: binary search, minimum window, course scheduling; one design mock | Record actual solve time, missing edge cases and a rubric score. |
| 3–4 | Signed windows and weighted scheduling | Rebuild both; explain dominance and the DP recurrence without source. |
| 5–6 | SingleFlight and flash-sale cache mock | Reproduce failure cleanup; quantify database fallback under a cache outage. |
| 7–8 | FencedRegister and scheduler mock | Draw the paused-worker timeline and identify the enforcing storage boundary. |
| 9–10 | TransactionalOutbox and inventory/webhook mock | Demonstrate rollback, reopen, duplicate delivery and consumer idempotency. |
| 11–12 | Collaborative document and AI gateway mocks | Explain convergence, authorization, deadlines and the hardest consistency trade-off. |
| 13–14 | Unseen mixed coding, design and debugging mocks; one behavioral story | Re-solve missed targets, compare scores, choose the next review by weakest skill. |

Use the [interview playbook](./INTERVIEW_PLAYBOOK.md) for the coding loop and
the [system design handbook](./SYSTEM_DESIGN_HANDBOOK.md) for fundamentals.
Review failed targets after 1, 3 and 7 days; space mastered targets further apart.

Score each dimension 0–3: requirements, correctness, complexity/capacity, testing,
failure handling, and communication. Zero means absent; one means prompted;
two means independently correct; three means defended with evidence/trade-offs.
Record the weakest dimension and one corrective action. This is a practice
rubric, not a prediction of a company's hiring decision.
