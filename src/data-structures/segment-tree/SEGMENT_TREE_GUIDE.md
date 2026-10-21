# Segment Tree: Mutable Range Aggregates

Use this when an array changes between queries and each query needs an aggregate
over a contiguous range. For example, a dashboard might replace one minute's
measurement, then ask for the lowest measurement in a selected window.

The [CMU range-query lecture](https://www.cs.cmu.edu/~15451-f23/lectures/lecture07-segtrees.pdf)
explains how storing aggregates of adjacent blocks makes both operations fast.
Each node holds the combination of its left block followed by its right block.
After changing a leaf, rebuild its ancestors. Queries combine disjoint blocks
covering the requested interval.

## Contract And Pattern Signal

`SegmentTree<T>` takes values, an identity, and an associative `combine` function.
Associativity means `combine(combine(a,b),c)` equals `combine(a,combine(b,c))`.
The identity must work on both sides: combining it with any value returns that
value. Commutativity is unnecessary; left-to-right order matters.

| Aggregate | Identity | Combine |
| --- | --- | --- |
| Sum | `0` | `(a, b) => a + b` |
| Minimum | `Infinity` | `Math.min` |
| Maximum | `-Infinity` | `Math.max` |
| Ordered text | `""` | `(a, b) => a + b` |

Use a pure reducer that returns a result without mutating its inputs. Treat
stored objects and the identity as immutable; the tree copies array slots, not
the objects themselves. The API cannot prove these mathematical contracts.

## Dry Run

For `[3, 1, 4, 1, 5]`, a sum tree answers `query(1, 4)` with `1 + 4 + 1 = 6`.
After `set(2, 9)`, the same query returns `11`. The right endpoint is excluded.
`query(2, 2)` returns `0`; `query(0, 5)` includes the entire array.

```ts
const lows = new SegmentTree([3, 1, 4, 1, 5], Infinity, Math.min);
lows.query(2, 5); // 1
lows.set(3, 8);
lows.query(2, 5); // 4
```

The implementation pads leaves to a power of two using the identity. During a
query it appends blocks discovered on the left and prepends blocks discovered on
the right, then combines those accumulators. Try tracing a text query: sums alone
can conceal an ordering bug.

## Costs, Alternatives, And Edge Cases

Construction takes O(n) combines and O(n) storage; point assignment and range
query take O(log n) combines with O(1) auxiliary space. These are time bounds
when combining and storing each result costs O(1). Concatenating long strings
adds copying costs. Floating-point addition can also depend on grouping; use
appropriate exact values or accept the resulting rounding behavior.

Prefix sums suit a fixed array. The existing Fenwick tree is compact for mutable
sums. A segment tree also supports operations such as minimum, where subtracting
two prefix results cannot recover an arbitrary interval. Lazy propagation adds
range updates; see the [CP-Algorithms extension](https://cp-algorithms.com/data_structures/segment_tree.html#range-updates-lazy-propagation).

Empty trees allow only `query(0, 0)`. Empty intervals return the identity. Reject
fractional, negative, reversed, and out-of-range boundaries before changing any
state. Point assignment requires an existing element, so index `length` is invalid.

## Practice And Follow-Ups

Run `bun test src/data-structures/tests/segment-tree.test.ts`, then generate
`bun run practice -- --problem SegmentTree`. Rebuild it from the invariant, and
compare sum/minimum queries against a direct scan after mixed updates. Explain
why a text reducer exposes errors that a sum reducer misses.

Review tomorrow, in one week, and after three weeks. For a production dashboard,
discuss who owns updates and how readers obtain a consistent snapshot; this
in-memory tree alone provides neither persistence nor coordination across servers.
