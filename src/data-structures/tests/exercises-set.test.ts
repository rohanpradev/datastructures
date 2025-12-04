import { describe, expect, test } from "bun:test";
import {
	findPairs,
	hasUniqueChars,
	longestConsecutiveSequence,
	removeDuplicates,
} from "@/data-structures/hash-table/problems/exercises-set";

describe("removeDuplicates", () => {
	test("should remove duplicates while maintaining order", () => {
		expect(removeDuplicates([1, 2, 3, 2, 4, 3, 5])).toEqual([1, 2, 3, 4, 5]);
		expect(removeDuplicates([5, 4, 3, 2, 1])).toEqual([5, 4, 3, 2, 1]);
	});

	test("should handle array with all duplicates", () => {
		expect(removeDuplicates([1, 1, 1, 1])).toEqual([1]);
		expect(removeDuplicates([5, 5])).toEqual([5]);
	});

	test("should handle array with no duplicates", () => {
		expect(removeDuplicates([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle empty array", () => {
		expect(removeDuplicates([])).toEqual([]);
	});

	test("should handle single element", () => {
		expect(removeDuplicates([1])).toEqual([1]);
	});

	test("should handle negative numbers", () => {
		expect(removeDuplicates([-1, -2, -1, -3, -2])).toEqual([-1, -2, -3]);
	});
});

describe("hasUniqueChars", () => {
	test("should return true for strings with unique characters", () => {
		expect(hasUniqueChars("abcdef")).toBe(true);
		expect(hasUniqueChars("12345")).toBe(true);
		expect(hasUniqueChars("a")).toBe(true);
	});

	test("should return false for strings with duplicate characters", () => {
		expect(hasUniqueChars("hello")).toBe(false); // 'l' repeats
		expect(hasUniqueChars("aabbcc")).toBe(false);
		expect(hasUniqueChars("aa")).toBe(false);
	});

	test("should handle empty string", () => {
		expect(hasUniqueChars("")).toBe(true);
	});

	test("should be case-sensitive", () => {
		expect(hasUniqueChars("Aa")).toBe(true);
		expect(hasUniqueChars("AA")).toBe(false);
	});

	test("should handle special characters", () => {
		expect(hasUniqueChars("!@#$%")).toBe(true);
		expect(hasUniqueChars("!!")).toBe(false);
	});
});

describe("findPairs", () => {
	test("should find all unique pairs that sum to target", () => {
		const result = findPairs([1, 2, 3, 4, 5], 6);
		expect(result.length).toBe(2);
		expect(result).toContainEqual([1, 5]);
		expect(result).toContainEqual([2, 4]);
	});

	test("should handle no pairs found", () => {
		expect(findPairs([1, 2, 3, 4, 5], 10)).toEqual([]);
		expect(findPairs([1, 2, 3], 100)).toEqual([]);
	});

	test("should handle pairs with same number", () => {
		const result = findPairs([1, 1, 2, 3, 4, 5], 2);
		expect(result).toEqual([[1, 1]]);
	});

	test("should avoid duplicate pairs", () => {
		const result = findPairs([1, 2, 3, 2, 4], 6);
		// Should only have [2, 4] once even though 2 appears twice
		expect(result).toEqual([[2, 4]]);
	});

	test("should handle negative numbers", () => {
		const result = findPairs([-1, 2, 3, -2, 4], 2);
		expect(result.length).toBeGreaterThan(0);
	});

	test("should handle empty array", () => {
		expect(findPairs([], 5)).toEqual([]);
	});

	test("should handle single element", () => {
		expect(findPairs([5], 10)).toEqual([]);
	});

	test("should order pairs correctly", () => {
		const result = findPairs([5, 1, 3, 2], 6);
		// Each pair should have smaller number first
		result.forEach((pair) => {
			expect(pair[0]!).toBeLessThanOrEqual(pair[1]!);
		});
	});
});

describe("longestConsecutiveSequence", () => {
	test("should find longest consecutive sequence", () => {
		expect(longestConsecutiveSequence([100, 4, 200, 1, 3, 2])).toBe(4); // [1,2,3,4]
		expect(longestConsecutiveSequence([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9); // [0-8]
	});

	test("should handle single element", () => {
		expect(longestConsecutiveSequence([1])).toBe(1);
		expect(longestConsecutiveSequence([100])).toBe(1);
	});

	test("should handle no consecutive sequences", () => {
		expect(longestConsecutiveSequence([1, 3, 5, 7, 9])).toBe(1);
	});

	test("should handle all consecutive", () => {
		expect(longestConsecutiveSequence([1, 2, 3, 4, 5])).toBe(5);
		expect(longestConsecutiveSequence([5, 4, 3, 2, 1])).toBe(5);
	});

	test("should handle duplicates", () => {
		expect(longestConsecutiveSequence([1, 2, 0, 1])).toBe(3); // [0,1,2]
		expect(longestConsecutiveSequence([1, 1, 1, 1])).toBe(1);
	});

	test("should handle negative numbers", () => {
		expect(longestConsecutiveSequence([-1, 0, 1, 2])).toBe(4);
		expect(longestConsecutiveSequence([-3, -2, -1, 0, 1])).toBe(5);
	});

	test("should handle empty array", () => {
		expect(longestConsecutiveSequence([])).toBe(0);
	});

	test("should handle multiple sequences", () => {
		// Two sequences: [1,2,3] and [10,11,12,13]
		expect(longestConsecutiveSequence([1, 2, 3, 10, 11, 12, 13])).toBe(4);
	});

	test("should handle large gaps", () => {
		expect(longestConsecutiveSequence([1, 1000, 2, 1001, 3])).toBe(3); // [1,2,3]
	});
});

describe("Set Exercises - Integration", () => {
	test("should work together on complex data", () => {
		const data = [1, 2, 2, 3, 4, 4, 5];

		// Remove duplicates
		const unique = removeDuplicates(data);
		expect(unique).toEqual([1, 2, 3, 4, 5]);

		// Find pairs
		const pairs = findPairs(data, 6);
		expect(pairs.length).toBeGreaterThan(0);

		// Longest sequence
		const seqLength = longestConsecutiveSequence(data);
		expect(seqLength).toBe(5);
	});

	test("should handle string operations", () => {
		expect(hasUniqueChars("abcdef")).toBe(true);
		expect(hasUniqueChars("aabbcc")).toBe(false);
	});
});
