import { describe, expect, test } from "bun:test";
import {
	createPracticeProblemDatabase,
	getPracticePatternStats,
	listDuePracticeProblems,
	recordPracticeAttempt,
	upsertPracticeProblems,
} from "@/node-concepts/bun-runtime/sqlite";

const seedProblems = [
	{
		slug: "two-sum",
		title: "Two Sum",
		pattern: "hash-map",
		difficulty: "easy" as const,
		mastery: 1,
		attempts: 1,
		solved: 1,
		updatedAt: 100,
	},
	{
		slug: "koko-eating-bananas",
		title: "Koko Eating Bananas",
		pattern: "binary-search",
		difficulty: "medium" as const,
		mastery: 0,
		updatedAt: 200,
	},
	{
		slug: "median-data-stream",
		title: "Find Median From Data Stream",
		pattern: "heap",
		difficulty: "hard" as const,
		mastery: 4,
		attempts: 5,
		solved: 4,
		updatedAt: 300,
	},
];

describe("Bun SQLite practice database", () => {
	test("creates an in-memory database and lists due problems", () => {
		const db = createPracticeProblemDatabase(seedProblems);

		try {
			const due = listDuePracticeProblems(db, 2, 5);

			expect(due.map((problem) => problem.slug)).toEqual([
				"koko-eating-bananas",
				"two-sum",
			]);
			expect(due[0]?.difficulty).toBe("medium");
		} finally {
			db.close();
		}
	});

	test("upserts problems in a transaction", () => {
		const db = createPracticeProblemDatabase(seedProblems);

		try {
			const changedRows = upsertPracticeProblems(db, [
				{
					slug: "two-sum",
					title: "Two Sum Updated",
					pattern: "hash-map",
					difficulty: "easy",
					mastery: 3,
					attempts: 2,
					solved: 2,
					updatedAt: 500,
				},
			]);
			const due = listDuePracticeProblems(db, 3, 5);

			expect(changedRows).toBe(1);
			expect(due.find((problem) => problem.slug === "two-sum")?.title).toBe(
				"Two Sum Updated",
			);
			expect(due.find((problem) => problem.slug === "two-sum")?.mastery).toBe(
				3,
			);
		} finally {
			db.close();
		}
	});

	test("records attempts and adjusts mastery", () => {
		const db = createPracticeProblemDatabase(seedProblems);

		try {
			recordPracticeAttempt(db, "koko-eating-bananas", true, 600);
			recordPracticeAttempt(db, "koko-eating-bananas", false, 700);

			const due = listDuePracticeProblems(db, 2, 5);
			const koko = due.find(
				(problem) => problem.slug === "koko-eating-bananas",
			);

			expect(koko?.attempts).toBe(2);
			expect(koko?.solved).toBe(1);
			expect(koko?.mastery).toBe(0);
			expect(koko?.updated_at).toBe(700);
		} finally {
			db.close();
		}
	});

	test("throws for attempts on unknown problems", () => {
		const db = createPracticeProblemDatabase(seedProblems);

		try {
			expect(() => recordPracticeAttempt(db, "missing", true)).toThrow(
				"Unknown practice problem: missing",
			);
		} finally {
			db.close();
		}
	});

	test("summarizes progress by pattern", () => {
		const db = createPracticeProblemDatabase(seedProblems);

		try {
			const stats = getPracticePatternStats(db);

			expect(stats).toEqual([
				{
					pattern: "binary-search",
					total: 1,
					average_mastery: 0,
					solved: 0,
					attempts: 0,
				},
				{
					pattern: "hash-map",
					total: 1,
					average_mastery: 1,
					solved: 0,
					attempts: 1,
				},
				{
					pattern: "heap",
					total: 1,
					average_mastery: 4,
					solved: 1,
					attempts: 5,
				},
			]);
		} finally {
			db.close();
		}
	});
});
