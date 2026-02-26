import { describe, expect, test } from "bun:test";
import {
  productSum,
  staircaseTraversal,
  revealMinesweeper,
} from "@/algorithms/recursion/array-recursion";

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

describe("staircaseTraversal", () => {
  test("handles height 0", () => {
    // No steps → 1 way (do nothing)
    expect(staircaseTraversal(0, 2)).toBe(1);
  });

  test("handles height 1", () => {
    // 1 step → only [1]
    expect(staircaseTraversal(1, 2)).toBe(1);
  });

  test("handles maxSteps = 1", () => {
    // height = 4, maxSteps = 1
    // Only one way: 1 + 1 + 1 + 1
    expect(staircaseTraversal(4, 1)).toBe(1);
  });

  test("handles small example (height 3, maxSteps 2)", () => {
    // Possible ways:
    // 1 + 1 + 1
    // 1 + 2
    // 2 + 1
    // Total = 3
    expect(staircaseTraversal(3, 2)).toBe(3);
  });

  test("handles height 4, maxSteps 2", () => {
    // Ways:
    // 1+1+1+1
    // 1+1+2
    // 1+2+1
    // 2+1+1
    // 2+2
    // Total = 5
    expect(staircaseTraversal(4, 2)).toBe(5);
  });

  test("handles height 4, maxSteps 3", () => {
    // Ways:
    // 1+1+1+1
    // 1+1+2
    // 1+2+1
    // 2+1+1
    // 2+2
    // 1+3
    // 3+1
    // Total = 7
    expect(staircaseTraversal(4, 3)).toBe(7);
  });

  test("handles when maxSteps > height", () => {
    // height = 3, maxSteps = 5
    // Same as maxSteps = 3
    // 1+1+1
    // 1+2
    // 2+1
    // 3
    // Total = 4
    expect(staircaseTraversal(3, 5)).toBe(4);
  });

  test("handles larger example (height 5, maxSteps 2)", () => {
    // Fibonacci pattern:
    // height 0 → 1
    // height 1 → 1
    // height 2 → 2
    // height 3 → 3
    // height 4 → 5
    // height 5 → 8
    expect(staircaseTraversal(5, 2)).toBe(8);
  });

  test("handles height 6, maxSteps 3", () => {
    // Compute step by step:
    // ways(0)=1
    // ways(1)=1
    // ways(2)=2
    // ways(3)=4
    // ways(4)=7
    // ways(5)=13
    // ways(6)=24
    expect(staircaseTraversal(6, 3)).toBe(24);
  });
});

describe("revealMinesweeper", () => {
  test("reveals a mine as X (game over case)", () => {
    const board = [
      ["H", "M"],
      ["H", "H"],
    ] as const;

    const result = revealMinesweeper(
      board.map((row) => [...row]),
      0,
      1,
    );

    // Clicking directly on a mine should convert it to "X"
    expect(result[0][1]).toBe("X");
  });

  test("reveals a number when adjacent mines exist", () => {
    // Board:
    // H M
    // H H
    //
    // Clicking (0,0):
    // Adjacent mine count = 1 → should become "1"

    const board = [
      ["H", "M"],
      ["H", "H"],
    ];

    const result = revealMinesweeper(board, 0, 0);

    expect(result[0][0]).toBe("1");
  });

  test("reveals 0 when no adjacent mines", () => {
    // Board:
    // H H
    // H H
    //
    // Clicking (0,0):
    // No adjacent mines → becomes "0"

    const board = [
      ["H", "H"],
      ["H", "H"],
    ];

    const result = revealMinesweeper(board, 0, 0);

    expect(result[0][0]).toBe("0");
  });

  test("recursively reveals neighbours when adjacent mines = 0", () => {
    // Board:
    // H H
    // H H
    //
    // Clicking (0,0):
    // Entire board should flood-fill to "0"

    const board = [
      ["H", "H"],
      ["H", "H"],
    ];

    const result = revealMinesweeper(board, 0, 0);

    expect(result).toEqual([
      ["0", "0"],
      ["0", "0"],
    ]);
  });

  test("does not reprocess already revealed cells", () => {
    // Board:
    // 0 0
    // 0 H
    //
    // Clicking (1,1):
    // Should reveal it but not affect already revealed cells

    const board = [
      ["0", "0"],
      ["0", "H"],
    ];

    const result = revealMinesweeper(board, 1, 1);

    expect(result[1][1]).toBe("0");
  });

  test("handles clicking on already revealed number", () => {
    const board = [
      ["1", "M"],
      ["H", "H"],
    ];

    const result = revealMinesweeper(board, 0, 0);

    // Should remain unchanged
    expect(result[0][0]).toBe("1");
  });

  test("handles edge cell correctly (boundary check)", () => {
    // Board:
    // M H
    // H H
    //
    // Clicking (1,1):
    // Adjacent mines = 1

    const board = [
      ["M", "H"],
      ["H", "H"],
    ];

    const result = revealMinesweeper(board, 1, 1);

    expect(result[1][1]).toBe("1");
  });

  test("handles single-cell board with mine", () => {
    const board = [["M"]];

    const result = revealMinesweeper(board, 0, 0);

    expect(result).toEqual([["X"]]);
  });

  test("handles single-cell board without mine", () => {
    const board = [["H"]];

    const result = revealMinesweeper(board, 0, 0);

    expect(result).toEqual([["0"]]);
  });
});
