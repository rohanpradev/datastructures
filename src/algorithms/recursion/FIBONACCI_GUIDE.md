# Fibonacci - Practice Guide

## Overview

This guide covers three different approaches to computing Fibonacci numbers, each with different time and space complexity trade-offs. Understanding these implementations teaches fundamental concepts in recursion, dynamic programming, and optimization.

---

## What is Fibonacci Sequence?

The Fibonacci sequence is: **0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55...**

### Definition

```
F(0) = 0
F(1) = 1
F(n) = F(n-1) + F(n-2) for n > 1
```

### Visual Pattern

```
Index:  0  1  2  3  4  5  6   7   8   9   10
Value:  0  1  1  2  3  5  8  13  21  34  55
        ↑  ↑  └──┴─→ Sum
        │  │
      Base Cases
```

---

## Problem 1: Naive Recursive Implementation

### Problem Statement

Implement Fibonacci using direct recursion following the mathematical definition.

### Visual Explanation - Recursion Tree

```
                    fib(5)
                   /      \
              fib(4)      fib(3)
             /     \      /     \
        fib(3)  fib(2)  fib(2)  fib(1)
        /   \    /  \    /  \
   fib(2) fib(1) ...  ...  ...
    /  \
fib(1) fib(0)

Notice: fib(3) is calculated TWICE!
        fib(2) is calculated THREE times!
        → Massive redundant computation
```

### Example Walkthrough

```
fib(4) execution:

fib(4)
├─ fib(3)
│  ├─ fib(2)
│  │  ├─ fib(1) → 1
│  │  └─ fib(0) → 0
│  │  = 1
│  └─ fib(1) → 1
│  = 2
└─ fib(2)
   ├─ fib(1) → 1
   └─ fib(0) → 0
   = 1
= 3

Total function calls: 9 calls for just fib(4)!
```

### Algorithm

```
1. Base case: if n ≤ 1, return n
2. Recursive case: return fib(n-1) + fib(n-2)
```

### Implementation Steps

```typescript
export function fibonacci(n: number): number {
  // TODO: Handle base cases (n = 0 or n = 1)
  // TODO: Recursive case: return fib(n-1) + fib(n-2)
}
```

### Complexity Analysis

```
Time: O(2^n) - exponential!
├─ Each call makes 2 recursive calls
├─ Forms a binary tree of depth n
└─ Total nodes ≈ 2^n

Space: O(n) - recursion stack depth
├─ Maximum depth of call stack = n
└─ Each call adds one frame to stack

Growth rate for fib(n):
n=5  →  15 calls
n=10 →  177 calls
n=20 →  21,891 calls
n=30 →  2,692,537 calls
n=40 →  331,160,281 calls (very slow!)
```

### When to Use

- ❌ **Never in production** (too slow)
- ✅ Educational purposes
- ✅ Understanding recursion concepts

---

## Problem 2: Memoized Recursive (Top-Down Dynamic Programming)

### Problem Statement

Optimize the recursive solution by caching previously computed results.

### Visual Explanation - Memoization

```
Without Memo:               With Memo:
    fib(5)                     fib(5)
   /      \                   /      \
fib(4)   fib(3)            fib(4)   fib(3) ← cached!
  /  \     /  \              /  \
...  ... ...  ...          ...  ...

Memo = { 0: 0, 1: 1, 2: 1, 3: 2, 4: 3, 5: 5 }
```

### Example Walkthrough

```
fibMemo(5) with memo = {}

Call 1: fibMemo(5)
├─ Not in memo
├─ Calculate: fibMemo(4) + fibMemo(3)
│
├─ Call fibMemo(4)
│  ├─ Not in memo
│  ├─ Calculate: fibMemo(3) + fibMemo(2)
│  │
│  ├─ Call fibMemo(3)
│  │  ├─ Not in memo
│  │  ├─ Calculate: fibMemo(2) + fibMemo(1)
│  │  │  ├─ fibMemo(2) = 1 (computed)
│  │  │  └─ fibMemo(1) = 1 (base case)
│  │  ├─ Result: 2
│  │  └─ Store memo[3] = 2 ✓
│  │
│  ├─ Call fibMemo(2)
│  │  └─ Found in memo! → 1 ✓
│  │
│  ├─ Result: 3
│  └─ Store memo[4] = 3 ✓
│
├─ Call fibMemo(3)
│  └─ Found in memo! → 2 ✓ (no recomputation!)
│
├─ Result: 5
└─ Store memo[5] = 5 ✓

Total calls: ~10 (vs 15 without memo)
Each value computed exactly once!
```

### Algorithm

```
1. Check if n is in memo
   - If yes: return cached value
2. Base case: if n ≤ 1, return n
3. Recursive case:
   - Compute result = fibMemo(n-1) + fibMemo(n-2)
   - Store in memo[n] = result
   - Return result
```

### Implementation Steps

```typescript
export function fibonacciMemo(
  n: number,
  memo: Map<number, number> = new Map(),
): number {
  // TODO: Check if n is in memo, return if found
  // TODO: Handle base cases (n = 0 or n = 1)
  // TODO: Compute result recursively
  // TODO: Store result in memo
  // TODO: Return result
}
```

### Complexity Analysis

```
Time: O(n)
├─ Each Fibonacci number computed exactly once
├─ Cached lookups are O(1)
└─ Total: n unique values to compute

Space: O(n)
├─ Memo map stores n values: O(n)
├─ Recursion stack depth: O(n)
└─ Total: O(n) + O(n) = O(n)

Performance comparison:
fib(40) naive:     ~5 seconds
fib(40) memo:      <1 millisecond
fib(100) memo:     <1 millisecond
```

### When to Use

- ✅ When recursive structure is preferred
- ✅ Medium-sized inputs (n < 10,000)
- ✅ Problems with overlapping subproblems
- ❌ Very large n (stack overflow risk)

---

## Problem 3: Bottom-Up Iterative (Dynamic Programming)

### Problem Statement

Compute Fibonacci iteratively, building from base cases up to the target.

### Visual Explanation

```
Target: fib(6)

Build up from bottom:

Step 0: F(0) = 0, F(1) = 1
        [0, 1]
         ↑  ↑
       prev current

Step 1: F(2) = F(1) + F(0) = 1 + 0 = 1
        [0, 1, 1]
            ↑  ↑
          prev current

Step 2: F(3) = F(2) + F(1) = 1 + 1 = 2
        [0, 1, 1, 2]
               ↑  ↑
             prev current

Step 3: F(4) = F(3) + F(2) = 2 + 1 = 3
        [0, 1, 1, 2, 3]
                  ↑  ↑
                prev current

Step 4: F(5) = F(4) + F(3) = 3 + 2 = 5
        [0, 1, 1, 2, 3, 5]
                     ↑  ↑
                   prev current

Step 5: F(6) = F(5) + F(4) = 5 + 3 = 8
        [0, 1, 1, 2, 3, 5, 8]
                        ↑  ↑
                      prev current

Result: 8
```

### Space-Optimized Approach

```
We only need last 2 values!

n = 6, want F(6)

Initialize:
prev = 0      (F(0))
current = 1   (F(1))

i = 2:
next = prev + current = 0 + 1 = 1
prev = current = 1
current = next = 1

i = 3:
next = 1 + 1 = 2
prev = 1, current = 2

i = 4:
next = 1 + 2 = 3
prev = 2, current = 3

i = 5:
next = 2 + 3 = 5
prev = 3, current = 5

i = 6:
next = 3 + 5 = 8
prev = 5, current = 8

Return current = 8
```

### Algorithm

```
1. Base case: if n ≤ 1, return n
2. Initialize prev = 0, current = 1
3. For i from 2 to n:
   - next = prev + current
   - prev = current
   - current = next
4. Return current
```

### Implementation Steps

```typescript
export function fibonacciBottomUp(n: number): number {
  // TODO: Handle base cases (n = 0 or n = 1)
  // TODO: Initialize prev = 0, current = 1
  // TODO: Loop from i = 2 to n
  // TODO: Calculate next = prev + current
  // TODO: Shift window: prev = current, current = next
  // TODO: Return current
}
```

### Complexity Analysis

```
Time: O(n)
└─ Single loop from 2 to n

Space: O(1)
└─ Only 3 variables (prev, current, next)

This is the BEST approach!
- Fastest execution
- Least memory
- No recursion overhead
- No stack overflow risk
```

### When to Use

- ✅ **Production code** (best choice!)
- ✅ Large inputs (n > 10,000)
- ✅ Space-constrained environments
- ✅ When performance is critical

---

## Comparison of All Three Approaches

### Side-by-Side Comparison

```
Problem: Compute F(10) = 55

┌──────────────┬─────────────┬──────────────┬──────────────┐
│   Approach   │    Time     │    Space     │    Calls     │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ Naive        │ O(2^n)      │ O(n)         │ 177 calls    │
│ Recursive    │ ~0.1ms      │ stack depth  │              │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ Memoized     │ O(n)        │ O(n)         │ 11 calls     │
│ Recursive    │ <0.01ms     │ map + stack  │              │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ Bottom-Up    │ O(n)        │ O(1)         │ 9 iterations │
│ Iterative    │ <0.01ms     │ 3 variables  │              │
└──────────────┴─────────────┴──────────────┴──────────────┘
```

### Performance for fib(40)

```
Naive Recursive:    ~5000 ms ❌
Memoized:           <1 ms    ✓
Bottom-Up:          <1 ms    ✓✓ (fastest)
```

### Visual Decision Tree

```
Need to compute Fibonacci?
│
├─ Learning recursion? → Naive Recursive
│
├─ Need recursive structure? → Memoized
│
└─ Production code? → Bottom-Up Iterative ✓
```

---

## Bonus: Fibonacci Array

### Problem Statement

Return an array containing all Fibonacci numbers from F(0) to F(n).

### Visual Explanation

```
Input: n = 6
Output: [0, 1, 1, 2, 3, 5, 8]

Build process:
fib = [0, 1]  ← base cases

i = 2: fib[2] = fib[1] + fib[0] = 1
       fib = [0, 1, 1]

i = 3: fib[3] = fib[2] + fib[1] = 2
       fib = [0, 1, 1, 2]

i = 4: fib[4] = fib[3] + fib[2] = 3
       fib = [0, 1, 1, 2, 3]

i = 5: fib[5] = fib[4] + fib[3] = 5
       fib = [0, 1, 1, 2, 3, 5]

i = 6: fib[6] = fib[5] + fib[4] = 8
       fib = [0, 1, 1, 2, 3, 5, 8]
```

### Algorithm

```
1. Handle base cases (n = 0 or n = 1)
2. Initialize array with [0, 1]
3. For i from 2 to n:
   - fib[i] = fib[i-1] + fib[i-2]
4. Return array
```

### Implementation Steps

```typescript
export function fibonacciArray(n: number): number[] {
  // TODO: Handle n = 0, return [0]
  // TODO: Handle n = 1, return [0, 1]
  // TODO: Initialize array with [0, 1]
  // TODO: Loop from i = 2 to n
  // TODO: Calculate fib[i] = fib[i-1] + fib[i-2]
  // TODO: Return array
}
```

### Complexity

- **Time:** O(n)
- **Space:** O(n) - stores all values

---

## Mathematical Properties of Fibonacci

### Golden Ratio

```
As n increases, F(n+1) / F(n) approaches φ (phi):

φ = (1 + √5) / 2 ≈ 1.618033988749895

Example:
F(10) / F(9) = 55 / 34 ≈ 1.617647
F(20) / F(19) = 6765 / 4181 ≈ 1.618034
F(30) / F(29) ≈ 1.618034 (very close!)
```

### Interesting Patterns

```
Every 3rd Fibonacci number is even:
F(0)=0 ✓, F(3)=2 ✓, F(6)=8 ✓, F(9)=34 ✓

Sum of first n Fibonacci numbers:
F(0) + F(1) + ... + F(n) = F(n+2) - 1

Example: 0+1+1+2+3+5 = 12 = F(7)-1 = 13-1 ✓
```

---

## Practice Exercises

### Exercise 1: Identify Efficiency

```
Which implementation should you use for:
a) Computing F(5)?
b) Computing F(100)?
c) Computing F(1000)?
d) Computing all F(0) to F(50)?
```

### Exercise 2: Modify Implementations

```
1. Modify naive recursive to print each call
2. Add call counter to memoized version
3. Make bottom-up return both F(n) and F(n-1)
```

### Exercise 3: Related Problems

```
1. Tribonacci: T(n) = T(n-1) + T(n-2) + T(n-3)
2. Fibonacci with different base cases
3. Find nth Fibonacci in O(log n) using matrix exponentiation
```

---

## Common Mistakes to Avoid

### ❌ Don't Do This

```typescript
// Mistake 1: Not handling base cases
function fib(n: number): number {
  return fib(n - 1) + fib(n - 2); // Stack overflow!
}

// Mistake 2: Creating new memo each call
function fibMemo(n: number): number {
  const memo = new Map(); // ❌ Recreated every call!
  // ...
}

// Mistake 3: Not normalizing negative n
function fibBottomUp(n: number): number {
  // What if n < 0? Should validate!
}
```

### ✅ Do This

```typescript
// Proper base case handling
if (n <= 1) return n;

// Pass memo as parameter
function fibMemo(n: number, memo = new Map()) {}

// Validate input
if (n < 0) throw new Error("n must be non-negative");
```

---

## Testing Strategy

### Test Cases to Include

```typescript
✓ Base cases: F(0) = 0, F(1) = 1
✓ Small values: F(5), F(10)
✓ Medium values: F(20), F(30)
✓ Large values: F(50), F(100) (for optimized versions)
✓ Edge cases: negative numbers (should error)

✓ Compare all three implementations for n ≤ 15
✓ Verify golden ratio property for large n
✓ Check every 3rd number is even
```

---

## Problem 4: Product Sum (Recursive Depth-Based Aggregation)

### Problem Statement

Given a potentially nested array of numbers, compute its **product sum**.

The product sum is defined as:

- The sum of all elements in the array
- Where each nested array’s sum is multiplied by its **depth level**
- The top-level array has a depth (multiplier) of **1**
- Each level of nesting increases the multiplier by **1**

---

### Visual Explanation – Depth-Based Multipliers

```
Array: [1, [2, 3], [4, [5]]]

Depth 1 (×1):
└─ 1

Depth 2 (×2):
└─ [2, 3]
└─ [4, [5]]

Depth 3 (×3):
└─ [5]
```

Calculation:

```
1
+ (2 + 3) * 2
+ (4 + (5 * 3)) * 2
= 1 + 10 + 26
= 37
```

---

### Example Walkthrough

```
productSum([1, [2, 3], [4, [5]]], multiplier = 1)

Call 1: productSum([1, [2, 3], [4, [5]]], 1)
├─ sum = 0
├─ value = 1 → sum = 1
│
├─ value = [2, 3]
│  └─ Call productSum([2, 3], 2)
│     ├─ sum = 2 + 3 = 5
│     └─ return 5 * 2 = 10
│
├─ value = [4, [5]]
│  └─ Call productSum([4, [5]], 2)
│     ├─ sum = 4
│     ├─ value = [5]
│     │  └─ Call productSum([5], 3)
│     │     └─ return 5 * 3 = 15
│     └─ return (4 + 15) * 2 = 38
│
└─ return (1 + 10 + 38) * 1 = 49
```

> Each recursive call computes **only its own level’s sum**, then applies the multiplier **once** before returning.

---

### Algorithm

```
1. Initialize sum = 0
2. Iterate through each value in the array
   - If value is a number:
     - Add it to sum
   - If value is an array:
     - Recursively compute product sum with multiplier + 1
     - Add result to sum
3. Multiply sum by the current multiplier
4. Return the result
```

---

### Implementation Steps

```typescript
export function productSum(
  nums: (number | number[])[],
  multiplier: number = 1,
): number {
  // TODO: Initialize a local sum for this depth level
  // TODO: Iterate through each element in nums
  //   - If number: add to sum
  //   - If array: recursively call productSum with multiplier + 1
  // TODO: Apply multiplier to sum
  // TODO: Return final result
}
```

---

### Complexity Analysis

```
Time: O(n)
├─ Each number is visited exactly once
├─ No repeated computation
└─ Total elements (including nested) = n

Space: O(d)
├─ Recursion stack depth = maximum nesting depth (d)
├─ No additional data structures
└─ Total auxiliary space = O(d)
```

---

### When to Use

- ✅ Problems involving nested or hierarchical data
- ✅ Recursive traversal with depth-based logic
- ✅ Clear parent → child relationships
- ❌ Extremely deep nesting (stack overflow risk)
- ❌ When iterative solutions are strictly required

---

### Key Takeaway

> **Each recursive level should compute its own subtotal and apply its multiplier exactly once.**

Avoid sharing state (like a running sum) across recursive calls—let recursion do the aggregation naturally.

---

## Additional Resources

### Visualization Tools

- Try drawing recursion trees for F(5)
- Plot graph of function calls vs n
- Visualize memo hit/miss ratio

### Related Topics

- Dynamic Programming
- Recursion vs Iteration
- Time-Space Tradeoffs
- Matrix Exponentiation (O(log n) solution)

Happy Coding! 🚀
