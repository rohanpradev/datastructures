/**
 * Finds the maximum sum of non-adjacent numbers in an array.
 *
 * @param {number[]} nums - The input array of numbers.
 * @returns {number | null} - Maximum sum of non-adjacent numbers, or null if array is empty.
 *
 * @example
 * maxSumNonAdjacent([3,2,5,10,7]); // returns 15 (3 + 5 + 7)
 * maxSumNonAdjacent([2,1,4,9]);    // returns 11 (2 + 9)
 */
export function maxSumNonAdjacent(nums: number[]): number | null {
	// Edge case: empty array
	if (nums.length === 0) return null;

	// Edge case: only one element
	if (nums.length === 1) return nums[0];

	// prevTwo: max sum up to two indices before current
	let prevTwo = nums[0];

	// prevOne: max sum up to previous index
	let prevOne = Math.max(nums[0], nums[1]);

	// Iterate from the third element to the end
	for (let i = 2; i < nums.length; i++) {
		// Either take current element + prevTwo, or skip current (prevOne)
		const currentMax = Math.max(prevOne, prevTwo + nums[i]);

		// Update prevTwo and prevOne for next iteration
		prevTwo = prevOne;
		prevOne = currentMax;
	}

	// prevOne contains the max sum for the whole array
	return prevOne;
}

/**
 * Calculates the number of ways to make change for a target amount
 * using the given denominations.
 *
 * @param {number} target - The target amount.
 * @param {number[]} denoms - Array of coin denominations.
 * @returns {number} - Number of ways to make change.
 *
 * @example
 * waysOfChange(5, [1, 2, 5]); // returns 4
 */
export function waysOfChange(target: number, denoms: number[]): number {
	// ways[i] = number of ways to make amount i
	const ways = new Array(target + 1).fill(0);
	ways[0] = 1; // base case: 1 way to make 0

	for (const coin of denoms) {
		for (let amount = coin; amount <= target; amount++) {
			ways[amount] += ways[amount - coin];
		}
	}

	return ways[target];
}

/**
 * Returns the minimum number of coins required to make the target amount.
 *
 * Uses dynamic programming where each index represents the minimum
 * number of coins needed to form that amount.
 *
 * If the target amount cannot be formed using the given denominations,
 * the function returns -1.
 *
 * Time Complexity: O(target * denoms.length)
 * Space Complexity: O(target)
 *
 * @param target - The amount of money we want to make
 * @param denoms - Available coin denominations (can be reused unlimited times)
 * @returns The minimum number of coins needed, or -1 if impossible
 */
export function minNumberOfCoinsForChange(
	target: number,
	denoms: number[],
): number {
	// nums[i] will store the minimum number of coins needed to make amount i
	const nums = new Array(target + 1).fill(Infinity);

	// Base case: 0 coins are needed to make amount 0
	nums[0] = 0;

	// Iterate through each denomination
	for (const denom of denoms) {
		// Try to build all amounts from denom up to target
		for (let amount = denom; amount <= target; amount++) {
			// If the previous amount is reachable, update the minimum
			nums[amount] = Math.min(nums[amount], 1 + nums[amount - denom]);
		}
	}

	// If the target is still Infinity, it cannot be formed
	return nums[target] === Infinity ? -1 : nums[target];
}

/**
 * Calculates the Levenshtein Distance (Edit Distance) between two strings.
 *
 * Levenshtein Distance is the minimum number of single-character operations
 * required to transform one string into another.
 *
 * Allowed operations:
 *  - Insert a character
 *  - Delete a character
 *  - Replace a character
 *
 * This implementation uses bottom-up Dynamic Programming.
 *
 * Time Complexity: O(n * m)
 * Space Complexity: O(n * m)
 *
 * Where:
 *  - n = length of string1
 *  - m = length of string2
 *
 * @param str1 - The source string
 * @param str2 - The target string
 * @returns The minimum number of edit operations required
 *
 * @example
 * levenshteinDistance("kitten", "sitting")
 * // → 3 (replace k→s, replace e→i, insert g)
 */
export function levenshteinDistance(str1: string, str2: string): number {
	const n = str1.length;
	const m = str2.length;

	// dp[i][j] represents the minimum number of edits required
	// to convert str1[0..i-1] into str2[0..j-1]
	const dp: number[][] = Array.from({ length: n + 1 }, () =>
		new Array(m + 1).fill(0),
	);

	// Base cases:
	// Converting a string to an empty string requires deleting all characters
	for (let i = 0; i <= n; i++) {
		dp[i][0] = i;
	}

	// Converting an empty string to a string requires inserting all characters
	for (let j = 0; j <= m; j++) {
		dp[0][j] = j;
	}

	// Fill the DP table
	for (let i = 1; i <= n; i++) {
		for (let j = 1; j <= m; j++) {
			// If current characters are the same, no operation is needed
			if (str1[i - 1] === str2[j - 1]) {
				dp[i][j] = dp[i - 1][j - 1];
			} else {
				// Otherwise, consider the minimum of:
				// 1. Insert (dp[i][j - 1])
				// 2. Delete (dp[i - 1][j])
				// 3. Replace (dp[i - 1][j - 1])
				dp[i][j] =
					1 +
					Math.min(
						dp[i][j - 1], // Insert
						dp[i - 1][j], // Delete
						dp[i - 1][j - 1], // Replace
					);
			}
		}
	}

	// The bottom-right cell contains the final answer
	return dp[n][m];
}

/**
 * Calculates the number of ways to traverse a grid using recursion.
 * You can only move either RIGHT or DOWN.
 *
 * This is the naive recursive solution and is NOT optimized.
 *
 * @param width - Number of columns in the grid
 * @param height - Number of rows in the grid
 * @returns Number of unique paths from top-left to bottom-right
 *
 * @example
 * numOfWaysToTraverseGraphRecursive(3, 3) // → 6
 *
 * @timeComplexity O(2^(width + height))
 * @spaceComplexity O(width + height) (call stack)
 */
export function numOfWaysToTraverseGraphRecursive(
	width: number,
	height: number,
): number {
	// Base case: only one way if there's a single row or column
	if (width === 1 || height === 1) return 1;

	// Ways = from left + from top
	return (
		numOfWaysToTraverseGraphRecursive(width - 1, height) +
		numOfWaysToTraverseGraphRecursive(width, height - 1)
	);
}

/**
 * Calculates the number of ways to traverse a grid using Dynamic Programming.
 * You can only move either RIGHT or DOWN.
 *
 * This approach stores intermediate results to avoid recomputation.
 *
 * @param width - Number of columns in the grid
 * @param height - Number of rows in the grid
 * @returns Number of unique paths from top-left to bottom-right
 *
 * @example
 * numberOfWaysToTraverseGraph(3, 3) // → 6
 *
 * @timeComplexity O(width × height)
 * @spaceComplexity O(width × height)
 */
export function numberOfWaysToTraverseGraph(
	width: number,
	height: number,
): number {
	// Create a 2D array initialized with 0s
	const ways: number[][] = Array.from({ length: height }, () =>
		new Array(width).fill(0),
	);

	// First row and first column have only one way to be reached
	for (let row = 0; row < height; row++) {
		for (let col = 0; col < width; col++) {
			if (row === 0 || col === 0) {
				ways[row][col] = 1;
			} else {
				// Current cell = ways from top + ways from left
				ways[row][col] = ways[row - 1][col] + ways[row][col - 1];
			}
		}
	}

	// Bottom-right cell contains the result
	return ways[height - 1][width - 1];
}

/**
 * Computes the factorial of a non-negative integer.
 *
 * Factorial definition:
 * n! = n × (n - 1) × (n - 2) × ... × 1
 *
 * @param n - Non-negative integer
 * @returns The factorial of `n`
 *
 * @example
 * factorial(5) // → 120
 *
 * @timeComplexity O(n)
 * @spaceComplexity O(1)
 */
function factorial(n: number): number {
	let result = 1;

	// Multiply all integers from 2 up to n
	for (let i = 2; i <= n; i++) {
		result *= i;
	}

	return result;
}

/**
 * Calculates the number of unique ways to traverse a grid
 * using a combinatorics (probability-based) approach.
 *
 * Rules:
 * - Start at the top-left corner
 * - End at the bottom-right corner
 * - Only RIGHT and DOWN moves are allowed
 *
 * Core idea:
 * - You must make:
 *   - (width - 1) RIGHT moves
 *   - (height - 1) DOWN moves
 * - The total number of moves is:
 *   rightMoves + downMoves
 * - The problem becomes counting the number of unique
 *   permutations of these moves
 *
 * Mathematical formula:
 * (rightMoves + downMoves)! / (rightMoves! × downMoves!)
 *
 * @param width - Number of columns in the grid
 * @param height - Number of rows in the grid
 * @returns Number of unique paths from top-left to bottom-right
 *
 * @example
 * numberOfWaysToTraverseGraphFactorial(3, 3) // → 6
 *
 * @timeComplexity O(width + height)
 * @spaceComplexity O(1)
 */
export function numberOfWaysToTraverseGraphFactorial(
	width: number,
	height: number,
): number {
	// Number of horizontal moves required to reach the last column
	const rightMoves = width - 1;

	// Number of vertical moves required to reach the last row
	const downMoves = height - 1;

	// Total number of moves made during the traversal
	const totalMoves = rightMoves + downMoves;

	// Number of unique ways to arrange RIGHT and DOWN moves
	return factorial(totalMoves) / (factorial(rightMoves) * factorial(downMoves));
}
