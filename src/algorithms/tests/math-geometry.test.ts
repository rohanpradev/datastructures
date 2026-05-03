import { describe, expect, test } from "bun:test";
import {
	isHappyNumber,
	rotateImage,
	setMatrixZeroes,
} from "@/algorithms/math-geometry/math-geometry";

describe("rotateImage", () => {
	test("rotates a 3x3 matrix clockwise in-place", () => {
		const matrix = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
		];

		expect(rotateImage(matrix)).toEqual([
			[7, 4, 1],
			[8, 5, 2],
			[9, 6, 3],
		]);
	});

	test("handles a 1x1 matrix", () => {
		expect(rotateImage([[1]])).toEqual([[1]]);
	});
});

describe("setMatrixZeroes", () => {
	test("sets rows and columns to zero", () => {
		const matrix = [
			[1, 1, 1],
			[1, 0, 1],
			[1, 1, 1],
		];

		expect(setMatrixZeroes(matrix)).toEqual([
			[1, 0, 1],
			[0, 0, 0],
			[1, 0, 1],
		]);
	});

	test("handles first row and first column markers", () => {
		const matrix = [
			[0, 1, 2, 0],
			[3, 4, 5, 2],
			[1, 3, 1, 5],
		];

		expect(setMatrixZeroes(matrix)).toEqual([
			[0, 0, 0, 0],
			[0, 4, 5, 0],
			[0, 3, 1, 0],
		]);
	});

	test("handles empty matrices", () => {
		expect(setMatrixZeroes([])).toEqual([]);
		expect(setMatrixZeroes([[]])).toEqual([[]]);
	});
});

describe("isHappyNumber", () => {
	test("detects happy and unhappy numbers", () => {
		expect(isHappyNumber(1)).toBe(true);
		expect(isHappyNumber(19)).toBe(true);
		expect(isHappyNumber(2)).toBe(false);
	});
});
