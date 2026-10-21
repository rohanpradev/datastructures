# Practice that returns when it is due

The review tracker keeps self-assessed recall across sessions. It complements
the existing focused tests, learning dashboard, and written invariant notes.

```bash
bun run practice:next
# Implement the generated exercise and explain its invariant from memory.
bun run practice:run
bun run practice:grade good
bun run practice:review
```

You can restrict the next selection with the same search used by the catalog:

```bash
bun run practice:next "pattern:range query"
bun run practice:next "difficulty:hard pattern:graph"
```

`practice:next` chooses the oldest due item among the matches. If none is due,
it chooses an unseen item in catalog/search order. If every matching item is
scheduled, it prints the next due time without replacing your active session.
Generating a problem does not mark it learned. Record a grade after an attempt.

| Grade | Use when | Next review |
| --- | --- | --- |
| `again` | Needed the solution or could not explain the invariant | In 10 minutes; resets the stage |
| `hard` | Completed with substantial hints or uncertainty | In 24 hours; keeps the stage |
| `good` | Solved independently and explained correctness and complexity | Advances one stage |
| `easy` | Recalled fluently and handled a follow-up | Skips one stage |

The stages are **1, 3, 7, 14, 30, 60, 120, and 180 days**, measured from the
latest rating. `good` starts at one day; `easy` starts at three. The maximum
interval is 180 days. These are elapsed 24-hour periods, stored and displayed
as UTC timestamps, so daylight-saving changes do not shift the intervals.

This is a transparent scheduling heuristic. It does not estimate memory
probability, use FSRS, or certify interview readiness. A passing test cannot
tell whether you solved from memory, copied a solution, or understood why it
works. That is why grades remain explicit self-assessments.

## What persists

The tracker stores the latest grade, review count, stage, last-review time,
and next-review time per exercise in `practice/.review-history.json`. It uses
a fingerprint of the reference test cases, source exports, and test path;
numeric catalog IDs can change without redirecting your history. Windows and
Unix paths/line endings resolve to the same identity. Changes to reference
cases intentionally create a fresh review item. Old records remain in the file
but do not appear in the current queue.

Only the active exercise can be graded. Regenerate older sessions created
before review identities were introduced, or sessions whose reference cases
changed. Regeneration keeps your implementation **and your added tests**.
Use `--force` only to reset both to the current reference starter and cases.

History is local and ignored by Git with the rest of `practice/`. Back up that
folder to keep your work across machines. `--clean` explicitly deletes it,
including solutions, added tests, and review history; it is rejected alongside
`--next` to prevent accidentally erasing the queue while selecting a review.

Writes hold an exclusive lock and replace the history file atomically. A
malformed history file produces an error and remains intact. If a process
dies while holding `.review-history.json.lock`, close other practice writers
and inspect the lock before manually removing it. Do not delete history as a
routine recovery step.

## Why this was added

[Dunlosky and colleagues' review of learning techniques](https://journals.sagepub.com/doi/10.1177/1529100612453266)
evaluated practice testing and distributed practice favorably across varied
learning conditions. That supports returning to a problem and retrieving an
explanation from memory. It does not establish this repository's exact
intervals or demonstrate a particular improvement in coding interviews.
The schedule above is an implementation choice you can inspect, not a claim
that the paper validated this tool.
