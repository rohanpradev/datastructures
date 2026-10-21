# Software Engineering Interview Guide

This is the practical map for preparing across a general software engineering
interview loop. The repository already has deep material for coding and system
design; this guide connects those resources and fills in rounds that are easy
to miss: SQL and database fundamentals, operating systems and networking,
low-level design, debugging, project discussion, and behavioral interviews.

Interview formats vary by company, level, team, and location. Treat the role
description and recruiter instructions as the contract. Use public company
guidance as examples, not guarantees. Microsoft's technical guidance discusses
problem solving, design, coding, testing, and past experience; Amazon's SDE III
guidance separately discusses coding, system design, and behavioral examples.

## Start With The Role And Format

Before studying, write down:

- Role, level, team, and responsibilities from the job description.
- Each round's format, duration, allowed tools, language, and evaluation focus.
- Whether it is coding, debugging, code review, machine coding, design, project
  deep dive, behavioral, or a combination.
- Constraints such as shared editor, tests, internet or AI use, diagramming,
  take-home scope, and accessibility needs.
- The two strongest relevant experiences or projects you can discuss honestly.

Ask the recruiter about unknowns. Do not infer permission to use AI, external
documentation, an IDE, or a particular language. Practice once in the expected
environment. For online assessments, read the platform instructions and
practice time management.

## Choose A Preparation Route

| Role or round | Prioritize | Repo route |
|---|---|---|
| New-grad or general SWE | Language fluency, core structures, algorithms, testing, project stories | [Learning path](../LEARNING_PATH.md), [mastery matrix](./MASTERY_MATRIX.md), topic guides in `src/` |
| Mid-level product/backend | Mixed coding, APIs and data models, SQL, debugging, service design, ownership stories | This guide, [worked examples](./WORKED_EXAMPLES.md), [system design handbook](./SYSTEM_DESIGN_HANDBOOK.md) |
| Senior or staff SWE | Architecture, operational judgment, cross-team influence, failure analysis, migrations, mentoring, trade-offs | [Enterprise design curriculum](./ENTERPRISE_SYSTEM_DESIGN_CURRICULUM.md), [interview playbook](./INTERVIEW_PLAYBOOK.md) |
| Backend or platform | Transactions, concurrency, networks, reliability, security, capacity, observability | `src/node-concepts/`, [system design handbook](./SYSTEM_DESIGN_HANDBOOK.md) |
| Frontend or full stack | JavaScript/TypeScript, browser behavior, accessibility, UI state, performance, API boundaries, product reasoning | `src/javascript-concepts/`, `src/typescript-concepts/`, plus role-specific references below |
| Infrastructure or systems | Processes, memory, concurrency, networking, storage, distributed systems, incidents | [MIT OS course](https://ocw.mit.edu/courses/6-1810-operating-system-engineering-fall-2023/), system design handbook |
| Data engineering | SQL, data modeling, batch/stream processing, idempotency, quality, orchestration, cost | This guide's database section, [CMU Database Systems](https://15445.courses.cs.cmu.edu/) |
| ML or AI engineering | Role-required statistics/modeling plus data pipelines, evaluation, deployment, retrieval, privacy, failure behavior | [AI interview labs](./AI_INTERVIEW_TRENDS_2026.md), [AI exercises](./AI_EXECUTABLE_PROBLEMS.md) |

This repository is strongest for TypeScript/JavaScript, algorithms, backend
runtime, and distributed-system interviews. Frontend frameworks, mobile,
language-specific systems programming, data science, and ML theory need
additional role-specific practice. Let the job description set the depth.

## Coding And Algorithms

Use the [interview playbook](./INTERVIEW_PLAYBOOK.md) for the timed loop and
[worked examples](./WORKED_EXAMPLES.md) for full solution traces. For each
problem:

1. Restate the contract. Clarify input size, duplicates, ordering, mutation,
   invalid inputs, and the no-answer case.
2. Give a baseline and its cost. Identify the constraint that makes it too
   slow or too large.
3. Choose a data structure or pattern, state the invariant, and trace a small
   example before coding.
4. Implement the simplest correct version in the allowed language. Narrate
   important decisions, not every keystroke.
5. Test empty/minimal input, boundaries, duplicates, adversarial ordering, and
   no-solution cases. Run tests if the environment provides them.
6. State time and auxiliary-space complexity with clear variables. Discuss a
   follow-up only after the core solution is correct.

Practice arrays, strings, binary search, trees, graphs, heaps, backtracking,
and DP through the topic guides. [LeetCode Top Interview 150](https://leetcode.com/studyplan/top-interview-150/)
is a broad external set for unseen exercises, not a prediction of what a
particular employer will ask.

## SQL And Database Reasoning

SQL is a core interview skill for backend and data roles. This repo has SQLite
exercises, but interview answers should transfer to the database in the role.
PostgreSQL documentation is a precise reference for relational behavior;
syntax and implementation details differ among engines.

For a query or model prompt:

1. State entities, cardinalities, ownership, and lifecycle. Choose primary and
   foreign keys; express uniqueness and non-null requirements as constraints.
2. Write the simplest correct query. Be explicit about join keys, filters,
   grouping, null behavior, ties, and deterministic ordering.
3. Check it against a tiny table by hand, including no rows, duplicates, nulls,
   and timestamp boundaries.
4. Propose indexes from the access pattern. An index costs writes, storage, and
   cache; it is not a generic speed switch.
5. Inspect the query plan for scans, joins, row-estimate errors, sorts, or
   spills before proposing schema or index changes.
6. If writes must agree, define the transaction boundary, constraints,
   isolation assumptions, retry behavior, and idempotency contract.

**Mini-drill:** Given `orders(id, customer_id, created_at, status, total)` and
`customers(id, email)`, return each customer's paid-order total for the last 30
days, including customers with no paid orders. Explain why the time filter
belongs with the orders join, how `COALESCE` handles an empty sum, and what
composite index might help a measured workload. Inspect `EXPLAIN` rather than
claiming the index must be used.

One PostgreSQL-shaped answer is:

```sql
SELECT c.id,
       c.email,
       COALESCE(SUM(o.total), 0) AS paid_total
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
 AND o.status = 'paid'
 AND o.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY c.id, c.email
ORDER BY c.id;
```

Keeping the order filters in `ON` preserves customers with no qualifying order;
putting them in `WHERE` would remove null-extended rows and change the outer
join's meaning. `CURRENT_TIMESTAMP` and interval syntax vary by SQL engine.
An index candidate might start with equality predicates and then the time
range, but column order and whether a partial index is useful depend on
selectivity, other queries, and the chosen database. Confirm against real
plans and write costs.

Know primary/foreign keys, normalization versus deliberate denormalization,
B-tree indexes, how composite-index column order affects filters/sorts,
transactions, isolation anomalies, optimistic concurrency, and pagination.
Index behavior is engine-specific. Contrast offset pagination
with keyset/cursor pagination and state the stable ordering key. For retry-safe
writes, connect uniqueness constraints and idempotency records to the
transaction. The [transactional outbox exercise](./INTERVIEW_UPGRADE_2026_09.md#3-database-and-broker-transactionaloutbox)
shows why a database write and broker publish are not atomic by default.

Practice prompts: find duplicate emails; compute a rolling daily total; page a
changing feed; reserve inventory without overselling; explain a retry after a
write timed out. State correctness first, then indexes and scale.

## Operating Systems, Concurrency, And Networking

These are common follow-ups in backend, platform, and senior interviews. Explain
the chain from request arrival to completion; do not memorize terms without a
failure scenario.

| Area | Be ready to explain | Drill |
|---|---|---|
| Processes and threads | Address-space isolation, shared memory, scheduling, context switches, worker pools, and why CPU-bound JavaScript can block an event loop | Compare CPU-heavy work inline versus a bounded worker pool; discuss saturation and cancellation |
| Memory | Stack/heap conceptually, garbage collection, retained-reference leaks, memory pressure, and streaming versus buffering | Estimate memory for 50,000 retained 64 KiB chunks; explain backpressure |
| Synchronization | Race conditions, atomic transitions, deadlock conditions, lock scope, and safe ownership | Two workers update inventory; define the invariant and atomic write boundary |
| DNS and connections | Name resolution, connection reuse, TLS handshake, certificates, DNS/connect/TLS/request timeouts | Trace a slow HTTPS request and identify useful telemetry |
| HTTP | Methods, status, headers, caching, idempotent semantics, streaming, proxy boundaries | Choose retries when a write may have committed before timeout |
| Reliability | Queueing, bounded concurrency, backpressure, retries with jitter, deadlines, circuit breakers, overload | Explain how unlimited concurrency/retries can turn partial failure into total failure |

For JavaScript, synchronous work occupies its isolate; asynchronous I/O does not
make CPU-heavy callbacks parallel. Workers add parallel execution but also
messaging, memory, startup, and cancellation costs. Check current runtime docs
for exact Node/Bun API behavior.

Start with [MIT Operating System Engineering](https://ocw.mit.edu/courses/6-1810-operating-system-engineering-fall-2023/)
for processes, virtual memory, threads, filesystems, and IPC. For networking,
use [MDN's HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
and [HTTP Semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110). The
[Google SRE book](https://sre.google/sre-book/table-of-contents/) covers
production reliability and incident thinking.

## Low-Level Design And Machine Coding

Low-level design (LLD) asks you to shape an implementable component or small
application. It differs from fleet-scale architecture. Start with behavior and
invariants; add abstractions only when they clarify the design.

1. Clarify users, use cases, constraints, and out-of-scope behavior.
2. List important entities and state transitions. Separate durable state from
   derived or temporary state.
3. Define public APIs, errors, invariants, and mutation/ownership rules.
4. Implement one vertical slice with readable types and dependency boundaries.
5. Test normal behavior, invalid transitions, duplicates, concurrency if
   relevant, and cleanup after failure.
6. Explain how persistence, multiple processes, observability, and security
   change the design. Do not call an in-memory demo distributed.

Prompts: LRU cache with a capacity contract; booking system with reservations
and expiry; notification dispatcher with retryable channels; rate limiter with
a clock abstraction; file indexer with cancellation and stable output. Make
your own API and invariants before looking at this repo's implementations.

Avoid both a bag of unrelated classes and a framework of interfaces before
requirements are known. Explain why each abstraction exists and how a new
requirement changes it.

## Debugging, Testing, And Code Review

An interview debugging round rewards disciplined investigation:

1. Reproduce the failure and record input, environment, expected, and observed
   behavior.
2. Read the failing test, stack trace, logs, and nearby code. Trace data/state
   ownership before guessing.
3. Form one hypothesis at a time. Add the smallest test or observation that
   could disprove it.
4. Find the earliest incorrect transition, not only the final symptom. Check
   boundaries, mutation, time, concurrency, and cleanup.
5. Make the smallest fix that restores the contract; keep the regression test.
6. Run the focused check, then an appropriate broader suite. Report
   environment limitations instead of claiming an unrun check passed.

In code review, check correctness before style: broken invariants, unhandled
failures, leaks, races, unsafe retries, missing limits, complexity, and tests
that do not prove behavior. Tie feedback to a concrete input or consequence.
The [Google Engineering Practices review guide](https://google.github.io/eng-practices/review/reviewer/)
is a useful standard for actionable feedback.

**Drill:** Introduce an off-by-one bug in binary search, a stale cache entry, or
a missing timer cleanup path. Write the failing regression test first, then
debug without unrelated edits. Compare with the [AI and no-AI labs](./AI_INTERVIEW_TRENDS_2026.md)
when tool use is part of the interview.

## System Design

Use the [System Design Handbook](./SYSTEM_DESIGN_HANDBOOK.md) for its 45-minute
framework and concept map, the [enterprise curriculum](./ENTERPRISE_SYSTEM_DESIGN_CURRICULUM.md)
for worked senior/staff scenarios, and the [failure labs](./INTERVIEW_UPGRADE_2026_09.md)
for timelines and concrete correctness constraints. A strong practice answer
shows:

- Functional requirements, non-goals, workload assumptions, and SLOs.
- A minimal architecture plus API and data model.
- A deep dive into the hardest correctness or scaling constraint.
- Capacity estimates with units and assumptions, not unsupported precision.
- Failure, retry, consistency, abuse, privacy, and tenant-isolation behavior.
- Observability and a credible evolution path.
- One rejected alternative and why it loses under these requirements.

## Project And Resume Deep Dives

Every resume bullet may become a technical prompt. Explain the problem, your
personal contribution, the design, the result, and what you would change. Do
not claim team outcomes as individual work; distinguish what you implemented,
influenced, measured, and inherited.

Prepare a one-page brief for two or three relevant projects:

```text
Project and users:
Problem and constraints:
My specific responsibility:
Architecture and key data flow:
Hardest decision and alternatives:
Correctness, testing, and rollout:
Measured outcome (baseline, result, time window):
Failure or surprise and what I learned:
What I would change with another month:
```

Check that each number has a source and comparison window. If an outcome was
not measured, say so and name what you would measure. For a portfolio project,
be ready to run it, explain limitations, and identify the parts you wrote.
Never present practice material as production experience.

For a recruiter or hiring-manager screen, prepare a concise introduction:
current focus, one or two relevant strengths, a concrete example, and what
kind of work you are seeking. Tie each point to the role; avoid reciting your
entire resume. Prepare clear answers about scope, collaboration, constraints,
availability, and why this role interests you. Be honest about gaps and explain
how you are closing them.

Bring questions that help you assess the role as well as continue the
conversation: what success looks like in six months; the team's current
technical constraint; how work is reviewed and operated; how the team makes
architecture decisions; and what the remaining interview stages evaluate.
Choose questions based on what has not already been answered. For take-home
work, clarify time expectations, allowed tools, evaluation criteria, and
whether reviewers expect production polish or a focused demonstration.

For frontend-focused interviews, supplement this repo with the [MDN Front-end
developer curriculum](https://developer.mozilla.org/en-US/curriculum/) and the
[W3C WAI accessibility tutorials](https://www.w3.org/WAI/tutorials/). Practice
explaining semantic HTML, keyboard access, responsive layout, rendering and
network performance, browser state, and progressive enhancement in the context
of the role rather than memorizing framework trivia.

## Behavioral And Collaboration Interviews

Build a story bank from real experience; structure is not a script. Amazon
explicitly recommends specific examples and STAR framing for its behavioral
interviews. Microsoft's technical guidance also notes that past experience and
role-related scenarios may be discussed. Other employers use different rubrics.

Prepare six to eight stories that can answer several prompts:

| Story area | Evidence to include |
|---|---|
| Ambiguous problem | What you clarified, chose, and changed |
| Technical disagreement | Alternatives, evidence, how you handled disagreement, outcome |
| Failure or mistake | Your part, impact, recovery, prevention, learning |
| Delivery under constraints | Scope, trade-offs, sequencing, quality safeguards |
| Ownership or incident | Detection, communication, mitigation, cause, follow-up |
| Influence or mentoring | Who needed alignment, how you adapted, observable outcome |
| User impact | User problem, evidence, and resulting decision |
| Learning quickly | Approach, validation, limits, reusable outcome |

Use **STAR plus reflection**:

- **Situation:** enough context to understand the stakes.
- **Task:** your responsibility and constraints.
- **Action:** what you did, why, alternatives, and collaboration.
- **Result:** measurable outcome where available; otherwise a concrete change.
- **Reflection:** what you learned and what you would do differently.

Keep the opening concise and reserve most of the answer for your actions.
Expect follow-ups about decisions, disagreements, metrics, and lessons. Never
invent metrics or expose confidential details. Practice follow-ups, not only a
90-second summary.

## Practical Eight-Week Plan

Adapt this to available time. Keep a miss log and revisit missed skills; a
completed checklist is not proof of readiness.

| Week | Focus | Evidence of progress |
|---|---|---|
| 1 | Baseline: coding mock, project story, SQL query; map role and rounds | Timed baseline and three concrete gaps |
| 2 | Language fundamentals, arrays/strings, hash maps, complexity | Explain and implement common collection patterns without notes |
| 3 | Linked structures, stacks/queues, trees, heaps, binary search | Mixed easy/medium solutions with edge-case tests |
| 4 | Graphs, recursion, backtracking, DP | State invariant/recurrence before coding; revisit misses after 1 and 3 days |
| 5 | SQL, schemas, transactions, OS/network basics, debugging | Complete SQL drill and explain one request path/failure timeline |
| 6 | LLD and system design | Timed machine-coding exercise and 45-minute design with feedback |
| 7 | Behavioral stories, project deep dives, role-specific topics | Six evidence-backed stories; defend every resume bullet |
| 8 | Full mock loop and weakest-area repair | Two complete mocks, no-AI coding round, follow-up review |

Use a 60–90 minute session as: 10 minutes recall, 30–45 minutes deliberate
practice, 10 minutes verification, 10 minutes explaining aloud, and 5 minutes
recording what to revisit. Select targets with the [mastery matrix](./MASTERY_MATRIX.md)
and [practice dashboard](../README.md#practice-generator-contract). For deeper
senior preparation, use the [12-week extension](../LEARNING_PATH.md#12-week-expert-extension).

## Mock Interview Feedback

Score each dimension 0–3: 0 absent, 1 needed repeated prompts, 2 independently
correct, 3 clear and defended. Record evidence, not just a number.

| Dimension | Evidence to record |
|---|---|
| Problem framing | Did I clarify ambiguity and define a contract? |
| Correctness | Did I state and preserve an invariant? |
| Testing | Did I choose useful edge cases and verify the result? |
| Complexity/trade-offs | Were estimates correct and assumptions visible? |
| Communication | Could the interviewer follow my reasoning and decisions? |
| Ownership | Did I explain my work, uncertainty, and learning honestly? |

Choose the lowest-scoring dimension for the next practice session. A mock
score is a coaching tool, not a prediction of a hiring decision.

## Quality References

Prefer primary documentation, course material, standards, and employer-authored
guidance. Use commercial prep sites for extra exercises; frequency rankings and
predictions are not authoritative evidence about a particular interview.

| Resource | Use it for |
|---|---|
| [Microsoft technical interview guidance](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing.html) | Problem solving, design, coding, testing, and technical discussion |
| [Amazon SDE III preparation](https://amazon.jobs/content/en-gb/how-we-hire/sde-iii-interview-prep) | One employer's senior coding, design, and behavioral guidance; do not generalize its loop |
| [MIT OCW 6.006 Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) | Algorithms with lectures, notes, and exercises |
| [CMU 15-445 Database Systems](https://15445.courses.cs.cmu.edu/) | Database internals and behavior beyond query syntax |
| PostgreSQL [transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html), [indexes](https://www.postgresql.org/docs/current/indexes.html), [EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) | Relational constraints, transaction semantics, index trade-offs, plan inspection |
| [MIT OCW 6.1810 Operating Systems](https://ocw.mit.edu/courses/6-1810-operating-system-engineering-fall-2023/) | Processes, virtual memory, threads, filesystems, IPC |
| [RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) and [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) | Normative HTTP semantics and an approachable overview |
| [Google SRE book](https://sre.google/sre-book/table-of-contents/) | SLOs, incidents, monitoring, reliability trade-offs |
| [Google Engineering Practices: review](https://google.github.io/eng-practices/review/reviewer/) | Review quality and actionable feedback |
| [LeetCode Top Interview 150](https://leetcode.com/studyplan/top-interview-150/) | Broad maintained exercise set |
| [Amazon SDE III preparation](https://amazon.jobs/content/en-gb/how-we-hire/sde-iii-interview-prep) | Employer-specific senior coding, design, and behavioral guidance |

For repository topic sources, see [learner note standards](./LEARNER_NOTE_STANDARDS.md),
[research brief](./RESEARCH_BRIEF_2026.md), and references in each topic guide.
Recheck dated releases and hiring guidance; protocol and fundamentals sources
change less often.
