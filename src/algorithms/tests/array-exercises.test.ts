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

  test("should handle maxDays = 0", () => {
    const result = canFinishPrinting([1, 2, 3], 0, 10);
    expect(result).toBe(false);
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
