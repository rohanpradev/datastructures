/**
 * Finds the only number that appears once when every other number appears twice.
 *
 * Pattern: XOR cancellation
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export function singleNumber(nums: number[]): number {
	let result = 0;

	for (const num of nums) {
		result ^= num;
	}

	return result;
}

/**
 * Returns count of set bits for every number from 0 to n.
 *
 * Pattern: DP over bits
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function countingBits(n: number): number[] {
	const counts = new Array<number>(n + 1).fill(0);

	for (let num = 1; num <= n; num++) {
		counts[num] = counts[num >> 1]! + (num & 1);
	}

	return counts;
}

/**
 * Returns the missing number from the range 0..n.
 *
 * Pattern: XOR index/value cancellation
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export function missingNumberXor(nums: number[]): number {
	let result = nums.length;

	for (let i = 0; i < nums.length; i++) {
		result ^= i;
		result ^= nums[i]!;
	}

	return result;
}

/**
 * Reverses the bits of a 32-bit unsigned integer.
 *
 * Pattern: bit shifting
 * Time Complexity: O(32) -> O(1)
 * Space Complexity: O(1)
 */
export function reverseBits(value: number): number {
	let result = 0;
	let current = value >>> 0;

	for (let i = 0; i < 32; i++) {
		result = (result << 1) | (current & 1);
		current >>>= 1;
	}

	return result >>> 0;
}
