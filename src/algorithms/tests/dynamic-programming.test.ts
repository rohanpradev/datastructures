import { describe, expect, test } from "bun:test";
import {
  maxSumNonAdjacent,
  minNumberOfCoinsForChange,
  waysOfChange,
  levenshteinDistance,
  numOfWaysToTraverseGraphRecursive,
  numberOfWaysToTraverseGraph,
  numberOfWaysToTraverseGraphFactorial,
} from "@/algorithms/dynamic-programming/dynamic-programming";

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

describe("levenshteinDistance", () => {
  test("identical strings have distance 0", () => {
    expect(levenshteinDistance("kitten", "kitten")).toBe(0);
  });

  test("empty strings have distance 0", () => {
    expect(levenshteinDistance("", "")).toBe(0);
  });

  test("converting empty string to non-empty string", () => {
    expect(levenshteinDistance("", "abc")).toBe(3);
  });

  test("converting non-empty string to empty string", () => {
    expect(levenshteinDistance("abc", "")).toBe(3);
  });

  test("single character substitution", () => {
    expect(levenshteinDistance("a", "b")).toBe(1);
  });

  test("single character insertion", () => {
    expect(levenshteinDistance("a", "ab")).toBe(1);
  });

  test("single character deletion", () => {
    expect(levenshteinDistance("ab", "a")).toBe(1);
  });

  test("classic example: kitten → sitting", () => {
    // replace k → s, replace e → i, insert g
    expect(levenshteinDistance("kitten", "sitting")).toBe(3);
  });

  test("classic example: flaw → lawn", () => {
    expect(levenshteinDistance("flaw", "lawn")).toBe(2);
  });

  test("completely different strings of same length", () => {
    expect(levenshteinDistance("abcd", "wxyz")).toBe(4);
  });

  test("case sensitivity matters", () => {
    expect(levenshteinDistance("Apple", "apple")).toBe(1);
  });

  test("handles whitespace correctly", () => {
    expect(levenshteinDistance("hello world", "hello  world")).toBe(1);
  });

  test("longer strings with partial overlap", () => {
    expect(levenshteinDistance("intention", "execution")).toBe(5);
  });
});

describe("numOfWaysToTraverseGraphRecursive", () => {
  test("returns 1 for a 1x1 grid", () => {
    expect(numOfWaysToTraverseGraphRecursive(1, 1)).toBe(1);
  });

  test("returns correct value for small grids", () => {
    expect(numOfWaysToTraverseGraphRecursive(2, 2)).toBe(2);
    expect(numOfWaysToTraverseGraphRecursive(3, 3)).toBe(6);
  });

  test("returns correct value for rectangular grids", () => {
    expect(numOfWaysToTraverseGraphRecursive(3, 2)).toBe(3);
    expect(numOfWaysToTraverseGraphRecursive(4, 3)).toBe(10);
  });
});

/* ------------------------------------------------------------------ */
/* Dynamic Programming Solution Tests                                  */
/* ------------------------------------------------------------------ */

describe("numberOfWaysToTraverseGraph", () => {
  test("returns 1 for a 1x1 grid", () => {
    expect(numberOfWaysToTraverseGraph(1, 1)).toBe(1);
  });

  test("returns correct value for small grids", () => {
    expect(numberOfWaysToTraverseGraph(2, 2)).toBe(2);
    expect(numberOfWaysToTraverseGraph(3, 3)).toBe(6);
  });

  test("returns correct value for rectangular grids", () => {
    expect(numberOfWaysToTraverseGraph(3, 2)).toBe(3);
    expect(numberOfWaysToTraverseGraph(5, 3)).toBe(15);
  });
});

/* ------------------------------------------------------------------ */
/* Factorial / Combinatorics Solution Tests                             */
/* ------------------------------------------------------------------ */

describe("numberOfWaysToTraverseGraphFactorial", () => {
  test("returns 1 for a 1x1 grid", () => {
    expect(numberOfWaysToTraverseGraphFactorial(1, 1)).toBe(1);
  });

  test("returns correct value for small grids", () => {
    expect(numberOfWaysToTraverseGraphFactorial(2, 2)).toBe(2);
    expect(numberOfWaysToTraverseGraphFactorial(3, 3)).toBe(6);
  });

  test("returns correct value for rectangular grids", () => {
    expect(numberOfWaysToTraverseGraphFactorial(3, 2)).toBe(3);
    expect(numberOfWaysToTraverseGraphFactorial(4, 3)).toBe(10);
  });
});
