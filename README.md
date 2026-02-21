# Data Structures & Algorithms (DSA) in TypeScript — Bun-Powered Learning Workspace

[![CI](https://github.com/rohanpradev/datastructures/actions/workflows/ci.yml/badge.svg)](https://github.com/rohanpradev/datastructures/actions/workflows/ci.yml)
[![Biome](https://img.shields.io/badge/Code_Quality-Biome-60a5fa?logo=biome)](https://biomejs.dev)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?logo=typescript\&logoColor=white)]()
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?logo=bun\&logoColor=white)]()

<img width="1024" alt="DSA Workspace Banner" src="https://github.com/user-attachments/assets/06b59555-ad3f-49c5-95b3-919f81170e14" />

**A comprehensive Data Structures & Algorithms workspace in TypeScript**, powered by **Bun**, featuring **1,900+ tests**, visual learning guides, automated practice generation, and interview-ready solutions.

Perfect for **coding interviews**, **algorithm mastery**, and **deep DSA understanding**.

---

## 📌 Table of Contents

* [Features](#features)
* [Learning Guides](#learning-guides)

  * [Data Structures](#data-structures)
  * [Algorithms](#algorithms)
  * [Node/Bun Concepts](#nodebun-concepts)
* [Quick Start](#quick-start)
* [Learning Workflow](#learning-workflow)
* [Project Structure](#project-structure)
* [Learning Paths](#learning-paths)
* [Testing & Quality](#testing--quality)
* [Complexity Reference](#complexity-reference)
* [Technologies](#technologies)
* [Stats](#stats)
* [Ideal For](#ideal-for)

---

## 🚀 Features

* ✅ **451+ DSA problems**
* ✅ **1,919 passing test cases**
* ✅ **11 visual learning guides**
* ✅ **Bun-powered practice template generator**
* ✅ **TypeScript (strict mode)**
* ✅ **Biome linting & formatting**
* ✅ **LeetCode-tagged problems**
* ✅ **Beginner → Advanced learning paths**

---

## 📚 Learning Guides

### Data Structures

* [Binary Search Tree Guide](/src/data-structures/binary-search-tree/problems/BST_PROBLEMS_GUIDE.md)
* [Hash Table Guide](/src/data-structures/hash-table/problems/HASH_TABLE_PROBLEMS_GUIDE.md)
* [Linked List Guide](/src/data-structures/singly-linked-list/problems/LINKED_LIST_GUIDE.md)
* [Stack Guide](/src/data-structures/stack/problems/STACK_PROBLEMS_GUIDE.md)
* [Graph Guide](/src/data-structures/graph/problems/GRAPH_PROBLEMS_GUIDE.md)
* [Heap Guide](/src/data-structures/heap/HEAP_GUIDE.md)

### Algorithms

* [Array Exercises](/src/algorithms/arrays/ARRAY_EXERCISES_GUIDE.md)
* [Array Problems](/src/algorithms/arrays/ARRAY_PROBLEMS_GUIDE.md)
* [Dynamic Programming](/src/algorithms/dynamic-programming/DYNAMIC_PROGRAMMING_GUIDE.md)
* [String Exercises](/src/algorithms/strings/STRING_EXERCISES_GUIDE.md)
* [Recursion & Fibonacci](/src/algorithms/recursion/FIBONACCI_GUIDE.md)
* [Sorting Algorithms](/src/algorithms/sorting/SORTING_GUIDE.md)

### Node/Bun Concepts

* [Node Concepts](/src/node-concepts/README.md)

> Each guide includes ASCII diagrams, complexity analysis, pitfalls, and test strategies.

---

## ⚡ Quick Start

### Install Dependencies

```bash
bun install
```

### Common Commands

```bash
bun practice   # Generate empty practice templates
bun test       # Run all tests (1,919)
bun check      # Lint & format with Biome
bun dev        # Run development server
```

---

## 🧠 Learning Workflow

1. **Read a Guide**

   ```bash
   cat /src/algorithms/arrays/ARRAY_EXERCISES_GUIDE.md
   ```

2. **Generate Practice Templates**

   ```bash
   bun practice
   ```

3. **Implement Solutions**

   * Work inside the `practice/` directory

4. **Run Tests**

   ```bash
   bun test /src/algorithms/arrays/array-exercises.test.ts
   ```

5. **Compare with Reference**

   * Check implementations in `src/`

---

## 🗂 Project Structure

```
DSA/
├─ src/                # Reference implementations
│  ├─ algorithms/
│  ├─ data-structures/
│  └─ node-concepts/
├─ practice/           # Generated practice workspace
├─ scripts/            # Bun automation scripts
├─ README.md
└─ package.json
```

---

## 🛤 Learning Paths

### Beginner

* Arrays
* Linked Lists
* Stack & Queue
* Basic Sorting

### Intermediate

* Binary Search Trees
* Hash Tables
* Recursion & DP
* Merge & Quick Sort

### Advanced

* Graph Algorithms
* Heap-based Problems
* Advanced BST Operations
* Optimized Hash Table Patterns

---

## 🧪 Testing & Quality

```bash
bun test
```

* 1,919 passing tests
* 23 test files
* Zero TypeScript errors
* Biome-enforced formatting

---

## ⏱ Complexity Reference

### Time Complexity

```
O(1)       Hash table lookup
O(log n)   Binary search
O(n)       Linear traversal
O(n log n) Merge sort
O(n²)      Bubble sort
O(2ⁿ)      Naive recursion
```

---

## 🛠 Technologies

* **Language:** TypeScript (Strict)
* **Runtime:** Bun
* **Testing:** Bun Test Runner
* **Linting:** Biome
* **File I/O:** Bun native APIs

---

## 📊 Stats

* **Problems:** 451
* **Tests:** 1,919
* **Guides:** 11
* **Test Files:** 23
* **Docs:** 5,000+ lines

---

## 🎯 Ideal For

* Coding interview preparation
* Data structures & algorithms mastery
* TypeScript developers
* Performance-focused learners

---

**Happy Coding 🚀**

*Last Updated: January 2026*

---
