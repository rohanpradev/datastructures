import { describe, expect, test } from "bun:test";
import {
	binarySearch,
	canAttendMeetings,
	canFinishCourses,
	coinChange,
	combinationSum,
	countComponents,
	eraseOverlapIntervals,
	isBipartite,
	kokoEatingBananas,
	lengthOfLongestSubstring,
	lowerBound,
	longestIncreasingSubsequence,
	maxProfit,
	minWindowSubstring,
	numIslands,
	permutations,
	productExceptSelf,
	searchRotatedSortedArray,
	shortestPathBinaryMatrix,
	slidingWindowMaximum,
	subarraySumEqualsK,
	subsets,
	threeSum,
	trapRainWater,
	UnionFind,
	wordBreak,
} from "@/algorithms/interview-patterns/interview-patterns";

describe("binarySearch", () => {
	test("finds targets in sorted arrays", () => {
		expect(binarySearch([1, 3, 5, 7, 9], 1)).toBe(0);
		expect(binarySearch([1, 3, 5, 7, 9], 7)).toBe(3);
		expect(binarySearch([1, 3, 5, 7, 9], 9)).toBe(4);
	});

	test("returns -1 when target is missing", () => {
		expect(binarySearch([], 1)).toBe(-1);
		expect(binarySearch([2, 4, 6], 5)).toBe(-1);
	});
});

describe("lowerBound", () => {
	test("returns insertion index for target", () => {
		expect(lowerBound([1, 3, 3, 5], 3)).toBe(1);
		expect(lowerBound([1, 3, 3, 5], 4)).toBe(3);
		expect(lowerBound([1, 3, 3, 5], 0)).toBe(0);
		expect(lowerBound([1, 3, 3, 5], 9)).toBe(4);
	});
});

describe("searchRotatedSortedArray", () => {
	test("finds values in rotated arrays", () => {
		expect(searchRotatedSortedArray([4, 5, 6, 7, 0, 1, 2], 0)).toBe(4);
		expect(searchRotatedSortedArray([6, 7, 1, 2, 3, 4, 5], 6)).toBe(0);
	});

	test("handles missing and unrotated arrays", () => {
		expect(searchRotatedSortedArray([4, 5, 6, 7, 0, 1, 2], 3)).toBe(-1);
		expect(searchRotatedSortedArray([1, 2, 3, 4], 3)).toBe(2);
	});
});

describe("maxProfit", () => {
	test("finds best single buy and sell profit", () => {
		expect(maxProfit([7, 1, 5, 3, 6, 4])).toBe(5);
		expect(maxProfit([7, 6, 4, 3, 1])).toBe(0);
	});
});

describe("threeSum", () => {
	test("returns unique triplets that sum to zero", () => {
		const result = threeSum([-1, 0, 1, 2, -1, -4])
			.map((triplet) => triplet.join(","))
			.sort();

		expect(result).toEqual(["-1,-1,2", "-1,0,1"]);
	});

	test("returns empty array when no triplet exists", () => {
		expect(threeSum([1, 2, 3])).toEqual([]);
	});
});

describe("trapRainWater", () => {
	test("computes trapped water", () => {
		expect(trapRainWater([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])).toBe(6);
		expect(trapRainWater([4, 2, 0, 3, 2, 5])).toBe(9);
	});
});

describe("lengthOfLongestSubstring", () => {
	test("returns longest unique-character window length", () => {
		expect(lengthOfLongestSubstring("abcabcbb")).toBe(3);
		expect(lengthOfLongestSubstring("bbbbb")).toBe(1);
		expect(lengthOfLongestSubstring("pwwkew")).toBe(3);
		expect(lengthOfLongestSubstring("")).toBe(0);
	});
});

describe("minWindowSubstring", () => {
	test("returns the smallest covering window", () => {
		expect(minWindowSubstring("ADOBECODEBANC", "ABC")).toBe("BANC");
		expect(minWindowSubstring("a", "a")).toBe("a");
	});

	test("returns empty string when no window exists", () => {
		expect(minWindowSubstring("a", "aa")).toBe("");
		expect(minWindowSubstring("abc", "")).toBe("");
	});
});

describe("subarraySumEqualsK", () => {
	test("counts all matching subarrays", () => {
		expect(subarraySumEqualsK([1, 1, 1], 2)).toBe(2);
		expect(subarraySumEqualsK([1, 2, 3], 3)).toBe(2);
		expect(subarraySumEqualsK([1, -1, 0], 0)).toBe(3);
	});
});

describe("slidingWindowMaximum", () => {
	test("returns maximum for every window", () => {
		expect(slidingWindowMaximum([1, 3, -1, -3, 5, 3, 6, 7], 3)).toEqual([
			3, 3, 5, 5, 6, 7,
		]);
	});

	test("handles empty and invalid windows", () => {
		expect(slidingWindowMaximum([], 3)).toEqual([]);
		expect(slidingWindowMaximum([1, 2], 0)).toEqual([]);
	});
});

describe("kokoEatingBananas", () => {
	test("finds the minimum feasible speed", () => {
		expect(kokoEatingBananas([3, 6, 7, 11], 8)).toBe(4);
		expect(kokoEatingBananas([30, 11, 23, 4, 20], 5)).toBe(30);
	});
});

describe("productExceptSelf", () => {
	test("computes products without division", () => {
		expect(productExceptSelf([1, 2, 3, 4])).toEqual([24, 12, 8, 6]);
		expect(productExceptSelf([-1, 1, 0, -3, 3])).toEqual([0, 0, 9, 0, 0]);
	});
});

describe("interval patterns", () => {
	test("detects whether meetings overlap", () => {
		expect(
			canAttendMeetings([
				[0, 30],
				[35, 40],
			]),
		).toBe(true);
		expect(
			canAttendMeetings([
				[0, 30],
				[5, 10],
			]),
		).toBe(false);
	});

	test("removes the fewest overlapping intervals", () => {
		expect(
			eraseOverlapIntervals([
				[1, 2],
				[2, 3],
				[3, 4],
				[1, 3],
			]),
		).toBe(1);
		expect(
			eraseOverlapIntervals([
				[1, 2],
				[1, 2],
				[1, 2],
			]),
		).toBe(2);
	});
});

describe("backtracking patterns", () => {
	test("generates all subsets", () => {
		const result = subsets([1, 2]).map((subset) => subset.join(",")).sort();
		expect(result).toEqual(["", "1", "1,2", "2"]);
	});

	test("generates reusable candidate sums", () => {
		const result = combinationSum([2, 3, 6, 7], 7)
			.map((combo) => combo.join(","))
			.sort();

		expect(result).toEqual(["2,2,3", "7"]);
	});

	test("generates permutations", () => {
		const result = permutations([1, 2, 3])
			.map((permutation) => permutation.join(","))
			.sort();

		expect(result).toEqual(["1,2,3", "1,3,2", "2,1,3", "2,3,1", "3,1,2", "3,2,1"]);
	});
});

describe("numIslands", () => {
	test("counts islands in a grid", () => {
		expect(
			numIslands([
				["1", "1", "0", "0", "0"],
				["1", "1", "0", "0", "0"],
				["0", "0", "1", "0", "0"],
				["0", "0", "0", "1", "1"],
			]),
		).toBe(3);
	});

	test("handles empty and water-only grids", () => {
		expect(numIslands([])).toBe(0);
		expect(
			numIslands([
				["0", "0"],
				["0", "0"],
			]),
		).toBe(0);
	});
});

describe("graph patterns", () => {
	test("detects whether courses can be completed", () => {
		expect(canFinishCourses(2, [[1, 0]])).toBe(true);
		expect(
			canFinishCourses(2, [
				[1, 0],
				[0, 1],
			]),
		).toBe(false);
	});

	test("finds shortest path in a binary matrix", () => {
		expect(
			shortestPathBinaryMatrix([
				[0, 1],
				[1, 0],
			]),
		).toBe(2);
		expect(
			shortestPathBinaryMatrix([
				[1, 0],
				[0, 0],
			]),
		).toBe(-1);
	});

	test("checks bipartite graphs", () => {
		expect(isBipartite([[1, 3], [0, 2], [1, 3], [0, 2]])).toBe(true);
		expect(isBipartite([[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]])).toBe(false);
	});
});

describe("dynamic programming patterns", () => {
	test("computes LIS length", () => {
		expect(longestIncreasingSubsequence([10, 9, 2, 5, 3, 7, 101, 18])).toBe(4);
		expect(longestIncreasingSubsequence([7, 7, 7, 7])).toBe(1);
	});

	test("solves coin change", () => {
		expect(coinChange([1, 2, 5], 11)).toBe(3);
		expect(coinChange([2], 3)).toBe(-1);
	});

	test("solves word break", () => {
		expect(wordBreak("leetcode", ["leet", "code"])).toBe(true);
		expect(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])).toBe(false);
	});
});

describe("union-find patterns", () => {
	test("unions and queries connectivity", () => {
		const unionFind = new UnionFind(4);

		expect(unionFind.union(0, 1)).toBe(true);
		expect(unionFind.union(1, 2)).toBe(true);
		expect(unionFind.connected(0, 2)).toBe(true);
		expect(unionFind.connected(0, 3)).toBe(false);
		expect(unionFind.count()).toBe(2);
	});

	test("counts connected components", () => {
		expect(
			countComponents(5, [
				[0, 1],
				[1, 2],
				[3, 4],
			]),
		).toBe(2);
	});
});
