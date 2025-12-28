/**
 * Sorting Algorithms
 *
 * Collection of fundamental sorting algorithms with detailed explanations.
 * Each algorithm demonstrates different approaches and trade-offs.
 */

/**
 * Bubble Sort
 *
 * Algorithm:
 * 1. Compare adjacent elements
 * 2. Swap if they're in wrong order
 * 3. Repeat until no swaps needed
 * 4. Largest elements "bubble" to the end
 *
 * Best for: Small datasets, nearly sorted data
 *
 * Time Complexity:
 * - Best: O(n) when already sorted
 * - Average: O(n²)
 * - Worst: O(n²)
 *
 * Space Complexity: O(1) - in-place
 *
 * Stable: Yes (maintains relative order of equal elements)
 *
 * @example
 * bubbleSort([64, 34, 25, 12, 22, 11, 90])
 * // [11, 12, 22, 25, 34, 64, 90]
 */
export function bubbleSort(arr: number[]): number[] {
	const n = arr.length;

	for (let i = 0; i < n - 1; i++) {
		let swapped = false;

		// Last i elements are already in place
		for (let j = 0; j < n - i - 1; j++) {
			if (arr[j]! > arr[j + 1]!) {
				// Swap adjacent elements
				[arr[j], arr[j + 1]] = [arr[j + 1]!, arr[j]!];
				swapped = true;
			}
		}

		// If no swaps, array is sorted
		if (!swapped) break;
	}

	return arr;
}

/**
 * Selection Sort
 *
 * Algorithm:
 * 1. Find minimum element in unsorted portion
 * 2. Swap it with first unsorted element
 * 3. Move boundary of sorted portion
 * 4. Repeat until entire array is sorted
 *
 * Best for: Small datasets, minimizing swaps
 *
 * Time Complexity:
 * - Best: O(n²)
 * - Average: O(n²)
 * - Worst: O(n²)
 *
 * Space Complexity: O(1) - in-place
 *
 * Stable: No (can change relative order)
 *
 * @example
 * selectionSort([64, 25, 12, 22, 11])
 * // [11, 12, 22, 25, 64]
 */
export function selectionSort(arr: number[]): number[] {
	const n = arr.length;

	for (let i = 0; i < n - 1; i++) {
		// Find minimum in unsorted portion
		let minIndex = i;
		for (let j = i + 1; j < n; j++) {
			if (arr[j] < arr[minIndex]) {
				minIndex = j;
			}
		}

		// Swap minimum with first unsorted element
		if (minIndex !== i) {
			[arr[i], arr[minIndex]] = [arr[minIndex]!, arr[i]!];
		}
	}

	return arr;
}

/**
 * Insertion Sort
 *
 * Algorithm:
 * 1. Start with second element
 * 2. Compare with elements before it
 * 3. Shift larger elements to the right
 * 4. Insert element in correct position
 * 5. Repeat for all elements
 *
 * Best for: Small datasets, nearly sorted data, online sorting
 *
 * Time Complexity:
 * - Best: O(n) when already sorted
 * - Average: O(n²)
 * - Worst: O(n²) when reverse sorted
 *
 * Space Complexity: O(1) - in-place
 *
 * Stable: Yes
 *
 * Advantages:
 * - Efficient for small datasets
 * - Adaptive (O(n) for nearly sorted)
 * - Online (can sort as it receives data)
 * - Simple implementation
 *
 * @example
 * insertionSort([12, 11, 13, 5, 6])
 * // [5, 6, 11, 12, 13]
 */
export function insertionSort(arr: number[]): number[] {
	const n = arr.length;

	for (let i = 1; i < n; i++) {
		const key = arr[i]!;
		let j = i - 1;

		// Shift elements greater than key to the right
		while (j >= 0 && arr[j]! > key) {
			arr[j + 1] = arr[j]!;
			j--;
		}

		// Insert key in correct position
		arr[j + 1] = key;
	}

	return arr;
}

/**
 * Merge - Helper function for Merge Sort
 *
 * Merges two sorted arrays into one sorted array
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(n + m)
 *
 * @param arr1 - First sorted array
 * @param arr2 - Second sorted array
 * @returns Merged sorted array
 *
 * @example
 * merge([1, 3, 5], [2, 4, 6])
 * // [1, 2, 3, 4, 5, 6]
 */
export function merge(arr1: number[], arr2: number[]): number[] {
	const result: number[] = [];
	let i = 0;
	let j = 0;

	// Merge while both arrays have elements
	while (i < arr1.length && j < arr2.length) {
		if (arr1[i]! < arr2[j]!) {
			result.push(arr1[i]!);
			i++;
		} else {
			result.push(arr2[j]!);
			j++;
		}
	}

	// Add remaining elements from arr1
	while (i < arr1.length) {
		result.push(arr1[i]!);
		i++;
	}

	// Add remaining elements from arr2
	while (j < arr2.length) {
		result.push(arr2[j]!);
		j++;
	}

	return result;
}

/**
 * Merge Sort
 *
 * Algorithm (Divide and Conquer):
 * 1. Divide array into two halves
 * 2. Recursively sort each half
 * 3. Merge the two sorted halves
 *
 * Best for: Large datasets, guaranteed O(n log n), stable sorting
 *
 * Time Complexity:
 * - Best: O(n log n)
 * - Average: O(n log n)
 * - Worst: O(n log n)
 *
 * Space Complexity: O(n) - not in-place
 *
 * Stable: Yes
 *
 * Advantages:
 * - Guaranteed O(n log n) performance
 * - Stable sort
 * - Good for linked lists
 * - Predictable performance
 *
 * Disadvantages:
 * - Requires O(n) extra space
 * - Slower than quicksort in practice
 *
 * @example
 * mergeSort([38, 27, 43, 3, 9, 82, 10])
 * // [3, 9, 10, 27, 38, 43, 82]
 */
export function mergeSort(arr: number[]): number[] {
	// Base case: array with 0 or 1 element is already sorted
	if (arr.length <= 1) return arr;

	// Divide: split array in half
	const mid = Math.floor(arr.length / 2);
	const left = arr.slice(0, mid);
	const right = arr.slice(mid);

	// Conquer: recursively sort both halves
	const sortedLeft = mergeSort(left);
	const sortedRight = mergeSort(right);

	// Combine: merge sorted halves
	return merge(sortedLeft, sortedRight);
}

/**
 * Quick Sort (Bonus)
 *
 * Algorithm (Divide and Conquer):
 * 1. Choose pivot element
 * 2. Partition array around pivot
 * 3. Recursively sort partitions
 *
 * Time Complexity:
 * - Best: O(n log n)
 * - Average: O(n log n)
 * - Worst: O(n²) with bad pivot
 *
 * Space Complexity: O(log n) - recursion stack
 *
 * @example
 * quickSort([10, 7, 8, 9, 1, 5])
 * // [1, 5, 7, 8, 9, 10]
 */
export function quickSort(arr: number[]): number[] {
	if (arr.length <= 1) return arr;

	const pivot = arr[Math.floor(arr.length / 2)]!;
	const left = arr.filter((x) => x < pivot);
	const middle = arr.filter((x) => x === pivot);
	const right = arr.filter((x) => x > pivot);

	return [...quickSort(left), ...middle, ...quickSort(right)];
}

/**
 * Partition/Pivot Helper for In-Place Quick Sort
 *
 * Partitions array around pivot element using Lomuto partition scheme:
 * 1. Choose pivot (element at pivotIndex)
 * 2. Move pivot to end
 * 3. Iterate through array, moving smaller elements to left
 * 4. Place pivot in its final sorted position
 *
 * After partitioning:
 * - All elements < pivot are to the left
 * - All elements > pivot are to the right
 * - Returns final pivot index
 *
 * Time Complexity: O(n) where n = endIndex - pivotIndex + 1
 * Space Complexity: O(1) - in-place
 *
 * @param arr - Array to partition
 * @param pivotIndex - Starting index of partition
 * @param endIndex - Ending index of partition
 * @returns Final index of pivot element
 *
 * @example
 * const arr = [4, 6, 1, 7, 3, 2, 5];
 * pivot(arr, 0, 6); // Returns 3
 * // arr is now [2, 1, 3, 4, 7, 6, 5]
 * //              ^     ^  ^
 * //           <pivot  pivot >pivot
 */
export function pivot(
	arr: number[],
	pivotIndex: number = 0,
	endIndex: number = arr.length - 1,
): number {
	// Store pivot value
	const pivotValue = arr[pivotIndex]!;

	// Move pivot to the end
	[arr[pivotIndex], arr[endIndex]] = [arr[endIndex]!, arr[pivotIndex]!];

	// Track where to place next smaller element
	let swapIndex = pivotIndex;

	// Iterate through partition (excluding pivot at end)
	for (let i = pivotIndex; i < endIndex; i++) {
		if (arr[i]! < pivotValue) {
			// Swap smaller element to left section
			[arr[swapIndex], arr[i]] = [arr[i]!, arr[swapIndex]!];
			swapIndex++;
		}
	}

	// Place pivot in its final position
	[arr[swapIndex], arr[endIndex]] = [arr[endIndex]!, arr[swapIndex]!];

	return swapIndex;
}

/**
 * In-Place Quick Sort with Pivot Helper
 *
 * Recursive implementation using Lomuto partition scheme.
 * Unlike the basic quickSort, this modifies the array in-place
 * and uses a pivot helper for partitioning.
 *
 * Algorithm:
 * 1. Base case: left >= right
 * 2. Partition array around pivot
 * 3. Recursively sort left partition
 * 4. Recursively sort right partition
 *
 * Time Complexity:
 * - Best: O(n log n) - balanced partitions
 * - Average: O(n log n)
 * - Worst: O(n²) - already sorted array with poor pivot choice
 *
 * Space Complexity: O(log n) - recursion stack (best/average)
 *                   O(n) - worst case stack depth
 *
 * @param arr - Array to sort (modified in-place)
 * @param left - Starting index (default 0)
 * @param right - Ending index (default arr.length - 1)
 * @returns The sorted array (same reference as input)
 *
 * @example
 * const arr = [4, 6, 1, 7, 3, 2, 5];
 * quickSortInPlace(arr);
 * // arr is now [1, 2, 3, 4, 5, 6, 7]
 */
export function quickSortInPlace(
	arr: number[],
	left: number = 0,
	right: number = arr.length - 1,
): number[] {
	// Base case: partition size 0 or 1
	if (left >= right) return arr;

	// Partition array and get pivot's final position
	const pivotIndex = pivot(arr, left, right);

	// Recursively sort left partition (elements < pivot)
	quickSortInPlace(arr, left, pivotIndex - 1);

	// Recursively sort right partition (elements > pivot)
	quickSortInPlace(arr, pivotIndex + 1, right);

	return arr;
}
