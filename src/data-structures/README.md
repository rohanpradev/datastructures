# Data Structures Learning Map

This folder teaches the implementation mechanics behind common interview and backend building blocks. Treat each structure as two lessons: how the API behaves, and which internal representation makes the operations efficient.

## How This Folder Is Organized

| Folder | Core idea | Interview skills |
|---|---|---|
| `singly-linked-list/` | One-way node chain | Pointer updates, cycle checks, middle/kth node, in-place reversal |
| `doubly-linked-list/` | Previous and next links | O(1) removal when you already have a node, LRU-cache internals |
| `stack/` | Last-in, first-out access | Parentheses, monotonic stack, expression evaluation, DFS simulation |
| `queue/` | First-in, first-out access | BFS, scheduling, producer/consumer workflows |
| `hash-table/` | Key-to-value lookup | Frequency counts, dedupe, grouping, collision and load-factor reasoning |
| `binary-tree/` | Hierarchical nodes without ordering guarantees | DFS/BFS traversals, path state, subtree reasoning |
| `binary-search-tree/` | Ordered binary tree | Bounds validation, kth element, predecessor/successor, search pruning |
| `heap/` | Priority queue over an array | Top-k, streaming median, merge k sorted lists/arrays |
| `trie/` | Prefix tree | Autocomplete, word search, prefix counting |
| `graph/` | Vertices and edges | DFS/BFS, components, cycle detection, topological order, shortest paths |

## Best Study Order

1. Start with stack and queue to lock in simple access discipline.
2. Learn linked lists before trees, because tree pointer work is linked-list pointer work with branching.
3. Study hash tables early; they are the default optimization for repeated lookup.
4. Move from binary trees to BSTs so the ordering invariant feels explicit.
5. Learn heaps before graph shortest-path problems.
6. Finish with graph and trie problems because they combine traversal, state, and memory trade-offs.

## Implementation Questions To Ask

- What operation must be O(1), O(log n), or O(n)?
- Does the structure own its nodes, or do callers hold node references?
- Can values be duplicated?
- Does iteration order matter?
- Which edge case breaks pointer updates: empty, one node, head, tail, or middle?
- What extra memory buys a better time complexity?

## Test Commands

```bash
bun test src/data-structures/tests
bun run practice -- --list stack
bun run practice -- --list graph
```

## Adding A New Data Structure

- Put the primary implementation in its own topic folder.
- Put LeetCode-style extensions under `problems/` when they depend on the structure.
- Add tests under `src/data-structures/tests`.
- Export stateful APIs as classes, for example `export class MinStack`.
- Add JSDoc to the class and public methods that explains behavior, complexity, and important invariants.
