# Type Safety Backlog

Bun's current TypeScript recommendation includes `noUncheckedIndexedAccess:
true`. The repo already uses strict TypeScript, but this stricter indexed-access
mode is not enabled yet because array, matrix, and queue-heavy educational code
needs a careful pass to avoid noisy non-null assertions.

Audit command used:

```bash
tsgo --noEmit --noUncheckedIndexedAccess true
```

## Upgrade Plan

1. Fix one topic folder at a time.
2. Prefer bounds checks and local variables over blanket `!` assertions.
3. Use tuple types for fixed coordinate pairs and direction vectors.
4. Replace repeated `array[index]` reads with guarded locals.
5. Keep code readable for learners; do not overfit types at the cost of the
   algorithm explanation.
6. Enable `noUncheckedIndexedAccess: true` in `tsconfig.json` only after the
   audit command passes.

## Highest-Value Areas

- `src/algorithms/arrays`: matrix and pointer-heavy implementations.
- `src/algorithms/dynamic-programming`: DP table initialization and indexing.
- `src/data-structures/graph`: adjacency and grid traversal helpers.
- `scripts/generate-practice.ts`: parser helpers with inferred arrays.
