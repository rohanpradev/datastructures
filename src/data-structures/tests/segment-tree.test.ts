import { describe, expect, test } from "bun:test";
import { SegmentTree } from "@/data-structures/segment-tree/segment-tree";

describe("SegmentTree", () => {
	test("answers half-open sums after point assignments on an uneven tree", () => {
		const tree = new SegmentTree([3, 1, 4, 1, 5], 0, (a, b) => a + b);
		expect(tree.length).toBe(5);
		expect(tree.query(0, 5)).toBe(14);
		expect(tree.query(1, 4)).toBe(6);
		tree.set(2, 9);
		expect(tree.query(1, 4)).toBe(11);
		tree.set(0, -3);
		tree.set(4, -5);
		expect(tree.query(0, 5)).toBe(3);
		expect(tree.query(4, 5)).toBe(-5);
	});

	test("supports minimum without an inverse operation", () => {
		const tree = new SegmentTree([3, 1, 4, 1, 5], Infinity, Math.min);
		expect(tree.query(2, 5)).toBe(1);
		tree.set(3, 8);
		expect(tree.query(2, 5)).toBe(4);
		tree.set(2, -7);
		expect(tree.query(0, 5)).toBe(-7);
		expect(tree.query(3, 3)).toBe(Infinity);
	});

	test("preserves order for a noncommutative reducer across every interval", () => {
		const values = Array.from({ length: 13 }, (_, i) => String.fromCharCode(97 + i));
		const tree = new SegmentTree(values, "", (left, right) => left + right);
		for (const replacement of ["c", "XY", ""]) {
			values[2] = replacement;
			tree.set(2, replacement);
			for (let start = 0; start <= values.length; start++) {
				for (let end = start; end <= values.length; end++) {
					expect(tree.query(start, end)).toBe(values.slice(start, end).join(""));
				}
			}
		}
	});

	test("supports immutable aggregate objects", () => {
		type Summary = { readonly count: number; readonly total: number };
		const empty: Summary = Object.freeze({ count: 0, total: 0 });
		const values: readonly Summary[] = Object.freeze([
			Object.freeze({ count: 1, total: 4 }),
			Object.freeze({ count: 1, total: 7 }),
		]);
		const tree = new SegmentTree(values, empty, (left, right) => ({
			count: left.count + right.count,
			total: left.total + right.total,
		}));
		expect(tree.query(0, 2)).toEqual({ count: 2, total: 11 });
		tree.set(1, Object.freeze({ count: 1, total: -2 }));
		expect(tree.query(0, 2)).toEqual({ count: 2, total: 2 });
		expect(values[1]).toEqual({ count: 1, total: 7 });
		expect(empty).toEqual({ count: 0, total: 0 });
	});

	test("returns the identity for all empty boundaries and handles a singleton", () => {
		const empty = new SegmentTree<number>([], 0, (a, b) => a + b);
		expect(empty.length).toBe(0);
		expect(empty.query(0, 0)).toBe(0);
		expect(() => empty.set(0, 1)).toThrow(RangeError);
		const tree = new SegmentTree([6], 0, (a, b) => a + b);
		expect(tree.query(0, 0)).toBe(0);
		expect(tree.query(1, 1)).toBe(0);
		expect(tree.query(0, 1)).toBe(6);
		tree.set(0, -2);
		tree.set(0, 0);
		expect(tree.query(0, 1)).toBe(0);
	});

	test("rejects invalid boundaries before mutation", () => {
		const tree = new SegmentTree([4, 5, 6], 0, (a, b) => a + b);
		for (const boundary of [-1, 0.5, NaN, Infinity, -Infinity, 4]) {
			expect(() => tree.query(boundary, 3)).toThrow(RangeError);
			expect(() => tree.query(0, boundary)).toThrow(RangeError);
			expect(() => tree.set(boundary, 99)).toThrow(RangeError);
		}
		expect(() => tree.query(2, 1)).toThrow(RangeError);
		expect(() => tree.set(3, 99)).toThrow(RangeError);
		expect(tree.query(0, 3)).toBe(15);
	});

	test("copies input slots and never changes the caller's array", () => {
		const values = [2, 7, 1];
		const tree = new SegmentTree(values, 0, (a, b) => a + b);
		values[0] = 100;
		expect(tree.query(0, 3)).toBe(10);
		tree.set(1, 9);
		expect(values).toEqual([100, 7, 1]);
		expect(tree.query(0, 3)).toBe(12);
	});

	test("matches scan oracles during seeded updates around power-of-two sizes", () => {
		let state = 0x5eed1234;
		const next = () => {
			state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
			return state;
		};
		for (const length of [0, 1, 2, 3, 7, 8, 9, 31, 32, 33]) {
			const values = Array.from({ length }, () => (next() % 201) - 100);
			const sum = new SegmentTree(values, 0, (a, b) => a + b);
			const minimum = new SegmentTree(values, Infinity, Math.min);
			for (let step = 0; step < 160; step++) {
				if (length > 0 && next() % 3 !== 0) {
					const index = next() % length;
					const value = (next() % 201) - 100;
					values[index] = value;
					sum.set(index, value);
					minimum.set(index, value);
				}
				const a = next() % (length + 1);
				const b = next() % (length + 1);
				const start = Math.min(a, b);
				const end = Math.max(a, b);
				const slice = values.slice(start, end);
				expect(sum.query(start, end)).toBe(slice.reduce((a, b) => a + b, 0));
				expect(minimum.query(start, end)).toBe(slice.reduce((a, b) => Math.min(a, b), Infinity));
			}
		}
	});
});
