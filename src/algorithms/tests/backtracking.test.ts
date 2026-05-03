import { describe, expect, test } from "bun:test";
import {
	generateParentheses,
	letterCombinations,
	wordSearch,
} from "@/algorithms/backtracking/backtracking";

describe("letterCombinations", () => {
	test("generates phone keypad combinations", () => {
		expect(letterCombinations("23").sort()).toEqual([
			"ad",
			"ae",
			"af",
			"bd",
			"be",
			"bf",
			"cd",
			"ce",
			"cf",
		]);
	});

	test("handles empty input", () => {
		expect(letterCombinations("")).toEqual([]);
	});
});

describe("generateParentheses", () => {
	test("generates all valid parenthesis strings", () => {
		expect(generateParentheses(3).sort()).toEqual([
			"((()))",
			"(()())",
			"(())()",
			"()(())",
			"()()()",
		]);
	});

	test("handles zero pairs", () => {
		expect(generateParentheses(0)).toEqual([""]);
	});
});

describe("wordSearch", () => {
	const board = [
		["A", "B", "C", "E"],
		["S", "F", "C", "S"],
		["A", "D", "E", "E"],
	];

	test("finds words by walking adjacent cells", () => {
		expect(wordSearch(board.map((row) => [...row]), "ABCCED")).toBe(true);
		expect(wordSearch(board.map((row) => [...row]), "SEE")).toBe(true);
	});

	test("does not reuse cells in the same path", () => {
		expect(wordSearch(board.map((row) => [...row]), "ABCB")).toBe(false);
	});
});
