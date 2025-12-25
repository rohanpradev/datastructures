import { describe, expect, test } from "bun:test";
import { productSum } from "@/algorithms/recursion/array-recursion";

describe("productSum", () => {
  test("handles a flat array of numbers", () => {
    // [1, 2, 3] → 1 + 2 + 3 = 6
    expect(productSum([1, 2, 3])).toBe(6);
  });

  test("handles a single level of nesting", () => {
    // [1, [2, 3]] → 1 + (2 + 3) * 2 = 1 + 10 = 11
    expect(productSum([1, [2, 3]])).toBe(11);
  });

  test("handles multiple nested arrays", () => {
    // [1, [2, 3], [4, 5]] → 1 + (2 + 3)*2 + (4 + 5)*2 = 1 + 10 + 18 = 29
    expect(productSum([1, [2, 3], [4, 5]])).toBe(29);
  });

  test("handles deep nesting", () => {
    // [1, [2, [3]]] → 1 + (2 + (3*3))*2 = 1 + (2 + 9)*2 = 1 + 22 = 23
    expect(productSum([1, [2, [3]]])).toBe(23);
  });

  test("handles complex nested structures", () => {
    // [1, [2, 3], [4, [5]]] →
    // 1 + (2+3)*2 + (4 + (5*3))*2 = 1 + 10 + 38 = 49
    expect(productSum([1, [2, 3], [4, [5]]])).toBe(49);
  });

  test("handles deeply nested single values", () => {
    // [[[[5]]]] → 5 * 4 = 20? Wait, let's compute carefully:
    // Depth 1: [[[[5]]]] → sum of [[ [5] ]] * 1
    // Depth 2: [[[5]]] → sum of [[5]] * 2
    // Depth 3: [[5]] → sum of [5] * 3
    // Depth 4: [5] → sum = 5 * 4 = 20
    expect(productSum([[[[5]]]])).toBe(120);
    // Wait let's double-check:

    // Depth 4 (innermost [5]) → 5 * 4? Actually multiplier starts at 1 for top, +1 per depth:
    // Level 1: [[[ [5] ]]] multiplier 1
    // Level 2: [[ [5] ]] multiplier 2
    // Level 3: [ [5] ] multiplier 3
    // Level 4: [5] multiplier 4
    // sum at innermost: 5 * 4 = 20
    // Return to previous: 20 * 3? Actually no, productSum returns sum * multiplier for each level:
    // Let's do step by step:
    // Level 4: [5] → sum=5 → sum*4=20
    // Level 3: [[5]] → sum = 20 → sum*3=60
    // Level 2: [[[5]]] → sum = 60 → sum*2=120
    // Level 1: [[[[5]]]] → sum = 120 → sum*1=120
    expect(productSum([[[[5]]]])).toBe(120);
  });

  test("handles empty arrays", () => {
    expect(productSum([])).toBe(0);
  });

  test("handles arrays with empty nested arrays", () => {
    // [1, [], [2, []]] → 1 + (0*2) + (2*2) = 1 + 0 + 4 = 5
    expect(productSum([1, [], [2, []]])).toBe(5);
  });

  test("handles negative numbers", () => {
    // [1, [-2, 3]] → 1 + (-2+3)*2 = 1 + 1*2 = 3
    expect(productSum([1, [-2, 3]])).toBe(3);
  });

  test("handles multiple empty and nested empty arrays", () => {
    // [[], [[]], [[[]]]] → all empty → 0
    expect(productSum([[], [[]], [[[]]]])).toBe(0);
  });

  test("handles large nested structure", () => {
    const arr = [1, [2, [3, [4]]], 5];
    // Compute manually:
    // Level 1: 1 + productSum([2, [3,[4]]],2) + 5
    // productSum([2,[3,[4]]],2):
    //   sum = 2 + productSum([3,[4]],3)
    // productSum([3,[4]],3):
    //   sum = 3 + productSum([4],4)
    // productSum([4],4):
    //   sum = 4 → sum*4=16
    // previous level: 3+16=19 → *3=57
    // previous: 2+57=59 → *2=118
    // top: 1 + 118 + 5 = 124
    expect(productSum(arr)).toBe(124);
  });
});
