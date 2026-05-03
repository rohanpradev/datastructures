# Data Structures, Algorithms, Node/Bun, and System Design Prep

<p align="center">
  <a href="https://svgl.app/?search=bun"><img src="https://svgl.app/library/bun.svg" alt="Bun" height="46" /></a>
  &nbsp;&nbsp;
  <a href="https://svgl.app/?search=typescript"><img src="https://svgl.app/library/typescript.svg" alt="TypeScript" height="46" /></a>
  &nbsp;&nbsp;
  <a href="https://svgl.app/?search=biome"><img src="https://svgl.app/library/biomejs.svg" alt="Biome" height="46" /></a>
  &nbsp;&nbsp;
  <a href="https://svgl.app/?search=node"><img src="https://svgl.app/library/nodejs.svg" alt="Node.js" height="46" /></a>
  &nbsp;&nbsp;
  <a href="https://svgl.app/?search=javascript"><img src="https://svgl.app/library/javascript.svg" alt="JavaScript" height="46" /></a>
  &nbsp;&nbsp;
  <a href="https://svgl.app/?search=github"><img src="https://svgl.app/library/github_light.svg" alt="GitHub" height="46" /></a>
</p>

<p align="center">
  <strong>Bun runtime</strong> | <strong>TypeScript 7</strong> | <strong>Biome quality</strong> | <strong>Node.js concepts</strong> | <strong>JavaScript fundamentals</strong> | <strong>GitHub CI</strong>
</p>

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
bun run check
```

Useful commands:

```bash
bun run check                 # Lint, typecheck, and run tests
bun run fix                   # Apply Biome fixes and formatting
bun run format                # Format supported files
bun run lint                  # Non-mutating Biome check for CI
bun run typecheck             # TypeScript 7 beta via tsgo
bun run test:algorithms       # Algorithm tests only
bun run test:bun              # Bun runtime concept tests only
bun run test:data-structures  # Data structure tests only
bun run test:node             # Node/Bun concept tests only
bun run test:coverage         # Text coverage report
bun run practice              # Generate empty practice templates
bun dev                       # Run Bun server examples
```

## Quality Gates

The repository is designed so one command verifies the working tree:

```bash
bun run check
```

That command runs:

1. `bun run lint`
2. `bun run typecheck`
3. `bun run test:ci`

CI runs the same gates on every push and pull request. The CI workflow uses current GitHub Actions majors (`actions/checkout@v6`, `actions/cache@v5`) and `oven-sh/setup-bun@v2`.

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

### Backtracking

Folder: `src/algorithms/backtracking`  
Beginner guide: [Backtracking Guide](./src/algorithms/backtracking/BACKTRACKING_GUIDE.md)

High-yield problems now covered:

- Letter Combinations Of A Phone Number
- Generate Parentheses
- Word Search

How to think:

- Backtracking is choose, explore, undo.
- Use it when the problem asks for all valid combinations or paths.
- Always define what makes a partial state invalid so you can prune early.

### Bit Manipulation

Folder: `src/algorithms/bit-manipulation`  
Beginner guide: [Bit Manipulation Guide](./src/algorithms/bit-manipulation/BIT_MANIPULATION_GUIDE.md)

High-yield problems now covered:

- Single Number
- Counting Bits
- Missing Number
- Reverse Bits

How to think:

- XOR cancels duplicate values.
- `num & 1` reads the last bit.
- `num >> 1` drops the last bit.

### Math And Geometry

Folder: `src/algorithms/math-geometry`  
Beginner guide: [Math And Geometry Guide](./src/algorithms/math-geometry/MATH_GEOMETRY_GUIDE.md)

High-yield problems now covered:

- Rotate Image
- Set Matrix Zeroes
- Happy Number

How to think:

- Matrix problems are mostly careful index transformations.
- Draw a small example before coding.
- For repeated transformations, look for cycles.

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
System design guide: [Node System Design Building Blocks](./src/node-concepts/system-design/SYSTEM_DESIGN_NODE_GUIDE.md)
Bun runtime guide: [Bun Runtime Interview Guide](./src/node-concepts/bun-runtime/BUN_RUNTIME_GUIDE.md)

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
- Bun file I/O with `Bun.file()` and `Bun.write()`
- Bun glob scanning with `Bun.Glob`
- Bun password hashing, cookies, and Shell scripting
- Token bucket rate limiter
- Sliding window rate limiter
- LRU cache
- Base62 URL-shortener IDs
- Snowflake-style distributed IDs

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

## Fast Learning Tracks

Use these tracks when you want a focused session instead of jumping across the whole repo.

### 30-Minute Warmup

1. Read one beginner guide.
2. Implement one easy function in `practice/`.
3. Run one focused test file.
4. Explain brute force and optimized complexity.

### 2-Hour Pattern Session

1. Pick one pattern: sliding window, stack, heap, DP, graph, backtracking, or system design.
2. Read the guide and all JSDoc comments for that topic.
3. Implement three related practice problems.
4. Run the focused test command.
5. Write one paragraph explaining the invariant.

### Mock Interview Session

1. Pick a problem you have not solved recently.
2. Set a 35-minute timer.
3. Speak through constraints, brute force, pattern, invariant, code, tests, and complexity.
4. After the timer, compare against `src/`.
5. Add any missed edge case to the matching test file.

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
