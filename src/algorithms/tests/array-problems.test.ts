import { describe, test, expect } from "bun:test";
import {
  mergeIntervals,
  findBestSeat,
  zeroSumSubarray,
  maxMedianSum,
  majorityElement,
  missingNumbers,
} from "@/algorithms/arrays/array-problems";

describe("mergeIntervals", () => {
  test("merges overlapping intervals", () => {
    const intervals: [number, number][] = [
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18],
    ];
    const result = mergeIntervals(intervals);
    expect(result).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ]);
  });

  test("merges touching intervals", () => {
    const intervals: [number, number][] = [
      [1, 4],
      [4, 5],
    ];
    const result = mergeIntervals(intervals);
    expect(result).toEqual([[1, 5]]);
  });

  test("handles empty input", () => {
    const intervals: [number, number][] = [];
    const result = mergeIntervals(intervals);
    expect(result).toEqual([]);
  });
});

describe("findBestSeat", () => {
  test("finds best seat in the middle", () => {
    const seats = [1, 0, 0, 0, 1] as (0 | 1)[];
    const result = findBestSeat(seats);
    expect(result).toBe(2);
  });

  test("returns first empty seat if only one empty seat", () => {
    const seats = [1, 1, 0, 1] as (0 | 1)[];
    const result = findBestSeat(seats);
    expect(result).toBe(2);
  });

  test("returns -1 if all seats occupied", () => {
    const seats = [1, 1, 1] as (0 | 1)[];
    const result = findBestSeat(seats);
    expect(result).toBe(-1);
  });
});

describe("zeroSumSubarray", () => {
  test("returns subarray at start", () => {
    const nums = [1, -1, 2];
    const result = zeroSumSubarray(nums);
    expect(result).toEqual([1, -1]);
  });

  test("returns subarray in middle", () => {
    const nums = [3, 1, -1, -3, 4];
    const result = zeroSumSubarray(nums) as number[];
    // Acceptable result: [1, -1, -3] or [3, 1, -1, -3] depending on implementation
    expect(result?.reduce((a, b) => a + b, 0)).toBe(0);
  });

  test("returns -1 if no zero-sum subarray", () => {
    const nums = [1, 2, 3];
    const result = zeroSumSubarray(nums);
    expect(result).toBe(-1);
  });
});

describe("maxMedianSum", () => {
  test("returns correct sum for exact multiple of 3", () => {
    const nums = [1, 2, 3, 4, 5, 6];
    const result = maxMedianSum(nums);
    expect(result).toBe(8);
  });

  test("handles array size of 5 (only one group)", () => {
    const nums = [1, 2, 3, 4, 5];
    const result = maxMedianSum(nums);
    expect(result).toBe(4);
  });

  test("handles unsorted input", () => {
    const nums = [6, 1, 5, 2, 4, 3];
    const result = maxMedianSum(nums);
    expect(result).toBe(8);
  });

  test("handles duplicate values", () => {
    const nums = [1, 1, 1, 1, 1, 1];
    const result = maxMedianSum(nums);
    expect(result).toBe(2);
  });

  test("returns 0 when less than 3 elements are present", () => {
    const nums = [10, 20];
    const result = maxMedianSum(nums);
    expect(result).toBe(0);
  });

  test("handles larger input", () => {
    const nums = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    const result = maxMedianSum(nums);
    expect(result).toBe(18); // medians: 8, 6, 4
  });
});
describe("missingNumbers", () => {
  test("finds two missing numbers in a small array", () => {
    const nums = [1, 2, 4, 6];
    const result = missingNumbers(nums);
    expect(result).toEqual([3, 5]);
  });

  test("finds missing numbers when array starts at 1 but has gaps", () => {
    const nums = [1, 3];
    const result = missingNumbers(nums);
    expect(result).toEqual([2, 4]);
  });

  test("finds missing numbers when array has consecutive numbers missing at the end", () => {
    const nums = [1, 2, 3, 4, 5];
    const result = missingNumbers(nums);
    expect(result).toEqual([6, 7]);
  });

  test("handles minimum input size", () => {
    const nums = [2];
    const result = missingNumbers(nums);
    expect(result).toEqual([1, 3]);
  });

  test("works with unordered input", () => {
    const nums = [4, 2, 1];
    const result = missingNumbers(nums);
    expect(result).toEqual([3, 5]);
  });
});
