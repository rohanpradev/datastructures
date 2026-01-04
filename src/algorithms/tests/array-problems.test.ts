import { describe, test, expect } from "bun:test";
import { mergeIntervals } from "@/algorithms/arrays/array-problems"; // adjust path if needed

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

  test("returns the same interval if no overlaps", () => {
    const intervals: [number, number][] = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    const result = mergeIntervals(intervals);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  test("handles a single interval", () => {
    const intervals: [number, number][] = [[1, 5]];
    const result = mergeIntervals(intervals);
    expect(result).toEqual([[1, 5]]);
  });

  test("handles empty input", () => {
    const intervals: [number, number][] = [];
    const result = mergeIntervals(intervals);
    expect(result).toEqual([]);
  });

  test("merges multiple overlapping intervals", () => {
    const intervals: [number, number][] = [
      [1, 10],
      [2, 3],
      [5, 8],
      [9, 12],
    ];
    const result = mergeIntervals(intervals);
    expect(result).toEqual([[1, 12]]);
  });

  test("handles intervals in random order", () => {
    const intervals: [number, number][] = [
      [5, 6],
      [1, 3],
      [2, 4],
      [7, 8],
    ];
    const result = mergeIntervals(intervals);
    expect(result).toEqual([
      [1, 4],
      [5, 6],
      [7, 8],
    ]);
  });
});
