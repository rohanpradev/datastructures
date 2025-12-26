/**
 * Array Coding Exercises
 *
 * Collection of common array manipulation problems frequently asked in coding interviews.
 * These exercises cover various techniques including two-pointers, sliding window,
 * dynamic programming, and in-place modifications.
 */

/**
 * Remove Element (LeetCode 27)
 *
 * Removes all instances of a value from an array in-place.
 * Returns the new length of the array.
 *
 * Algorithm (Two-Pointer):
 * 1. Use pointer k to track position for next valid element
 * 2. Iterate through array
 * 3. When element != val, place it at position k and increment k
 * 4. Return k (new length)
 *
 * Time Complexity: O(n) - single pass
 * Space Complexity: O(1) - in-place modification
 *
 * @param nums - Array to modify (modified in-place)
 * @param val - Value to remove
 * @returns New length of array after removing val
 *
 * @example
 * const arr = [3, 2, 2, 3];
 * removeElement(arr, 3); // Returns 2, arr is now [2, 2, _, _]
 *
 * @example
 * const arr = [0, 1, 2, 2, 3, 0, 4, 2];
 * removeElement(arr, 2); // Returns 5, arr is now [0, 1, 3, 0, 4, _, _, _]
 */
export function removeElement(nums: number[], val: number): number {
  let k = 0; // Position for next valid element

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i]!;
      k++;
    }
  }

  return k;
}

/**
 * Find Max and Min
 *
 * Finds both maximum and minimum values in an array in a single pass.
 *
 * Algorithm:
 * 1. Initialize max and min to first element
 * 2. Iterate through remaining elements
 * 3. Update max and min as needed
 * 4. Return tuple [max, min]
 *
 * Time Complexity: O(n) - single pass
 * Space Complexity: O(1)
 *
 * @param arr - Array to search (must be non-empty)
 * @returns Tuple of [max, min] values
 * @throws Error if array is empty
 *
 * @example
 * findMaxMin([3, 1, 4, 1, 5, 9, 2, 6]); // [9, 1]
 * findMaxMin([42]); // [42, 42]
 * findMaxMin([-5, -1, -10, -3]); // [-1, -10]
 */
export function findMaxMin(arr: number[]): [number, number] {
  if (arr.length === 0) {
    throw new Error("Array must not be empty");
  }

  let max = arr[0]!;
  let min = arr[0]!;

  for (let i = 1; i < arr.length; i++) {
    const current = arr[i]!;
    if (current > max) max = current;
    if (current < min) min = current;
  }

  return [max, min];
}

/**
 * Find Longest String
 *
 * Finds the longest string in an array of strings.
 * If multiple strings have the same maximum length, returns the first one.
 *
 * Algorithm:
 * 1. Initialize longest to first string
 * 2. Iterate through remaining strings
 * 3. Update longest if current string is longer
 * 4. Return longest string
 *
 * Time Complexity: O(n) - single pass
 * Space Complexity: O(1) - only stores reference
 *
 * @param strings - Array of strings (must be non-empty)
 * @returns The longest string
 * @throws Error if array is empty
 *
 * @example
 * findLongestString(["apple", "banana", "kiwi"]); // "banana"
 * findLongestString(["a", "bb", "cc"]); // "bb" (first max)
 * findLongestString(["hello"]); // "hello"
 */
export function findLongestString(strings: string[]): string {
  if (strings.length === 0) {
    throw new Error("Array must not be empty");
  }

  let longest = strings[0]!;

  for (let i = 1; i < strings.length; i++) {
    const current = strings[i]!;
    if (current.length > longest.length) {
      longest = current;
    }
  }

  return longest;
}

/**
 * Remove Duplicates from Sorted Array (LeetCode 26)
 *
 * Removes duplicates from a sorted array in-place.
 * Returns the number of unique elements.
 *
 * Algorithm (Two-Pointer):
 * 1. Use pointer k to track position for next unique element
 * 2. Iterate through array starting from index 1
 * 3. When nums[i] != nums[k], increment k and place nums[i] there
 * 4. Return k + 1 (count of unique elements)
 *
 * Time Complexity: O(n) - single pass
 * Space Complexity: O(1) - in-place modification
 *
 * @param nums - Sorted array to modify (modified in-place)
 * @returns Number of unique elements
 *
 * @example
 * const arr = [1, 1, 2];
 * removeDuplicates(arr); // Returns 2, arr is now [1, 2, _]
 *
 * @example
 * const arr = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
 * removeDuplicates(arr); // Returns 5, arr is now [0, 1, 2, 3, 4, _, _, _, _, _]
 */
export function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  let k = 0; // Position of last unique element

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[k]) {
      k++;
      nums[k] = nums[i]!;
    }
  }

  return k + 1;
}

/**
 * Best Time to Buy and Sell Stock (LeetCode 121)
 *
 * Finds the maximum profit from buying and selling a stock once.
 * You must buy before you sell.
 *
 * Algorithm (Single Pass):
 * 1. Track minimum price seen so far
 * 2. Track maximum profit seen so far
 * 3. For each price:
 *    - Update min price if current is lower
 *    - Update max profit if (current - min) is higher
 * 4. Return max profit
 *
 * Time Complexity: O(n) - single pass
 * Space Complexity: O(1)
 *
 * @param prices - Array of stock prices (prices[i] is price on day i)
 * @returns Maximum profit, or 0 if no profit possible
 *
 * @example
 * maxProfit([7, 1, 5, 3, 6, 4]); // 5 (buy at 1, sell at 6)
 * maxProfit([7, 6, 4, 3, 1]); // 0 (no profit possible)
 * maxProfit([2, 4, 1]); // 2 (buy at 2, sell at 4)
 */
export function maxProfit(prices: number[]): number {
  if (prices.length === 0) return 0;

  let minPrice = prices[0]!;
  let maxProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i]!;

    // Update minimum price if we found a lower one
    if (currentPrice < minPrice) {
      minPrice = currentPrice;
    }

    // Calculate profit if we sell at current price
    const profit = currentPrice - minPrice;

    // Update maximum profit if current is better
    if (profit > maxProfit) {
      maxProfit = profit;
    }
  }

  return maxProfit;
}

/**
 * Rotate Array (LeetCode 189)
 *
 * Rotates an array to the right by k steps.
 * Modified in-place with O(1) extra space.
 *
 * Algorithm (Triple Reverse):
 * 1. Normalize k to be within array bounds (k %= n)
 * 2. Reverse entire array
 * 3. Reverse first k elements
 * 4. Reverse remaining n-k elements
 *
 * Example: [1,2,3,4,5,6,7], k=3
 * - Reverse all: [7,6,5,4,3,2,1]
 * - Reverse first 3: [5,6,7,4,3,2,1]
 * - Reverse last 4: [5,6,7,1,2,3,4] ✓
 *
 * Time Complexity: O(n) - three passes
 * Space Complexity: O(1) - in-place
 *
 * @param nums - Array to rotate (modified in-place)
 * @param k - Number of steps to rotate right
 *
 * @example
 * const arr = [1, 2, 3, 4, 5, 6, 7];
 * rotate(arr, 3); // arr is now [5, 6, 7, 1, 2, 3, 4]
 *
 * @example
 * const arr = [-1, -100, 3, 99];
 * rotate(arr, 2); // arr is now [3, 99, -1, -100]
 */
export function rotate(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;

  // Normalize k to be within array bounds
  k = k % n;
  if (k === 0) return;

  // Helper function to reverse array segment
  const reverse = (start: number, end: number) => {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end]!, nums[start]!];
      start++;
      end--;
    }
  };

  // Step 1: Reverse entire array
  reverse(0, n - 1);

  // Step 2: Reverse first k elements
  reverse(0, k - 1);

  // Step 3: Reverse remaining n-k elements
  reverse(k, n - 1);
}

/**
 * Maximum Subarray (LeetCode 53) - Kadane's Algorithm
 *
 * Finds the contiguous subarray with the largest sum.
 *
 * Algorithm (Kadane's Algorithm):
 * 1. Track current sum (resets to current element if negative)
 * 2. Track maximum sum seen so far
 * 3. For each element:
 *    - Add to current sum
 *    - If current sum becomes negative, reset to current element
 *    - Update max sum if current sum is larger
 * 4. Return max sum
 *
 * Key Insight: If current sum becomes negative, it can't help future sums,
 * so we restart from the next element.
 *
 * Time Complexity: O(n) - single pass
 * Space Complexity: O(1)
 *
 * @param nums - Array of integers (must be non-empty)
 * @returns Maximum sum of contiguous subarray
 *
 * @example
 * maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]); // 6 ([4,-1,2,1])
 * maxSubArray([1]); // 1
 * maxSubArray([5, 4, -1, 7, 8]); // 23 (entire array)
 * maxSubArray([-1, -2, -3]); // -1 (best single element)
 */
export function maxSubArray(nums: number[]): number {
  if (nums.length === 0) {
    throw new Error("Array must not be empty");
  }

  let currentSum = nums[0]!;
  let maxSum = nums[0]!;

  for (let i = 1; i < nums.length; i++) {
    const current = nums[i]!;

    // Either extend current subarray or start new one
    currentSum = Math.max(current, currentSum + current);

    // Update maximum sum if current is better
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

/**
 * Printing Press Capacity Check
 *
 * Determines whether a printing press can print all page batches
 * (in their given order, without reordering) within a fixed number of days,
 * where each day has a maximum page capacity.
 *
 * Problem Summary:
 * - `batches[i]` = number of pages in batch `i`
 * - Batches must be printed in **exact order**
 * - Each day can print at most `maxPagesPerDay`
 * - If the next batch would exceed the daily limit, printing moves to the next day
 * - Goal: Determine if **all batches** can be printed within `maxDays`
 *
 * Algorithm:
 * 1. Track the current day (`day`) and pages printed today (`dayLoad`)
 * 2. Process batches in order (`batchIndex`)
 * 3. For each batch:
 *    - If a single batch exceeds daily capacity → impossible, return false
 *    - If adding this batch exceeds today's limit → advance to next day
 *    - Otherwise, print the batch and continue
 * 4. Once all batches are processed, return true
 *
 * Key Insight:
 * - This is a classic "partition array into ≤ K segments with max sum limit" problem
 * - Because batches must remain in order, the algorithm greedily fills each day
 *   until it cannot fit the next batch.
 *
 * Time Complexity: O(n) — single pass through the batches
 * Space Complexity: O(1)
 *
 * @param batches - Array of page counts that must be printed in order
 * @param maxDays - Total number of days available
 * @param maxPagesPerDay - Max printable pages per day
 * @returns `true` if all batches fit within maxDays, otherwise `false`
 *
 * @example
 * canFinishPrinting([5, 3, 4], 2, 10); // true  (Day1: 5+3, Day2: 4)
 * canFinishPrinting([6, 6, 6], 2, 10); // false (requires 3 days)
 * canFinishPrinting([12], 10, 10);    // false (single batch exceeds capacity)
 * canFinishPrinting([], 1, 10);       // true (nothing to print)
 */
export function canFinishPrinting(
  batches: number[],
  maxDays: number,
  maxPagesPerDay: number,
): boolean {
  let day = 1;
  let dayLoad = 0;
  let batchIndex = 0;

  while (batchIndex < batches.length) {
    const nextBatch = batches[batchIndex]!;

    // If a single batch exceeds daily capacity, impossible
    if (nextBatch > maxPagesPerDay) {
      return false;
    }

    // If adding this batch exceeds the limit, move to next day
    if (dayLoad + nextBatch > maxPagesPerDay) {
      day++;
      if (day > maxDays) {
        return false;
      }
      dayLoad = 0;
      continue;
    }

    // Otherwise, print this batch
    dayLoad += nextBatch;
    batchIndex++;
  }

  // All batches printed within maxDays
  return true;
}

/**
 * Two Sum (Hash Map Approach)
 *
 * Determines whether there exist two numbers in the array whose sum equals
 * the given target, and returns their **indices**.
 *
 * Problem Summary:
 * - `arr[i]` = number at index `i`
 * - Find two **distinct indices** `i` and `j` such that:
 *     arr[i] + arr[j] === target
 * - Each element may be used **at most once**
 * - Order of indices does not matter
 *
 * Algorithm:
 * 1. Create a hash map (`seen`) to store numbers we have already visited
 *    along with their indices.
 * 2. Iterate through the array from left to right.
 * 3. For each element:
 *    - Compute the required complement: `target - current`
 *    - If the complement already exists in the map:
 *        → we found a valid pair, return their indices
 *    - Otherwise, store the current number with its index in the map
 * 4. If no pair is found after the loop, return `undefined`
 *
 * Key Insight:
 * - By trading space for time, we reduce the problem from O(n²) to O(n)
 * - The hash map allows constant-time lookups for complements
 *
 * Time Complexity: O(n) — single pass through the array
 * Space Complexity: O(n) — hash map storing seen values
 *
 * @param arr - Array of numbers to search
 * @param target - Desired sum of two numbers
 * @returns A tuple of indices `[i, j]` if a pair exists, otherwise `undefined`
 *
 * @example
 * twoSum([2, 7, 11, 15], 9);  // [0, 1]
 * twoSum([3, 2, 4], 6);      // [1, 2]
 * twoSum([3, 3], 6);         // [0, 1]
 * twoSum([1, 2, 3], 7);      // undefined
 */
export function twoSum(
  arr: number[],
  target: number,
): [number, number] | undefined {
  // Map from value → index where it was first seen
  const seen: Record<number, number> = {};

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i]!;
    const complement = target - current;

    // If we've already seen the complement, we have a solution
    if (seen[complement] !== undefined) {
      return [seen[complement], i];
    }

    // Store the current value with its index
    seen[current] = i;
  }

  // No valid pair found
  return undefined;
}

/**
 * Validate Subsequence (Two-Pointer Approach)
 *
 * Determines whether a given `sequence` is a subsequence of `array`.
 * A subsequence appears in the same **relative order**, but elements
 * do **not** need to be contiguous.
 *
 * Problem Summary:
 * - Given two arrays:
 *     - `array`: the source array
 *     - `sequence`: the array we want to validate as a subsequence
 * - Determine whether all elements in `sequence` appear in `array`
 *   in the same order
 * - Elements do not need to be adjacent
 *
 * Algorithm:
 * 1. Use two pointers:
 *    - `arrayIndex` traverses the main array
 *    - `sequenceIndex` tracks progress in the sequence
 * 2. Iterate through `array`:
 *    - If `array[arrayIndex] === sequence[sequenceIndex]`,
 *      advance `sequenceIndex`
 *    - Always advance `arrayIndex`
 * 3. Stop early if the entire sequence has been matched
 * 4. After iteration, check whether all sequence elements were matched
 *
 * Key Insight:
 * - You only move forward in the sequence when a match is found
 * - This guarantees order preservation without backtracking
 *
 * Time Complexity: O(n) — where `n` is the length of the main array
 * Space Complexity: O(1) — constant extra space
 *
 * @param array - The array to search within
 * @param sequence - The sequence to validate
 * @returns `true` if `sequence` is a subsequence of `array`, otherwise `false`
 *
 * @example
 * validateSubsequence([5, 1, 22, 25, 6, -1, 8, 10], [1, 6, -1, 10]); // true
 * validateSubsequence([1, 2, 3, 4], [2, 4]);                       // true
 * validateSubsequence([1, 2, 3, 4], [2, 5]);                       // false
 * validateSubsequence([1, 2, 3], [3, 2]);                          // false
 */
export function validateSubsequence(
  array: number[],
  sequence: number[],
): boolean {
  let arrayIndex = 0; // Pointer for the main array
  let sequenceIndex = 0; // Pointer for the sequence we are matching

  // Traverse the main array while there are still sequence elements to match
  while (arrayIndex < array.length && sequenceIndex < sequence.length) {
    // If elements match, move forward in the sequence
    if (array[arrayIndex] === sequence[sequenceIndex]) {
      sequenceIndex++;
    }

    // Always move forward in the main array
    arrayIndex++;
  }

  // If all sequence elements were matched, it is a valid subsequence
  return sequenceIndex === sequence.length;
}

/**
 * Returns a new array containing the squares of the input numbers,
 * sorted in non-decreasing order.
 *
 * This function assumes the input array is already sorted in
 * non-decreasing order (can include negative numbers).
 *
 * Time complexity: O(n)
 * Space complexity: O(n)
 *
 * @param nums - A sorted array of integers (may include negatives)
 * @returns A new array of sorted squared values
 */
export function sortedSquaredArray(nums: number[]): number[] {
  // Pointer starting at the beginning of the array
  let startPointer = 0;

  // Pointer starting at the end of the array
  let endPointer = nums.length - 1;

  // Index to fill the result array from right to left
  let i = nums.length - 1;

  // Result array initialized with zeros
  const sortedSquare: number[] = new Array(nums.length).fill(0);

  // Continue until both pointers have been processed
  while (startPointer <= endPointer) {
    const startVal = nums[startPointer];
    const endVal = nums[endPointer];

    // Compare absolute values to decide which square is larger
    if (Math.abs(startVal) > Math.abs(endVal)) {
      sortedSquare[i] = startVal * startVal;
      startPointer++;
    } else {
      sortedSquare[i] = endVal * endVal;
      endPointer--;
    }

    // Move to the next position from the right
    i--;
  }

  return sortedSquare;
}

/**
 * Tournament Winner
 *
 * Determines the overall winner of a tournament based on match results.
 * Each competition consists of a home team and an away team.
 *
 * Rules:
 * - `results[i] === 1` → home team wins
 * - `results[i] === 0` → away team wins
 * - Each win is worth 1 point
 * - The team with the highest total points wins the tournament
 *
 * Algorithm:
 * 1. Use a hash map to track the number of wins for each team
 * 2. Iterate through all competitions:
 *    - Determine the winner of each match
 *    - Increment that team's win count
 *    - Update the current tournament leader if needed
 * 3. Return the team with the most wins
 *
 * Key Insight:
 * - Updating the leader during iteration avoids a second pass
 * - Hash map allows constant-time score updates
 *
 * Time Complexity: O(n) — where n is the number of competitions
 * Space Complexity: O(k) — where k is the number of unique teams
 *
 * @param competitions - Array of matches, each as [homeTeam, awayTeam]
 * @param results - Array of match results (1 = home win, 0 = away win)
 * @returns The name of the tournament-winning team
 *
 * @example
 * tournamentWinner(
 *   [["HTML", "C#"], ["C#", "Python"], ["Python", "HTML"]],
 *   [0, 0, 1]
 * ); // "Python"
 */
export function tournamentWinner(
  competitions: Array<[string, string]>,
  results: number[],
): string {
  // Map to store win counts for each team
  const winCounts: Record<string, number> = {};

  // Track the current tournament leader
  let currentLeader = "";
  let maxWins = 0;

  // Iterate through each competition
  for (let i = 0; i < competitions.length; i++) {
    const [homeTeam, awayTeam] = competitions[i];

    // Determine winner based on result
    const winner = results[i] === 1 ? homeTeam : awayTeam;

    // Increment the winner's win count
    winCounts[winner] = (winCounts[winner] ?? 0) + 1;

    // Update leader if this team now has the most wins
    if (winCounts[winner] > maxWins) {
      maxWins = winCounts[winner];
      currentLeader = winner;
    }
  }

  return currentLeader;
}

/**
 * Non-Constructible Change
 *
 * Finds the minimum amount of change that cannot be created
 * using any subset of the given coin values.
 *
 * Algorithm:
 * 1. Sort the coins in ascending order
 * 2. Track the maximum constructible change so far
 * 3. If the next coin is greater than (change + 1), we found a gap
 * 4. Otherwise, extend the constructible range
 *
 * Time Complexity: O(n log n)
 * Space Complexity: O(1) (ignoring sort space)
 */
export function nonConstructableChange(nums: number[]): number {
  // Sort numerically (IMPORTANT)
  nums.sort((a, b) => a - b);

  let change = 0;

  for (const val of nums) {
    // If we cannot create change + 1, return it
    if (val > change + 1) {
      return change + 1;
    }

    // Extend constructible range
    change += val;
  }

  // All values are constructible up to `change`
  return change + 1;
}

/**
 * Transposes a matrix.
 *
 * The transpose of a matrix flips it over its diagonal,
 * converting rows into columns and columns into rows.
 *
 * Example:
 * [
 *   [1, 2, 3],
 *   [4, 5, 6]
 * ]
 * becomes:
 * [
 *   [1, 4],
 *   [2, 5],
 *   [3, 6]
 * ]
 *
 * @param {number[][]} matrix - A 2D array representing the matrix
 * @returns {number[][]} A new matrix that is the transpose of the input
 *
 * Time Complexity:  O(m × n)
 * Space Complexity: O(m × n)
 *   where m = number of rows, n = number of columns
 *
 * Note:
 * - In-place transpose is NOT possible for non-square matrices,
 *   so a new matrix must be created.
 */
export function transpose(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Create a new matrix with swapped dimensions (cols × rows)
  const result: number[][] = Array.from({ length: cols }, () => Array(rows));

  // Copy values to their transposed positions
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }

  return result;
}

/**
 * Compares two strings where '#' represents a backspace character.
 *
 * The function processes both strings from right to left,
 * skipping characters that are "deleted" by '#'.
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(1)
 *
 * @param {string} str1 - First input string
 * @param {string} str2 - Second input string
 * @returns {boolean} True if both strings are equal after applying backspaces
 */
export function backspaceStringCompare(str1: string, str2: string): boolean {
  // Pointers starting from the end of each string
  let i = str1.length - 1;
  let j = str2.length - 1;

  // Counters for how many characters to skip due to '#'
  let skip1 = 0;
  let skip2 = 0;

  // Continue while there are characters left in either string
  while (i >= 0 || j >= 0) {
    // Move i to the next valid character in str1
    while (i >= 0) {
      if (str1[i] === "#") {
        skip1++; // Found a backspace
        i--;
      } else if (skip1 > 0) {
        skip1--; // Skip a character due to backspace
        i--;
      } else {
        break; // Valid character found
      }
    }

    // Move j to the next valid character in str2
    while (j >= 0) {
      if (str2[j] === "#") {
        skip2++;
        j--;
      } else if (skip2 > 0) {
        skip2--;
        j--;
      } else {
        break;
      }
    }

    // Compare the current valid characters
    const char1 = i >= 0 ? str1[i] : null;
    const char2 = j >= 0 ? str2[j] : null;

    // If characters differ, strings are not equal
    if (char1 !== char2) return false;

    // Move both pointers left
    i--;
    j--;
  }

  // All characters matched
  return true;
}

/**
 * Calculate the maximum number of planes that can be stopped
 * before landing, given their initial distance and speed.
 *
 * This uses a greedy approach:
 * 1. Compute the landing time for each plane.
 * 2. Sort planes by earliest landing time.
 * 3. Stop one plane per second in order of landing times.
 *
 * @param initialDistance - Array of distances of planes from the runway
 * @param landingSpeed - Array of speeds at which planes are landing
 * @returns Maximum number of planes that can be stopped
 *
 * @example
 * const initialDistance = [1, 3, 5, 4, 8];
 * const landingSpeed = [1, 2, 2, 1, 2];
 * maxPlanesStopped(initialDistance, landingSpeed); // 4
 */
export function maxPlanesStopped(
  initialDistance: number[],
  landingSpeed: number[],
): number {
  const numberOfPlanes = initialDistance.length;

  // 1. Compute landing times for each plane
  const landingTimes: number[] = [];
  for (let i = 0; i < numberOfPlanes; i++) {
    // Use Math.ceil because a plane lands at the moment distance <= 0
    landingTimes.push(Math.ceil(initialDistance[i] / landingSpeed[i]));
  }

  // 2. Sort landing times in ascending order
  landingTimes.sort((a, b) => a - b);

  // 3. Greedily shoot planes one per second
  let currentSecond = 0;
  let planesStopped = 0;

  for (const landingTime of landingTimes) {
    // Can we stop this plane before it lands?
    if (currentSecond < landingTime) {
      planesStopped++;
      currentSecond++; // Move to next second for next plane
    }
  }

  return planesStopped;
}

/**
 * Calculates the minimum total waiting time for a list of tasks.
 *
 * Each number represents the execution time of a task.
 * Tasks are executed sequentially, and each task waits for all
 * previous tasks to complete.
 *
 * The optimal strategy is to execute shorter tasks first (greedy),
 * which minimizes the total waiting time.
 *
 * @param nums - An array of positive integers representing task durations
 * @returns The minimum total waiting time
 *
 * @example
 * minimumWaitingTime([3, 2, 1, 2, 6]); // 17
 */
export function minimumWaitingTime(nums: number[]): number {
  // Sort tasks in ascending order to minimize waiting time
  nums.sort((a, b) => a - b);

  let total = 0;

  // Each task contributes its duration to the waiting time
  // of all tasks that come after it
  for (let i = 0; i < nums.length; i++) {
    total += nums[i] * (nums.length - i - 1);
  }

  return total;
}

/**
 * Determines whether a class photo can be taken such that
 * one shirt color is entirely in the back row and every student
 * in the back row is strictly taller than the student in front.
 *
 * @param redShirts - Heights of students wearing red shirts
 * @param blueShirts - Heights of students wearing blue shirts
 * @returns True if a valid class photo arrangement exists, otherwise false
 */
export function classPhoto(redShirts: number[], blueShirts: number[]): boolean {
  // If the groups are not the same size, a valid photo is impossible
  if (redShirts.length !== blueShirts.length) return false;

  // Sort both arrays from tallest to shortest
  redShirts.sort((a, b) => b - a);
  blueShirts.sort((a, b) => b - a);

  // If the tallest students are the same height, no valid back row exists
  if (redShirts[0] === blueShirts[0]) return false;

  // Determine which color must be in the back row
  const backRow = redShirts[0] > blueShirts[0] ? "red" : "blue";

  // Compare each pair of students by height
  for (let i = 0; i < redShirts.length; i++) {
    if (backRow === "red") {
      // Red shirts must be strictly taller than blue shirts
      if (redShirts[i] <= blueShirts[i]) return false;
    } else {
      // Blue shirts must be strictly taller than red shirts
      if (blueShirts[i] <= redShirts[i]) return false;
    }
  }

  // All students satisfy the height requirement
  return true;
}

/**
 * Calculates the total speed of tandem bicycles.
 *
 * Each tandem bicycle is ridden by one red-shirt rider and one blue-shirt rider.
 * The speed of a tandem bicycle is the maximum of the two riders' speeds.
 *
 * @param redShirtSpeeds - Speeds of red-shirt riders
 * @param blueShirtSpeeds - Speeds of blue-shirt riders
 * @param fastest - Whether to maximize or minimize the total speed
 * @returns The total speed of all tandem bicycles
 */
export function tandemBicycle(
  redShirtSpeeds: number[],
  blueShirtSpeeds: number[],
  fastest: boolean,
): number {
  // Sort both arrays in ascending order
  redShirtSpeeds.sort((a, b) => a - b);
  blueShirtSpeeds.sort((a, b) => a - b);

  let totalSpeed = 0;
  const n = redShirtSpeeds.length;

  // Pointer for blue-shirt riders
  let blueIndex = fastest ? n - 1 : 0;

  // Always iterate from slowest red to fastest red
  for (let i = 0; i < n; i++) {
    const redSpeed = redShirtSpeeds[i];
    const blueSpeed = blueShirtSpeeds[blueIndex];

    // Tandem speed is determined by the faster rider
    totalSpeed += Math.max(redSpeed, blueSpeed);

    // Adjust blue pointer based on goal
    if (fastest) {
      blueIndex--; // pair slow red with fast blue
    } else {
      blueIndex++; // pair slow red with slow blue
    }
  }

  return totalSpeed;
}

/**
 * Optimal Freelancing (Job Sequencing with Deadlines)
 *
 * Problem summary:
 * - Each job takes 1 day
 * - You can do at most 1 job per day
 * - Each job has a deadline (latest day it can be done)
 * - Goal: maximize total payment
 *
 * Greedy strategy:
 * 1. Sort jobs by payment (highest first)
 * 2. For each job, schedule it as late as possible before its deadline
 * 3. Keep track of which days are already taken
 *
 * Why this works:
 * - Taking higher-paying jobs first ensures we don't lose valuable slots
 * - Scheduling jobs as late as possible keeps earlier days free for
 *   jobs with tighter deadlines
 *
 * Time Complexity:
 * - Sorting jobs: O(n log n)
 * - Scheduling: O(7n) → effectively O(n) since days are fixed
 *
 * Space Complexity:
 * - O(7) → constant extra space
 */
export function optimalFreelancing(
  jobs: Array<{ deadline: number; payment: number }>,
) {
  const slots = new Array(7).fill(null); // days 1–7 → indices 0–6
  // Sort jobs by highest payment first.  This is the key greedy choice.
  jobs.sort((a, b) => b.payment - a.payment);

  let totalMoney = 0;

  for (const job of jobs) {
    // try latest available day
    let idx = Math.min(job.deadline - 1, 6);

    while (idx >= 0) {
      // If this day is free, schedule the job here
      if (slots[idx] === null) {
        slots[idx] = job.payment;
        totalMoney += job.payment;
        break;
      }
      // Otherwise, try the previous day
      idx--;
    }
    // If no day was available, this job is skipped
  }

  return totalMoney;
}

/**
 * Performs a binary search on a sorted array to find the index of the target element.
 * The function assumes that the input array is sorted in ascending order.
 *
 * @param {number[]} nums - The sorted array of numbers to search through.
 * @param {number} target - The value to search for within the array.
 *
 * @returns {number | null} The index of the target element if found, or `null` if the target is not in the array.
 */
export function binarySearch(nums: number[], target: number): number | null {
  // Initialize the left and right pointers
  let left = 0; // Left boundary of the search range
  let right = nums.length - 1; // Right boundary of the search range

  // Continue searching while there is a valid range to check
  while (left <= right) {
    // Calculate the middle index to avoid overflow issues
    const mid = Math.floor((left + right) / 2);

    // The value at the middle index
    const value = nums[mid];

    // Check if the target is smaller than the middle value
    if (target < value) {
      // If target is smaller, discard the right half of the array
      right = mid - 1;
    }
    // Check if the target is larger than the middle value
    else if (target > value) {
      // If target is larger, discard the left half of the array
      left = mid + 1;
    }
    // The target is equal to the value at the middle
    else {
      // Return the index of the found target
      return mid;
    }
  }

  // Return null if the target was not found
  return null;
}

/**
 * Finds the three largest numbers in an array.
 *
 * The function iterates through the array once and keeps track of the
 * three largest values seen so far using a fixed-size array.
 *
 * The returned array is ordered as:
 * [thirdLargest, secondLargest, largest]
 *
 * @param {number[]} nums - The input array of numbers (length >= 3).
 * @returns {number[]} An array containing the three largest numbers.
 *
 * @example
 * threeLargestNumbers([10, 5, 9, 10, 12]);
 * // → [10, 10, 12]
 *
 * @complexity
 * Time: O(n) — single pass through the array
 * Space: O(1) — constant extra space
 */
export function threeLargestNumbers(nums: number[]): number[] {
  // Stores the three largest numbers found so far:
  // result[0] → third largest
  // result[1] → second largest
  // result[2] → largest
  const result = [-Infinity, -Infinity, -Infinity];

  // Iterate through each number in the input array
  for (const num of nums) {
    // If the current number is larger than the largest value
    if (num > result[2]) {
      // Shift values down and insert the new largest
      result[0] = result[1];
      result[1] = result[2];
      result[2] = num;
    }
    // If the number is between the largest and second largest
    else if (num > result[1]) {
      // Shift the second largest down and insert
      result[0] = result[1];
      result[1] = num;
    }
    // If the number is between the second and third largest
    else if (num > result[0]) {
      result[0] = num;
    }
  }

  // Return the three largest numbers
  return result;
}

function shiftAndUpdate(arr: number[], value: number, idx: number) {
  // Shift elements left starting from index 0 up to idx-1
  for (let i = 0; i < idx; i++) {
    arr[i] = arr[i + 1];
  }

  // Insert the new value at the target index
  arr[idx] = value;
}

/**
 * Encrypts a string using a Caesar cipher.
 *
 * Each lowercase letter (`a`–`z`) is shifted forward in the alphabet
 * by the given shift value, wrapping around from `z` back to `a`.
 *
 * @param {string} str - The input string to encrypt.
 *   Assumes all characters are lowercase letters (`a`–`z`).
 * @param {number} shift - Number of positions to shift each letter.
 *   Can be any integer; values larger than 26 are normalized.
 *
 * @returns {string} The encrypted string.
 *
 * @example
 * caesarCipherEncryptor("abc", 2); // "cde"
 * caesarCipherEncryptor("xyz", 2); // "zab"
 * caesarCipherEncryptor("abc", 52); // "abc"
 */
export function caesarCipherEncryptor(str: string, shift: number): string {
  // Total number of letters in the English alphabet
  const alphabetSize = 26;

  // Normalize the shift so it always stays between 0–25
  // This also correctly handles large and negative shifts
  const normalizedShift =
    ((shift % alphabetSize) + alphabetSize) % alphabetSize;

  // This will store the final encrypted string
  let cipherText = "";

  // Loop through every character in the input string
  for (let i = 0; i < str.length; i++) {
    // Get the ASCII (Unicode) value of the current character
    const charCode = str.charCodeAt(i);

    // ----------------------------------------------------
    // Handle lowercase letters: 'a' (97) to 'z' (122)
    // ----------------------------------------------------
    if (charCode >= 97 && charCode <= 122) {
      // Convert character to a 0–25 range (a = 0, b = 1, ...)
      const normalized = charCode - 97;

      // Apply the shift and wrap around using modulo
      const shifted = (normalized + normalizedShift) % alphabetSize;

      // Convert back to a lowercase letter and append to result
      cipherText += String.fromCharCode(shifted + 97);

      // ----------------------------------------------------
      // Handle uppercase letters: 'A' (65) to 'Z' (90)
      // ----------------------------------------------------
    } else if (charCode >= 65 && charCode <= 90) {
      // Convert character to a 0–25 range (A = 0, B = 1, ...)
      const normalized = charCode - 65;

      // Apply the shift and wrap around using modulo
      const shifted = (normalized + normalizedShift) % alphabetSize;

      // Convert back to an uppercase letter and append to result
      cipherText += String.fromCharCode(shifted + 65);

      // ----------------------------------------------------
      // Handle non-alphabet characters (spaces, numbers, symbols)
      // These are left unchanged
      // ----------------------------------------------------
    } else {
      cipherText += str[i];
    }
  }

  // Return the fully encrypted string
  return cipherText;
}

/**
 * Encodes a string using Run-Length Encoding (RLE).
 *
 * Consecutive repeated characters are represented as a count followed by the character.
 * Counts are capped at 9, so long runs are split into multiple groups.
 *
 * Examples:
 *   runLengthEncoding("AAAAAAAAAAAAABBCCCCDD") => "9A4A2B4C2D"
 *   runLengthEncoding("A")                     => "1A"
 *   runLengthEncoding("AB")                    => "1A1B"
 *
 * @param {string} str - The input string to encode.
 * @returns {string} - The run-length encoded string.
 */
export function runLengthEncoding(str: string): string {
  // Array to store encoded parts (count + character)
  const encoded: string[] = [];

  // Edge case: empty string
  if (str.length === 0) return "";

  // Initialize count and current character
  let count = 1;
  let currentChar = str[0];

  // Iterate over the string starting from the second character
  for (let i = 1; i < str.length; i++) {
    const char = str[i];

    // If the character is the same and count < 9, increment the count
    if (char === currentChar && count < 9) {
      count++;
    } else {
      // Otherwise, push the current run (count + character) to the encoded array
      encoded.push(count.toString(), currentChar);

      // Reset for the next character
      currentChar = char;
      count = 1;
    }
  }

  // Push the final run after the loop ends
  encoded.push(count.toString(), currentChar);

  // Join all parts into a single string and return
  return encoded.join("");
}
