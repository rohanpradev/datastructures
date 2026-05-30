# Start Here

This repo is a TypeScript-first interview course, not a loose snippet folder.
Use this route when you want a clean path from fundamentals to mixed interview
readiness.

## Current Tooling Baseline

This repo follows the current official Bun guidance for TypeScript projects:
run TypeScript directly with Bun, keep static checking in a separate command,
use `@types/bun`, `moduleResolution: "bundler"`, `module: "Preserve"`,
`verbatimModuleSyntax`, and strict TypeScript checking.

References:

- Bun TypeScript docs: https://bun.sh/docs/typescript
- Bun test docs: https://bun.sh/docs/test/writing-tests
- TypeScript docs: https://www.typescriptlang.org/docs/
- TypeScript TSConfig reference: https://www.typescriptlang.org/tsconfig/

## Folder Structure

Read top-level docs first, source folders second, tests third, generated
practice last.

```text
docs/                    learner route, interview playbook, tooling notes
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
```

Use topic search when you know what to drill:

```bash
bun run practice -- --list graph
bun run practice -- --random sliding
bun run practice -- --problem kthLargestElement
```

After generating a problem, implement only the file under `practice/`, then run
the focused test command printed by the generator.

## Study Order

1. TypeScript and JavaScript fundamentals.
2. Stack, queue, linked list, hash table.
3. Arrays, strings, sorting, two pointers, sliding window.
4. Trees, BSTs, tries, heaps, graphs.
5. Recursion, backtracking, dynamic programming, bit manipulation.
6. Mixed interview patterns.
7. Bun runtime, async resilience, and system-design primitives.

## End-To-End Checks

Run these before trusting a change:

```bash
bun run check
bun run practice:audit
bun run practice:validate
```

`bun run check` verifies formatting, linting, typechecking, and all tests.
`practice:audit` verifies test-to-export mapping. `practice:validate` generates
every focused target and catches broken generated imports or stubs.

