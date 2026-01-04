/**
 * Merges all overlapping intervals.
 *
 * An interval [a, b] overlaps with [c, d] if c <= b.
 *
 * @param {Array<[number, number]>} intervals
 *   An array of intervals where each interval is a tuple [start, end].
 *
 * @returns {Array<[number, number]>}
 *   A new array of merged, non-overlapping intervals sorted by start time.
 *
 * @example
 * mergeIntervals([[1,3],[2,6],[8,10],[15,18]])
 * // → [[1,6],[8,10],[15,18]]
 */
export function mergeIntervals(
  intervals: Array<[number, number]>,
): Array<[number, number]> {
  if (intervals.length === 0) return [];

  // Sort intervals by starting value (ascending)
  const sortedIntervals = [...intervals].sort(([a], [b]) => a - b);

  /** @type {Array<[number, number]>} */
  const merged: Array<[number, number]> = [];

  for (const [start, end] of sortedIntervals) {
    // If merged is empty or current interval does not overlap
    if (merged.length === 0 || merged[merged.length - 1][1] < start) {
      // Push a new interval (copy to avoid mutating input)
      merged.push([start, end]);
    } else {
      // Overlapping interval → merge with the last one
      merged[merged.length - 1][1] = Math.max(
        merged[merged.length - 1][1],
        end,
      );
    }
  }

  return merged;
}
