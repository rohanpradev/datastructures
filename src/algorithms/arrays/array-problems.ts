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

  // Step 1: Sort intervals by their start value
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);

  const result: Array<[number, number]> = [];

  // Step 2: Iterate through sorted intervals
  for (const [start, end] of sorted) {
    const last = result[result.length - 1];

    // Case A: No overlap → add new interval
    if (!last || last[1] < start) {
      result.push([start, end]);
    }
    // Case B: Overlap → merge with the last interval
    else {
      last[1] = Math.max(last[1], end);
    }
  }

  return result;
}

/**
 * Finds the best seat in a row such that the distance to the closest
 * occupied seat is maximized.
 *
 * A seat is represented as:
 * - 1 → occupied
 * - 0 → empty
 *
 * The algorithm looks for the longest stretch of empty seats (`0`)
 * that lies between two occupied seats (`1`) and selects the middle
 * seat of that stretch.
 *
 * If no valid seat exists, the function returns -1.
 *
 * @param {Array<0 | 1>} seats
 *   An array representing a row of seats where:
 *   - 1 means the seat is occupied
 *   - 0 means the seat is empty
 *
 * @returns {number}
 *   The index of the best seat, or -1 if no suitable seat is found.
 *
 * @example
 * findBestSeat([1, 0, 0, 0, 1])
 * // → 2
 */
export function findBestSeat(seats: Array<0 | 1>): number {
  // Index of the best seat found so far
  let bestSeat = -1;

  // Maximum number of empty seats between two occupied seats
  let maxSpace = 0;

  // Pointer to the last occupied seat encountered
  let left = 0;

  // Scan forward to find the next occupied seat
  for (let right = 1; right < seats.length; right++) {
    // When we find an occupied seat, we can measure the empty stretch
    if (seats[right] === 1) {
      // Number of empty seats between left and right
      const currentSpace = right - left - 1;

      // If this stretch is the longest so far, update best seat
      if (currentSpace > maxSpace) {
        maxSpace = currentSpace;

        // Choose the middle seat of the empty stretch
        bestSeat = Math.floor((left + right) / 2);
      }

      // Move left pointer to the current occupied seat
      left = right;
    }
  }

  return bestSeat;
}

/**
 * Finds any contiguous subarray whose elements sum to zero.
 *
 * Uses the prefix sum technique:
 * - If the same cumulative sum appears twice,
 *   the elements between those indices sum to zero.
 *
 * @param nums - Array of integers (can include negatives)
 * @returns A zero-sum subarray, or -1 if none exists
 *
 * @example
 * zeroSumSubarray([3, 1, -1, -3])
 * // → [1, -1]
 */
export function zeroSumSubarray(nums: number[]): number[] | -1 {
  // Running total of elements seen so far
  let prefixSum = 0;

  // Maps prefixSum → index where it was first seen
  const prefixSumIndex = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];

    // Case 1: subarray from index 0 sums to zero
    if (prefixSum === 0) {
      return nums.slice(0, i + 1);
    }

    // Case 2: prefix sum seen before → zero-sum subarray
    if (prefixSumIndex.has(prefixSum)) {
      const startIndex = prefixSumIndex.get(prefixSum)! + 1;
      return nums.slice(startIndex, i + 1);
    }

    // Store the first occurrence of this prefix sum
    prefixSumIndex.set(prefixSum, i);
  }

  // No zero-sum subarray found
  return -1;
}

/**
 * Returns the maximum possible sum of medians
 * from ⌊n / 3⌋ disjoint triplets.
 *
 * @param nums - Array of integers
 * @returns Maximum sum of medians
 *
 * @example
 * maxMedianSum([1,2,3,4,5,6]) // 8
 */
export function maxMedianSum(nums: number[]): number {
  // Sort numbers in ascending order
  nums.sort((a, b) => a - b);

  const n = nums.length;
  const groups = Math.floor(n / 3);
  let sum = 0;

  /*
     Start from the second-largest element.
     Each median is found by skipping the largest element
     and stepping back by 2 positions per group.
    */
  let index = n - 2;

  for (let i = 0; i < groups; i++) {
    sum += nums[index]; // Add median
    index -= 2; // Move to next median candidate
  }

  return sum;
}
