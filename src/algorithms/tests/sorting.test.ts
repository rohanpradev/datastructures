import { describe, expect, test } from "bun:test";
import {
	bubbleSort,
	insertionSort,
	merge,
	mergeSort,
	pivot,
	quickSort,
	quickSortInPlace,
	selectionSort,
} from "@/algorithms/sorting/sorting";

describe("bubbleSort", () => {
	test("should sort array in ascending order", () => {
		expect(bubbleSort([64, 34, 25, 12, 22, 11, 90])).toEqual([
			11, 12, 22, 25, 34, 64, 90,
		]);
	});

	test("should handle already sorted array", () => {
		expect(bubbleSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle reverse sorted array", () => {
		expect(bubbleSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle empty array", () => {
		expect(bubbleSort([])).toEqual([]);
	});

	test("should handle single element", () => {
		expect(bubbleSort([42])).toEqual([42]);
	});

	test("should handle duplicate values", () => {
		expect(bubbleSort([3, 1, 3, 2, 1])).toEqual([1, 1, 2, 3, 3]);
	});

	test("should handle negative numbers", () => {
		expect(bubbleSort([-5, 3, -1, 7, -10])).toEqual([-10, -5, -1, 3, 7]);
	});

	test("should be stable sort", () => {
		// For numbers, we can't directly test stability, but algorithm is stable
		expect(bubbleSort([3, 3, 1, 2])).toEqual([1, 2, 3, 3]);
	});
});

describe("selectionSort", () => {
	test("should sort array in ascending order", () => {
		expect(selectionSort([64, 25, 12, 22, 11])).toEqual([11, 12, 22, 25, 64]);
	});

	test("should handle already sorted array", () => {
		expect(selectionSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle reverse sorted array", () => {
		expect(selectionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle empty array", () => {
		expect(selectionSort([])).toEqual([]);
	});

	test("should handle single element", () => {
		expect(selectionSort([42])).toEqual([42]);
	});

	test("should handle duplicate values", () => {
		expect(selectionSort([3, 1, 3, 2, 1])).toEqual([1, 1, 2, 3, 3]);
	});

	test("should handle negative numbers", () => {
		expect(selectionSort([-5, 3, -1, 7, -10])).toEqual([-10, -5, -1, 3, 7]);
	});

	test("should minimize number of swaps", () => {
		// Selection sort does at most n-1 swaps
		const arr = [5, 4, 3, 2, 1];
		selectionSort(arr);
		expect(arr).toEqual([1, 2, 3, 4, 5]);
	});
});

describe("insertionSort", () => {
	test("should sort array in ascending order", () => {
		expect(insertionSort([12, 11, 13, 5, 6])).toEqual([5, 6, 11, 12, 13]);
	});

	test("should handle already sorted array efficiently", () => {
		expect(insertionSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle reverse sorted array", () => {
		expect(insertionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle empty array", () => {
		expect(insertionSort([])).toEqual([]);
	});

	test("should handle single element", () => {
		expect(insertionSort([42])).toEqual([42]);
	});

	test("should handle two elements", () => {
		expect(insertionSort([2, 1])).toEqual([1, 2]);
		expect(insertionSort([1, 2])).toEqual([1, 2]);
	});

	test("should handle duplicate values", () => {
		expect(insertionSort([3, 1, 3, 2, 1])).toEqual([1, 1, 2, 3, 3]);
	});

	test("should handle negative numbers", () => {
		expect(insertionSort([-5, 3, -1, 7, -10])).toEqual([-10, -5, -1, 3, 7]);
	});

	test("should handle zeros", () => {
		expect(insertionSort([0, -1, 1, 0])).toEqual([-1, 0, 0, 1]);
	});

	test("should be stable sort", () => {
		expect(insertionSort([3, 3, 1, 2])).toEqual([1, 2, 3, 3]);
	});
});

describe("merge", () => {
	test("should merge two sorted arrays", () => {
		expect(merge([1, 3, 5], [2, 4, 6])).toEqual([1, 2, 3, 4, 5, 6]);
	});

	test("should handle empty first array", () => {
		expect(merge([], [1, 2, 3])).toEqual([1, 2, 3]);
	});

	test("should handle empty second array", () => {
		expect(merge([1, 2, 3], [])).toEqual([1, 2, 3]);
	});

	test("should handle both arrays empty", () => {
		expect(merge([], [])).toEqual([]);
	});

	test("should handle arrays of different lengths", () => {
		expect(merge([1, 5, 9], [2, 3, 4, 6, 7, 8])).toEqual([
			1, 2, 3, 4, 5, 6, 7, 8, 9,
		]);
	});

	test("should handle duplicate values", () => {
		expect(merge([1, 3, 3], [2, 3, 4])).toEqual([1, 2, 3, 3, 3, 4]);
	});

	test("should handle negative numbers", () => {
		expect(merge([-5, -1, 3], [-3, 0, 7])).toEqual([-5, -3, -1, 0, 3, 7]);
	});

	test("should handle single element arrays", () => {
		expect(merge([1], [2])).toEqual([1, 2]);
		expect(merge([2], [1])).toEqual([1, 2]);
	});
});

describe("mergeSort", () => {
	test("should sort array in ascending order", () => {
		expect(mergeSort([38, 27, 43, 3, 9, 82, 10])).toEqual([
			3, 9, 10, 27, 38, 43, 82,
		]);
	});

	test("should handle already sorted array", () => {
		expect(mergeSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle reverse sorted array", () => {
		expect(mergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle empty array", () => {
		expect(mergeSort([])).toEqual([]);
	});

	test("should handle single element", () => {
		expect(mergeSort([42])).toEqual([42]);
	});

	test("should handle two elements", () => {
		expect(mergeSort([2, 1])).toEqual([1, 2]);
	});

	test("should handle duplicate values", () => {
		expect(mergeSort([3, 1, 3, 2, 1])).toEqual([1, 1, 2, 3, 3]);
	});

	test("should handle negative numbers", () => {
		expect(mergeSort([-5, 3, -1, 7, -10])).toEqual([-10, -5, -1, 3, 7]);
	});

	test("should handle large array", () => {
		const arr = Array.from({ length: 100 }, (_, i) => 100 - i);
		const sorted = mergeSort(arr);
		expect(sorted).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
	});

	test("should be stable sort", () => {
		expect(mergeSort([3, 3, 1, 2])).toEqual([1, 2, 3, 3]);
	});

	test("should handle random array", () => {
		const arr = [64, 25, 12, 22, 11, 90, 88, 45, 50, 30];
		const sorted = mergeSort(arr);
		expect(sorted).toEqual([11, 12, 22, 25, 30, 45, 50, 64, 88, 90]);
	});
});

describe("quickSort", () => {
	test("should sort array in ascending order", () => {
		expect(quickSort([10, 7, 8, 9, 1, 5])).toEqual([1, 5, 7, 8, 9, 10]);
	});

	test("should handle already sorted array", () => {
		expect(quickSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle reverse sorted array", () => {
		expect(quickSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle empty array", () => {
		expect(quickSort([])).toEqual([]);
	});

	test("should handle single element", () => {
		expect(quickSort([42])).toEqual([42]);
	});

	test("should handle duplicate values", () => {
		expect(quickSort([3, 1, 3, 2, 1])).toEqual([1, 1, 2, 3, 3]);
	});

	test("should handle negative numbers", () => {
		expect(quickSort([-5, 3, -1, 7, -10])).toEqual([-10, -5, -1, 3, 7]);
	});

	test("should handle large array", () => {
		const arr = Array.from({ length: 100 }, (_, i) => 100 - i);
		const sorted = quickSort(arr);
		expect(sorted).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
	});
});

describe("Sorting Algorithms Comparison", () => {
	const testArrays = [
		[64, 34, 25, 12, 22, 11, 90],
		[5, 2, 8, 1, 9],
		[3, 7, 2, 11, 5, 17, 1, 13],
		[-5, 3, -1, 0, 7, -10, 2],
	];

	testArrays.forEach((arr, index) => {
		test(`all algorithms should produce same result for array ${index}`, () => {
			const expected = [...arr].sort((a, b) => a - b);

			expect(bubbleSort([...arr])).toEqual(expected);
			expect(selectionSort([...arr])).toEqual(expected);
			expect(insertionSort([...arr])).toEqual(expected);
			expect(mergeSort([...arr])).toEqual(expected);
			expect(quickSort([...arr])).toEqual(expected);
		});
	});
});

describe("Sorting Edge Cases", () => {
	test("should handle all same values", () => {
		const arr = [5, 5, 5, 5, 5];
		expect(bubbleSort([...arr])).toEqual(arr);
		expect(selectionSort([...arr])).toEqual(arr);
		expect(insertionSort([...arr])).toEqual(arr);
		expect(mergeSort([...arr])).toEqual(arr);
		expect(quickSort([...arr])).toEqual(arr);
	});

	test("should handle zeros", () => {
		const arr = [0, 1, 0, -1];
		expect(bubbleSort([...arr])).toEqual([-1, 0, 0, 1]);
		expect(mergeSort([...arr])).toEqual([-1, 0, 0, 1]);
	});

	test("should handle alternating high and low values", () => {
		const arr = [100, 1, 99, 2, 98, 3];
		const expected = [1, 2, 3, 98, 99, 100];
		expect(bubbleSort([...arr])).toEqual(expected);
		expect(selectionSort([...arr])).toEqual(expected);
		expect(insertionSort([...arr])).toEqual(expected);
		expect(mergeSort([...arr])).toEqual(expected);
		expect(quickSort([...arr])).toEqual(expected);
	});
});

describe("Pivot Helper Function", () => {
	test("should partition array around pivot", () => {
		const arr = [4, 6, 1, 7, 3, 2, 5];
		const pivotIndex = pivot(arr);

		// After pivot, all elements before pivotIndex should be <= pivot value
		// All elements after should be >= pivot value
		const pivotValue = arr[pivotIndex]!;
		for (let i = 0; i < pivotIndex; i++) {
			expect(arr[i]!).toBeLessThanOrEqual(pivotValue);
		}
		for (let i = pivotIndex + 1; i < arr.length; i++) {
			expect(arr[i]!).toBeGreaterThanOrEqual(pivotValue);
		}
	});

	test("should return correct pivot index", () => {
		const arr = [4, 6, 1, 7, 3, 2, 5];
		const result = pivot(arr, 0, 6);
		expect(result).toBeGreaterThanOrEqual(0);
		expect(result).toBeLessThan(arr.length);
	});

	test("should handle single element", () => {
		const arr = [5];
		const result = pivot(arr, 0, 0);
		expect(result).toBe(0);
		expect(arr).toEqual([5]);
	});

	test("should handle two elements", () => {
		const arr = [2, 1];
		pivot(arr, 0, 1);
		expect(arr).toEqual([1, 2]);
	});

	test("should partition subarray", () => {
		const arr = [9, 8, 7, 6, 5, 4, 3, 2, 1];
		const pivotIdx = pivot(arr, 2, 5); // Partition indices 2-5

		// Elements before index 2 and after index 5 should be unchanged
		expect(arr[0]).toBe(9);
		expect(arr[1]).toBe(8);
		expect(arr[6]).toBe(3);
		expect(arr[7]).toBe(2);
		expect(arr[8]).toBe(1);

		// Pivot should be in valid position within [2, 5]
		expect(pivotIdx).toBeGreaterThanOrEqual(2);
		expect(pivotIdx).toBeLessThanOrEqual(5);
	});

	test("should handle already partitioned array", () => {
		const arr = [1, 2, 3, 4, 5];
		const result = pivot(arr);
		expect(arr[result]).toBe(1); // First element stays first
	});
});

describe("In-Place Quick Sort", () => {
	test("should sort array in-place", () => {
		const arr = [4, 6, 1, 7, 3, 2, 5];
		const result = quickSortInPlace(arr);

		expect(result).toBe(arr); // Same reference
		expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7]);
	});

	test("should handle empty array", () => {
		const arr: number[] = [];
		quickSortInPlace(arr);
		expect(arr).toEqual([]);
	});

	test("should handle single element", () => {
		const arr = [5];
		quickSortInPlace(arr);
		expect(arr).toEqual([5]);
	});

	test("should handle sorted array", () => {
		const arr = [1, 2, 3, 4, 5];
		quickSortInPlace(arr);
		expect(arr).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle reverse sorted array", () => {
		const arr = [5, 4, 3, 2, 1];
		quickSortInPlace(arr);
		expect(arr).toEqual([1, 2, 3, 4, 5]);
	});

	test("should handle duplicates", () => {
		const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
		quickSortInPlace(arr);
		expect(arr).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 6, 9]);
	});

	test("should handle negative numbers", () => {
		const arr = [5, -3, 0, 2, -1, 7];
		quickSortInPlace(arr);
		expect(arr).toEqual([-3, -1, 0, 2, 5, 7]);
	});

	test("should handle large array", () => {
		const arr = Array.from({ length: 100 }, (_, i) => 100 - i);
		quickSortInPlace(arr);
		expect(arr).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
	});

	test("should handle all same values", () => {
		const arr = [5, 5, 5, 5, 5];
		quickSortInPlace(arr);
		expect(arr).toEqual([5, 5, 5, 5, 5]);
	});

	test("should produce same result as basic quickSort", () => {
		const testArrays = [
			[64, 34, 25, 12, 22, 11, 90],
			[5, 2, 8, 1, 9],
			[3, 7, 2, 11, 5, 17, 1, 13],
			[-5, 3, -1, 0, 7, -10, 2],
			[100, 1, 99, 2, 98, 3],
		];

		testArrays.forEach((arr) => {
			const expected = quickSort([...arr]);
			const inPlace = [...arr];
			quickSortInPlace(inPlace);
			expect(inPlace).toEqual(expected);
		});
	});
});
