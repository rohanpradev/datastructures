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

/**
 * Finds the two missing numbers in an array containing numbers
 * from the range 1 to n, where exactly two numbers are missing.
 *
 * Example:
 *   Input:  [1, 2, 4, 6]
 *   Output: [3, 5]
 *
 * Assumptions:
 * - The array contains unique integers
 * - All numbers are in the range 1..n
 * - Exactly two numbers are missing
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 *
 * @param nums - Array of integers from 1..n with exactly two missing values
 * @returns A tuple containing the two missing numbers
 */
export function missingNumbers(nums: number[]): [number, number] {
	/**
	 * Since two numbers are missing, the total range size (n)
	 * must be the length of the array + 2.
	 */
	const n = nums.length + 2;

	/**
	 * Calculate the expected sum of numbers from 1 to n
	 * using the arithmetic series formula:
	 *
	 *   sum = n * (n + 1) / 2
	 */
	const expectedSum = (n * (n + 1)) / 2;

	/**
	 * Calculate the sum of all numbers that actually exist
	 * in the given array.
	 */
	const actualSum = nums.reduce((sum, num) => sum + num, 0);

	/**
	 * The difference between the expected sum and the actual sum
	 * equals the sum of the two missing numbers.
	 *
	 *   missing1 + missing2 = missingSum
	 */
	const missingSum = expectedSum - actualSum;

	/**
	 * We split the number range into two halves.
	 * One missing number must be in each half.
	 *
	 * Example:
	 *   missingSum = 8 → mid = 4
	 *   Left range:  1..4
	 *   Right range: 5..n
	 */
	const mid = Math.floor(missingSum / 2);

	/**
	 * Expected sum of numbers from 1 to mid
	 */
	const expectedLeftSum = (mid * (mid + 1)) / 2;

	/**
	 * Expected sum of numbers from mid + 1 to n
	 * This is the total expected sum minus the left half sum.
	 */
	const expectedRightSum = expectedSum - expectedLeftSum;

	/**
	 * These will hold the sums of the numbers that actually exist
	 * in the left and right halves of the array.
	 */
	let actualLeftSum = 0;
	let actualRightSum = 0;

	/**
	 * Loop through the array and accumulate sums based on
	 * which half each number belongs to.
	 */
	for (const num of nums) {
		if (num <= mid) {
			actualLeftSum += num;
		} else {
			actualRightSum += num;
		}
	}

	/**
	 * The missing number in each half is found by subtracting
	 * the actual sum from the expected sum.
	 */
	const firstMissing = expectedLeftSum - actualLeftSum;
	const secondMissing = expectedRightSum - actualRightSum;

	/**
	 * Return both missing numbers as a tuple.
	 */
	return [firstMissing, secondMissing];
}
/**
 * Finds the majority element in an array of numbers.
 *
 * The majority element is the element that appears **more than n/2 times**.
 * This implementation uses the **Boyer–Moore Voting Algorithm**, which
 * guarantees O(n) time and O(1) space.
 *
 * Algorithm:
 * 1. Initialize `count = 0` and `candidate = null`.
 * 2. Iterate through the array:
 *    - If count is 0, set the current number as the new candidate.
 *    - If the current number equals the candidate, increment count.
 *    - Otherwise, decrement count.
 * 3. After the loop, the candidate is guaranteed to be the majority element.
 *
 * Assumes that a majority element **always exists**.
 *
 * @param {number[]} nums - The input array of integers.
 * @returns {number} The majority element.
 *
 * @example
 * majorityElement([3, 2, 3])
 * // → 3
 *
 * @example
 * majorityElement([2,2,1,1,1,2,2])
 * // → 2
 *
 * @complexity
 * Time Complexity: O(n) — single pass through the array
 * Space Complexity: O(1) — constant space
 */
export function majorityElement(nums: number[]): number {
	let candidate: number | null = null; // Current majority candidate
	let count = 0; // Count of the current candidate

	for (const num of nums) {
		if (count === 0) {
			// When count drops to 0, pick a new candidate
			candidate = num;
		}

		if (num === candidate) {
			// Same as candidate → increment count
			count++;
		} else {
			// Different from candidate → decrement count
			count--;
		}
	}

	// candidate now holds the majority element
	return candidate!;
}

/**
 * Finds two numbers whose sum is less than or equal to the target
 * and as close to the target as possible.
 *
 * If an exact match is found, it is returned immediately.
 * Otherwise, the closest smaller sum is returned.
 * If no valid pair exists, null is returned.
 *
 * @param numbers - Array of integers
 * @param targetSum - Target sum
 * @returns A tuple containing the selected pair or null
 */
export function sweetAndSavoury(
	numbers: number[],
	targetSum: number,
): [number, number] | null {
	// Create a sorted copy to avoid mutating the input array
	const sortedNumbers = [...numbers].sort((a, b) => a - b);

	// Two pointers for scanning from both ends
	let leftIndex = 0;
	let rightIndex = sortedNumbers.length - 1;

	// Track the closest sum that does not exceed the target
	let closestValidSum = -Infinity;

	// Track the pair that produces the closest valid sum
	let closestPair: [number, number] | null = null;

	// Move pointers until they meet
	while (leftIndex < rightIndex) {
		const leftValue = sortedNumbers[leftIndex];
		const rightValue = sortedNumbers[rightIndex];
		const currentSum = leftValue + rightValue;

		// Best possible case: exact match
		if (currentSum === targetSum) {
			return [leftValue, rightValue];
		}

		// Valid sum smaller than target
		if (currentSum < targetSum) {
			// Update if this sum is closer to the target
			if (currentSum > closestValidSum) {
				closestValidSum = currentSum;
				closestPair = [leftValue, rightValue];
			}

			// Move left pointer to increase sum
			leftIndex++;
		} else {
			// Sum is too large, decrease it
			rightIndex--;
		}
	}

	return closestPair;
}
