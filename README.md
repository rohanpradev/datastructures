# Data Structures, Algorithms, Node/Bun, and System Design Prep

TypeScript 7 + Bun interview-prep workspace with reference implementations, tests, guides, and generated practice templates.

This repo is organized by topic so you can learn a pattern, implement it in `practice/`, run the matching tests, and compare against the reference in `src/`.

## Why This Exists

FAANG interviews, especially Google-style interviews, reward pattern recognition, clear reasoning, edge-case handling, and code that you can explain under time pressure. The problem set here is aligned with common public prep tracks such as Blind 75 / NeetCode 150 style patterns and Google's own emphasis on data structures, algorithms, Big-O, maps, trees, graphs, binary search, recursion, dynamic programming, and interview communication.

Research references:

- [Google Tech Dev Guide: Data Structures and Algorithms](https://techdevguide.withgoogle.com/paths/data-structures-and-algorithms/)
- [Google Tech Dev Guide: Interview Prep](https://techdevguide.withgoogle.com/paths/interview/)
- [NeetCode roadmap](https://neetcode.io/roadmap)
- [Blind 75 problem list](https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions)
- [TypeScript 7 beta announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/)

## Quick Start

```bash
bun install
bun test
bun run typecheck
bun run check
```

Useful commands:

```bash
bun run practice        # Generate empty practice templates
bun test src            # Run reference tests
bun test practice       # Run generated practice tests
bun run typecheck       # TypeScript 7 beta via tsgo
bun dev                 # Run Bun server examples
```

## How To Solve A Problem You Do Not Know

Use this script in every interview. It keeps you from jumping into code too early.

1. Restate the problem.
   Say what the input is, what output is expected, and whether you need one answer or all answers.

2. Ask constraints.
   Important questions: input size, sorted or unsorted, duplicates, negatives, empty input, mutation allowed, memory limits.

3. Try brute force.
   Write the simplest idea in words. Even if it is too slow, it gives you a correctness baseline.

4. Identify the pattern.
   Look for signals:
   - Sorted array: binary search or two pointers.
   - Contiguous subarray/substring: sliding window or prefix sum.
   - Next greater/smaller: monotonic stack.
   - Top k: heap or quickselect.
   - Dependencies: graph/topological sort.
   - Connected components: DFS/BFS or union-find.
   - "Min/max ways", "can form", "best score": dynamic programming.

5. State the invariant.
   Examples:
   - Sliding window: the window always contains no duplicate characters.
   - Binary search: the answer is always inside `[left, right]`.
   - Monotonic stack: stack indices are increasing by height.
   - DP: `dp[i]` means the best answer for the prefix ending at `i`.

6. Code the smallest correct version.
   Prefer clear variable names. Do not optimize prematurely.

7. Test out loud.
   Cover empty input, one item, duplicates, negative values, sorted/reverse sorted input, no-solution case, and large boundary behavior.

8. Give complexity.
   Always state time and space. If there is a trade-off, say it.

## FAANG Problem Map

### Arrays And Hashing

Folder: `src/algorithms/arrays`
Beginner guide: [FAANG Array Problems Guide](./src/algorithms/arrays/FAANG_ARRAY_PROBLEMS_GUIDE.md)

High-yield problems now covered:

- Two Sum
- Validate Subsequence
- Sorted Squared Array
- Product Except Self
- Top K Frequent Elements
- Majority Element
- Merge Intervals
- Search In Sorted Matrix
- Longest Consecutive Sequence
- Median Of Two Sorted Arrays

How to think:

- Need fast membership or counts: use `Map` / `Set`.
- Need a range sum: use prefix sums.
- Need sorted pair logic: sort and use two pointers.
- Need kth/top frequency: use buckets or heaps.

### Strings

Folder: `src/algorithms/strings`
Beginner guide: [FAANG String Problems Guide](./src/algorithms/strings/FAANG_STRING_PROBLEMS_GUIDE.md)

High-yield problems now covered:

- Generate Document
- First Non-Repeating Character
- Semordnilap
- Group Anagrams
- Valid Anagram

How to think:

- Same letters in different order usually means frequency counting.
- Longest/shortest substring usually means sliding window.
- Palindrome checks often use two pointers or expand-around-center.

### Stack

Folder: `src/data-structures/stack`
Beginner guide: [FAANG Stack Problems Guide](./src/data-structures/stack/problems/FAANG_STACK_PROBLEMS_GUIDE.md)

High-yield problems now covered:

- Valid Parentheses
- Min Stack
- Daily Temperatures
- Evaluate Expression
- Largest Rectangle In Histogram
- Queue Using Two Stacks

How to think:

- Matching/nesting: stack.
- Next greater/smaller: monotonic stack.
- "Minimum at every stack depth": companion stack.

### Heap

Folder: `src/data-structures/heap`
Beginner guide: [FAANG Heap Problems Guide](./src/data-structures/heap/FAANG_HEAP_PROBLEMS_GUIDE.md)

High-yield problems now covered:

- Max Heap
- Min Heap
- Kth Largest Element

How to think:

- Need top k but not fully sorted: heap of size k.
- Need repeated min/max extraction: heap.
- Need streaming median next: combine max-heap and min-heap.

### Dynamic Programming

Folder: `src/algorithms/dynamic-programming`
Beginner guide: [FAANG DP Problems Guide](./src/algorithms/dynamic-programming/FAANG_DP_PROBLEMS_GUIDE.md)

High-yield problems now covered:

- Max Sum Non-Adjacent
- Number Of Ways To Make Change
- Min Coins For Change
- Edit Distance
- Grid Traversal
- Max Product Subarray
- Longest Common Subsequence

How to think:

- Define the state first: what does `dp[i]` or `dp[row][col]` mean?
- Define the transition: how does this state use earlier states?
- Define base cases before loops.
- If recursion repeats work, memoize or convert to bottom-up DP.

### Graphs

Folder: `src/data-structures/graph` and `src/algorithms/arrays` for matrix graph problems.

High-yield problems covered:

- Graph traversals
- River Sizes
- Remove Islands
- Minimum Pass Matrix
- Number Of Islands style matrix DFS/BFS

How to think:

- Shortest path in unweighted graph: BFS.
- Explore all connected land/nodes: DFS or BFS.
- Dependency ordering: topological sort.
- Connectivity under unions: union-find.

### Node/Bun Concepts

Folder: `src/node-concepts`

Interview topics covered:

- Event loop ordering
- Chunked CPU work
- Promise task queue
- Circuit breaker
- AbortController
- Timeout wrappers
- Retry logic
- Pub/Sub
- Bun server and worker offloading

## Practice Workflow

1. Pick a topic from the map above.
2. Read the guide in that folder.
3. Generate practice templates:

```bash
bun run practice
```

4. Implement the matching file under `practice/`.
5. Run a focused test:

```bash
bun test practice/algorithms/tests/array-problems.test.ts
```

6. Compare with `src/`.
7. Explain the pattern and complexity in your own words.

## Project Structure

```text
.
|-- .github/workflows/      # CI for Bun tests, Biome, TypeScript 7
|-- practice/               # Generated empty implementations
|-- scripts/                # Bun automation
|-- src/
|   |-- algorithms/
|   |   |-- arrays/
|   |   |-- dynamic-programming/
|   |   |-- recursion/
|   |   |-- sorting/
|   |   `-- strings/
|   |-- data-structures/
|   |   |-- binary-search-tree/
|   |   |-- binary-tree/
|   |   |-- graph/
|   |   |-- hash-table/
|   |   |-- heap/
|   |   |-- queue/
|   |   |-- stack/
|   |   `-- trie/
|   `-- node-concepts/
|-- package.json
|-- tsconfig.json
`-- README.md
```

## Tooling

- Runtime: Bun
- Language: TypeScript 7 beta through `@typescript/native-preview`
- Typecheck command: `bun run typecheck`
- Test runner: Bun test
- Formatter/linter: Biome

## Quality Rules For New Problems

Every new interview problem should include:

- Reference implementation in the correct topic folder.
- Tests in the matching test file.
- JSDoc explaining pattern, time complexity, and space complexity.
- Edge cases in tests.
- A short guide entry when the pattern is new.

This keeps the repo useful even when you have never seen the problem before.
