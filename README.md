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

For a week-by-week plan, use [LEARNING_PATH.md](./LEARNING_PATH.md).

## Course Map

Use the repo as a progressive course, not as a random problem dump.

| Level | Focus | Folders | Exit criteria |
|---|---|---|---|
| 1 | TypeScript fluency and core JavaScript behavior | `src/typescript-concepts`, `src/javascript-concepts`, `src/node-concepts/basics` | Explain generics, `unknown`, decorators, promises, generators, event loop ordering, value/reference behavior, and module boundaries. |
| 2 | Core data structures | `src/data-structures/{stack,queue,hash-table,singly-linked-list,doubly-linked-list,binary-tree,binary-search-tree,heap,trie,graph}` | Implement each structure from scratch and state operation complexity without notes. |
| 3 | Interview algorithms | `src/algorithms/{arrays,strings,sorting,recursion,backtracking,dynamic-programming,bit-manipulation,math-geometry,interview-patterns}` | Recognize the pattern before coding and pass the focused test suite. |
| 4 | Advanced problem solving | FAANG guides inside each topic folder | Solve mixed problems under time pressure, including follow-ups and edge cases. |
| 5 | Backend/system design primitives | `src/node-concepts/async`, `src/node-concepts/system-design`, `src/node-concepts/bun-runtime` | Explain the in-memory algorithm, failure modes, and distributed production upgrade. |
| 6 | Capstone review | `practice/` plus `bun run check` | Generate unknown practice, solve cleanly, and keep lint, typecheck, tests, and coverage healthy. |

## What Is Already Covered

The repo already includes broad DS&A coverage, so new work should fill gaps instead of duplicating basics:

- Data structures: linked lists, stack, queue, hash table, heap, trie, graph, binary tree, BST, plus LeetCode-style problem guides.
- Algorithms: arrays, strings, sorting, recursion, backtracking, dynamic programming, bit manipulation, math/geometry, and interview patterns.
- Runtime/backend: promises, event loop, generators, concurrent operations, circuit breaker, pub/sub, resilience, Bun file I/O, Bun Shell, Bun security, SQLite, and system design blocks.
- Verification: Bun tests across each topic, TypeScript checking via `tsgo`, Biome lint/format checks, generated practice validation, and GitHub CI.

## Advanced Topics To Master

These are the topics that turn the repo into a senior-level TypeScript prep course:

| Topic | Learn in repo | Interview/system design angle |
|---|---|---|
| Consistent hashing | `src/node-concepts/system-design/consistent-hash.ts` | Cache/database sharding, node joins/leaves, virtual nodes, hot-key mitigation. |
| Bloom filters | `src/node-concepts/system-design/bloom-filter.ts` | Negative cache, read-path protection, false-positive trade-offs, memory sizing. |
| Rate limiting | `src/node-concepts/system-design/rate-limiter.ts` | Token bucket vs sliding window, Redis atomicity, fairness vs burst tolerance. |
| Cache eviction | `src/node-concepts/system-design/lru-cache.ts` | LRU internals, TTL, stale data, cache-aside vs write-through. |
| ID generation | `src/node-concepts/system-design/id-generation.ts` | Base62 public IDs, Snowflake-style IDs, clock rollback, collision risks. |
| Async resilience | `src/node-concepts/async` | Retries, timeout budgets, backpressure, circuit breakers, pub/sub fan-out. |
| Bun-native backend work | `src/node-concepts/bun-runtime` | File I/O, Shell, password hashing, cookies, SQLite, SQL/Redis boundaries. |

## Why This Exists

FAANG interviews, especially Google-style interviews, reward pattern recognition, clear reasoning, edge-case handling, and code that you can explain under time pressure. The problem set here is aligned with common public prep tracks such as Blind 75 / NeetCode 150 style patterns and Google's own emphasis on data structures, algorithms, Big-O, maps, trees, graphs, binary search, recursion, dynamic programming, and interview communication.

Research references:

- [Google Tech Dev Guide: Data Structures and Algorithms](https://techdevguide.withgoogle.com/paths/data-structures-and-algorithms/)
- [Google Tech Dev Guide: Interview Prep](https://techdevguide.withgoogle.com/paths/interview/)
- [NeetCode roadmap](https://neetcode.io/roadmap)
- [Blind 75 problem list](https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions)
- [MDN JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [Node.js releases](https://nodejs.org/en/about/previous-releases)
- [Bun documentation](https://bun.sh/docs)
- [TC39 proposals](https://github.com/tc39/proposals)
- [TypeScript 7 beta announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/)
- [TypeScript Handbook: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript 4.9: `satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html)
- [TypeScript 5.0: decorators and const type parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)
- [TypeScript 5.2: `using` declarations and explicit resource management](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html)

Documentation refresh note: as of May 13, 2026, the Node.js release page lists Node.js 24 as LTS and Node.js 26 as Current. This repo targets interview learning, so production-facing Node examples should favor LTS behavior unless a Current-only feature is explicitly being studied.

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
bun run test:js               # JavaScript core concept tests only
bun run test:node             # Node/Bun concept tests only
bun run test:coverage         # Text and lcov coverage report
bun test src/typescript-concepts/test # Modern TypeScript concept tests
bun run practice              # Pick one problem and generate focused practice
bun run practice:random       # Generate a random focused problem
bun run practice:list         # List focused practice targets with metadata
bun run practice:manifest     # Write practice/practice-manifest.json
bun run practice:audit        # Validate test/export naming for focused practice
bun dev                       # Run Bun server examples
```

## Practice Generator Contract

The focused practice generator depends on consistent names between tests and source exports:

- Standalone interview problems use `export function problemName(...)`.
- Data structures and stateful APIs use `export class StructureName`.
- Helper functions stay unexported unless they are intentionally tested as their own problem.
- A top-level test block should be named after the main export, for example `describe("twoSum", ...)`.
- Multi-export blocks should use clear broad titles such as `Integration`, `Comparison`, `Edge Cases`, or `Patterns`.

Run these checks when adding or renaming problems:

```bash
bun run practice:manifest
bun run practice -- --audit-targets
bun run practice -- --validate-all-focused
```

The manifest is Bun-native JSON output generated with `Bun.write()`. It includes every target's topic, inferred pattern, difficulty, source files, test file, and exports, which makes it useful for dashboards, SQLite progress trackers, or spaced-repetition scripts.

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

Bun test behavior is centralized in `bunfig.toml`: test preloading, text/lcov coverage reporters, coverage output directory, and test-file coverage exclusion. Package installation also uses a minimum release age to avoid adopting freshly published packages immediately, while excluding the small toolchain packages that are intentionally kept current.

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

## Common Interview Mistakes To Avoid

Learn from what makes candidates fail. Here are the top mistakes and how to avoid them:

### Coding Mistakes

| Mistake | Why It Fails | Fix |
|---|---|---|
| Jump to code before understanding | Write wrong solution | Follow the 8-step process first |
| Only test happy path | Miss edge cases | Test: empty, single, duplicates, boundaries |
| Forget null/empty checks | NullPointerException | Always check before accessing properties |
| Off-by-one errors in loops | Wrong indices accessed | Draw boundary diagram, verify carefully |
| Mutate input unexpectedly | Change problem requirements | Ask "can I modify input?" first |
| Inefficient: `.shift()` on arrays | O(n) per operation, becomes O(n²) | Use index pointer instead: `array[i++]` |
| Inefficient: searching in array every time | O(n²) or worse | Use hash map for O(1) lookups |

### Communication Mistakes

| Mistake | Why It Fails | Fix |
|---|---|---|
| Silent coding for 20 minutes | Interviewer can't follow or help | Think out loud, explain approach first |
| Not stating complexity | Shows you don't think about efficiency | Always end with "Time: O(...), Space: O(...)" |
| Ignoring interviewer hints | Miss the intended solution | Listen carefully; hints usually mean you're on wrong path |
| Using single-letter variables | Interviewer can't follow `s`, `p`, `t`, `m` | Use: `slow`, `prev`, `temp`, `max` |
| Forgetting to explain "why" | Interviewer unsure if you understand | Explain pattern choice and data structure rationale |

### Algorithm Mistakes

| Problem Type | Common Mistake | Correct Approach |
|---|---|---|
| BST validation | Only check immediate children | Pass min/max bounds through recursion |
| LRU cache | Don't move to head on access | Must update "recently used" on every access |
| BFS on weighted graph | Use BFS (wrong!) | Use Dijkstra or Bellman-Ford |
| Linked list cycle | Don't track visited nodes | Use visited set or Floyd's algorithm |
| Substring problems | Check membership slowly | Use sliding window + hash map |
| Tree path problems | Don't carry state down recursion | Pass value/sum/path as parameter |
| Matrix DFS | Forget to mark as visited | Mark before recursing to prevent cycles |
| Duplicate handling | Assume input has no duplicates | Explicitly ask and handle duplicates |

## FAANG Problem Map

This section maps problems by topic with difficulty levels and interview frequency. Use this to find the right problems for your skill level and target company.

**Legend:**
- 🔴 = High frequency in interviews (focus here!)
- 🟡 = Medium frequency
- 🟢 = Lower frequency (good for comprehensive prep)
- 🌟 = Great follow-up question
- ⏱️ = Estimated time: Warm-up (5-10min) | Easy (15-20min) | Medium (30-45min) | Hard (45-60min+)

### Arrays And Hashing

Folder: `src/algorithms/arrays`
Beginner guide: [FAANG Array Problems Guide](./src/algorithms/arrays/FAANG_ARRAY_PROBLEMS_GUIDE.md)

| Problem | Company Freq | Difficulty | Time | Pattern |
|---|---|---|---|---|
| Two Sum | 🔴 High | Easy | 15min | Hash Map |
| Valid Anagram | 🔴 High | Easy | 10min | Hash Map |
| Group Anagrams | 🔴 High | Medium | 30min | Hash Map |
| Top K Frequent Elements | 🔴 High | Medium | 25min | Heap/Bucket |
| Product Except Self | 🔴 High | Medium | 20min | Prefix Sum |
| Validate Subsequence | 🟡 Medium | Easy | 15min | Two Pointers |
| Majority Element | 🟡 Medium | Easy | 20min | Counting/Voting |
| Merge Intervals | 🔴 High | Medium | 30min | Sorting |
| Search In Sorted Matrix | 🟡 Medium | Medium | 25min | Binary Search |
| Longest Consecutive Sequence | 🔴 High | Medium | 25min | Hash Set |
| Median Of Two Sorted Arrays | 🔴 High | Hard | 45min | Binary Search |

**How to think:**
- Need fast membership or counts: use `Map` / `Set`.
- Need a range sum: use prefix sums.
- Need sorted pair logic: sort and use two pointers.
- Need kth/top frequency: use buckets or heaps.

**Recommended warm-up:** Start with "Two Sum", then "Valid Anagram", then "Top K Frequent".

### Strings

Folder: `src/algorithms/strings`
Beginner guide: [FAANG String Problems Guide](./src/algorithms/strings/FAANG_STRING_PROBLEMS_GUIDE.md)

| Problem | Company Freq | Difficulty | Time | Pattern |
|---|---|---|---|---|
| Valid Anagram | 🔴 High | Easy | 15min | Frequency Count |
| Group Anagrams | 🔴 High | Medium | 30min | Hash Map |
| First Non-Repeating Character | 🟡 Medium | Easy | 15min | Hash Map |
| Semordnilap | 🟢 Low | Easy | 10min | Hash Set |
| Generate Document | 🟡 Medium | Easy | 15min | Frequency Count |

**How to think:**
- Same letters in different order usually means frequency counting.
- Longest/shortest substring usually means sliding window.
- Palindrome checks often use two pointers or expand-around-center.

### Stack

Folder: `src/data-structures/stack`
Beginner guide: [FAANG Stack Problems Guide](./src/data-structures/stack/problems/FAANG_STACK_PROBLEMS_GUIDE.md)

| Problem | Company Freq | Difficulty | Time | Pattern |
|---|---|---|---|---|
| Valid Parentheses | 🔴 High | Easy | 15min | Stack Matching |
| Min Stack | 🔴 High | Medium | 20min | Stack with Tracking |
| Daily Temperatures | 🔴 High | Medium | 20min | Monotonic Stack |
| Largest Rectangle In Histogram | 🟡 Medium | Hard | 40min | Monotonic Stack |
| Evaluate Expression | 🟡 Medium | Medium | 25min | Stack Parsing |
| Queue Using Two Stacks | 🟢 Low | Medium | 20min | Design |

**How to think:**
- Matching/nesting: stack.
- Next greater/smaller: monotonic stack.
- "Minimum at every stack depth": companion stack.

### Heap

Folder: `src/data-structures/heap`
Beginner guide: [FAANG Heap Problems Guide](./src/data-structures/heap/FAANG_HEAP_PROBLEMS_GUIDE.md)

| Problem | Company Freq | Difficulty | Time | Pattern |
|---|---|---|---|---|
| Kth Largest Element | 🔴 High | Medium | 20min | Min Heap |
| Find Median From Data Stream | 🔴 High | Hard | 35min | Dual Heap |
| Top K Frequent Elements | 🔴 High | Medium | 25min | Heap |
| Merge K Sorted Arrays | 🟡 Medium | Hard | 40min | Min Heap |
| Max Heap / Min Heap | 🟢 Low | Easy | 15min | Fundamentals |

**How to think:**
- Need top k but not fully sorted: heap of size k.
- Need repeated min/max extraction: heap.
- Need streaming median next: combine max-heap and min-heap.
- Need to merge many sorted sources: min heap with one active item per source.

### Dynamic Programming

Folder: `src/algorithms/dynamic-programming`
Beginner guide: [FAANG DP Problems Guide](./src/algorithms/dynamic-programming/FAANG_DP_PROBLEMS_GUIDE.md)

| Problem | Company Freq | Difficulty | Time | Pattern |
|---|---|---|---|---|
| Max Sum Non-Adjacent | 🟡 Medium | Medium | 25min | 1D DP |
| Min Coins For Change | 🔴 High | Medium | 30min | Coin Change |
| Edit Distance | 🔴 High | Hard | 40min | 2D DP |
| Max Product Subarray | 🟡 Medium | Medium | 25min | DP Tracking |
| Longest Common Subsequence | 🟡 Medium | Medium | 30min | 2D DP |
| Grid Traversal | 🟡 Medium | Medium | 25min | Path DP |
| Number Of Ways To Make Change | 🟡 Medium | Medium | 30min | Combination DP |

**How to think:**
- Define the state first: what does `dp[i]` or `dp[row][col]` mean?
- Define the transition: how does this state use earlier states?
- Define base cases before loops.
- If recursion repeats work, memoize or convert to bottom-up DP.

### Backtracking

Folder: `src/algorithms/backtracking`  
Beginner guide: [Backtracking Guide](./src/algorithms/backtracking/BACKTRACKING_GUIDE.md)

| Problem | Company Freq | Difficulty | Time | Pattern |
|---|---|---|---|---|
| Letter Combinations Of A Phone Number | 🟡 Medium | Medium | 25min | Backtracking |
| Generate Parentheses | 🔴 High | Medium | 30min | Backtracking |
| Word Search | 🔴 High | Medium | 30min | Grid Backtracking |

**How to think:**
- Backtracking is choose, explore, undo.
- Use it when the problem asks for all valid combinations or paths.
- Always define what makes a partial state invalid so you can prune early.

### Bit Manipulation

Folder: `src/algorithms/bit-manipulation`  
Beginner guide: [Bit Manipulation Guide](./src/algorithms/bit-manipulation/BIT_MANIPULATION_GUIDE.md)

| Problem | Company Freq | Difficulty | Time | Pattern |
|---|---|---|---|---|
| Single Number | 🔴 High | Easy | 15min | XOR |
| Counting Bits | 🟡 Medium | Medium | 20min | Bit DP |
| Missing Number | 🟡 Medium | Easy | 15min | XOR |
| Reverse Bits | 🟢 Low | Easy | 10min | Bit Manipulation |

**How to think:**
- XOR cancels duplicate values.
- `num & 1` reads the last bit.
- `num >> 1` drops the last bit.

### Math And Geometry

Folder: `src/algorithms/math-geometry`  
Beginner guide: [Math And Geometry Guide](./src/algorithms/math-geometry/MATH_GEOMETRY_GUIDE.md)

| Problem | Company Freq | Difficulty | Time | Pattern |
|---|---|---|---|---|
| Rotate Image | 🟡 Medium | Medium | 25min | Index Transform |
| Set Matrix Zeroes | 🟡 Medium | Medium | 25min | In-place |
| Happy Number | 🟢 Low | Easy | 15min | Cycle Detection |

**How to think:**
- Matrix problems are mostly careful index transformations.
- Draw a small example before coding.
- For repeated transformations, look for cycles.

### Graphs

Folder: `src/data-structures/graph` and `src/algorithms/arrays` for matrix graph problems.
Beginner guide: [FAANG Graph Problems Guide](./src/data-structures/graph/problems/GRAPH_PROBLEMS_GUIDE.md)

| Problem | Company Freq | Difficulty | Time | Pattern |
|---|---|---|---|---|
| Number of Islands | 🔴 High | Medium | 30min | DFS/BFS |
| River Sizes | 🟡 Medium | Medium | 30min | DFS |
| Remove Islands | 🟡 Medium | Medium | 30min | DFS |
| Minimum Pass Matrix | 🟡 Medium | Hard | 40min | BFS |
| Graph Traversals | 🟢 Low | Easy | 15min | Fundamentals |

**How to think:**
- Shortest path in unweighted graph: BFS.
- Explore all connected land/nodes: DFS or BFS.
- Dependency ordering: topological sort.
- Connectivity under unions: union-find.

### JavaScript Core Concepts

Folder: `src/javascript-concepts`
Guide: [JavaScript Core Concepts Interview Guide](./src/javascript-concepts/README.md)

Interview topics covered:

- SameValueZero equality used by `Map`, `Set`, and `includes`
- Hash-map grouping with `Map`
- Closures and private state
- Iterables and `Symbol.iterator`
- `structuredClone`
- Deferred promises
- Memoization with explicit cache keys
- Bounded promise concurrency

How to think:

- Know which equality model an API uses before debugging `NaN`, `-0`, or object keys.
- A promise starts when it is created. A scheduler needs task factories.
- Memoization is only correct when the cache key represents all inputs that affect output.

### Data Structures

Folder: `src/data-structures`

| Data Structure | Guide | Key Problems | Time Complexity |
|---|---|---|---|
| Array / Vector | N/A | Sorted array, sliding window, 2D problems | Access: O(1), Insert: O(n) |
| Singly Linked List | [Linked List Guide](./src/data-structures/singly-linked-list/problems/LINKED_LIST_GUIDE.md) 🟢 | Find middle, has cycle, reverse | Access: O(n), Insert: O(1)* |
| Doubly Linked List | [DLL FAANG Guide](./src/data-structures/doubly-linked-list/FAANG_DLL_PROBLEMS_GUIDE.md) 🟡 | LRU Cache, Deque, Browser history | Access: O(n), Insert: O(1)* |
| Stack | [Stack FAANG Guide](./src/data-structures/stack/problems/FAANG_STACK_PROBLEMS_GUIDE.md) 🔴 | Valid parentheses, min stack, monotonic | Push/Pop: O(1) |
| Queue | [Queue FAANG Guide](./src/data-structures/queue/FAANG_QUEUE_PROBLEMS_GUIDE.md) 🟡 | BFS, level-order, sliding window deque | Enqueue/Dequeue: O(1) |
| Hash Table/Map | [Hash Table Guide](./src/data-structures/hash-table/problems/HASH_TABLE_PROBLEMS_GUIDE.md) 🔴 | Two sum, group, frequency | Average: O(1) |
| Heap | [Heap FAANG Guide](./src/data-structures/heap/FAANG_HEAP_PROBLEMS_GUIDE.md) 🔴 | Kth largest, median streaming | Insert/Delete: O(log n) |
| Binary Tree | [Binary Tree FAANG Guide](./src/data-structures/binary-tree/FAANG_BINARY_TREE_PROBLEMS_GUIDE.md) 🟡 | Level-order, path sum, traversals | Search: O(n) |
| Binary Search Tree | [BST FAANG Guide](./src/data-structures/binary-search-tree/FAANG_BST_PROBLEMS_GUIDE.md) 🟡 | Validate, kth smallest, LCA | Average: O(log n) |
| Graph | [Graph Guide](./src/data-structures/graph/problems/GRAPH_PROBLEMS_GUIDE.md) 🟡 | Islands, paths, traversals (DFS/BFS) | DFS/BFS: O(V+E) |
| Trie | [Trie FAANG Guide](./src/data-structures/trie/FAANG_TRIE_PROBLEMS_GUIDE.md) 🟡 | Autocomplete, word search, prefix | Insert/Search: O(L) |

**Note:** *Time assumes you have a node reference. If searching for position first, add O(n).

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
- Bun SQLite with in-memory databases, strict named parameters, and transactions
- Token bucket rate limiter
- Sliding window rate limiter
- LRU cache
- Base62 URL-shortener IDs
- Snowflake-style distributed IDs

## Practice Workflow

1. Pick a topic from the map above.
2. Read the guide in that folder.
3. Generate one focused practice problem:

```bash
bun run practice
```

You can also list or choose directly:

```bash
bun run practice -- --list heap
bun run practice -- --problem 160
bun run practice -- --problem kth-largest-element
bun run practice -- --problem kthLargestElement
```

The list output includes each target's ID, slug, exported symbol, and source file. Use the slug or exported symbol when you want a repeatable command for a particular problem; use the ID for quick one-off selection from the current list.

4. Implement the generated file under `practice/`.
5. Run the exact focused test command printed by the generator.
6. Compare with `src/`.
7. Explain the pattern and complexity in your own words.

Use `bun run practice -- --all --clean` only when you intentionally want every practice file and every copied test. The default workflow keeps the practice folder focused on one selected problem so unrelated TODOs do not create noisy test failures.

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
|-- coverage/               # Generated coverage reports; not source material
|-- practice/               # Generated empty implementations and focused tests
|-- scripts/                # Bun automation, especially the practice generator
|-- src/
|   |-- typescript-concepts/ # Generics, unknown, satisfies, decorators
|   |-- javascript-concepts/ # Language fundamentals with runnable examples
|   |-- algorithms/
|   |   |-- README.md        # Algorithm study order and topic map
|   |   |-- arrays/          # Hash maps, two pointers, intervals, matrices
|   |   |-- backtracking/    # Choice trees, constraints, undo state
|   |   |-- bit-manipulation/ # XOR, masks, shifts
|   |   |-- dynamic-programming/
|   |   |-- interview-patterns/
|   |   |-- math-geometry/
|   |   |-- recursion/
|   |   |-- sorting/
|   |   `-- strings/
|   |-- data-structures/
|   |   |-- README.md        # Data-structure study order and topic map
|   |   |-- binary-search-tree/
|   |   |-- binary-tree/
|   |   |-- doubly-linked-list/
|   |   |-- graph/
|   |   |-- hash-table/
|   |   |-- heap/
|   |   |-- queue/
|   |   |-- singly-linked-list/
|   |   |-- stack/
|   |   `-- trie/
|   `-- node-concepts/       # Runtime, async, Bun, and system design examples
|-- package.json
|-- tsconfig.json
`-- README.md
```

## How To Navigate The Repo

Use these entry points instead of reading files alphabetically:

| Goal | Start here | Then run |
|---|---|---|
| Learn TypeScript best practices | `src/typescript-concepts/README.md` | `bun test src/typescript-concepts/test` |
| Learn a new algorithm pattern | `src/algorithms/README.md` | `bun test src/algorithms/tests` |
| Learn a data structure from scratch | `src/data-structures/README.md` | `bun test src/data-structures/tests` |
| Review JavaScript fundamentals | `src/javascript-concepts/README.md` | `bun test src/javascript-concepts/test` |
| Review Node, Bun, async, and system design | `src/node-concepts/README.md` | `bun test src/node-concepts/test` |
| Practice without seeing the answer | `practice/README.md` | `bun run practice` |

Inside each topic, read in this order: guide first, implementation second, test file third, generated practice last. The guides explain the mental model, implementations show the reference approach, tests define edge cases, and `practice/` gives you a clean room to rebuild it.

## Tooling

- Runtime: Bun
- Language: TypeScript 7 beta through `@typescript/native-preview`
- Typecheck command: `bun run typecheck`
- Test runner: Bun test
- Formatter/linter: Biome
- Docs baseline: official MDN, Node.js, Bun, and TC39 references linked above

## Quality Rules For New Problems

Every new interview problem should include:

- Reference implementation in the correct topic folder.
- Tests in the matching test file.
- JSDoc explaining pattern, time complexity, and space complexity.
- Edge cases in tests.
- A short guide entry when the pattern is new.

This keeps the repo useful even when you have never seen the problem before.
