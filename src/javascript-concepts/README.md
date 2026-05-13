# JavaScript Core Concepts Interview Guide

This folder turns language fundamentals into runnable examples. The goal is to know what the runtime is doing well enough to explain bugs, trade-offs, and Big-O under pressure.

Official references:

- [MDN JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)
- [TC39 proposals](https://github.com/tc39/proposals)

## Topics Covered

| Topic | Function | Interview signal |
| --- | --- | --- |
| Equality semantics | `sameValueZero` | Explains `NaN`, `-0`, `Map`, `Set`, and `includes` behavior |
| Hash-map grouping | `groupBy` | Builds anagrams, frequency buckets, graph adjacency lists, and indexes |
| Closures | `createCounter` | Shows private state and lexical scope |
| Iterables | `range` | Explains `Symbol.iterator`, `for...of`, spread, generators, maps, and sets |
| Structured cloning | `cloneStructured` | Avoids JSON clone limitations |
| Promise state | `createDeferred` | Useful for adapting callback/event APIs and tests |
| Memoization | `memoizeByKey` | Trades memory for repeated-work savings |
| Concurrency scheduling | `runWithConcurrency` | Shows why promise factories matter |

## Study Order

1. Equality: know the difference between `===`, `Object.is`, and SameValueZero.
2. Collections: use `Map` when keys are not clean strings or when insertion order matters.
3. Closures: explain why state remains alive after the outer function returns.
4. Iterables: explain how `for...of` asks an object for `Symbol.iterator`.
5. Async: remember that promises start when created; schedulers need task factories.
6. Memoization: define the cache key and invalidation rules before coding.

## Test Command

```bash
bun test src/javascript-concepts/test/core-concepts.test.ts
```
