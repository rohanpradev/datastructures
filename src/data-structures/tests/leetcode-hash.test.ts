import { describe, expect, test } from "bun:test";
import {
	containsDuplicate,
	findDuplicates,
	firstNonRepeatingChar,
	groupAnagrams,
	isAnagram,
	itemInCommon,
	longestConsecutive,
	subarraySum,
	twoSum,
} from "@/data-structures/hash-table/problems/leetcode-hash";

describe("twoSum", () => {
	test("should find two numbers that sum to target", () => {
		expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
		expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
		expect(twoSum([3, 3], 6)).toEqual([0, 1]);
	});

	test("should handle negative numbers", () => {
		expect(twoSum([-1, -2, -3, -4, -5], -8)).toEqual([2, 4]);
	});

	test("should return empty array if no solution", () => {
		expect(twoSum([1, 2, 3], 10)).toEqual([]);
	});

	test("should work with zero", () => {
		expect(twoSum([0, 4, 3, 0], 0)).toEqual([0, 3]);
	});

	test("should handle large arrays", () => {
		const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		expect(twoSum(nums, 19)).toEqual([8, 9]);
	});
});

describe("groupAnagrams", () => {
	test("should group anagrams together", () => {
		const result = groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);
		expect(result.length).toBe(3);
		expect(result).toContainEqual(
			expect.arrayContaining(["eat", "tea", "ate"]),
		);
		expect(result).toContainEqual(expect.arrayContaining(["tan", "nat"]));
		expect(result).toContainEqual(["bat"]);
	});

	test("should handle empty array", () => {
		expect(groupAnagrams([])).toEqual([]);
	});

	test("should handle single string", () => {
		const result = groupAnagrams(["a"]);
		expect(result).toEqual([["a"]]);
	});

	test("should handle empty strings", () => {
		const result = groupAnagrams(["", ""]);
		expect(result).toEqual([["", ""]]);
	});

	test("should handle no anagrams", () => {
		const result = groupAnagrams(["abc", "def", "ghi"]);
		expect(result.length).toBe(3);
	});

	test("should handle all same anagrams", () => {
		const result = groupAnagrams(["abc", "bca", "cab"]);
		expect(result.length).toBe(1);
		expect(result[0]?.length).toBe(3);
	});
});

describe("longestConsecutive", () => {
	test("should find longest consecutive sequence", () => {
		expect(longestConsecutive([100, 4, 200, 1, 3, 2])).toBe(4);
		expect(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9);
	});

	test("should handle empty array", () => {
		expect(longestConsecutive([])).toBe(0);
	});

	test("should handle single element", () => {
		expect(longestConsecutive([1])).toBe(1);
	});

	test("should handle no consecutive numbers", () => {
		expect(longestConsecutive([1, 3, 5, 7, 9])).toBe(1);
	});

	test("should handle duplicates", () => {
		expect(longestConsecutive([1, 2, 0, 1])).toBe(3);
	});

	test("should handle negative numbers", () => {
		expect(longestConsecutive([-1, 0, 1, 2])).toBe(4);
	});

	test("should handle large sequence", () => {
		expect(longestConsecutive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(10);
	});
});

describe("subarraySum", () => {
	test("should count subarrays with sum k", () => {
		expect(subarraySum([1, 1, 1], 2)).toBe(2);
		expect(subarraySum([1, 2, 3], 3)).toBe(2);
	});

	test("should handle negative numbers", () => {
		expect(subarraySum([1, -1, 0], 0)).toBe(3);
	});

	test("should handle zero sum", () => {
		expect(subarraySum([0, 0, 0], 0)).toBe(6);
	});

	test("should handle single element matching k", () => {
		expect(subarraySum([5], 5)).toBe(1);
	});

	test("should handle no matching subarrays", () => {
		expect(subarraySum([1, 2, 3], 10)).toBe(0);
	});

	test("should handle entire array sum", () => {
		expect(subarraySum([1, 2, 3, 4], 10)).toBe(1);
	});
});

describe("containsDuplicate", () => {
	test("should return true for duplicates", () => {
		expect(containsDuplicate([1, 2, 3, 1])).toBe(true);
		expect(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toBe(true);
	});

	test("should return false for no duplicates", () => {
		expect(containsDuplicate([1, 2, 3, 4])).toBe(false);
	});

	test("should handle empty array", () => {
		expect(containsDuplicate([])).toBe(false);
	});

	test("should handle single element", () => {
		expect(containsDuplicate([1])).toBe(false);
	});

	test("should handle negative numbers", () => {
		expect(containsDuplicate([-1, -2, -3, -1])).toBe(true);
	});
});

describe("isAnagram", () => {
	test("should return true for anagrams", () => {
		expect(isAnagram("anagram", "nagaram")).toBe(true);
		expect(isAnagram("listen", "silent")).toBe(true);
	});

	test("should return false for non-anagrams", () => {
		expect(isAnagram("rat", "car")).toBe(false);
		expect(isAnagram("hello", "world")).toBe(false);
	});

	test("should handle different lengths", () => {
		expect(isAnagram("a", "ab")).toBe(false);
	});

	test("should handle empty strings", () => {
		expect(isAnagram("", "")).toBe(true);
	});

	test("should handle single character", () => {
		expect(isAnagram("a", "a")).toBe(true);
		expect(isAnagram("a", "b")).toBe(false);
	});

	test("should be case sensitive", () => {
		expect(isAnagram("Anagram", "nagaram")).toBe(false);
	});
});

describe("Hash Table Problems - Integration", () => {
	test("should combine multiple operations", () => {
		const nums = [1, 2, 3, 4, 5];
		expect(containsDuplicate(nums)).toBe(false);
		expect(twoSum(nums, 9)).toEqual([3, 4]);
		expect(longestConsecutive(nums)).toBe(5);
	});

	test("should handle edge cases across problems", () => {
		expect(twoSum([], 0)).toEqual([]);
		expect(groupAnagrams([])).toEqual([]);
		expect(longestConsecutive([])).toBe(0);
		expect(subarraySum([], 0)).toBe(0);
		expect(containsDuplicate([])).toBe(false);
	});
});

describe("itemInCommon", () => {
	test("should return true when arrays have common items", () => {
		expect(itemInCommon([1, 2, 3], [4, 5, 2])).toBe(true);
		expect(itemInCommon([1, 2, 3], [3, 4, 5])).toBe(true);
	});

	test("should return false when arrays have no common items", () => {
		expect(itemInCommon([1, 2, 3], [4, 5, 6])).toBe(false);
		expect(itemInCommon([1], [2])).toBe(false);
	});

	test("should handle empty arrays", () => {
		expect(itemInCommon([], [1, 2, 3])).toBe(false);
		expect(itemInCommon([1, 2, 3], [])).toBe(false);
		expect(itemInCommon([], [])).toBe(false);
	});

	test("should handle duplicate values", () => {
		expect(itemInCommon([1, 1, 2], [2, 3, 3])).toBe(true);
		expect(itemInCommon([1, 1, 1], [2, 2, 2])).toBe(false);
	});
});

describe("findDuplicates", () => {
	test("should find all duplicate values", () => {
		const result = findDuplicates([1, 2, 3, 2, 4, 3, 5]);
		expect(result).toContain(2);
		expect(result).toContain(3);
		expect(result.length).toBe(2);
	});

	test("should return empty array when no duplicates", () => {
		expect(findDuplicates([1, 2, 3, 4, 5])).toEqual([]);
		expect(findDuplicates([1])).toEqual([]);
	});

	test("should handle array with all duplicates", () => {
		const result = findDuplicates([1, 1, 1, 1]);
		expect(result).toContain(1);
		expect(result.length).toBe(1);
	});

	test("should handle multiple duplicates", () => {
		const result = findDuplicates([1, 1, 2, 2, 3, 3]);
		expect(result.length).toBe(3);
		expect(result).toContain(1);
		expect(result).toContain(2);
		expect(result).toContain(3);
	});

	test("should handle empty array", () => {
		expect(findDuplicates([])).toEqual([]);
	});
});

describe("firstNonRepeatingChar", () => {
	test("should find first non-repeating character", () => {
		expect(firstNonRepeatingChar("leetcode")).toBe(0); // 'l'
		expect(firstNonRepeatingChar("loveleetcode")).toBe(2); // 'v'
	});

	test("should return -1 when all characters repeat", () => {
		expect(firstNonRepeatingChar("aabb")).toBe(-1);
		expect(firstNonRepeatingChar("aabbcc")).toBe(-1);
	});

	test("should handle single character", () => {
		expect(firstNonRepeatingChar("a")).toBe(0);
	});

	test("should handle all unique characters", () => {
		expect(firstNonRepeatingChar("abcdef")).toBe(0);
	});

	test("should handle empty string", () => {
		expect(firstNonRepeatingChar("")).toBe(-1);
	});

	test("should handle character at end", () => {
		expect(firstNonRepeatingChar("aabbc")).toBe(4); // 'c'
	});
});
