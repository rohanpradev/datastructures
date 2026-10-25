import { describe, expect, test } from "bun:test";
import { summarizePracticeScores } from "@/node-concepts/bun-runtime/sqlite-functions";

describe("summarizePracticeScores", () => {
	test("combines a mastery UDF with a population-variance aggregate", () => {
		expect(summarizePracticeScores([20, 80, 80, 100])).toEqual({
			attempts: 4,
			mastered: 3,
			average: 70,
			variance: 900,
		});
	});

	test("returns explicit empty-batch results", () => {
		expect(summarizePracticeScores([])).toEqual({
			attempts: 0,
			mastered: 0,
			average: null,
			variance: null,
		});
	});

	test("includes the mastery boundary and keeps separate calls independent", () => {
		expect(summarizePracticeScores([79.999, 80]).mastered).toBe(1);
		expect(summarizePracticeScores([100])).toEqual({
			attempts: 1,
			mastered: 1,
			average: 100,
			variance: 0,
		});
		expect(summarizePracticeScores([0]).mastered).toBe(0);
	});

	test("preserves fractional population variance", () => {
		expect(summarizePracticeScores([50, 51, 52]).variance).toBeCloseTo(2 / 3);
	});

	test("rejects invalid scores and bounds synchronous work", () => {
		for (const score of [-1, 101, Number.NaN, Number.POSITIVE_INFINITY]) {
			expect(() => summarizePracticeScores([score])).toThrow(
				"finite percentages",
			);
		}
		expect(() => summarizePracticeScores(Array(10_001).fill(50))).toThrow(
			"10,000 scores",
		);
	});
});
