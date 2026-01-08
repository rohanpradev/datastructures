datastructures/README.md#L1-999
# Data Structures & Algorithms - Complete Learning Workspace 
[![CI](https://github.com/rohanpradev/datastructures/actions/workflows/ci.yml/badge.svg)](https://github.com/rohanpradev/datastructures/actions/workflows/ci.yml)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/06b59555-ad3f-49c5-95b3-919f81170e14" />

A comprehensive DSA workspace with **1,919 passing tests**, detailed practice guides, and automated template generation for hands-on learning. Also includes Node.js design patterns.

---

##  Comprehensive Learning Guides

This workspace includes **11 detailed guides** with visual explanations:

### Data Structures
-  [`src/data-structures/binary-search-tree/problems/BST_PROBLEMS_GUIDE.md`](src/data-structures/binary-search-tree/problems/BST_PROBLEMS_GUIDE.md)
-  [`src/data-structures/hash-table/problems/HASH_TABLE_PROBLEMS_GUIDE.md`](src/data-structures/hash-table/problems/HASH_TABLE_PROBLEMS_GUIDE.md)
-  [`src/data-structures/singly-linked-list/problems/LINKED_LIST_GUIDE.md`](src/data-structures/singly-linked-list/problems/LINKED_LIST_GUIDE.md)
-  [`src/data-structures/stack/problems/STACK_PROBLEMS_GUIDE.md`](src/data-structures/stack/problems/STACK_PROBLEMS_GUIDE.md)
-  [`src/data-structures/graph/problems/GRAPH_PROBLEMS_GUIDE.md`](src/data-structures/graph/problems/GRAPH_PROBLEMS_GUIDE.md)
-  [`src/data-structures/heap/HEAP_GUIDE.md`](src/data-structures/heap/HEAP_GUIDE.md)

### Algorithms
-  [`src/algorithms/arrays/ARRAY_EXERCISES_GUIDE.md`](src/algorithms/arrays/ARRAY_EXERCISES_GUIDE.md)
-  [`src/algorithms/arrays/ARRAY_PROBLEMS_GUIDE.md`](src/algorithms/arrays/ARRAY_PROBLEMS_GUIDE.md)
-  [`src/algorithms/strings/STRING_EXERCISES_GUIDE.md`](src/algorithms/strings/STRING_EXERCISES_GUIDE.md)
-  [`src/algorithms/recursion/FIBONACCI_GUIDE.md`](src/algorithms/recursion/FIBONACCI_GUIDE.md)
-  [`src/algorithms/sorting/SORTING_GUIDE.md`](src/algorithms/sorting/SORTING_GUIDE.md)

**Each guide includes:**
-  Visual ASCII diagrams
-  Step-by-step walkthroughs
-  Complexity analysis
-  Common pitfalls
-  Implementation hints
-  Test strategies

---

##  Quick Start

### Installation

```datastructures/README.md#L101-106
bun install
```

### Available Commands

```datastructures/README.md#L110-120
# Generate practice templates (empty implementations)
bun practice

# Run all tests (1,919 tests)
bun test

# Check code quality with Biome
bun check

# Run development server
bun dev
```

---

##  Learning Workflow

### 1. Read a Guide
Choose any topic and read the comprehensive guide:
```datastructures/README.md#L130-136
# Array problems with visual explanations
cat src/algorithms/arrays/ARRAY_EXERCISES_GUIDE.md

# BST problems with tree diagrams
cat src/data-structures/binary-search-tree/problems/BST_PROBLEMS_GUIDE.md
```

### 2. Generate Practice Templates
Create empty implementations to practice:
```datastructures/README.md#L142-146
bun practice
# Creates `practice/` directory with empty function stubs
```

### 3. Implement Solutions
Follow the guide to implement functions in `practice/` directory.

### 4. Validate with Tests
```datastructures/README.md#L154-156
# Run tests for a specific module
bun test src/algorithms/arrays/array-exercises.test.ts
```

### 5. Compare with Reference
Check `src/` for reference implementations.

---

##  What'\''s Included

### Data Structures (6)
`Binary Search Tree`  `Hash Table`  `Linked List`  `Stack & Queue`  `Graph`  `Heap`

### Algorithm Categories (3)
`Array Exercises` (many problems)  `Sorting` (multiple algorithms)  `Recursion & DP`

### LeetCode Problems (50+)
All tagged with LeetCode numbers for easy reference.

### Node js Concepts and Patterns
Generator functions, Promises, Async

### Test Coverage
```datastructures/README.md#L180-188
 1,919 tests passing
 23 test files
 Zero TypeScript errors
 100% type safety (where applicable)
```

---

##  Project Structure

```datastructures/README.md#L200-260
DSA/
 README.md                          This file
 package.json
 tsconfig.json
 biome.json

 src/                               Reference implementations
    algorithms/
       arrays/
          array-exercises.ts
          ARRAY_EXERCISES_GUIDE.md 
          array-problems.ts
          ARRAY_PROBLEMS_GUIDE.md 
       strings/
          string-exercises.ts
          STRING_EXERCISES_GUIDE.md 
       recursion/
          FIBONACCI_GUIDE.md 
       sorting/
           SORTING_GUIDE.md 
   
    data-structures/
        binary-search-tree/problems/
           BST_PROBLEMS_GUIDE.md 
        hash-table/problems/
           HASH_TABLE_PROBLEMS_GUIDE.md 
        singly-linked-list/problems/
           LINKED_LIST_GUIDE.md 
        stack/problems/
           STACK_PROBLEMS_GUIDE.md 
        graph/problems/
           GRAPH_PROBLEMS_GUIDE.md 
        heap/
            HEAP_GUIDE.md 

 scripts/
    generate-practice.ts           Uses Bun native file I/O

 practice/                           Generated by `bun practice`
     (empty implementations + tests)
```

---

##  Learning Paths

###  Beginner
1. Array Exercises (removeElement, findMaxMin)
2. Linked List (Fast & slow pointers)
3. Stack & Queue (Basic operations)
4. Sorting (Bubble, Selection, Insertion)

###  Intermediate
1. BST Problems (Validate, LCA)
2. Hash Table (Two sum, Anagrams)
3. Recursion/DP (Fibonacci variants)
4. Sorting (Merge, Quick sort)

###  Advanced
1. Graph (DFS, BFS, Cycle detection)
2. Heap (Kth largest, Merge K lists)
3. BST (Delete node, Range queries)
4. Hash Table (Longest consecutive)

---

##  Key Features

### Comprehensive Guides
- Visual ASCII diagrams
- Detailed complexity analysis
- Common mistakes section
- Step-by-step implementation
- Real-world use cases

### Practice System
```datastructures/README.md#L320-322
bun practice
```
- Extracts function signatures automatically
- Generates empty implementations
- Preserves test files
- Uses Bun's native file I/O (`Bun.file()`, `Bun.write()`)

### Code Quality
- Biome linter/formatter v2.3.6
- TypeScript strict mode
- Comprehensive test coverage

---

##  Testing

### Run All Tests
```datastructures/README.md#L340-342
bun test  # 1,919 tests
```

### Run Specific Tests
```datastructures/README.md#L346-350
bun test src/data-structures/binary-search-tree/binarySearchTree.test.ts
bun test src/algorithms/sorting/sortingAlgorithms.test.ts
```

---

##  Complexity Quick Reference

### Time Complexities
```datastructures/README.md#L360-368
O(1)       - Hash table lookup
O(log n)   - Binary search, BST
O(n)       - Array traversal
O(n log n) - Merge sort, Quick sort
O(n^2)     - Bubble sort
O(2^n)     - Naive Fibonacci
```

### Data Structure Operations
```datastructures/README.md#L376-396
Structure    | Access  | Search  | Insert  | Delete
-------------|---------|---------|---------|--------
Array        | O(1)    | O(n)    | O(n)    | O(n)
Linked List  | O(n)    | O(n)    | O(1)*   | O(1)*
Stack/Queue  | O(n)    | O(n)    | O(1)    | O(1)
Hash Table   | N/A     | O(1)    | O(1)    | O(1)
BST          | O(log n)| O(log n)| O(log n)| O(log n)
Heap         | N/A     | O(n)    | O(log n)| O(log n)

* With pointer to position
```

---

##  Technologies

- **Runtime:** [Bun](https://bun.sh) v1.3.1+
- **Language:** TypeScript (strict mode)
- **Testing:** Bun test runner
- **Linting:** Biome v2.3.6
- **File I/O:** Bun native APIs

---

##  Resources

### LeetCode Problems Included
- BST: 98, 235, 226, 230, 108, 938, 450
- Hash Table: 1, 49, 217, 242, 128, 560
- Linked List: 876, 92, 86, 21
- Stack/Queue: 20, 232, 155
- Graph: 200, 207, 133, 1091, 417
- Arrays: 27, 26, 121, 189, 53

### Visualization Tools
- [VisuAlgo](https://visualgo.net/)
- [Algorithm Visualizer](https://algorithm-visualizer.org/)
- [Data Structure Visualizations](https://www.cs.usfca.edu/~galles/visualization/)

---

##  Stats

- **Problems:** 451 (each `describe()` block in tests maps to a problem / scenario)
- **Tests:** 1,919 individual test cases (`test()` calls)
- **Test Files:** 23
- **Guides:** 11
- **Documentation:** 5,000+ lines

Note: I keep the README's counts in sync with the repository's test-suite and guides. If you add or remove problems/tests, re-run a quick count of `describe()` / `test()` occurrences to update the numbers above.

---

##  Perfect For

- Technical interview prep  
- Algorithm mastery  
- Data structure understanding  
- Problem-solving practice  

---

**Happy Coding!**

---

*Last Updated: January 2026*
