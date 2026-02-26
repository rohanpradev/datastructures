# 🧠 Recursion Patterns – Practice Guide

## Overview

This guide explains **recursion as a problem-solving technique**, not just through Fibonacci, but through multiple recursive problem types:

* Linear recursion (Fibonacci)
* Tree recursion (subset / branching problems)
* Depth-based recursion (Product Sum)
* Grid / flood-fill recursion (Minesweeper-style problems)

The goal is to understand:

* ✅ Base cases
* ✅ Recursive cases
* ✅ Recursion trees
* ✅ Stack behavior
* ✅ When to use memoization
* ✅ When to convert to iteration

---

# What is Recursion?

Recursion is when a function **calls itself** to solve smaller versions of the same problem.

### Core Structure

```
function solve(problem):
    if base case:
        return answer

    reduce problem
    return solve(smaller problem)
```

Every recursive function has:

1. **Base case** → stops recursion
2. **Recursive case** → reduces the problem
3. **Progress toward base case** → prevents infinite loops

---

# Pattern 1: Linear Recursion (Fibonacci Example)

## Problem Type

Each call makes **1 or 2 smaller calls**.

### Example: Fibonacci

```
F(n) = F(n-1) + F(n-2)
```

### Recursion Tree

```
fib(4)
├─ fib(3)
│  ├─ fib(2)
│  └─ fib(1)
└─ fib(2)
```

### What This Teaches

* Recursion tree growth
* Overlapping subproblems
* Why memoization helps

### Complexity

```
Naive: O(2^n)
Memoized: O(n)
```

---

# Pattern 2: Depth-Based Recursion (Product Sum)

## Problem Type

Each recursive level depends on its **depth**.

### Example

```
[1, [2, 3], [4, [5]]]
```

Each nested level increases multiplier.

### Recursive Thinking

```
At each level:
1. Compute subtotal
2. Call recursion for nested arrays
3. Apply multiplier once
```

### What This Teaches

* Managing state per depth
* Avoiding shared mutable state
* Clean return-based aggregation

### Complexity

```
Time: O(n)
Space: O(d)  (depth of nesting)
```

---

# Pattern 3: Grid / Flood Fill Recursion (Minesweeper Style)

## Problem Type

Explore neighboring cells recursively.

### Example

Revealing empty cells in Minesweeper:

```
If cell has 0 adjacent mines:
    reveal neighbors
```

### Visual Expansion

```
Click:
0 0 1
0 1 M
0 1 1

Recursion spreads until boundary of numbers.
```

### What This Teaches

* Boundary checking
* Preventing infinite recursion
* Marking visited nodes
* 8-direction traversal

### Complexity

```
Worst case: O(rows × cols)
```

Each cell visited once.

---

# Pattern 4: Backtracking Recursion

## Problem Type

Explore all possible paths.

### Example Problems

* Subsets
* Permutations
* Combination sum
* N-Queens

### Structure

```
function backtrack(state):
    if solution found:
        store result
        return

    for each choice:
        choose
        backtrack(new state)
        undo choice
```

### What This Teaches

* Decision trees
* Exploring search space
* Undoing state (backtracking step)

---

# Core Recursion Concepts

## 1️⃣ Recursion Tree

Every recursive function forms a tree:

* Nodes = function calls
* Edges = recursive calls
* Leaves = base cases

Understanding the tree helps you analyze complexity.

---

## 2️⃣ Call Stack

Each recursive call adds a frame:

```
main()
  → solve(3)
    → solve(2)
      → solve(1)
```

Stack depth = maximum recursion depth.

Too deep → stack overflow.

---

## 3️⃣ Overlapping Subproblems

If the same inputs are computed multiple times:

```
fib(3) called twice
```

Use memoization.

---

## 4️⃣ When NOT to Use Recursion

* Extremely deep recursion (stack overflow risk)
* When iterative solution is clearer
* When constant space is required

---

# Converting Recursion to Iteration

## Example Pattern

Recursive:

```
solve(n):
    if base:
        return
    solve(n-1)
```

Iterative equivalent:

```
for i from n down to base:
    process
```

Many recursive problems can be rewritten using:

* Stack
* Queue
* Loop

---

# Recursion vs Memoization vs Iteration

| Approach           | Time Complexity   | Space Complexity | Use Case                |
| ------------------ | ----------------- | ---------------- | ----------------------- |
| Naive Recursion    | Often exponential | O(depth)         | Learning                |
| Memoized Recursion | Usually O(n)      | O(n)             | Overlapping subproblems |
| Iterative (DP)     | O(n)              | O(1) possible    | Production              |

---

# Recursion Problem Checklist

Before writing recursive code, ask:

```
1. What is the smallest input? (base case)
2. How do I reduce the problem?
3. Does each call move toward the base case?
4. Is there repeated work?
5. What is the maximum depth?
```

---

# Common Mistakes

### ❌ Missing Base Case

```
function f(n):
    return f(n-1)  // infinite recursion
```

---

### ❌ Not Progressing Toward Base

```
function f(n):
    return f(n)  // no change
```

---

### ❌ Shared Mutable State

Avoid using global variables for accumulation.

Prefer:

```
return recursive_result + current_value
```

---

### ❌ Forgetting to Mark Visited (Graph / Grid Problems)

Can cause infinite loops.

---

# Recursion Complexity Quick Guide

## If each call makes:

* 1 call → O(n)
* 2 calls → O(2^n)
* Branching factor b → O(b^n)
* Divide by 2 each time → O(log n)

---

# Practice Problem Categories

### 🔹 Linear Recursion

* Factorial
* Fibonacci
* Sum of array

### 🔹 Tree Recursion

* Subsets
* Permutations
* Combination Sum

### 🔹 Depth-Based

* Product Sum
* Nested JSON traversal

### 🔹 Grid / Graph

* Minesweeper reveal
* Flood fill
* Number of islands

---

# Advanced Topics

* Tail recursion
* Memoization patterns
* Dynamic Programming (top-down vs bottom-up)
* Matrix exponentiation
* Backtracking pruning

---

# Testing Strategy for Recursive Problems

Always test:

```
✓ Smallest input (base case)
✓ Typical case
✓ Large input
✓ Edge cases
✓ Deep nesting
✓ Empty input
✓ Invalid input
```

For grid problems:

```
✓ Corner cell
✓ Edge cell
✓ Center cell
✓ Fully empty grid
✓ Fully filled grid
```

---
