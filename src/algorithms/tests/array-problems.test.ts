import { describe, test, expect } from "bun:test";
import {
  mergeIntervals,
  findBestSeat,
  zeroSumSubarray,
  maxMedianSum,
  majorityElement,
  missingNumbers,
  sweetAndSavoury,
  maxSumNonAdjacent,
  waysOfChange,
  minNumberOfCoinsForChange,
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
describe("majorityElement", () => {
  test("returns the majority element in a small array", () => {
    const result = majorityElement([3, 2, 3]);
    expect(result).toBe(3);
  });

  test("returns the majority element when it appears many times", () => {
    const result = majorityElement([2, 2, 1, 1, 1, 2, 2]);
    expect(result).toBe(2);
  });

  test("works when all elements are the same", () => {
    const result = majorityElement([5, 5, 5, 5]);
    expect(result).toBe(5);
  });

  test("works when majority element is at the beginning", () => {
    const result = majorityElement([7, 7, 7, 2, 3]);
    expect(result).toBe(7);
  });

  test("works when majority element is at the end", () => {
    const result = majorityElement([1, 2, 3, 9, 9, 9, 9]);
    expect(result).toBe(9);
  });

  test("works with negative numbers", () => {
    const result = majorityElement([-1, -1, -1, 2, 3]);
    expect(result).toBe(-1);
  });

  test("works with large array", () => {
    const nums = Array(1000).fill(4);
    nums.push(1, 2, 3);
    const result = majorityElement(nums);
    expect(result).toBe(4);
  });
});

describe("sweetAndSavoury", () => {
  test("returns exact match when sum equals target", () => {
    const result = sweetAndSavoury([-3, -5, 1, 7], 4);
    expect(result).toEqual([-3, 7]);
  });

  test("returns closest sum less than target when no exact match exists", () => {
    const result = sweetAndSavoury([5, 2, 4, 6, 3], 7);
    expect(result).not.toBeNull();
    expect(result![0] + result![1]).toBe(7);
  });

  test("returns null when no valid pair exists", () => {
    const result = sweetAndSavoury([8, 10, 3], 7);
    expect(result).toBeNull();
  });

  test("handles negative numbers correctly", () => {
    const result = sweetAndSavoury([-10, -5, -2, -1], -6);
    expect(result).toEqual([-5, -1]);
  });

  test("handles mixed positive and negative numbers", () => {
    const result = sweetAndSavoury([-4, -2, 3, 9], 5);
    expect(result).toEqual([-4, 9]);
  });

  test("returns closest smaller sum when multiple valid pairs exist", () => {
    const result = sweetAndSavoury([1, 2, 3, 4, 5], 8);
    expect(result).toEqual([3, 5]);
  });

  test("does not mutate the original array", () => {
    const nums = [4, 1, 6, 2];
    sweetAndSavoury(nums, 7);
    expect(nums).toEqual([4, 1, 6, 2]);
  });

  test("works with duplicate numbers", () => {
    const result = sweetAndSavoury([2, 2, 2, 2], 4);
    expect(result).toEqual([2, 2]);
  });

  test("returns null when array has fewer than two elements", () => {
    const result = sweetAndSavoury([5], 10);
    expect(result).toBeNull();
  });
});

describe("maxSumNonAdjacent", () => {
  test("calculates max sum for multiple elements", () => {
    const nums = [3, 2, 5, 10, 7];
    const result = maxSumNonAdjacent(nums);
    expect(result).toBe(15); // 3 + 5 + 7
  });

  test("calculates max sum for small array", () => {
    const nums = [2, 1, 4, 9];
    const result = maxSumNonAdjacent(nums);
    expect(result).toBe(11); // 2 + 9
  });

  test("handles single element array", () => {
    const nums = [5];
    const result = maxSumNonAdjacent(nums);
    expect(result).toBe(5);
  });

  test("handles empty array", () => {
    const nums: number[] = [];
    const result = maxSumNonAdjacent(nums);
    expect(result).toBeNull();
  });

  test("handles array with all negative numbers", () => {
    const nums = [-1, -2, -3, -4];
    const result = maxSumNonAdjacent(nums);
    expect(result).toBe(-1); // pick the least negative
  });

  test("handles array with zeros and positives", () => {
    const nums = [0, 5, 0, 10];
    const result = maxSumNonAdjacent(nums);
    expect(result).toBe(15); // pick 5 + 10
  });

  test("handles array with alternating high and low values", () => {
    const nums = [10, 1, 10, 1, 10];
    const result = maxSumNonAdjacent(nums);
    expect(result).toBe(30); // pick 10 + 10 + 10
  });
});

describe("waysOfChange", () => {
  test("calculates number of ways for small target", () => {
    const target = 5;
    const denoms = [1, 2, 5];
    const result = waysOfChange(target, denoms);
    expect(result).toBe(4); // 1+1+1+1+1, 1+1+1+2, 1+2+2, 5
  });

  test("calculates number of ways for target with only 2s", () => {
    const target = 3;
    const denoms = [2];
    const result = waysOfChange(target, denoms);
    expect(result).toBe(0); // cannot make 3
  });

  test("calculates number of ways for multiple denominations", () => {
    const target = 10;
    const denoms = [2, 5, 3, 6];
    const result = waysOfChange(target, denoms);
    expect(result).toBe(5);
    // combinations: [2x5], [2+2+6], [2+3+5], [5+5], [3+3+2+2]
  });

  test("handles target = 0", () => {
    const target = 0;
    const denoms = [1, 2, 3];
    const result = waysOfChange(target, denoms);
    expect(result).toBe(1); // 1 way to pick no coins
  });

  test("handles empty denominations array", () => {
    const target = 5;
    const denoms: number[] = [];
    const result = waysOfChange(target, denoms);
    expect(result).toBe(0); // cannot make 5 with no coins
  });

  test("handles target less than all coins", () => {
    const target = 3;
    const denoms = [5, 6];
    const result = waysOfChange(target, denoms);
    expect(result).toBe(0); // no coin ≤ target
  });

  test("handles single coin equal to target", () => {
    const target = 7;
    const denoms = [7];
    const result = waysOfChange(target, denoms);
    expect(result).toBe(1); // only one way: pick 7
  });

  test("handles large target with multiple coins", () => {
    const target = 8;
    const denoms = [1, 2, 3];
    const result = waysOfChange(target, denoms);
    expect(result).toBe(10);
    // combinations: [1x8], [2+1x6], [2x2+1x4], [3+1x5], etc.
  });
});

describe("minNumberOfCoinsForChange", () => {
  test("calculates minimum coins for small target", () => {
    const target = 7;
    const denoms = [1, 5, 10];
    const result = minNumberOfCoinsForChange(target, denoms);
    expect(result).toBe(3); // 5 + 1 + 1
  });

  test("returns -1 when target cannot be made", () => {
    const target = 3;
    const denoms = [2];
    const result = minNumberOfCoinsForChange(target, denoms);
    expect(result).toBe(-1); // cannot make 3
  });

  test("calculates minimum coins for multiple denominations", () => {
    const target = 10;
    const denoms = [2, 5, 3, 6];
    const result = minNumberOfCoinsForChange(target, denoms);
    expect(result).toBe(2); // 5 + 5
  });

  test("handles target = 0", () => {
    const target = 0;
    const denoms = [1, 2, 3];
    const result = minNumberOfCoinsForChange(target, denoms);
    expect(result).toBe(0); // no coins needed
  });

  test("handles empty denominations array", () => {
    const target = 5;
    const denoms: number[] = [];
    const result = minNumberOfCoinsForChange(target, denoms);
    expect(result).toBe(-1); // cannot make any positive target
  });

  test("handles target less than all denominations", () => {
    const target = 3;
    const denoms = [5, 6];
    const result = minNumberOfCoinsForChange(target, denoms);
    expect(result).toBe(-1); // no coin ≤ target
  });

  test("handles single coin equal to target", () => {
    const target = 7;
    const denoms = [7];
    const result = minNumberOfCoinsForChange(target, denoms);
    expect(result).toBe(1); // one coin of 7
  });

  test("chooses optimal solution over greedy choice", () => {
    const target = 6;
    const denoms = [1, 3, 4];
    const result = minNumberOfCoinsForChange(target, denoms);
    expect(result).toBe(2); // 3 + 3 (better than 4 + 1 + 1)
  });

  test("handles large target with multiple coins", () => {
    const target = 8;
    const denoms = [1, 2, 3];
    const result = minNumberOfCoinsForChange(target, denoms);
    expect(result).toBe(3); // 3 + 3 + 2
  });

  test("handles duplicate denominations", () => {
    const target = 4;
    const denoms = [1, 2, 2];
    const result = minNumberOfCoinsForChange(target, denoms);
    expect(result).toBe(2); // 2 + 2
  });
});
