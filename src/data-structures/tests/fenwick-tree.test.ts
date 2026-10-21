import { describe, expect, test } from "bun:test";
import { FenwickTree } from "@/data-structures/fenwick-tree/fenwick-tree";

describe("FenwickTree", () => {
	test("answers dashboard windows after corrections, including empty windows", () => {
		const tree = new FenwickTree([3, 1, 4, 2]);
		expect(tree.prefixSum(3)).toBe(8);
		expect(tree.rangeSum(1, 4)).toBe(7);
		tree.add(2, -2);
		expect(tree.rangeSum(1, 4)).toBe(5);
		expect(tree.rangeSum(4, 4)).toBe(0);
		expect(new FenwickTree([]).prefixSum(0)).toBe(0);
	});

	test("agrees with direct sums across deterministic mixed updates", () => {
		const values = Array.from({ length: 31 }, (_, i) => i - 15);
		const tree = new FenwickTree(values);
		for (let step = 0; step < 100; step++) {
			const index = (step * 17) % values.length;
			const delta = (step % 9) - 4;
			values[index] += delta;
			tree.add(index, delta);
			for (let start = 0; start <= values.length; start++) {
				const end = Math.min(values.length, start + step % 11);
				expect(tree.rangeSum(start, end)).toBe(values.slice(start, end).reduce((a, b) => a + b, 0));
			}
		}
	});

	test("rejects sparse inputs instead of allowing undefined to poison sums", () => {
		const sparse = new Array<number>(3);
		sparse[0] = 1;
		sparse[2] = 3;
		expect(() => new FenwickTree(sparse)).toThrow(RangeError);
		expect(() => new FenwickTree(new Array<number>(1))).toThrow(RangeError);
	});

	test("rejects invalid boundaries and nonfinite updates before mutation", () => {
		const tree = new FenwickTree([4, 5]);
		for (const boundary of [-1, 0.5, NaN, Infinity, 3]) {
			expect(() => tree.prefixSum(boundary)).toThrow(RangeError);
			expect(() => tree.add(boundary, 1)).toThrow(RangeError);
		}
		expect(() => tree.add(2, 1)).toThrow(RangeError);
		expect(() => tree.add(0, Infinity)).toThrow(RangeError);
		expect(() => tree.rangeSum(2, 1)).toThrow(RangeError);
		expect(() => tree.rangeSum(-1, 0)).toThrow(RangeError);
		expect(() => new FenwickTree([NaN])).toThrow(RangeError);
		expect(tree.prefixSum(2)).toBe(9);
	});
});
