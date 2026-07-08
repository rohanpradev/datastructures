import { describe, expect, test } from "bun:test";
import {
	accountsMerge,
	binarySearch,
	canAttendMeetings,
	canFinishCourses,
	coinChange,
	combinationSum,
	containerWithMostWater,
	countComponents,
	dailyTemperatures,
	eraseOverlapIntervals,
	insertInterval,
	isBipartite,
	kokoEatingBananas,
	largestRectangleArea,
	lengthOfLongestSubstring,
	lowerBound,
	longestConsecutiveRun,
	longestIncreasingSubsequence,
	maxProfit,
	mergeOverlappingIntervals,
	minMeetingRooms,
	minWindowSubstring,
	numIslands,
	permutations,
	productExceptSelf,
	rottingOranges,
	searchRotatedSortedArray,
	shortestPathBinaryMatrix,
	slidingWindowMaximum,
	subarraySumEqualsK,
	subsets,
	threeSum,
	topKFrequentElements,
	trapRainWater,
	UnionFind,
	validParentheses,
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

describe("longestConsecutiveRun", () => {
	test("finds the longest run without sorting", () => {
		expect(longestConsecutiveRun([100, 4, 200, 1, 3, 2])).toBe(4);
		expect(longestConsecutiveRun([0, -1, 1, 2, 2])).toBe(4);
	});

	test("handles empty input", () => {
		expect(longestConsecutiveRun([])).toBe(0);
	});
});

describe("topKFrequentElements", () => {
	test("returns the most frequent values", () => {
		expect(topKFrequentElements([1, 1, 1, 2, 2, 3], 2).sort()).toEqual([
			1, 2,
		]);
		expect(topKFrequentElements([4, 4, 4, 6, 6, 7], 1)).toEqual([4]);
	});

	test("handles invalid k", () => {
		expect(topKFrequentElements([1, 2], 0)).toEqual([]);
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

describe("containerWithMostWater", () => {
	test("finds the maximum area", () => {
		expect(containerWithMostWater([1, 8, 6, 2, 5, 4, 8, 3, 7])).toBe(49);
		expect(containerWithMostWater([1, 1])).toBe(1);
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

describe("validParentheses", () => {
	test("accepts balanced bracket strings", () => {
		expect(validParentheses("()[]{}")).toBe(true);
		expect(validParentheses("{[()]}")).toBe(true);
	});

	test("rejects crossing or unfinished brackets", () => {
		expect(validParentheses("(]")).toBe(false);
		expect(validParentheses("([)]")).toBe(false);
		expect(validParentheses("(")).toBe(false);
	});
});

describe("dailyTemperatures", () => {
	test("returns waits for the next warmer day", () => {
		expect(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])).toEqual([
			1, 1, 4, 2, 1, 1, 0, 0,
		]);
	});

	test("returns zero where no warmer day exists", () => {
		expect(dailyTemperatures([80, 79, 78])).toEqual([0, 0, 0]);
	});
});

describe("largestRectangleArea", () => {
	test("computes the best histogram rectangle", () => {
		expect(largestRectangleArea([2, 1, 5, 6, 2, 3])).toBe(10);
		expect(largestRectangleArea([2, 4])).toBe(4);
	});

	test("handles empty histograms", () => {
		expect(largestRectangleArea([])).toBe(0);
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

describe("insertInterval", () => {
	test("inserts an interval without overlap", () => {
		expect(
			insertInterval(
				[
					[1, 2],
					[5, 7],
				],
				[3, 4],
			),
		).toEqual([
			[1, 2],
			[3, 4],
			[5, 7],
		]);
	});

	test("inserts and merges across multiple intervals", () => {
		expect(
			insertInterval(
				[
					[1, 2],
					[3, 5],
					[6, 7],
					[8, 10],
					[12, 16],
				],
				[4, 8],
			),
		).toEqual([
			[1, 2],
			[3, 10],
			[12, 16],
		]);
	});

	test("inserts into empty and edge-touching ranges", () => {
		expect(insertInterval([], [5, 7])).toEqual([[5, 7]]);
		expect(
			insertInterval(
				[
					[1, 3],
					[6, 9],
				],
				[3, 6],
			),
		).toEqual([[1, 9]]);
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

	test("merges overlapping intervals", () => {
		expect(
			mergeOverlappingIntervals([
				[1, 3],
				[2, 6],
				[8, 10],
				[15, 18],
			]),
		).toEqual([
			[1, 6],
			[8, 10],
			[15, 18],
		]);
		expect(
			mergeOverlappingIntervals([
				[1, 4],
				[4, 5],
			]),
		).toEqual([[1, 5]]);
	});

	test("counts required meeting rooms", () => {
		expect(
			minMeetingRooms([
				[0, 30],
				[5, 10],
				[15, 20],
			]),
		).toBe(2);
		expect(
			minMeetingRooms([
				[7, 10],
				[2, 4],
			]),
		).toBe(1);
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

describe("accountsMerge", () => {
	function normalize(accounts: string[][]): string[] {
		return accounts
			.map(([name, ...emails]) => [name, ...emails.sort()].join("|"))
			.sort();
	}

	test("merges accounts connected by shared emails", () => {
		const merged = accountsMerge([
			["John", "johnsmith@mail.com", "john_newyork@mail.com"],
			["John", "johnsmith@mail.com", "john00@mail.com"],
			["Mary", "mary@mail.com"],
			["John", "johnnybravo@mail.com"],
		]);

		expect(normalize(merged)).toEqual([
			"John|john00@mail.com|john_newyork@mail.com|johnsmith@mail.com",
			"John|johnnybravo@mail.com",
			"Mary|mary@mail.com",
		]);
	});

	test("merges transitive email connections", () => {
		const merged = accountsMerge([
			["Alex", "a@mail.com", "b@mail.com"],
			["Alex", "c@mail.com"],
			["Alex", "b@mail.com", "c@mail.com"],
		]);

		expect(normalize(merged)).toEqual(["Alex|a@mail.com|b@mail.com|c@mail.com"]);
	});

	test("deduplicates repeated emails and preserves email-less accounts", () => {
		expect(
			normalize(
				accountsMerge([
					["Nina", "n@mail.com", "n@mail.com"],
					["Solo"],
				]),
			),
		).toEqual(["Nina|n@mail.com", "Solo"]);
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

describe("rottingOranges", () => {
	test("returns minutes for multi-source BFS spread", () => {
		expect(
			rottingOranges([
				[2, 1, 1],
				[1, 1, 0],
				[0, 1, 1],
			]),
		).toBe(4);
	});

	test("returns -1 when fresh oranges are isolated", () => {
		expect(
			rottingOranges([
				[2, 1, 1],
				[0, 1, 1],
				[1, 0, 1],
			]),
		).toBe(-1);
	});

	test("handles no fresh oranges", () => {
		expect(rottingOranges([[0, 2]])).toBe(0);
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
