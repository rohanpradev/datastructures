/**
 * Calculates the "product sum" of a potentially nested array of numbers.
 *
 * The product sum is defined as:
 * - The sum of all numbers in the array
 * - Where each nested array is summed and multiplied by its depth
 *
 * Depth rules:
 * - Top-level array has a multiplier of 1
 * - Each level of nesting increases the multiplier by 1
 *
 * Example:
 * productSum([1, [2, 3], [4, [5]]])
 * = 1
 * + (2 + 3) * 2
 * + (4 + (5 * 3)) * 2
 * = 1 + 10 + 26
 * = 37
 *
 * @param nums - An array containing numbers or nested arrays of numbers
 * @param multiplier - The depth-based multiplier (defaults to 1 for top-level)
 * @returns The calculated product sum
 */
export function productSum(
  nums: (number | number[])[],
  multiplier: number = 1,
): number {
  let sum = 0;

  // Iterate through each value in the current array level
  for (const value of nums) {
    if (Array.isArray(value)) {
      // Recursively compute the product sum of nested arrays,
      // increasing the multiplier to reflect deeper nesting
      sum += productSum(value, multiplier + 1);
    } else {
      // Add plain numbers directly to the current level's sum
      sum += value;
    }
  }

  // Apply the multiplier for this depth level once
  return sum * multiplier;
}
