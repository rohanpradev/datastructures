/**
 * Set-based Exercises
 *
 * These exercises demonstrate using Set data structure (or HashTable as Set)
 * for solving common interview problems efficiently.
 */

import { HashTable } from "@/data-structures/hash-table/hash-table";

/**
 * Exercise: Remove Duplicates
 *
 * Problem: Given an array, return a new array with duplicates removed.
 *
 * Algorithm:
 * 1. Use Set to track seen values
 * 2. Only add values to result if not seen before
 * 3. Return array with unique values in original order
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * @example
 * removeDuplicates([1, 2, 3, 2, 4, 3, 5]) // [1, 2, 3, 4, 5]
 * removeDuplicates([1, 1, 1]) // [1]
 * removeDuplicates([]) // []
 */
export function removeDuplicates(nums: number[]): number[] {
	const seen = new HashTable<number, boolean>();
	const result: number[] = [];

	for (const num of nums) {
		if (!seen.has(num)) {
			seen.set(num, true);
			result.push(num);
		}
	}

	return result;
}

/**
 * Exercise: Has Unique Characters
 *
 * Problem: Determine if a string has all unique characters.
 *
 * Algorithm:
 * 1. Use Set to track seen characters
 * 2. If character already in set, return false
 * 3. Otherwise add character to set
 * 4. Return true if all characters are unique
 *
 * Time Complexity: O(n)
 * Space Complexity: O(k) where k is number of unique characters
 *
 * @example
 * hasUniqueChars("abcdef") // true
 * hasUniqueChars("hello") // false ('l' repeats)
 * hasUniqueChars("") // true
 */
export function hasUniqueChars(str: string): boolean {
	const seen = new HashTable<string, boolean>();

	for (const char of str) {
		if (seen.has(char)) {
			return false;
		}
		seen.set(char, true);
	}

	return true;
}

/**
 * Exercise: Find Pairs
 *
 * Problem: Given an array of integers and a target sum,
 * return an array of all unique pairs that sum to the target.
 *
 * Algorithm:
 * 1. Use Set to track seen numbers
 * 2. For each number, check if (target - number) exists in set
 * 3. If yes, add pair to result (smaller number first)
 * 4. Use Set to avoid duplicate pairs
 * 5. Return all unique pairs
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * @example
 * findPairs([1, 2, 3, 4, 5], 6) // [[1, 5], [2, 4]]
 * findPairs([1, 2, 3, 4, 5], 10) // []
 * findPairs([1, 1, 2, 3, 4, 5], 2) // [[1, 1]]
 */
export function findPairs(nums: number[], target: number): number[][] {
	const seen = new HashTable<number, boolean>();
	const pairs: number[][] = [];
	const usedPairs = new HashTable<string, boolean>();

	for (const num of nums) {
		const complement = target - num;

		if (seen.has(complement)) {
			// Create pair key with smaller number first
			const pair = num < complement ? [num, complement] : [complement, num];
			const pairKey = pair.join(",");

			// Only add if we haven't used this pair before
			if (!usedPairs.has(pairKey)) {
				pairs.push(pair);
				usedPairs.set(pairKey, true);
			}
		}

		seen.set(num, true);
	}

	return pairs;
}

/**
 * Exercise: Longest Consecutive Sequence
 *
 * Problem: Given an unsorted array of integers, find the length of the
 * longest consecutive elements sequence.
 * Must run in O(n) time.
 *
 * Algorithm:
 * 1. Add all numbers to Set for O(1) lookup
 * 2. For each number, check if it's the start of a sequence (num-1 not in set)
 * 3. If start of sequence, count how many consecutive numbers exist
 * 4. Track maximum sequence length
 * 5. Return max length
 *
 * Time Complexity: O(n) - each number visited at most twice
 * Space Complexity: O(n)
 *
 * @example
 * longestConsecutiveSequence([100, 4, 200, 1, 3, 2]) // 4 (sequence: 1,2,3,4)
 * longestConsecutiveSequence([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]) // 9 (0-8)
 * longestConsecutiveSequence([]) // 0
 */
export function longestConsecutiveSequence(nums: number[]): number {
	if (nums.length === 0) return 0;

	const numSet = new HashTable<number, boolean>();

	// Add all numbers to set
	for (const num of nums) {
		numSet.set(num, true);
	}

	let maxLength = 0;

	// Check each potential sequence start
	for (const num of nums) {
		// Only start counting if this is the beginning of a sequence
		if (!numSet.has(num - 1)) {
			let currentNum = num;
			let currentLength = 1;

			// Count consecutive numbers
			while (numSet.has(currentNum + 1)) {
				currentNum++;
				currentLength++;
			}

			maxLength = Math.max(maxLength, currentLength);
		}
	}

	return maxLength;
}
