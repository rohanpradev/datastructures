import { describe, expect, test } from "bun:test";
import {
  findLongestString,
  findMaxMin,
  maxProfit,
  maxSubArray,
  removeDuplicates,
  removeElement,
  rotate,
  canFinishPrinting,
  twoSum,
  validateSubsequence,
  sortedSquaredArray,
  tournamentWinner,
  nonConstructableChange,
  transpose,
  backspaceStringCompare,
  maxPlanesStopped,
  minimumWaitingTime,
  classPhoto,
  tandemBicycle,
  optimalFreelancing,
  binarySearch,
  threeLargestNumbers,
  caesarCipherEncryptor,
  runLengthEncoding,
  threeNumberSum,
  smallestDifference,
} from "@/algorithms/arrays/array-exercises";

describe("removeElement", () => {
  test("should remove all instances of value", () => {
    const arr = [3, 2, 2, 3];
    const k = removeElement(arr, 3);

    expect(k).toBe(2);
    // First k elements should not contain val
    expect(arr.slice(0, k)).toEqual([2, 2]);
  });

  test("should handle no removals", () => {
    const arr = [1, 2, 3, 4];
    const k = removeElement(arr, 5);

    expect(k).toBe(4);
    expect(arr.slice(0, k)).toEqual([1, 2, 3, 4]);
  });

  test("should handle all elements removed", () => {
    const arr = [7, 7, 7, 7];
    const k = removeElement(arr, 7);

    expect(k).toBe(0);
  });

  test("should handle empty array", () => {
    const arr: number[] = [];
    const k = removeElement(arr, 5);

    expect(k).toBe(0);
  });

  test("should handle single element kept", () => {
    const arr = [1];
    const k = removeElement(arr, 2);

    expect(k).toBe(1);
    expect(arr[0]).toBe(1);
  });

  test("should handle single element removed", () => {
    const arr = [1];
    const k = removeElement(arr, 1);

    expect(k).toBe(0);
  });

  test("should handle multiple occurrences", () => {
    const arr = [0, 1, 2, 2, 3, 0, 4, 2];
    const k = removeElement(arr, 2);

    expect(k).toBe(5);
    const result = arr.slice(0, k);
    expect(result.sort()).toEqual([0, 0, 1, 3, 4]);
  });
});

describe("findMaxMin", () => {
  test("should find max and min in array", () => {
    const [max, min] = findMaxMin([3, 1, 4, 1, 5, 9, 2, 6]);
    expect(max).toBe(9);
    expect(min).toBe(1);
  });

  test("should handle single element", () => {
    const [max, min] = findMaxMin([42]);
    expect(max).toBe(42);
    expect(min).toBe(42);
  });

  test("should handle negative numbers", () => {
    const [max, min] = findMaxMin([-5, -1, -10, -3]);
    expect(max).toBe(-1);
    expect(min).toBe(-10);
  });

  test("should handle mixed positive and negative", () => {
    const [max, min] = findMaxMin([-5, 10, -20, 30]);
    expect(max).toBe(30);
    expect(min).toBe(-20);
  });

  test("should handle all same values", () => {
    const [max, min] = findMaxMin([5, 5, 5, 5]);
    expect(max).toBe(5);
    expect(min).toBe(5);
  });

  test("should handle two elements", () => {
    const [max, min] = findMaxMin([1, 2]);
    expect(max).toBe(2);
    expect(min).toBe(1);
  });

  test("should throw error for empty array", () => {
    expect(() => findMaxMin([])).toThrow("Array must not be empty");
  });

  test("should handle zeros", () => {
    const [max, min] = findMaxMin([0, -1, 1, 0]);
    expect(max).toBe(1);
    expect(min).toBe(-1);
  });
});

describe("findLongestString", () => {
  test("should find longest string", () => {
    const result = findLongestString(["apple", "banana", "kiwi"]);
    expect(result).toBe("banana");
  });

  test("should return first when multiple max length", () => {
    const result = findLongestString(["a", "bb", "cc"]);
    expect(result).toBe("bb");
  });

  test("should handle single string", () => {
    const result = findLongestString(["hello"]);
    expect(result).toBe("hello");
  });

  test("should handle empty strings", () => {
    const result = findLongestString(["", "a", ""]);
    expect(result).toBe("a");
  });

  test("should handle all empty strings", () => {
    const result = findLongestString(["", "", ""]);
    expect(result).toBe("");
  });

  test("should throw error for empty array", () => {
    expect(() => findLongestString([])).toThrow("Array must not be empty");
  });

  test("should handle very long strings", () => {
    const longString = "a".repeat(1000);
    const result = findLongestString(["short", longString, "medium"]);
    expect(result).toBe(longString);
  });

  test("should handle unicode characters", () => {
    const result = findLongestString(["🎉", "hello", "👋"]);
    expect(result).toBe("hello");
  });
});

describe("removeDuplicates", () => {
  test("should remove duplicates from sorted array", () => {
    const arr = [1, 1, 2];
    const k = removeDuplicates(arr);

    expect(k).toBe(2);
    expect(arr.slice(0, k)).toEqual([1, 2]);
  });

  test("should handle array with many duplicates", () => {
    const arr = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
    const k = removeDuplicates(arr);

    expect(k).toBe(5);
    expect(arr.slice(0, k)).toEqual([0, 1, 2, 3, 4]);
  });

  test("should handle no duplicates", () => {
    const arr = [1, 2, 3, 4, 5];
    const k = removeDuplicates(arr);

    expect(k).toBe(5);
    expect(arr.slice(0, k)).toEqual([1, 2, 3, 4, 5]);
  });

  test("should handle empty array", () => {
    const arr: number[] = [];
    const k = removeDuplicates(arr);

    expect(k).toBe(0);
  });

  test("should handle single element", () => {
    const arr = [1];
    const k = removeDuplicates(arr);

    expect(k).toBe(1);
    expect(arr[0]).toBe(1);
  });

  test("should handle all same elements", () => {
    const arr = [1, 1, 1, 1];
    const k = removeDuplicates(arr);

    expect(k).toBe(1);
    expect(arr[0]).toBe(1);
  });

  test("should handle two elements same", () => {
    const arr = [1, 1];
    const k = removeDuplicates(arr);

    expect(k).toBe(1);
    expect(arr[0]).toBe(1);
  });

  test("should handle negative numbers", () => {
    const arr = [-3, -3, -2, -1, -1, 0, 0, 0];
    const k = removeDuplicates(arr);

    expect(k).toBe(4);
    expect(arr.slice(0, k)).toEqual([-3, -2, -1, 0]);
  });
});

describe("maxProfit", () => {
  test("should find maximum profit", () => {
    const profit = maxProfit([7, 1, 5, 3, 6, 4]);
    expect(profit).toBe(5); // Buy at 1, sell at 6
  });

  test("should return 0 when no profit possible", () => {
    const profit = maxProfit([7, 6, 4, 3, 1]);
    expect(profit).toBe(0);
  });

  test("should handle single element", () => {
    const profit = maxProfit([5]);
    expect(profit).toBe(0);
  });

  test("should handle empty array", () => {
    const profit = maxProfit([]);
    expect(profit).toBe(0);
  });

  test("should handle two elements ascending", () => {
    const profit = maxProfit([1, 5]);
    expect(profit).toBe(4);
  });

  test("should handle two elements descending", () => {
    const profit = maxProfit([5, 1]);
    expect(profit).toBe(0);
  });

  test("should buy at lowest and sell at peak after", () => {
    const profit = maxProfit([2, 4, 1, 7, 5]);
    expect(profit).toBe(6); // Buy at 1, sell at 7
  });

  test("should handle multiple peaks", () => {
    const profit = maxProfit([3, 2, 6, 5, 0, 3]);
    expect(profit).toBe(4); // Buy at 2, sell at 6
  });

  test("should handle all same prices", () => {
    const profit = maxProfit([5, 5, 5, 5]);
    expect(profit).toBe(0);
  });
});

describe("rotate", () => {
  test("should rotate array to the right", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    rotate(arr, 3);
    expect(arr).toEqual([5, 6, 7, 1, 2, 3, 4]);
  });

  test("should handle k larger than array length", () => {
    const arr = [1, 2, 3];
    rotate(arr, 4); // Equivalent to k=1
    expect(arr).toEqual([3, 1, 2]);
  });

  test("should handle k = 0", () => {
    const arr = [1, 2, 3, 4];
    rotate(arr, 0);
    expect(arr).toEqual([1, 2, 3, 4]);
  });

  test("should handle k equal to array length", () => {
    const arr = [1, 2, 3];
    rotate(arr, 3);
    expect(arr).toEqual([1, 2, 3]);
  });

  test("should handle single element", () => {
    const arr = [1];
    rotate(arr, 5);
    expect(arr).toEqual([1]);
  });

  test("should handle two elements", () => {
    const arr = [1, 2];
    rotate(arr, 1);
    expect(arr).toEqual([2, 1]);
  });

  test("should handle empty array", () => {
    const arr: number[] = [];
    rotate(arr, 3);
    expect(arr).toEqual([]);
  });

  test("should handle negative numbers", () => {
    const arr = [-1, -100, 3, 99];
    rotate(arr, 2);
    expect(arr).toEqual([3, 99, -1, -100]);
  });

  test("should handle large k", () => {
    const arr = [1, 2, 3, 4, 5];
    rotate(arr, 12); // 12 % 5 = 2
    expect(arr).toEqual([4, 5, 1, 2, 3]);
  });
});

describe("maxSubArray", () => {
  test("should find maximum subarray sum", () => {
    const sum = maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
    expect(sum).toBe(6); // [4,-1,2,1]
  });

  test("should handle single element", () => {
    const sum = maxSubArray([1]);
    expect(sum).toBe(1);
  });

  test("should handle single negative element", () => {
    const sum = maxSubArray([-1]);
    expect(sum).toBe(-1);
  });

  test("should handle all positive numbers", () => {
    const sum = maxSubArray([5, 4, -1, 7, 8]);
    expect(sum).toBe(23); // Entire array
  });

  test("should handle all negative numbers", () => {
    const sum = maxSubArray([-1, -2, -3, -4]);
    expect(sum).toBe(-1); // Best single element
  });

  test("should handle two elements", () => {
    const sum = maxSubArray([1, -2]);
    expect(sum).toBe(1);
  });

  test("should handle zeros", () => {
    const sum = maxSubArray([0, -1, 0, 1]);
    expect(sum).toBe(1);
  });

  test("should handle alternating positive and negative", () => {
    const sum = maxSubArray([1, -1, 1, -1, 1]);
    expect(sum).toBe(1);
  });

  test("should throw error for empty array", () => {
    expect(() => maxSubArray([])).toThrow("Array must not be empty");
  });

  test("should handle large positive at end", () => {
    const sum = maxSubArray([-2, -3, -1, 100]);
    expect(sum).toBe(100);
  });

  test("should handle subarray in middle", () => {
    const sum = maxSubArray([-5, 1, 2, 3, -5]);
    expect(sum).toBe(6); // [1,2,3]
  });
});

describe("Array Exercises Integration", () => {
  test("should handle removing duplicates then rotating", () => {
    const arr = [1, 1, 2, 2, 3, 3];
    const k = removeDuplicates(arr);
    const unique = arr.slice(0, k); // [1, 2, 3]
    rotate(unique, 1);
    expect(unique).toEqual([3, 1, 2]);
  });

  test("should find max profit after removing element", () => {
    const prices = [7, 1, 5, 3, 6, 4, 6];
    removeElement(prices, 6); // Remove invalid prices
    const k = removeElement(prices, 6);
    const validPrices = prices.slice(0, k);
    const profit = maxProfit(validPrices);
    expect(profit).toBeGreaterThan(0);
  });

  test("should work with various array operations", () => {
    // Start with array
    const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5];

    // Find max and min
    const [max, min] = findMaxMin(arr);
    expect(max).toBe(9);
    expect(min).toBe(1);

    // Sort (for removeDuplicates)
    arr.sort((a, b) => a - b);

    // Remove duplicates
    const uniqueLength = removeDuplicates(arr);
    expect(uniqueLength).toBeLessThan(arr.length);

    // Rotate
    const unique = arr.slice(0, uniqueLength);
    rotate(unique, 2);
    expect(unique.length).toBe(uniqueLength);
  });
});

describe("canFinishPrinting", () => {
  test("should return true when batches fit exactly within days", () => {
    const result = canFinishPrinting([5, 5, 5], 3, 5);
    expect(result).toBe(true); // Each batch = 1 day
  });

  test("should return true when batches fit with leftover space", () => {
    const result = canFinishPrinting([3, 3, 3], 2, 10);
    // Day 1: 3+3+3 = 9 → all fit in 1 day but 2 allowed
    expect(result).toBe(true);
  });

  test("should return true for typical multi-day scenario", () => {
    const result = canFinishPrinting([5, 3, 4], 2, 10);
    // Day1: 5+3 = 8, Day2: 4
    expect(result).toBe(true);
  });

  test("should return false when batches require more days than allowed", () => {
    const result = canFinishPrinting([6, 6, 6], 2, 10);
    // Needs 3 days
    expect(result).toBe(false);
  });

  test("should return false when a single batch exceeds daily capacity", () => {
    const result = canFinishPrinting([12], 3, 10);
    expect(result).toBe(false);
  });

  test("should return true for empty batch list", () => {
    const result = canFinishPrinting([], 5, 10);
    expect(result).toBe(true); // nothing to print
  });

  test("should handle single batch that fits", () => {
    const result = canFinishPrinting([7], 1, 10);
    expect(result).toBe(true);
  });

  test("should return false when single batch doesn't fit in 1 day", () => {
    const result = canFinishPrinting([7], 1, 5);
    expect(result).toBe(false);
  });

  test("should handle day boundary transitions correctly", () => {
    const result = canFinishPrinting([4, 4, 4, 4], 2, 8);
    // Day1: 4+4, Day2: 4+4
    expect(result).toBe(true);
  });

  test("should fail when transitions exceed allowed days", () => {
    const result = canFinishPrinting([4, 4, 4, 4], 1, 8);
    // Would require 2 days
    expect(result).toBe(false);
  });

  test("should handle maxPagesPerDay = 0", () => {
    const result = canFinishPrinting([1, 2, 3], 5, 0);
    expect(result).toBe(false); // nothing can be printed
  });

  test("should handle very large capacity allowing all in 1 day", () => {
    const result = canFinishPrinting([5, 10, 20], 1, 100);
    expect(result).toBe(true);
  });

  test("should handle multiple daily resets", () => {
    const result = canFinishPrinting([3, 8, 2, 7, 5], 3, 10);
    // Day1: 3+8 exceeds → 3 only, next day
    // Day2: 8+2 = 10
    // Day3: 7 (5 cannot be reached → fail)
    expect(result).toBe(false);
  });

  test("should pass scenario where exact last day is used fully", () => {
    const result = canFinishPrinting([5, 5, 10], 2, 10);
    // Day1: 5+5 = 10
    // Day2: 10
    expect(result).toBe(true);
  });

  test("should fail when exceeding last day by one batch", () => {
    const result = canFinishPrinting([5, 5, 10, 1], 2, 10);
    // Day1: 10
    // Day2: 10
    // Day3 needed for 1 → fail
    expect(result).toBe(false);
  });
});

describe("twoSum", () => {
  test("should find indices of two numbers that sum to target", () => {
    const arr = [2, 7, 11, 15];
    const result = twoSum(arr, 9)!;

    expect(arr[result[0]] + arr[result[1]]).toBe(9);
  });

  test("should handle array with duplicate values", () => {
    const arr = [3, 3];
    const result = twoSum(arr, 6)!;

    expect(arr[result[0]] + arr[result[1]]).toBe(6);
  });

  test("should return undefined when no solution exists", () => {
    const arr = [1, 2, 3, 4];
    const result = twoSum(arr, 10);

    expect(result).toBeUndefined();
  });

  test("should handle negative numbers", () => {
    const arr = [-3, 4, 1, 2];
    const result = twoSum(arr, -1)!;

    expect(arr[result[0]] + arr[result[1]]).toBe(-1);
  });

  test("should not use the same element twice", () => {
    const arr = [3];
    const result = twoSum(arr, 6);

    expect(result).toBeUndefined();
  });

  test("should handle empty array", () => {
    const arr: number[] = [];
    const result = twoSum(arr, 5);

    expect(result).toBeUndefined();
  });

  test("should return any valid indices when solution appears later", () => {
    const arr = [1, 5, 3, 7];
    const result = twoSum(arr, 8)!;

    expect(arr[result[0]] + arr[result[1]]).toBe(8);
  });

  test("should handle zero correctly", () => {
    const arr = [0, 4, 3, 0];
    const result = twoSum(arr, 0)!;

    expect(arr[result[0]] + arr[result[1]]).toBe(0);
  });
});

describe("validateSubsequence", () => {
  test("returns true when sequence is a valid subsequence", () => {
    const array = [5, 1, 22, 25, 6, -1, 8, 10];
    const sequence = [1, 6, -1, 10];

    expect(validateSubsequence(array, sequence)).toBe(true);
  });

  test("returns true when sequence elements are contiguous", () => {
    expect(validateSubsequence([1, 2, 3, 4], [2, 3])).toBe(true);
  });

  test("returns true when sequence contains a single element", () => {
    expect(validateSubsequence([1, 2, 3], [2])).toBe(true);
  });

  test("returns true when sequence is empty", () => {
    expect(validateSubsequence([1, 2, 3], [])).toBe(true);
  });

  test("returns false when sequence order is incorrect", () => {
    expect(validateSubsequence([1, 2, 3], [3, 2])).toBe(false);
  });

  test("returns false when sequence contains elements not in array", () => {
    expect(validateSubsequence([1, 2, 3, 4], [2, 5])).toBe(false);
  });

  test("returns false when sequence is longer than array", () => {
    expect(validateSubsequence([1, 2], [1, 2, 3])).toBe(false);
  });

  test("handles duplicate values correctly", () => {
    const array = [1, 1, 1, 2, 2, 3];
    const sequence = [1, 2, 3];

    expect(validateSubsequence(array, sequence)).toBe(true);
  });

  test("fails when duplicates appear in the wrong order", () => {
    const array = [1, 2, 1, 2];
    const sequence = [2, 1];

    expect(validateSubsequence(array, sequence)).toBe(true);
  });

  test("returns false when array is empty and sequence is not", () => {
    expect(validateSubsequence([], [1])).toBe(false);
  });

  test("returns true when both array and sequence are empty", () => {
    expect(validateSubsequence([], [])).toBe(true);
  });
});

describe("sortedSquaredArray", () => {
  test("should handle mixed negative and positive numbers", () => {
    const nums = [-4, -1, 0, 3, 10];
    const result = sortedSquaredArray(nums);

    expect(result).toEqual([0, 1, 9, 16, 100]);
  });

  test("should handle all negative numbers", () => {
    const nums = [-7, -5, -3, -1];
    const result = sortedSquaredArray(nums);

    expect(result).toEqual([1, 9, 25, 49]);
  });

  test("should handle all positive numbers", () => {
    const nums = [1, 2, 3, 4];
    const result = sortedSquaredArray(nums);

    expect(result).toEqual([1, 4, 9, 16]);
  });

  test("should handle array with zeros", () => {
    const nums = [-2, 0, 0, 3];
    const result = sortedSquaredArray(nums);

    expect(result).toEqual([0, 0, 4, 9]);
  });

  test("should handle single element", () => {
    const nums = [-5];
    const result = sortedSquaredArray(nums);

    expect(result).toEqual([25]);
  });

  test("should handle empty array", () => {
    const nums: number[] = [];
    const result = sortedSquaredArray(nums);

    expect(result).toEqual([]);
  });

  test("should not mutate the original array", () => {
    const nums = [-3, -1, 2];
    const copy = [...nums];

    sortedSquaredArray(nums);

    expect(nums).toEqual(copy);
  });
});

describe("tournamentWinner", () => {
  test("should return the correct winner for a basic tournament", () => {
    const competitions: Array<[string, string]> = [
      ["HTML", "C#"],
      ["C#", "Python"],
      ["Python", "HTML"],
    ];
    const results = [0, 0, 1];

    expect(tournamentWinner(competitions, results)).toBe("Python");
  });

  test("should handle a single match", () => {
    expect(tournamentWinner([["A", "B"]], [1])).toBe("A");
  });

  test("should handle all wins by the same team", () => {
    const competitions: Array<[string, string]> = [
      ["A", "B"],
      ["A", "C"],
      ["A", "D"],
    ];
    const results = [1, 1, 1];

    expect(tournamentWinner(competitions, results)).toBe("A");
  });

  test("should handle alternating winners", () => {
    const competitions: Array<[string, string]> = [
      ["A", "B"],
      ["B", "C"],
      ["C", "A"],
      ["A", "C"],
    ];
    const results = [1, 1, 1, 0];

    // C ends with the most wins (2)
    expect(tournamentWinner(competitions, results)).toBe("C");
  });

  test("should keep first leader when all teams tie", () => {
    const competitions: Array<[string, string]> = [
      ["X", "Y"],
      ["Y", "Z"],
      ["Z", "X"],
    ];
    const results = [1, 1, 1];

    // All teams have 1 win → first leader remains
    expect(tournamentWinner(competitions, results)).toBe("X");
  });

  test("should return empty string when no competitions are played", () => {
    expect(tournamentWinner([], [])).toBe("");
  });
});

describe("nonConstructableChange", () => {
  test("should handle basic example", () => {
    const nums = [1, 2, 5];
    expect(nonConstructableChange(nums)).toBe(4);
  });

  test("should handle sequential coins", () => {
    const nums = [1, 1, 1, 1];
    expect(nonConstructableChange(nums)).toBe(5);
  });

  test("should return 1 when first coin is greater than 1", () => {
    const nums = [2, 3, 4];
    expect(nonConstructableChange(nums)).toBe(1);
  });

  test("should handle empty array", () => {
    const nums: number[] = [];
    expect(nonConstructableChange(nums)).toBe(1);
  });

  test("should handle single coin equal to 1", () => {
    const nums = [1];
    expect(nonConstructableChange(nums)).toBe(2);
  });

  test("should handle single coin greater than 1", () => {
    const nums = [7];
    expect(nonConstructableChange(nums)).toBe(1);
  });

  test("should handle larger random set", () => {
    const nums = [1, 1, 3, 4, 7, 10];
    expect(nonConstructableChange(nums)).toBe(27);
  });

  test("should handle unsorted input array", () => {
    const nums = [5, 1, 3, 1];
    expect(nonConstructableChange(nums)).toBe(11);
  });
});

describe("transpose", () => {
  test("transposes a square matrix", () => {
    const input = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const output = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ];

    expect(transpose(input)).toEqual(output);
  });

  test("transposes a rectangular matrix (more rows than columns)", () => {
    const input = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];

    const output = [
      [1, 3, 5],
      [2, 4, 6],
    ];

    expect(transpose(input)).toEqual(output);
  });

  test("transposes a rectangular matrix (more columns than rows)", () => {
    const input = [[1, 2, 3]];

    const output = [[1], [2], [3]];

    expect(transpose(input)).toEqual(output);
  });

  test("handles a single-element matrix", () => {
    const input = [[42]];
    const output = [[42]];

    expect(transpose(input)).toEqual(output);
  });

  test("handles a single row matrix", () => {
    const input = [[1, 2, 3, 4]];
    const output = [[1], [2], [3], [4]];

    expect(transpose(input)).toEqual(output);
  });

  test("handles a single column matrix", () => {
    const input = [[1], [2], [3]];
    const output = [[1, 2, 3]];

    expect(transpose(input)).toEqual(output);
  });

  test("handles negative numbers and zero", () => {
    const input = [
      [0, -1],
      [-2, 3],
    ];

    const output = [
      [0, -2],
      [-1, 3],
    ];

    expect(transpose(input)).toEqual(output);
  });

  test("does not mutate the original matrix", () => {
    const input = [
      [1, 2],
      [3, 4],
    ];

    const original = structuredClone(input);
    transpose(input);

    expect(input).toEqual(original);
  });
});

describe("backspaceStringCompare", () => {
  test("returns true for identical strings without backspaces", () => {
    expect(backspaceStringCompare("abc", "abc")).toBe(true);
  });

  test("handles single backspace correctly", () => {
    expect(backspaceStringCompare("ab#c", "ac")).toBe(true);
  });

  test("handles multiple backspaces in a row", () => {
    expect(backspaceStringCompare("a##c", "#a#c")).toBe(true);
  });

  test("returns false when final strings differ", () => {
    expect(backspaceStringCompare("a#c", "b")).toBe(false);
  });

  test("handles backspaces at the beginning", () => {
    expect(backspaceStringCompare("###abc", "abc")).toBe(true);
  });

  test("handles backspaces that exceed character count", () => {
    expect(backspaceStringCompare("abc####", "")).toBe(true);
  });

  test("handles empty strings", () => {
    expect(backspaceStringCompare("", "")).toBe(true);
  });

  test("handles one empty and one non-empty string", () => {
    expect(backspaceStringCompare("", "a")).toBe(false);
  });

  test("handles only backspaces", () => {
    expect(backspaceStringCompare("###", "####")).toBe(true);
  });

  test("handles interleaved characters and backspaces", () => {
    expect(backspaceStringCompare("bxj##tw", "bxo#j##tw")).toBe(true);
  });

  test("detects mismatch after backspaces", () => {
    expect(backspaceStringCompare("xy#z", "xzz#")).toBe(true);
  });
});

describe("Max Planes Stopped Before Landing", () => {
  test("should return 0 when there are no planes", () => {
    const result = maxPlanesStopped([], []);
    expect(result).toBe(0);
  });

  test("should handle a single plane", () => {
    const result = maxPlanesStopped([5], [1]);
    expect(result).toBe(1);
  });

  test("should return the maximum planes stopped for given example", () => {
    const initialDistance = [1, 3, 5, 4, 8];
    const landingSpeed = [1, 2, 2, 1, 2];
    const result = maxPlanesStopped(initialDistance, landingSpeed);
    expect(result).toBe(4);
  });

  test("should handle planes landing at the same time", () => {
    const initialDistance = [2, 4, 6];
    const landingSpeed = [2, 4, 6]; // landing times: [1,1,1]
    const result = maxPlanesStopped(initialDistance, landingSpeed);
    expect(result).toBe(1); // only one plane per second can be stopped
  });

  test("should handle planes with large distances and speeds", () => {
    const initialDistance = [100, 200, 300];
    const landingSpeed = [10, 20, 30]; // landing times: [10,10,10]
    const result = maxPlanesStopped(initialDistance, landingSpeed);
    expect(result).toBe(3); // stop one per second before deadline
  });

  test("should handle fast planes landing before others", () => {
    const initialDistance = [5, 10, 15];
    const landingSpeed = [5, 1, 1]; // landing times: [1,10,15]
    const result = maxPlanesStopped(initialDistance, landingSpeed);
    expect(result).toBe(3);
  });

  test("should handle planes where some land too quickly", () => {
    const initialDistance = [1, 5, 6, 7];
    const landingSpeed = [2, 1, 1, 1]; // landing times: [1,5,6,7]
    const result = maxPlanesStopped(initialDistance, landingSpeed);
    expect(result).toBe(4);
  });

  test("should handle unsorted input arrays", () => {
    const initialDistance = [10, 2, 8, 1];
    const landingSpeed = [2, 1, 4, 1]; // landing times: [5,2,2,1]
    const result = maxPlanesStopped(initialDistance, landingSpeed);
    expect(result).toBe(3);
  });
});

describe("minimumWaitingTime", () => {
  test("should return correct waiting time for example input", () => {
    expect(minimumWaitingTime([3, 2, 1, 2, 6])).toBe(17);
  });

  test("should return 0 for empty array", () => {
    expect(minimumWaitingTime([])).toBe(0);
  });

  test("should return 0 for single task", () => {
    expect(minimumWaitingTime([5])).toBe(0);
  });

  test("should return correct waiting time for already sorted tasks", () => {
    // [1, 2, 3, 4] → waiting times: 0, 1, 3, 6 → total 10
    expect(minimumWaitingTime([1, 2, 3, 4])).toBe(10);
  });

  test("should return correct waiting time for reverse sorted tasks", () => {
    // [4, 3, 2, 1] → sort → [1, 2, 3, 4] → total 10
    expect(minimumWaitingTime([4, 3, 2, 1])).toBe(10);
  });

  test("should handle tasks with duplicate durations", () => {
    // [2, 2, 2] → waiting times: 0, 2, 4 → total 6
    expect(minimumWaitingTime([2, 2, 2])).toBe(6);
  });

  test("should handle large numbers", () => {
    // [10, 20, 30] → sort → [10,20,30] → waiting times: 0,10,30 → total 40
    expect(minimumWaitingTime([10, 20, 30])).toBe(40);
  });
});

describe("classPhoto", () => {
  test("should return true when one group is strictly taller", () => {
    const redShirts = [5, 8, 1, 3, 4];
    const blueShirts = [6, 9, 2, 4, 5];

    const result = classPhoto(redShirts, blueShirts);

    expect(result).toBe(true);
  });

  test("should return false when heights are equal at any position", () => {
    const redShirts = [5, 6, 7];
    const blueShirts = [5, 6, 7];

    const result = classPhoto(redShirts, blueShirts);

    expect(result).toBe(false);
  });

  test("should return false when rows cannot be arranged", () => {
    const redShirts = [6, 5, 4];
    const blueShirts = [7, 3, 5];

    const result = classPhoto(redShirts, blueShirts);

    expect(result).toBe(false);
  });

  test("should handle single student per row", () => {
    const redShirts = [5];
    const blueShirts = [6];

    const result = classPhoto(redShirts, blueShirts);

    expect(result).toBe(true);
  });

  test("should return false for single student of equal height", () => {
    const redShirts = [5];
    const blueShirts = [5];

    const result = classPhoto(redShirts, blueShirts);

    expect(result).toBe(false);
  });

  test("should return false when array lengths differ", () => {
    const redShirts = [5, 6];
    const blueShirts = [7];

    const result = classPhoto(redShirts, blueShirts);

    expect(result).toBe(false);
  });

  test("should work when red shirts are in the back row", () => {
    const redShirts = [10, 8, 6];
    const blueShirts = [9, 7, 5];

    const result = classPhoto(redShirts, blueShirts);

    expect(result).toBe(true);
  });

  test("should handle already sorted arrays", () => {
    const redShirts = [9, 7, 5];
    const blueShirts = [10, 8, 6];

    const result = classPhoto(redShirts, blueShirts);

    expect(result).toBe(true);
  });

  test("should handle unsorted arrays", () => {
    const redShirts = [3, 6, 1, 8];
    const blueShirts = [4, 7, 2, 9];

    const result = classPhoto(redShirts, blueShirts);

    expect(result).toBe(true);
  });

  test("should fail if any back-row student is not strictly taller", () => {
    const redShirts = [9, 7, 5];
    const blueShirts = [10, 6, 6];

    const result = classPhoto(redShirts, blueShirts);

    expect(result).toBe(false);
  });
});

test("returns fastest total speed", () => {
  const red = [5, 5, 3, 9, 2];
  const blue = [3, 6, 7, 2, 1];

  const result = tandemBicycle(red, blue, true);
  expect(result).toBe(32);
});

test("returns slowest total speed", () => {
  const red = [5, 5, 3, 9, 2];
  const blue = [3, 6, 7, 2, 1];

  const result = tandemBicycle(red, blue, false);
  expect(result).toBe(25);
});

test("works with equal speeds", () => {
  const red = [4, 4, 4];
  const blue = [4, 4, 4];

  expect(tandemBicycle(red, blue, true)).toBe(12);
  expect(tandemBicycle(red, blue, false)).toBe(12);
});

test("works with a single rider", () => {
  const red = [10];
  const blue = [3];

  expect(tandemBicycle(red, blue, true)).toBe(10);
  expect(tandemBicycle(red, blue, false)).toBe(10);
});

test("handles unsorted input arrays", () => {
  const red = [1, 7, 3];
  const blue = [6, 2, 4];

  expect(tandemBicycle(red, blue, true)).toBe(17);
  expect(tandemBicycle(red, blue, false)).toBe(13);
});

test("handles already sorted arrays", () => {
  const red = [1, 2, 3];
  const blue = [4, 5, 6];

  expect(tandemBicycle(red, blue, true)).toBe(15);
  expect(tandemBicycle(red, blue, false)).toBe(15);
});

describe("optimalFreelancing", () => {
  test("should schedule jobs to maximize total payment", () => {
    const jobs = [
      { deadline: 1, payment: 100 },
      { deadline: 2, payment: 19 },
      { deadline: 2, payment: 27 },
      { deadline: 1, payment: 25 },
      { deadline: 3, payment: 15 },
    ];

    const result = optimalFreelancing(jobs);

    // Optimal schedule: 100 (day 1) + 27 (day 2) + 15 (day 3)
    expect(result).toBe(142);
  });

  test("should handle jobs with same deadline", () => {
    const jobs = [
      { deadline: 1, payment: 50 },
      { deadline: 1, payment: 40 },
      { deadline: 1, payment: 30 },
    ];

    const result = optimalFreelancing(jobs);

    // Only one job can be done on day 1
    expect(result).toBe(50);
  });

  test("should schedule jobs as late as possible", () => {
    const jobs = [
      { deadline: 3, payment: 20 },
      { deadline: 1, payment: 100 },
      { deadline: 2, payment: 50 },
    ];

    const result = optimalFreelancing(jobs);

    // Day 1 → 100, Day 2 → 50, Day 3 → 20
    expect(result).toBe(170);
  });

  test("should skip jobs that cannot be scheduled", () => {
    const jobs = [
      { deadline: 1, payment: 100 },
      { deadline: 1, payment: 90 },
      { deadline: 1, payment: 80 },
    ];

    const result = optimalFreelancing(jobs);

    // Only one job fits on day 1
    expect(result).toBe(100);
  });

  test("should handle empty job list", () => {
    const jobs: Array<{ deadline: number; payment: number }> = [];

    const result = optimalFreelancing(jobs);

    expect(result).toBe(0);
  });

  test("should handle single job", () => {
    const jobs = [{ deadline: 5, payment: 75 }];

    const result = optimalFreelancing(jobs);

    expect(result).toBe(75);
  });

  test("should ignore jobs with deadline <= 0", () => {
    const jobs = [
      { deadline: 0, payment: 100 },
      { deadline: -1, payment: 50 },
      { deadline: 1, payment: 30 },
    ];

    const result = optimalFreelancing(jobs);

    // Only the valid job can be scheduled
    expect(result).toBe(30);
  });
});

describe("binarySearch", () => {
  test("should find target in the middle of the array", () => {
    const arr = [1, 3, 5, 7, 9];
    const index = binarySearch(arr, 5);

    expect(index).toBe(2);
  });

  test("should find target at the beginning of the array", () => {
    const arr = [2, 4, 6, 8, 10];
    const index = binarySearch(arr, 2);

    expect(index).toBe(0);
  });

  test("should find target at the end of the array", () => {
    const arr = [2, 4, 6, 8, 10];
    const index = binarySearch(arr, 10);

    expect(index).toBe(4);
  });

  test("should return null when target is not present", () => {
    const arr = [1, 2, 3, 4, 5];
    const index = binarySearch(arr, 6);

    expect(index).toBeNull();
  });

  test("should handle empty array", () => {
    const arr: number[] = [];
    const index = binarySearch(arr, 3);

    expect(index).toBeNull();
  });

  test("should handle single-element array when target exists", () => {
    const arr = [7];
    const index = binarySearch(arr, 7);

    expect(index).toBe(0);
  });

  test("should handle single-element array when target does not exist", () => {
    const arr = [7];
    const index = binarySearch(arr, 3);

    expect(index).toBeNull();
  });

  test("should work with negative numbers", () => {
    const arr = [-10, -5, -2, 0, 3, 8];
    const index = binarySearch(arr, -5);

    expect(index).toBe(1);
  });

  test("should work with duplicate values (returns any valid index)", () => {
    const arr = [1, 2, 2, 2, 3];
    const index = binarySearch(arr, 2);

    expect(index).not.toBeNull();
    expect(arr[index!]).toBe(2);
  });

  test("should not modify the input array", () => {
    const arr = [1, 3, 5, 7, 9];
    const copy = [...arr];

    binarySearch(arr, 5);

    expect(arr).toEqual(copy);
  });

  test("should handle target smaller than all elements", () => {
    const arr = [5, 10, 15];
    const index = binarySearch(arr, 1);

    expect(index).toBeNull();
  });

  test("should handle target larger than all elements", () => {
    const arr = [5, 10, 15];
    const index = binarySearch(arr, 20);

    expect(index).toBeNull();
  });
});

describe("threeLargestNumbers", () => {
  test("returns the three largest numbers in correct order", () => {
    const nums = [10, 5, 9, 10, 12];
    const result = threeLargestNumbers(nums);

    expect(result).toEqual([10, 10, 12]);
  });

  test("handles array with exactly three elements", () => {
    const nums = [1, 2, 3];
    const result = threeLargestNumbers(nums);

    expect(result).toEqual([1, 2, 3]);
  });

  test("handles negative numbers", () => {
    const nums = [-10, -5, -2, -1];
    const result = threeLargestNumbers(nums);

    expect(result).toEqual([-5, -2, -1]);
  });

  test("handles duplicate values", () => {
    const nums = [4, 4, 4, 4];
    const result = threeLargestNumbers(nums);

    expect(result).toEqual([4, 4, 4]);
  });

  test("handles mixed positive and negative values", () => {
    const nums = [-1, 3, 0, 2, 5];
    const result = threeLargestNumbers(nums);

    expect(result).toEqual([2, 3, 5]);
  });

  test("handles numbers in descending order", () => {
    const nums = [9, 8, 7, 6, 5];
    const result = threeLargestNumbers(nums);

    expect(result).toEqual([7, 8, 9]);
  });

  test("handles numbers in ascending order", () => {
    const nums = [1, 2, 3, 4, 5];
    const result = threeLargestNumbers(nums);

    expect(result).toEqual([3, 4, 5]);
  });

  test("does not mutate the input array", () => {
    const nums = [3, 1, 2, 4];
    const copy = [...nums];

    threeLargestNumbers(nums);

    expect(nums).toEqual(copy);
  });

  test("handles large numbers", () => {
    const nums = [Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER, 42];
    const result = threeLargestNumbers(nums);

    expect(result).toEqual([0, 42, Number.MAX_SAFE_INTEGER]);
  });

  test("handles repeated insertion of same value", () => {
    const nums = [5, 5, 1, 5, 2];
    const result = threeLargestNumbers(nums);

    expect(result).toEqual([5, 5, 5]);
  });
});

describe("caesarCipherEncryptor", () => {
  test("shifts lowercase letters correctly", () => {
    const result = caesarCipherEncryptor("abc", 1);
    expect(result).toBe("bcd");
  });

  test("wraps around the alphabet", () => {
    const result = caesarCipherEncryptor("xyz", 2);
    expect(result).toBe("zab");
  });

  test("handles shift values greater than 26", () => {
    const result = caesarCipherEncryptor("abc", 28);
    expect(result).toBe("cde");
  });

  test("handles negative shifts", () => {
    const result = caesarCipherEncryptor("bcd", -1);
    expect(result).toBe("abc");
  });

  test("handles full lowercase alphabet input", () => {
    const result = caesarCipherEncryptor("abcdefghijklmnopqrstuvwxyz", 1);
    expect(result).toBe("bcdefghijklmnopqrstuvwxyza");
  });

  test("handles uppercase letters correctly", () => {
    const result = caesarCipherEncryptor("ABC", 2);
    expect(result).toBe("CDE");
  });

  test("wraps around uppercase letters", () => {
    const result = caesarCipherEncryptor("XYZ", 3);
    expect(result).toBe("ABC");
  });

  test("handles mixed uppercase and lowercase letters", () => {
    const result = caesarCipherEncryptor("AbCz", 1);
    expect(result).toBe("BcDa");
  });

  test("preserves spaces and special characters", () => {
    const result = caesarCipherEncryptor("Hello, World!", 3);
    expect(result).toBe("Khoor, Zruog!");
  });

  test("preserves numbers and symbols", () => {
    const result = caesarCipherEncryptor("123!@#", 5);
    expect(result).toBe("123!@#");
  });

  test("handles zero shift (returns same string)", () => {
    const result = caesarCipherEncryptor("NoChange", 0);
    expect(result).toBe("NoChange");
  });

  test("handles very large negative shifts", () => {
    const result = caesarCipherEncryptor("abc", -27);
    expect(result).toBe("zab");
  });

  test("handles empty string", () => {
    const result = caesarCipherEncryptor("", 5);
    expect(result).toBe("");
  });

  test("does not mutate the input string", () => {
    const input = "abc";
    caesarCipherEncryptor(input, 1);
    expect(input).toBe("abc");
  });

  test("handles repeated characters", () => {
    const result = caesarCipherEncryptor("aaa", 3);
    expect(result).toBe("ddd");
  });
});

describe("runLengthEncoding", () => {
  test("encodes simple repeated characters", () => {
    expect(runLengthEncoding("aaabbc")).toBe("3a2b1c");
  });

  test("handles long runs with count > 9", () => {
    expect(runLengthEncoding("AAAAAAAAAAAAA")).toBe("9A4A"); // 13 As
  });

  test("handles single characters", () => {
    expect(runLengthEncoding("A")).toBe("1A");
  });

  test("handles multiple single characters", () => {
    expect(runLengthEncoding("ABCD")).toBe("1A1B1C1D");
  });

  test("handles empty string", () => {
    expect(runLengthEncoding("")).toBe("");
  });

  test("handles mixed long and short runs", () => {
    expect(runLengthEncoding("AAAAAAAAAAAAABBCCCCDD")).toBe("9A4A2B4C2D");
  });

  test("handles alternating characters", () => {
    expect(runLengthEncoding("ABABAB")).toBe("1A1B1A1B1A1B");
  });

  test("handles exactly 9 consecutive characters", () => {
    expect(runLengthEncoding("AAAAAAAAA")).toBe("9A");
  });

  test("handles 10 consecutive characters", () => {
    expect(runLengthEncoding("AAAAAAAAAA")).toBe("9A1A");
  });

  test("handles all letters unique", () => {
    expect(runLengthEncoding("ABCDEFGHIJKLMNOPQRSTUVWXYZ")).toBe(
      "1A1B1C1D1E1F1G1H1I1J1K1L1M1N1O1P1Q1R1S1T1U1V1W1X1Y1Z",
    );
  });
});

describe("threeNumberSum", () => {
  test("should find all triplets that sum to target", () => {
    const nums = [1, 2, 3, 4, 5, 6];
    const target = 10;
    const result = threeNumberSum(nums, target);

    expect(result).toEqual([
      [1, 3, 6],
      [1, 4, 5],
      [2, 3, 5],
    ]);
  });

  test("should handle negative numbers", () => {
    const nums = [0, -1, 2, -3, 1];
    const target = 0;
    const result = threeNumberSum(nums, target);

    expect(result).toEqual([
      [-3, 1, 2],
      [-1, 0, 1],
    ]);
  });

  test("should handle empty array", () => {
    const result = threeNumberSum([], 5);
    expect(result).toEqual([]);
  });

  test("should handle array with less than 3 numbers", () => {
    expect(threeNumberSum([1, 2], 3)).toEqual([]);
    expect(threeNumberSum([5], 5)).toEqual([]);
  });

  test("should handle duplicates in array", () => {
    const nums = [1, 2, 2, 3, 3, 4];
    const target = 7;
    const result = threeNumberSum(nums, target);

    expect(result).toEqual([
      [1, 2, 4],
      [1, 3, 3],
      [2, 2, 3],
    ]);
  });

  test("should return empty array when no triplets sum to target", () => {
    const nums = [1, 2, 3, 4, 5];
    const target = 50;
    const result = threeNumberSum(nums, target);

    expect(result).toEqual([]);
  });
});

describe("smallestDifference", () => {
  test("should find the smallest difference for normal arrays", () => {
    const arr1 = [1, 3, 15, 11, 2];
    const arr2 = [23, 127, 235, 19, 8];
    const result = smallestDifference(arr1, arr2);

    expect(result).toEqual([11, 8]);
  });

  test("should handle arrays with negative numbers", () => {
    const arr1 = [-1, -5, 4, 10];
    const arr2 = [3, -2, 8, -7];
    const result = smallestDifference(arr1, arr2);

    expect(result).toEqual([-1, -2]);
  });

  test("should handle arrays with single element each", () => {
    const arr1 = [5];
    const arr2 = [10];
    const result = smallestDifference(arr1, arr2);

    expect(result).toEqual([5, 10]);
  });

  test("should handle arrays with multiple equal differences", () => {
    const arr1 = [1, 3, 5];
    const arr2 = [2, 4, 6];
    const result = smallestDifference(arr1, arr2);

    // Multiple pairs have difference 1, but first one found is [1,2]
    expect(result).toEqual([1, 2]);
  });

  test("should handle arrays with zero", () => {
    const arr1 = [0, 10, 20];
    const arr2 = [5, 15, 25];
    const result = smallestDifference(arr1, arr2);

    expect(result).toEqual([0, 5]);
  });

  test("should throw error if one array is empty", () => {
    expect(() => smallestDifference([], [1, 2, 3])).toThrow(
      "Both arrays must have at least one element",
    );
    expect(() => smallestDifference([1, 2, 3], [])).toThrow(
      "Both arrays must have at least one element",
    );
  });

  test("should handle arrays with same elements", () => {
    const arr1 = [7, 7, 7];
    const arr2 = [7, 7, 7];
    const result = smallestDifference(arr1, arr2);

    expect(result).toEqual([7, 7]);
  });
});
