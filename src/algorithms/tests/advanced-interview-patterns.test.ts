import { describe, expect, test } from "bun:test";
import {
	maxScheduledProfit,
	shortestSubarrayAtLeastK,
} from "@/algorithms/interview-patterns/advanced-interview-patterns";

describe("shortestSubarrayAtLeastK", () => {
	test("handles negative values that break ordinary sliding windows", () => {
		expect(shortestSubarrayAtLeastK([2, -1, 2], 3)).toBe(3);
		expect(shortestSubarrayAtLeastK([84, -37, 32, 40, 95], 167)).toBe(3);
		expect(shortestSubarrayAtLeastK([1, -1, 5], 5)).toBe(1);
	});

	test("requires a nonempty subarray, including nonpositive targets", () => {
		expect(shortestSubarrayAtLeastK([], 0)).toBe(-1);
		expect(shortestSubarrayAtLeastK([-2], -1)).toBe(-1);
		expect(shortestSubarrayAtLeastK([-2, -1], -1)).toBe(1);
		expect(shortestSubarrayAtLeastK([0, 0], 0)).toBe(1);
		expect(shortestSubarrayAtLeastK([1, 2], 4)).toBe(-1);
	});

	test("matches a brute-force oracle on exhaustive small signed arrays", () => {
		for (let size = 0; size <= 5; size++) {
			for (let mask = 0; mask < 3 ** size; mask++) {
				let digits = mask;
				const nums = Array.from({ length: size }, () => {
					const value = (digits % 3) - 1;
					digits = Math.floor(digits / 3);
					return value;
				});
				for (let target = -2; target <= 3; target++) {
					let best = Infinity;
					for (let start = 0; start < size; start++) {
						let sum = 0;
						for (let end = start; end < size; end++) {
							sum += nums[end];
							if (sum >= target) best = Math.min(best, end - start + 1);
						}
					}
					expect(shortestSubarrayAtLeastK(nums, target)).toBe(best === Infinity ? -1 : best);
				}
			}
		}
	});

	test("handles a large pending deque without front-removal scans", () => {
		const nums = Array(50_000).fill(1);
		expect(shortestSubarrayAtLeastK(nums, 25_000)).toBe(25_000);
		expect(nums[0]).toBe(1);
	});
});

describe("maxScheduledProfit", () => {
	test("uses compatible prefixes instead of earliest-end or highest-profit greed", () => {
		expect(maxScheduledProfit([
			{ start: 1, end: 3, profit: 5 },
			{ start: 2, end: 4, profit: 6 },
			{ start: 3, end: 5, profit: 5 },
		])).toBe(10);
		expect(maxScheduledProfit([
			{ start: 0, end: 10, profit: 15 },
			{ start: 0, end: 5, profit: 10 },
			{ start: 5, end: 10, profit: 10 },
		])).toBe(20);
	});

	test("handles empty input, negative profits, equal ends and immutable input", () => {
		expect(maxScheduledProfit([])).toBe(0);
		expect(maxScheduledProfit([{ start: 1, end: 2, profit: -1 }])).toBe(0);
		const jobs = Object.freeze([
			Object.freeze({ start: 3, end: 4, profit: 4 }),
			Object.freeze({ start: 0, end: 3, profit: 3 }),
			Object.freeze({ start: 1, end: 3, profit: 5 }),
		]);
		expect(maxScheduledProfit(jobs)).toBe(9);
		expect(jobs[0].start).toBe(3);
	});

	test("matches subset enumeration across deterministic generated jobs", () => {
		let seed = 42;
		const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
		for (let example = 0; example < 80; example++) {
			const jobs = Array.from({ length: 8 }, () => {
				const start = random() % 10;
				return { start, end: start + 1 + random() % 5, profit: random() % 20 - 3 };
			});
			let best = 0;
			for (let mask = 0; mask < 1 << jobs.length; mask++) {
				const selected = jobs.filter((_, index) => mask & (1 << index)).sort((a, b) => a.start - b.start);
				if (selected.every((job, index) => index === 0 || selected[index - 1].end <= job.start)) {
					best = Math.max(best, selected.reduce((sum, job) => sum + job.profit, 0));
				}
			}
			expect(maxScheduledProfit(jobs)).toBe(best);
		}
	});

	test("rejects malformed job boundaries and nonfinite numbers", () => {
		for (const job of [
			{ start: 1, end: 1, profit: 1 },
			{ start: 2, end: 1, profit: 1 },
			{ start: NaN, end: 1, profit: 1 },
			{ start: 0, end: Infinity, profit: 1 },
			{ start: 0, end: 1, profit: NaN },
		]) expect(() => maxScheduledProfit([job])).toThrow(RangeError);
	});
});
