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

/**
 * Finds the sizes of all rivers in a matrix.
 *
 * A river is defined as any number of horizontally or vertically
 * adjacent cells with a value of 1.
 *
 * The function returns an array containing the size of each river.
 * The order of the sizes does not matter.
 *
 * Time Complexity: O(rows × cols)
 * Space Complexity: O(rows × cols) — due to recursion stack
 *
 * @param matrix - A 2D array of 0s and 1s representing land (0) and river (1)
 * @returns An array of integers where each integer is a river size
 */
export function riverSizes(matrix: number[][]): number[] {
  // Store the size of each discovered river
  const riverSizes: number[] = [];

  // Directions for moving up, down, left, and right
  const directions = [
    [1, 0], // down
    [-1, 0], // up
    [0, 1], // right
    [0, -1], // left
  ];

  /**
   * Depth-First Search to explore a river starting from (row, col).
   *
   * This function:
   * 1. Marks the current cell as visited
   * 2. Explores all connected river cells
   * 3. Returns the total size of the river
   */
  function dfs(row: number, col: number): number {
    // Stop if out of bounds or if the cell is not part of a river
    if (
      row < 0 ||
      row >= matrix.length ||
      col < 0 ||
      col >= matrix[0].length ||
      matrix[row][col] === 0
    ) {
      return 0;
    }

    // Mark the current cell as visited by setting it to 0
    matrix[row][col] = 0;

    // Current cell counts as part of the river
    let currentRiverSize = 1;

    // Explore all four directions
    for (const [rowOffset, colOffset] of directions) {
      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      currentRiverSize += dfs(nextRow, nextCol);
    }

    return currentRiverSize;
  }

  // Traverse every cell in the matrix
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      // Start a DFS only if the cell is part of a river
      if (matrix[row][col] === 1) {
        riverSizes.push(dfs(row, col));
      }
    }
  }

  return riverSizes;
}

/**
 * Removes all islands from a matrix.
 *
 * An island is a group of horizontally or vertically adjacent `1`s
 * that is NOT connected to the border of the matrix.
 *
 * Border-connected land is considered "safe" and will remain unchanged.
 * All other land cells (`1`s) are converted to `0`s.
 *
 * The matrix is mutated in-place and also returned for convenience.
 *
 * @param {number[][]} matrix - A 2D grid where:
 *   - 1 represents land
 *   - 0 represents water
 *
 * @returns {number[][]} The modified matrix with islands removed
 *
 * @example
 * removeIslands([
 *   [1, 0, 0],
 *   [0, 1, 0],
 *   [1, 0, 1],
 * ]);
 * // → [
 * //   [1, 0, 0],
 * //   [0, 0, 0],
 * //   [1, 0, 1],
 * // ]
 */
export function removeIslands(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Directions for exploring adjacent cells (up, down, left, right)
  const directions = [
    [1, 0], // down
    [-1, 0], // up
    [0, 1], // right
    [0, -1], // left
  ];

  /**
   * Performs a Depth-First Search (DFS) to mark all land cells
   * connected to a border cell as "safe".
   *
   * Safe cells are temporarily marked with the value `2`.
   *
   * @param {number} row - Current row index
   * @param {number} col - Current column index
   */
  function markSafeLand(row: number, col: number): void {
    // Stop if out of bounds or not land
    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      matrix[row][col] !== 1
    ) {
      return;
    }

    // Mark the cell as safe
    matrix[row][col] = 2;

    // Recursively explore all neighboring cells
    for (const [rowOffset, colOffset] of directions) {
      markSafeLand(row + rowOffset, col + colOffset);
    }
  }

  // Step 1: Mark all land cells connected to the borders as safe
  for (let col = 0; col < cols; col++) {
    if (matrix[0][col] === 1) {
      markSafeLand(0, col);
    }
    if (matrix[rows - 1][col] === 1) {
      markSafeLand(rows - 1, col);
    }
  }

  for (let row = 0; row < rows; row++) {
    if (matrix[row][0] === 1) {
      markSafeLand(row, 0);
    }
    if (matrix[row][cols - 1] === 1) {
      markSafeLand(row, cols - 1);
    }
  }

  // Step 2: Remove islands and restore safe land
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (matrix[row][col] === 1) {
        // Unmarked land → island → remove
        matrix[row][col] = 0;
      } else if (matrix[row][col] === 2) {
        // Restore safe land
        matrix[row][col] = 1;
      }
    }
  }

  return matrix;
}

/**
 * Returns the minimum number of passes required to convert all negative numbers
 * in a matrix to positive numbers.
 *
 * A negative number becomes positive if it has at least one
 * adjacent positive number (up, down, left, or right).
 *
 * If it is impossible to convert all negatives, the function returns -1.
 *
 * Approach:
 * - Uses a multi-source Breadth-First Search (BFS).
 * - All positive numbers are treated as starting points.
 * - Each BFS level represents one "pass" over the matrix.
 *
 * Time Complexity: O(rows × cols)
 * Space Complexity: O(rows × cols)
 *
 * @param matrix - 2D array of integers
 * @returns Minimum number of passes, or -1 if impossible
 */
export function minimumPassMatrix(matrix: number[][]): number {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Queue to store positions of positive numbers
  const queue: Array<[number, number]> = [];

  // Count of remaining negative numbers
  let negativeCount = 0;

  // Step 1: Initialize the queue with all positive values
  // and count how many negatives exist
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] > 0) {
        queue.push([r, c]);
      } else if (matrix[r][c] < 0) {
        negativeCount++;
      }
    }
  }

  // Directions for adjacent cells (up, down, left, right)
  const directions: Array<[number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  let passes = 0;

  // Step 2: Perform BFS, one level at a time
  // Each level corresponds to one pass
  while (queue.length > 0 && negativeCount > 0) {
    const levelSize = queue.length;

    // Process exactly one BFS level
    for (let i = 0; i < levelSize; i++) {
      const [row, col] = queue.shift()!;

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        // Skip out-of-bounds cells
        if (newRow < 0 || newCol < 0 || newRow >= rows || newCol >= cols) {
          continue;
        }

        // Convert adjacent negative numbers
        if (matrix[newRow][newCol] < 0) {
          matrix[newRow][newCol] *= -1;
          negativeCount--;
          queue.push([newRow, newCol]);
        }
      }
    }

    // One full BFS level completed → one pass
    passes++;
  }

  // If negatives remain, conversion is impossible
  return negativeCount === 0 ? passes : -1;
}

/**
 * Groups strings by their adjacent character differences.
 * Two strings belong to the same group if:
 *  - They have the same length.
 *  - The difference between each pair of adjacent characters is the same.
 *
 * @param {string[]} strings - Array of lowercase English strings
 * @returns {string[][]} - Array of groups, each group is an array of strings
 */
export function groupStringsByDifferences(strings: string[]): string[][] {
  // Map to store groups by their difference pattern
  const map: Map<string, string[]> = new Map();

  for (const str of strings) {
    // Compute difference pattern for the string
    const diffs: number[] = [];
    for (let i = 1; i < str.length; i++) {
      diffs.push(str.charCodeAt(i) - str.charCodeAt(i - 1));
    }

    // Join differences to form a key (e.g., [1,1] -> "1,1")
    const key = diffs.join(",");

    // Add the string to the corresponding group in the map
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(str);
  }

  // Convert the map values to an array of groups
  return Array.from(map.values());
}

/**
 * Restores the correct visiting order from consecutive visit pairs.
 *
 * Each tuple [A, B] means A was visited immediately before B.
 * All places form one continuous, non-branching path.
 *
 * Works with both strings and numbers.
 *
 * @typeParam T - Place identifier type (string or number)
 * @param tuples - Array of consecutive visit pairs
 * @returns The places in the correct visiting order
 *
 * @example
 * restoreTravelPath([
 *   ["Paris", "Berlin"],
 *   ["London", "Paris"],
 *   ["Berlin", "Rome"]
 * ])
 * // → ["London", "Paris", "Berlin", "Rome"]
 *
 * @example
 * restoreTravelPath([
 *   [1, 3],
 *   [0, 1],
 *   [3, 7]
 * ])
 * // → [0, 1, 3, 7]
 */
export function restoreTravelPath<T extends string | number>(
  tuples: [T, T][],
): T[] {
  // Map each place to the place visited immediately after it
  const nextPlace = new Map<T, T>();

  // Track incoming and outgoing appearances
  const starts = new Set<T>();
  const ends = new Set<T>();

  // Build the relationship graph
  for (const [from, to] of tuples) {
    nextPlace.set(from, to);
    starts.add(from);
    ends.add(to);
  }

  // Find the starting place (no incoming edge)
  let start: T | undefined;
  for (const place of starts) {
    if (!ends.has(place)) {
      start = place;
      break;
    }
  }

  // Follow the chain to reconstruct the path
  const path: T[] = [];
  while (start !== undefined) {
    path.push(start);
    start = nextPlace.get(start);
  }

  return path;
}

/**
 * Computes the maximum value in a matrix by evaluating expressions
 * formed from numbers and operators, traversing left->right in rows
 * and top->bottom in columns.
 *
 * Consecutive numbers without an operator in between are ignored.
 *
 * @param matrix - 2D array of numbers and operators ("+", "-", "*", "/")
 * @returns maximum evaluated value
 */
/**
 * Computes the maximum value in a matrix by evaluating expressions
 * formed from numbers and operators, traversing left->right in rows
 * and top->bottom in columns.
 *
 * Consecutive numbers without an operator in between are ignored.
 *
 * @param matrix - 2D array of numbers and operators ("+", "-", "*", "/")
 * @returns maximum evaluated value, or -Infinity if no valid expression
 */
export function maxExpressionValue(matrix: (number | string)[][]): number {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0)
    return -Infinity;

  const rows = matrix.length;
  const cols = matrix[0].length;
  let maxValue = -Infinity;

  const evaluateTokens = (tokens: (number | string)[]): number => {
    if (tokens.length < 3) return -Infinity; // invalid expression
    let result = tokens[0] as number;
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i] as string;
      const num = tokens[i + 1] as number;
      if (typeof num !== "number") return -Infinity;
      switch (op) {
        case "+":
          result += num;
          break;
        case "-":
          result -= num;
          break;
        case "*":
          result *= num;
          break;
        case "/":
          result /= num;
          break;
        default:
          return -Infinity;
      }
    }
    return result;
  };

  const processLine = (line: (number | string)[]) => {
    let tokens: (number | string)[] = [];
    for (const val of line) {
      if (typeof val === "number") {
        if (
          tokens.length === 0 ||
          typeof tokens[tokens.length - 1] === "string"
        ) {
          tokens.push(val);
        } else {
          // consecutive numbers without operator
          maxValue = Math.max(maxValue, evaluateTokens(tokens));
          tokens = [val];
        }
      } else {
        // operator
        if (tokens.length === 0) continue; // skip operator at start
        tokens.push(val);
      }
    }
    maxValue = Math.max(maxValue, evaluateTokens(tokens));
  };

  // process rows
  for (let r = 0; r < rows; r++) processLine(matrix[r]);

  // process columns
  for (let c = 0; c < cols; c++) {
    const column: (number | string)[] = [];
    for (let r = 0; r < rows; r++) column.push(matrix[r][c]);
    processLine(column);
  }

  return maxValue;
}

/**
 * Calculates the number of minutes until the next departure after the current time.
 *
 * @param departures - An array of departure times in "HH:MM" format.
 * @param currentTime - The current time in "HH:MM" format.
 * @returns The number of minutes until the next departure.
 *          Returns -1 if there is no departure later in the day.
 *
 * @example
 * nextDeparture(["08:30","09:45","14:00"], "09:00") → 45
 */
export function nextDeparture(
  departures: string[],
  currentTime: string,
): number {
  /**
   * Converts a "HH:MM" formatted string into total minutes since midnight.
   * Example: "14:10" → 14*60 + 10 = 850
   */
  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Convert the current time to minutes for easy comparison
  const current = toMinutes(currentTime);

  // Convert all departure times to minutes and sort them ascendingly
  const departuresInMinutes = departures.map(toMinutes).sort((a, b) => a - b);

  // Iterate through sorted departure times
  // The first departure later than current time is the next one
  for (const dep of departuresInMinutes) {
    if (dep > current) {
      return dep - current; // Difference in minutes
    }
  }

  // No departure later than current time
  return -1;
}
