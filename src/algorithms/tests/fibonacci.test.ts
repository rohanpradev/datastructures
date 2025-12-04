import { describe, expect, test } from "bun:test";
import {
	fibonacci,
	fibonacciArray,
	fibonacciBottomUp,
	fibonacciMemo,
} from "@/algorithms/recursion/fibonacci";

describe("Fibonacci - Naive Recursive", () => {
	test("should return 0 for F(0)", () => {
		expect(fibonacci(0)).toBe(0);
	});

	test("should return 1 for F(1)", () => {
		expect(fibonacci(1)).toBe(1);
	});

	test("should compute small Fibonacci numbers", () => {
		expect(fibonacci(2)).toBe(1);
		expect(fibonacci(3)).toBe(2);
		expect(fibonacci(4)).toBe(3);
		expect(fibonacci(5)).toBe(5);
		expect(fibonacci(6)).toBe(8);
	});

	test("should compute F(10)", () => {
		expect(fibonacci(10)).toBe(55);
	});

	test("should compute F(15)", () => {
		expect(fibonacci(15)).toBe(610);
	});

	test("should compute first 10 Fibonacci numbers correctly", () => {
		const expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
		for (let i = 0; i < expected.length; i++) {
			expect(fibonacci(i)).toBe(expected[i]!);
		}
	});
});

describe("Fibonacci with Memoization", () => {
	test("should return 0 for F(0)", () => {
		expect(fibonacciMemo(0)).toBe(0);
	});

	test("should return 1 for F(1)", () => {
		expect(fibonacciMemo(1)).toBe(1);
	});

	test("should compute small Fibonacci numbers", () => {
		expect(fibonacciMemo(2)).toBe(1);
		expect(fibonacciMemo(3)).toBe(2);
		expect(fibonacciMemo(4)).toBe(3);
		expect(fibonacciMemo(5)).toBe(5);
		expect(fibonacciMemo(6)).toBe(8);
	});

	test("should compute larger Fibonacci numbers efficiently", () => {
		expect(fibonacciMemo(20)).toBe(6765);
		expect(fibonacciMemo(30)).toBe(832040);
		expect(fibonacciMemo(40)).toBe(102334155);
	});

	test("should handle very large n", () => {
		expect(fibonacciMemo(50)).toBe(12586269025);
	});

	test("should reuse memoization across calls", () => {
		const memo = new Map<number, number>();

		// First call populates memo
		fibonacciMemo(10, memo);
		expect(memo.size).toBeGreaterThan(0);

		// Second call reuses memo
		const result = fibonacciMemo(10, memo);
		expect(result).toBe(55);
	});

	test("should compute first 20 Fibonacci numbers correctly", () => {
		const expected = [
			0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597,
			2584, 4181,
		];
		for (let i = 0; i < expected.length; i++) {
			expect(fibonacciMemo(i)).toBe(expected[i]!);
		}
	});
});

describe("Fibonacci - Bottom-Up Iterative", () => {
	test("should return 0 for F(0)", () => {
		expect(fibonacciBottomUp(0)).toBe(0);
	});

	test("should return 1 for F(1)", () => {
		expect(fibonacciBottomUp(1)).toBe(1);
	});

	test("should compute small Fibonacci numbers", () => {
		expect(fibonacciBottomUp(2)).toBe(1);
		expect(fibonacciBottomUp(3)).toBe(2);
		expect(fibonacciBottomUp(4)).toBe(3);
		expect(fibonacciBottomUp(5)).toBe(5);
		expect(fibonacciBottomUp(6)).toBe(8);
	});

	test("should compute larger Fibonacci numbers efficiently", () => {
		expect(fibonacciBottomUp(20)).toBe(6765);
		expect(fibonacciBottomUp(30)).toBe(832040);
		expect(fibonacciBottomUp(40)).toBe(102334155);
	});

	test("should handle very large n", () => {
		expect(fibonacciBottomUp(50)).toBe(12586269025);
		expect(fibonacciBottomUp(75)).toBe(2111485077978050);
	});

	test("should compute first 15 Fibonacci numbers correctly", () => {
		const expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];
		for (let i = 0; i < expected.length; i++) {
			expect(fibonacciBottomUp(i)).toBe(expected[i]!);
		}
	});
});

describe("Fibonacci Array", () => {
	test("should return [0] for n=0", () => {
		expect(fibonacciArray(0)).toEqual([0]);
	});

	test("should return [0, 1] for n=1", () => {
		expect(fibonacciArray(1)).toEqual([0, 1]);
	});

	test("should return array of Fibonacci numbers", () => {
		expect(fibonacciArray(6)).toEqual([0, 1, 1, 2, 3, 5, 8]);
	});

	test("should return array for larger n", () => {
		const result = fibonacciArray(10);
		expect(result).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
		expect(result.length).toBe(11);
	});

	test("should have correct last element", () => {
		const result = fibonacciArray(20);
		expect(result[20]).toBe(6765);
	});
});

describe("Fibonacci Implementations Comparison", () => {
	test("all implementations should produce same results for small n", () => {
		for (let i = 0; i <= 15; i++) {
			const naive = fibonacci(i);
			const memoized = fibonacciMemo(i);
			const bottomUp = fibonacciBottomUp(i);
			const fromArray = fibonacciArray(i)[i]!;

			expect(memoized).toBe(naive);
			expect(bottomUp).toBe(naive);
			expect(fromArray).toBe(naive);
		}
	});

	test("optimized versions should handle large n efficiently", () => {
		const n = 45;
		const memoized = fibonacciMemo(n);
		const bottomUp = fibonacciBottomUp(n);

		expect(memoized).toBe(bottomUp);
		expect(memoized).toBe(1134903170);
	});

	test("all implementations should follow Fibonacci property", () => {
		// F(n) = F(n-1) + F(n-2) for n >= 2
		for (let i = 2; i <= 20; i++) {
			const fn = fibonacciBottomUp(i);
			const fn1 = fibonacciBottomUp(i - 1);
			const fn2 = fibonacciBottomUp(i - 2);

			expect(fn).toBe(fn1 + fn2);
		}
	});
});

describe("Fibonacci Edge Cases", () => {
	test("should handle sequential calls efficiently", () => {
		const results: number[] = [];
		for (let i = 0; i <= 10; i++) {
			results.push(fibonacciBottomUp(i));
		}
		expect(results).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
	});

	test("memoization should work with shared memo object", () => {
		const memo = new Map<number, number>();

		const result1 = fibonacciMemo(15, memo);
		const memoSize1 = memo.size;

		// Computing smaller number should use cached values
		const result2 = fibonacciMemo(10, memo);
		const memoSize2 = memo.size;

		expect(result1).toBe(610);
		expect(result2).toBe(55);
		expect(memoSize2).toBe(memoSize1); // No new entries needed
	});

	test("should handle F(2) = F(1) + F(0) correctly", () => {
		expect(fibonacci(2)).toBe(fibonacci(1) + fibonacci(0));
		expect(fibonacciMemo(2)).toBe(fibonacciMemo(1) + fibonacciMemo(0));
		expect(fibonacciBottomUp(2)).toBe(
			fibonacciBottomUp(1) + fibonacciBottomUp(0),
		);
	});
});

describe("Fibonacci Properties", () => {
	test("ratio of consecutive Fibonacci numbers approaches golden ratio", () => {
		// φ (phi) ≈ 1.618033988749895
		const goldenRatio = (1 + Math.sqrt(5)) / 2;

		const f30 = fibonacciBottomUp(30);
		const f29 = fibonacciBottomUp(29);
		const ratio = f30 / f29;

		// Should be close to golden ratio for large n
		expect(Math.abs(ratio - goldenRatio)).toBeLessThan(0.001);
	});

	test("every 3rd Fibonacci number is even", () => {
		for (let i = 0; i <= 30; i += 3) {
			const fib = fibonacciBottomUp(i);
			expect(fib % 2).toBe(0);
		}
	});

	test("F(n+m) = F(n)×F(m+1) + F(n-1)×F(m) for n,m > 0", () => {
		// Testing Fibonacci identity
		const n = 5;
		const m = 3;

		const fnPlusM = fibonacciBottomUp(n + m);
		const fn = fibonacciBottomUp(n);
		const fn1 = fibonacciBottomUp(n - 1);
		const fm = fibonacciBottomUp(m);
		const fm1 = fibonacciBottomUp(m + 1);

		expect(fnPlusM).toBe(fn * fm1 + fn1 * fm);
	});
});
