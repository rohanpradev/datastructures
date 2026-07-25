# Start Here

This repo is a TypeScript-first interview course, not a loose snippet folder.
Use this route when you want a clean path from fundamentals to mixed interview
readiness, system design, and current AI-era interview formats.

## Best Entry Route

1. Read [RESEARCH_BRIEF_2026.md](./RESEARCH_BRIEF_2026.md) to understand the
   current interview and enterprise signals that shaped the platform.
2. Read [LEARNER_NOTE_STANDARDS.md](./LEARNER_NOTE_STANDARDS.md) so you know
   how to use guides, source comments, tests, and generated TODOs for actual
   understanding.
3. Use [MASTERY_MATRIX.md](./MASTERY_MATRIX.md) to choose beginner,
   intermediate, advanced, or expert work.
4. Study [WORKED_EXAMPLES.md](./WORKED_EXAMPLES.md) before your first clean-room
   practice session.
5. Use [AI_INTERVIEW_TRENDS_2026.md](./AI_INTERVIEW_TRENDS_2026.md) for
   AI-assisted, no-AI, debugging, and repo-comprehension interview drills.
6. Use
   [SYSTEM_DESIGN_HANDBOOK.md](./SYSTEM_DESIGN_HANDBOOK.md) for the complete
   concept map, answer framework, correctness checklist, and question bank.
7. Use
   [ENTERPRISE_SYSTEM_DESIGN_CURRICULUM.md](./ENTERPRISE_SYSTEM_DESIGN_CURRICULUM.md)
   for detailed senior/staff scenario walkthroughs.
8. Use [BUN_2026_CURRICULUM.md](./BUN_2026_CURRICULUM.md) to cover the current
   Bun release, production boundaries, and modern test workflows.
9. Generate a dashboard:

```bash
bun run practice:dashboard
```

This writes `practice/practice-manifest.json` and
`practice/learning-dashboard.md` with levels, interview modes, estimated
minutes, rubrics, spaced-review cadence, and enterprise prompts.

## How The Notes Work

For each topic, read the guide first, skim JSDoc/comments for invariants, inspect
tests for edge cases, then rebuild the selected export in `practice/`. Do not
open the reference implementation until your attempt passes or you can name the
specific blocker. Your own note should stay compact: target, pattern, invariant,
missed edge case, next review.

## Current Tooling Baseline

This repo follows the current official Bun guidance for TypeScript projects:
run TypeScript directly with Bun, keep static checking in a separate command,
use `@types/bun`, `moduleResolution: "bundler"`, `module: "Preserve"`,
`verbatimModuleSyntax`, and strict TypeScript checking. Current strictness
includes `exactOptionalPropertyTypes` and indexed-signature bracket access;
`noUncheckedIndexedAccess` remains a documented backlog because the algorithm
track needs focused indexing fixes before it can be enabled globally.

References:

- Bun TypeScript docs: https://bun.com/docs/runtime/typescript
- Bun test docs: https://bun.com/docs/test/writing-tests
- TypeScript 7 release: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- TypeScript docs: https://www.typescriptlang.org/docs/
- TypeScript TSConfig reference: https://www.typescriptlang.org/tsconfig/

## Folder Structure

Read top-level docs first, source folders second, tests third, generated
practice last.

```text
docs/                    learner route, worked examples, trends, system design
src/typescript-concepts/ modern TypeScript syntax and type-system practice
src/javascript-concepts/ JavaScript semantics that interviews often probe
src/algorithms/          pattern-first algorithm implementations and guides
src/data-structures/     structure internals plus related problem sets
src/node-concepts/       Bun, async, runtime, and system-design primitives
scripts/                 practice generation and learner automation
practice/                generated clean-room work area; ignored by git
```

## Daily Practice

Use difficulty commands when you want a low-friction session:

```bash
bun run practice:easy
bun run practice:medium
bun run practice:hard
bun run practice:dashboard
```

Use topic search when you know what to drill:

```bash
bun run practice -- --random beginner
bun run practice -- --random expert
bun run practice -- --list graph
bun run practice -- --list medium graph
bun run practice -- --random sliding
bun run practice -- --random sliding --seed cohort-a
bun run practice -- --problem kthLargestElement
```

After generating a problem, implement only the file under `practice/`, then use
`bun run practice:run` for one test pass or `bun run practice:watch` for feedback
on every save. `bun run practice:status` restores the active paths and commands.
Generating the same target preserves your code; `--force` is the explicit reset.

## Study Order

1. Research brief and mastery matrix.
2. Worked examples and beginner TypeScript/JavaScript fundamentals.
3. Stack, queue, linked list, hash table.
4. Arrays, strings, sorting, two pointers, sliding window.
5. Trees, BSTs, tries, heaps, graphs.
6. Recursion, backtracking, dynamic programming, bit manipulation.
7. Mixed interview patterns and AI-era interview drills.
8. Bun runtime and current Bun 1.3 APIs.
9. Distributed-system primitives, the system-design handbook, and enterprise scenarios.

## End-To-End Checks

Run these before trusting a change:

```bash
bun run check
bun run docs:check
bun run practice:audit
bun run practice:validate
```

`bun run check` verifies formatting, linting, typechecking, and all tests.
`practice:audit` verifies test-to-export mapping and proves every eligible
runnable block is mapped exactly once. `practice:validate` generates every target,
checks its stub boundary, then runs all focused scenarios against the canonical
implementation so missing cases or imports cannot pass silently.
