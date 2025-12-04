import { HashTable } from "@/data-structures/hash-table/hash-table";

/**
 * LeetCode Problem: Two Sum
 *
 * Problem: Given an array of integers and a target, return indices of two numbers that add up to target.
 *
 * Algorithm:
 * 1. Use hash table to store value -> index mapping
 * 2. For each number, check if (target - number) exists in hash
 * 3. If yes, return [stored index, current index]
 * 4. Otherwise, store current number and index
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * @example
 * twoSum([2, 7, 11, 15], 9) // [0, 1]
 * twoSum([3, 2, 4], 6) // [1, 2]
 */
export function twoSum(nums: number[], target: number): number[] {
	const map = new HashTable<number, number>();

	for (let i = 0; i < nums.length; i++) {
		const complement = target - nums[i]!;
		if (map.has(complement)) {
			return [map.get(complement)!, i];
		}
		map.set(nums[i]!, i);
	}

	return [];
}

/**
 * LeetCode Problem: Group Anagrams
 *
 * Problem: Given array of strings, group anagrams together.
 *
 * Algorithm:
 * 1. For each string, create a sorted version as key
 * 2. Use hash table: sorted string -> array of original strings
 * 3. All anagrams will have same sorted key
 * 4. Return all grouped arrays
 *
 * Time Complexity: O(n * k log k) where k is max string length
 * Space Complexity: O(n * k)
 *
 * @example
 * groupAnagrams(["eat","tea","tan","ate","nat","bat"])
 * // [["eat","tea","ate"], ["tan","nat"], ["bat"]]
 */
export function groupAnagrams(strs: string[]): string[][] {
	const map = new HashTable<string, string[]>();

	for (const str of strs) {
		const sorted = str.split("").sort().join("");
		const group = map.get(sorted) || [];
		group.push(str);
		map.set(sorted, group);
	}

	return map.values();
}

/**
 * LeetCode Problem: Longest Consecutive Sequence
 *
 * Problem: Find length of longest consecutive sequence in unsorted array.
 *
 * Algorithm:
 * 1. Add all numbers to hash table for O(1) lookup
 * 2. For each number, check if it's start of sequence (num-1 not in set)
 * 3. If start, count consecutive numbers
 * 4. Track maximum length
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * @example
 * longestConsecutive([100, 4, 200, 1, 3, 2]) // 4 (sequence: 1,2,3,4)
 */
export function longestConsecutive(nums: number[]): number {
	if (nums.length === 0) return 0;

	const numSet = new HashTable<number, boolean>();
	for (const num of nums) {
		numSet.set(num, true);
	}

	let maxLength = 0;

	for (const num of nums) {
		// Only start counting if this is beginning of sequence
		if (!numSet.has(num - 1)) {
			let currentNum = num;
			let currentLength = 1;

			while (numSet.has(currentNum + 1)) {
				currentNum++;
				currentLength++;
			}

			maxLength = Math.max(maxLength, currentLength);
		}
	}

	return maxLength;
}

/**
 * LeetCode Problem: Subarray Sum Equals K
 *
 * Problem: Count subarrays with sum equal to k.
 *
 * Algorithm:
 * 1. Use prefix sum with hash table
 * 2. Store cumulative sum -> frequency
 * 3. If (currentSum - k) exists, add its frequency to count
 * 4. Update hash table with current sum
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * @example
 * subarraySum([1, 1, 1], 2) // 2 ([1,1] twice)
 * subarraySum([1, 2, 3], 3) // 2 ([3] and [1,2])
 */
export function subarraySum(nums: number[], k: number): number {
	const map = new HashTable<number, number>();
	map.set(0, 1); // Base case: sum of 0 occurs once

	let count = 0;
	let sum = 0;

	for (const num of nums) {
		sum += num;
		const complement = sum - k;

		if (map.has(complement)) {
			count += map.get(complement)!;
		}

		map.set(sum, (map.get(sum) || 0) + 1);
	}

	return count;
}

/**
 * LeetCode Problem: Contains Duplicate
 *
 * Problem: Return true if array contains any duplicates.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function containsDuplicate(nums: number[]): boolean {
	const seen = new HashTable<number, boolean>();

	for (const num of nums) {
		if (seen.has(num)) return true;
		seen.set(num, true);
	}

	return false;
}

/**
 * LeetCode Problem: Valid Anagram
 *
 * Problem: Check if two strings are anagrams.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - limited to 26 letters
 */
export function isAnagram(s: string, t: string): boolean {
	if (s.length !== t.length) return false;

	const count = new HashTable<string, number>();

	for (const char of s) {
		count.set(char, (count.get(char) || 0) + 1);
	}

	for (const char of t) {
		const freq = count.get(char);
		if (!freq) return false;
		count.set(char, freq - 1);
	}

	return true;
}

/**
 * Exercise: Item In Common
 *
 * Problem: Given two arrays, return true if they have at least one item in common.
 *
 * Algorithm:
 * 1. Add all items from first array to hash table
 * 2. Check each item from second array if it exists in hash table
 * 3. Return true on first match, false if no matches
 *
 * Time Complexity: O(n + m) where n and m are array lengths
 * Space Complexity: O(n) for hash table
 *
 * @example
 * itemInCommon([1, 2, 3], [4, 5, 2]) // true (2 is common)
 * itemInCommon([1, 2, 3], [4, 5, 6]) // false
 */
export function itemInCommon(arr1: number[], arr2: number[]): boolean {
	const map = new HashTable<number, boolean>();

	// Add all items from first array
	for (const item of arr1) {
		map.set(item, true);
	}

	// Check if any item from second array exists
	for (const item of arr2) {
		if (map.has(item)) return true;
	}

	return false;
}

/**
 * Exercise: Find Duplicates
 *
 * Problem: Given an array of integers, return an array of all duplicate values.
 *
 * Algorithm:
 * 1. Use hash table to count frequency of each number
 * 2. Collect all numbers with frequency > 1
 * 3. Return array of duplicates
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * @example
 * findDuplicates([1, 2, 3, 2, 4, 3, 5]) // [2, 3]
 * findDuplicates([1, 2, 3, 4, 5]) // []
 */
export function findDuplicates(nums: number[]): number[] {
	const count = new HashTable<number, number>();
	const duplicates: number[] = [];

	// Count frequency of each number
	for (const num of nums) {
		count.set(num, (count.get(num) || 0) + 1);
	}

	// Collect numbers that appear more than once
	for (const num of count.keys()) {
		if (count.get(num)! > 1) {
			duplicates.push(num);
		}
	}

	return duplicates;
}

/**
 * Exercise: First Non-Repeating Character
 *
 * Problem: Given a string, find the first non-repeating character and return its index.
 * If it doesn't exist, return -1.
 *
 * Algorithm:
 * 1. Count frequency of each character using hash table
 * 2. Iterate through string again to find first char with frequency 1
 * 3. Return index of first non-repeating char or -1
 *
 * Time Complexity: O(n)
 * Space Complexity: O(k) where k is number of unique characters
 *
 * @example
 * firstNonRepeatingChar("leetcode") // 0 ('l')
 * firstNonRepeatingChar("loveleetcode") // 2 ('v')
 * firstNonRepeatingChar("aabb") // -1
 */
export function firstNonRepeatingChar(s: string): number {
	const count = new HashTable<string, number>();

	// Count frequency of each character
	for (const char of s) {
		count.set(char, (count.get(char) || 0) + 1);
	}

	// Find first character with frequency 1
	for (let i = 0; i < s.length; i++) {
		if (count.get(s[i]!) === 1) {
			return i;
		}
	}

	return -1;
}
