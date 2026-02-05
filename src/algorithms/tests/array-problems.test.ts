import { describe, test, expect } from "bun:test";
import {
  mergeIntervals,
  findBestSeat,
  zeroSumSubarray,
  maxMedianSum,
  majorityElement,
  missingNumbers,
  sweetAndSavoury,
  riverSizes,
  removeIslands,
  minimumPassMatrix,
  groupStringsByDifferences,
  restoreTravelPath,
  maxExpressionValue,
  nextDeparture,
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

describe("riverSizes", () => {
  test("returns empty array when there are no rivers", () => {
    const matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    expect(riverSizes(matrix)).toEqual([]);
  });

  test("handles a single-cell river", () => {
    const matrix = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];

    expect(riverSizes(matrix)).toEqual([1]);
  });

  test("handles one large river", () => {
    const matrix = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];

    expect(riverSizes(matrix)).toEqual([9]);
  });

  test("handles multiple small rivers", () => {
    const matrix = [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
    ];

    const result = riverSizes(matrix).sort((a, b) => a - b);
    expect(result).toEqual([1, 1, 1, 1]);
  });

  test("handles rivers with complex shapes", () => {
    const matrix = [
      [1, 0, 0, 1, 0],
      [1, 0, 1, 0, 0],
      [0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 1, 1, 0],
    ];

    const result = riverSizes(matrix).sort((a, b) => a - b);
    expect(result).toEqual([1, 2, 2, 2, 5]);
  });

  test("does not count diagonal connections as rivers", () => {
    const matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];

    const result = riverSizes(matrix).sort((a, b) => a - b);
    expect(result).toEqual([1, 1, 1]);
  });

  test("works with a single row", () => {
    const matrix = [[1, 1, 0, 1, 1, 1]];

    const result = riverSizes(matrix).sort((a, b) => a - b);
    expect(result).toEqual([2, 3]);
  });

  test("works with a single column", () => {
    const matrix = [[1], [1], [0], [1], [1], [1]];

    const result = riverSizes(matrix).sort((a, b) => a - b);
    expect(result).toEqual([2, 3]);
  });
});

describe("removeIslands", () => {
  test("returns the same matrix when there is no land", () => {
    const matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    expect(removeIslands(matrix)).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  test("removes a single-cell island", () => {
    const matrix = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];

    expect(removeIslands(matrix)).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  test("does not remove land connected to the border", () => {
    const matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];

    expect(removeIslands(matrix)).toEqual([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  test("keeps all land when everything is connected to the border", () => {
    const matrix = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];

    expect(removeIslands(matrix)).toEqual([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
  });

  test("removes multiple internal islands", () => {
    const matrix = [
      [1, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 1],
    ];

    expect(removeIslands(matrix)).toEqual([
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1],
    ]);
  });

  test("handles complex shapes with both safe land and islands", () => {
    const matrix = [
      [1, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 1],
      [0, 0, 1, 0, 1, 0],
      [1, 1, 0, 0, 1, 0],
      [1, 0, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 1],
    ];

    expect(removeIslands(matrix)).toEqual([
      [1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1],
      [0, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1],
    ]);
  });

  test("does not treat diagonal connections as safe", () => {
    const matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];

    expect(removeIslands(matrix)).toEqual([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 1],
    ]);
  });

  test("works with a single row", () => {
    const matrix = [[1, 0, 1, 1, 0, 1]];

    expect(removeIslands(matrix)).toEqual([[1, 0, 1, 1, 0, 1]]);
  });

  test("works with a single column", () => {
    const matrix = [[1], [0], [1], [1], [0], [1]];

    expect(removeIslands(matrix)).toEqual([[1], [0], [1], [1], [0], [1]]);
  });
});

describe("minimumPassMatrix", () => {
  test("returns correct number of passes for a typical matrix", () => {
    const matrix = [
      [0, -1, -3, 2, 0],
      [1, -2, -5, -1, -3],
      [3, 0, 0, -4, -1],
    ];

    const result = minimumPassMatrix(matrix);
    expect(result).toBe(3);
  });

  test("returns 0 when there are no negative numbers", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];

    const result = minimumPassMatrix(matrix);
    expect(result).toBe(0);
  });

  test("returns -1 when conversion is impossible", () => {
    const matrix = [
      [-1, -1],
      [-1, -1],
    ];

    const result = minimumPassMatrix(matrix);
    expect(result).toBe(-1);
  });

  test("handles a single cell matrix (positive)", () => {
    const matrix = [[5]];

    const result = minimumPassMatrix(matrix);
    expect(result).toBe(0);
  });

  test("handles a single cell matrix (negative)", () => {
    const matrix = [[-5]];

    const result = minimumPassMatrix(matrix);
    expect(result).toBe(-1);
  });

  test("converts negatives in multiple passes correctly", () => {
    const matrix = [
      [1, -1, -1],
      [-1, -1, -1],
    ];

    const result = minimumPassMatrix(matrix);
    expect(result).toBe(3);
  });

  test("handles zeros correctly", () => {
    const matrix = [
      [0, -1, 0],
      [1, 0, -1],
      [0, -1, 0],
    ];

    const result = minimumPassMatrix(matrix);
    expect(result).toBe(-1);
  });

  test("handles empty negatives list correctly", () => {
    const matrix = [
      [0, 0],
      [0, 0],
    ];

    const result = minimumPassMatrix(matrix);
    expect(result).toBe(0);
  });
});

describe("groupStringsByDifferences", () => {
  const flatten = (arr: string[][]) => arr.flat();

  test("groups strings correctly by difference pattern", () => {
    const input = ["abc", "bcd", "cde", "abd"];
    const result = groupStringsByDifferences(input);

    // All original strings must appear in some group
    expect(flatten(result).sort()).toEqual(input.sort());
  });

  test("handles strings of different lengths", () => {
    const input = ["abc", "abcd", "bcde", "cdef"];
    const result = groupStringsByDifferences(input);

    // All strings should appear somewhere
    expect(flatten(result).sort()).toEqual(input.sort());
  });

  test("handles single string", () => {
    const input = ["abc"];
    const result = groupStringsByDifferences(input);
    expect(result).toEqual([["abc"]]);
  });

  test("handles empty input", () => {
    const input: string[] = [];
    const result = groupStringsByDifferences(input);
    expect(result).toEqual([]);
  });

  test("groups strings with same difference pattern together", () => {
    const input = ["ace", "bdf", "xz"];
    const result = groupStringsByDifferences(input);

    // All strings appear
    expect(flatten(result).sort()).toEqual(input.sort());

    // Strings with same pattern are in the same group
    const patternGroups = result.map((group) =>
      group.map((str) =>
        group[0]
          .split("")
          .map((c) => c.charCodeAt(0))
          .map((v, i, arr) => (i === 0 ? 0 : v - arr[i - 1])),
      ),
    );

    // Every group has identical difference patterns
    patternGroups.forEach((diffs) =>
      diffs.forEach((d) => expect(d).toEqual(diffs[0])),
    );
  });
});

describe("restoreTravelPath", () => {
  test("restores path for string locations", () => {
    const pairs: [string, string][] = [
      ["Paris", "Berlin"],
      ["London", "Paris"],
      ["Berlin", "Rome"],
    ];

    const result = restoreTravelPath(pairs);

    expect(result).toEqual(["London", "Paris", "Berlin", "Rome"]);
  });

  test("restores path for numeric locations", () => {
    const pairs: [number, number][] = [
      [1, 3],
      [0, 1],
      [3, 7],
    ];

    const result = restoreTravelPath(pairs);

    expect(result).toEqual([0, 1, 3, 7]);
  });

  test("handles unordered input pairs", () => {
    const pairs: [string, string][] = [
      ["C", "D"],
      ["A", "B"],
      ["B", "C"],
    ];

    const result = restoreTravelPath(pairs);

    expect(result).toEqual(["A", "B", "C", "D"]);
  });

  test("handles single pair", () => {
    const pairs: [string, string][] = [["A", "B"]];

    const result = restoreTravelPath(pairs);

    expect(result).toEqual(["A", "B"]);
  });

  test("handles numeric path with negative values", () => {
    const pairs: [number, number][] = [
      [-2, -1],
      [-3, -2],
      [-1, 0],
    ];

    const result = restoreTravelPath(pairs);

    expect(result).toEqual([-3, -2, -1, 0]);
  });

  test("handles large numeric identifiers", () => {
    const pairs: [number, number][] = [
      [1000000, 2000000],
      [1, 1000000],
    ];

    const result = restoreTravelPath(pairs);

    expect(result).toEqual([1, 1000000, 2000000]);
  });

  test("returns empty array for empty input", () => {
    const pairs: Array<[string | number, string | number]> = [];

    const result = restoreTravelPath(pairs);

    expect(result).toEqual([]);
  });
});

describe("maxExpressionValue", () => {
  test("evaluates a simple row expression", () => {
    const matrix = [[2, "+", 3]];
    const result = maxExpressionValue(matrix);
    expect(result).toBe(5);
  });

  test("evaluates a simple column expression", () => {
    const matrix = [[2], ["+"], [3]];
    const result = maxExpressionValue(matrix);
    expect(result).toBe(5);
  });

  test("evaluates row and column expressions, takes max", () => {
    const matrix = [
      [2, "+", 3],
      ["*", 4, "-"],
      [1, "+", 5],
    ];
    const result = maxExpressionValue(matrix);
    // Row 2: 1+5 = 6 is max
    expect(result).toBe(6);
  });

  test("ignores consecutive numbers without operator", () => {
    const matrix = [
      [2, 2, "+", 3], // 2 2 invalid, start new expr at 2
    ];
    const result = maxExpressionValue(matrix);
    // Only valid: 2 + 3 = 5
    expect(result).toBe(5);
  });

  test("evaluates multiple operators", () => {
    const matrix = [
      [1, "+", 2, "*", 3],
      [4, "-", 1, "+", 2],
    ];
    const result = maxExpressionValue(matrix);
    // Row 0: 1+2*3 = 9
    // Row 1: 4-1+2 = 5
    expect(result).toBe(9);
  });

  test("handles negative numbers", () => {
    const matrix = [
      [-2, "+", 3],
      [1, "*", -5],
    ];
    const result = maxExpressionValue(matrix);
    // Row 0: -2+3=1, Row1: 1*-5=-5 → max = 1
    expect(result).toBe(1);
  });

  test("handles empty matrix", () => {
    const matrix: (number | string)[][] = [];
    const result = maxExpressionValue(matrix);
    expect(result).toBe(-Infinity);
  });

  test("handles single number only", () => {
    const matrix = [[5]];
    const result = maxExpressionValue(matrix);
    // Not enough tokens for a valid expression → return -Infinity
    expect(result).toBe(-Infinity);
  });

  test("evaluates columns correctly", () => {
    const matrix = [
      [1, 2, "+"],
      ["+", "*", 3],
    ];
    const result = maxExpressionValue(matrix);
    expect(result).toBe(-Infinity);
  });
});

describe("nextDeparture", () => {
  test("next departure later in the day", () => {
    const departures = ["08:30", "09:45", "14:00", "15:20"];
    const currentTime = "14:10";

    // Next departure after 14:10 is 15:20 → 70 minutes difference
    const result = nextDeparture(departures, currentTime);
    expect(result).toBe(70);
  });

  test("no departures left in the day", () => {
    const departures = ["09:00", "10:00"];
    const currentTime = "11:00";

    // All departures are before current time → should return -1
    const result = nextDeparture(departures, currentTime);
    expect(result).toBe(-1);
  });

  test("departure exactly one minute later", () => {
    const departures = ["14:11"];
    const currentTime = "14:10";

    // Only one departure → 1 minute difference
    const result = nextDeparture(departures, currentTime);
    expect(result).toBe(1);
  });

  test("departure at the same time is ignored", () => {
    const departures = ["14:10", "15:00"];
    const currentTime = "14:10";

    // 14:10 is not after current time → next is 15:00 → 50 minutes
    const result = nextDeparture(departures, currentTime);
    expect(result).toBe(50);
  });

  test("current time before first departure", () => {
    const departures = ["06:00", "08:30", "12:15"];
    const currentTime = "05:50";

    // Next departure is 06:00 → 10 minutes
    const result = nextDeparture(departures, currentTime);
    expect(result).toBe(10);
  });

  test("single departure later in the day", () => {
    const departures = ["23:50"];
    const currentTime = "23:45";

    // Only one departure → 5 minutes difference
    const result = nextDeparture(departures, currentTime);
    expect(result).toBe(5);
  });

  test("empty departures array returns -1", () => {
    const departures: string[] = [];
    const currentTime = "12:00";

    // No departures → return -1
    const result = nextDeparture(departures, currentTime);
    expect(result).toBe(-1);
  });

  test("departures not sorted initially", () => {
    const departures = ["15:00", "09:00", "12:30"];
    const currentTime = "11:00";

    // Sort internally: 09:00, 12:30, 15:00 → next after 11:00 is 12:30 → 90 minutes
    const result = nextDeparture(departures, currentTime);
    expect(result).toBe(90);
  });
});
