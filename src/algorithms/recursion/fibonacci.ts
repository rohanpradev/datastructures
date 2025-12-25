/**
 * Fibonacci Number Implementations
 *
 * The Fibonacci sequence is: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
 * Where F(n) = F(n-1) + F(n-2), with F(0) = 0 and F(1) = 1
 *
 * This file demonstrates three approaches to computing Fibonacci numbers,
 * each with different time/space complexity tradeoffs.
 */

/**
 * Fibonacci - Naive Recursive Implementation
 *
 * Classic recursive approach that directly implements the mathematical definition.
 *
 * Algorithm:
 * 1. Base case: F(0) = 0, F(1) = 1
 * 2. Recursive case: F(n) = F(n-1) + F(n-2)
 *
 * Time Complexity: O(2^n) - exponential!
 * - Each call makes 2 recursive calls, creating a binary tree of calls
 * - Results in massive redundant computation
 *
 * Space Complexity: O(n) - recursion stack depth
 *
 * Advantages:
 * - Simple and intuitive
 * - Directly matches mathematical definition
 *
 * Disadvantages:
 * - Extremely slow for n > 40
 * - Massive redundant calculations (e.g., F(3) computed many times)
 *
 * Use Cases:
 * - Educational purposes only
 * - Demonstrating inefficiency without optimization
 *
 * @param n - The position in Fibonacci sequence (0-indexed)
 * @returns The nth Fibonacci number
 *
 * @example
 * fibonacci(0) // 0
 * fibonacci(1) // 1
 * fibonacci(6) // 8
 * fibonacci(10) // 55
 */
export function fibonacci(n: number): number {
  // Base cases
  if (n <= 1) return n;

  // Recursive case: F(n) = F(n-1) + F(n-2)
  return fibonacci(n - 1) + fibonacci(n - 2);
}

/**
 * Fibonacci with Memoization (Top-Down Dynamic Programming)
 *
 * Optimized recursive approach that caches previously computed results
 * to avoid redundant calculations.
 *
 * Algorithm:
 * 1. Check if result already computed (in memo)
 * 2. If yes, return cached result
 * 3. If no, compute recursively and cache result
 *
 * Time Complexity: O(n)
 * - Each Fibonacci number computed exactly once
 * - Subsequent lookups are O(1)
 *
 * Space Complexity: O(n)
 * - O(n) for memoization map
 * - O(n) for recursion stack
 *
 * Advantages:
 * - Much faster than naive recursion
 * - Still uses natural recursive structure
 * - Easy to implement from naive version
 *
 * Disadvantages:
 * - Requires extra space for memo
 * - Still uses recursion stack
 *
 * Use Cases:
 * - When recursive structure is preferred
 * - Problems with overlapping subproblems
 * - Medium-sized inputs (n < 10000)
 *
 * @param n - The position in Fibonacci sequence
 * @param memo - Map to store computed results (optional, created automatically)
 * @returns The nth Fibonacci number
 *
 * @example
 * fibonacciMemo(50) // 12586269025 (fast!)
 * fibonacciMemo(100) // 354224848179262000000
 */
export function fibonacciMemo(
  n: number,
  memo: Map<number, number> = new Map(),
): number {
  // Check memo first
  if (memo.has(n)) {
    return memo.get(n)!;
  }

  // Base cases
  if (n <= 1) {
    return n;
  }

  // Compute and cache result
  const result = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  memo.set(n, result);

  return result;
}

/**
 * Fibonacci - Bottom-Up Dynamic Programming (Iterative)
 *
 * Iterative approach that builds up from base cases.
 * Most efficient implementation for computing single Fibonacci number.
 *
 * Algorithm:
 * 1. Start with base cases: F(0) = 0, F(1) = 1
 * 2. Build up iteratively: F(i) = F(i-1) + F(i-2)
 * 3. Return F(n)
 *
 * Time Complexity: O(n)
 * - Single pass from 2 to n
 *
 * Space Complexity: O(1)
 * - Only stores last two values
 * - Can also use O(n) array if all values needed
 *
 * Advantages:
 * - Most efficient time and space
 * - No recursion overhead
 * - No risk of stack overflow
 *
 * Disadvantages:
 * - Less intuitive than recursive version
 * - Iterative structure may be harder to understand
 *
 * Use Cases:
 * - Production code
 * - Large inputs
 * - Space-constrained environments
 *
 * @param n - The position in Fibonacci sequence
 * @returns The nth Fibonacci number
 *
 * @example
 * fibonacciBottomUp(0) // 0
 * fibonacciBottomUp(1) // 1
 * fibonacciBottomUp(50) // 12586269025
 * fibonacciBottomUp(100) // 354224848179262000000
 */
export function fibonacciBottomUp(n: number): number {
  // Base cases
  if (n <= 1) return n;

  // Initialize with base cases
  let prev = 0; // F(0)
  let current = 1; // F(1)

  // Build up from F(2) to F(n)
  for (let i = 2; i <= n; i++) {
    const next = prev + current; // F(i) = F(i-1) + F(i-2)
    prev = current; // Shift window
    current = next;
  }

  return current;
}

/**
 * Fibonacci - Bottom-Up with Full Array (Alternative)
 *
 * Variation that stores all Fibonacci numbers up to n.
 * Useful when you need access to all intermediate values.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - stores all values
 *
 * @param n - The position in Fibonacci sequence
 * @returns Array of all Fibonacci numbers from F(0) to F(n)
 *
 * @example
 * fibonacciArray(6) // [0, 1, 1, 2, 3, 5, 8]
 */
export function fibonacciArray(n: number): number[] {
  if (n === 0) return [0];
  if (n === 1) return [0, 1];

  const fib: number[] = [0, 1];

  for (let i = 2; i <= n; i++) {
    fib[i] = fib[i - 1]! + fib[i - 2]!;
  }

  return fib;
}

/**
 * Performance Comparison Helper
 *
 * Compares execution time of different Fibonacci implementations.
 * Warning: Don't use naive fibonacci for n > 40!
 *
 * @param n - Fibonacci number to compute
 *
 * @example
 * compareFibonacci(30)
 * // Naive: 832040 (1234ms)
 * // Memoized: 832040 (2ms)
 * // Bottom-up: 832040 (1ms)
 */
export function compareFibonacci(n: number): void {
  console.log(`\nComputing Fibonacci(${n}):\n`);

  if (n <= 40) {
    const start1 = performance.now();
    const result1 = fibonacci(n);
    const time1 = performance.now() - start1;
    console.log(`Naive recursive: ${result1} (${time1.toFixed(2)}ms)`);
  } else {
    console.log(`Naive recursive: Skipped (too slow for n > 40)`);
  }

  const start2 = performance.now();
  const result2 = fibonacciMemo(n);
  const time2 = performance.now() - start2;
  console.log(`Memoized: ${result2} (${time2.toFixed(2)}ms)`);

  const start3 = performance.now();
  const result3 = fibonacciBottomUp(n);
  const time3 = performance.now() - start3;
  console.log(`Bottom-up: ${result3} (${time3.toFixed(2)}ms)\n`);
}
