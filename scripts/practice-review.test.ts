import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { discoverPracticeTargets } from "./generate-practice";
import {
	isReviewGrade,
	planReviews,
	readReviewHistory,
	recordReview,
	reviewKey,
	scheduleReview,
	type ReviewGrade,
	type ReviewHistory,
	type ReviewRecord,
} from "./practice-review";

const PRACTICE_ROOT = resolve(process.cwd(), "practice");
const TEST_ROOT = join(PRACTICE_ROOT, `__review-test-${randomUUID()}`);
const NOW = new Date("2026-10-19T10:30:00.000Z");
const DAY = 86_400_000;
const KEY = "a".repeat(64);
const OTHER_KEY = "b".repeat(64);

beforeAll(async () => {
	await mkdir(TEST_ROOT, { recursive: true });
});

afterAll(async () => {
	// Only this test run's resolved directory can be removed recursively.
	if (
		dirname(resolve(TEST_ROOT)) !== PRACTICE_ROOT ||
		!basename(TEST_ROOT).startsWith("__review-test-")
	) {
		throw new Error("Refusing to clean an unexpected review test directory");
	}
	await rm(TEST_ROOT, { recursive: true, force: true });
});

function target(name: string) {
	return {
		name,
		testRelativePath: "algorithms/tests/example.test.ts",
		targetSymbols: [{ importPath: "algorithms/example", importedName: name }],
		testBlocks: [
			{
				text: `describe("${name}", () => { test("edge", () => ${name}()); });`,
			},
		],
	};
}

function record(dueAt: string): ReviewRecord {
	return {
		grade: "good",
		reviews: 1,
		streak: 1,
		lastReviewedAt: "2026-10-01T10:30:00.000Z",
		dueAt,
	};
}

async function expectNoWriteArtifacts(path: string) {
	const names = await readdir(dirname(path));
	expect(names.filter((name) => name.startsWith(`${basename(path)}.`))).toEqual(
		[],
	);
}

describe("practice review identity", () => {
	test("gives every current focused catalog target a distinct identity", () => {
		const targets = discoverPracticeTargets();
		expect(targets.length).toBeGreaterThan(200);
		expect(new Set(targets.map(reviewKey)).size).toBe(targets.length);
	});

	test("survives Windows separators, CRLF, catalog renumbering, and import ordering", () => {
		const original = {
			...target("solve"),
			id: 1,
			targetSymbols: [
				{ importPath: "algorithms/example", importedName: "solve" },
				{ importPath: "algorithms/helper", importedName: "Helper" },
			],
			testBlocks: [{ text: 'describe("solve", () => {\n  solve();\n});\n' }],
		};
		const moved = {
			...original,
			id: 99,
			testRelativePath: "algorithms\\tests\\example.test.ts",
			targetSymbols: original.targetSymbols.toReversed().map((symbol) => ({
				...symbol,
				importPath: symbol.importPath.replaceAll("/", "\\"),
			})),
			testBlocks: [
				{
					text: `\r\n${original.testBlocks[0]!.text.replaceAll("\n", "\r\n")}  `,
				},
			],
		};
		expect(reviewKey(original)).toMatch(/^[a-f0-9]{64}$/);
		expect(reviewKey(moved)).toBe(reviewKey(original));
	});

	test("keeps distinct cases, exports, source modules, and test files separate", () => {
		const original = target("solve");
		const variants = [
			original,
			{
				...original,
				testBlocks: [{ text: 'test("new edge", () => solve(0));' }],
			},
			{ ...original, testRelativePath: "algorithms/tests/other.test.ts" },
			{
				...original,
				targetSymbols: [
					{ importPath: "algorithms/example", importedName: "other" },
				],
			},
			{
				...original,
				targetSymbols: [
					{ importPath: "algorithms/other", importedName: "solve" },
				],
			},
		];
		expect(new Set(variants.map(reviewKey)).size).toBe(variants.length);
	});
});

describe("practice review scheduler", () => {
	test.each([
		["again", 10 * 60_000, 0],
		["hard", DAY, 0],
		["good", DAY, 1],
		["easy", 3 * DAY, 2],
	] as const)("schedules an initial %s review", (grade, elapsed, streak) => {
		expect(scheduleReview(undefined, grade, NOW)).toEqual({
			grade,
			reviews: 1,
			streak,
			lastReviewedAt: NOW.toISOString(),
			dueAt: new Date(NOW.getTime() + elapsed).toISOString(),
		});
	});

	test("retains the stage on hard, advances on good, and resets after again", () => {
		const first = scheduleReview(undefined, "good", NOW);
		const second = scheduleReview(first, "good", new Date(first.dueAt));
		expect(Date.parse(second.dueAt) - Date.parse(second.lastReviewedAt)).toBe(
			3 * DAY,
		);
		const hard = scheduleReview(second, "hard", new Date(second.dueAt));
		expect(hard.streak).toBe(second.streak);
		expect(Date.parse(hard.dueAt) - Date.parse(hard.lastReviewedAt)).toBe(DAY);
		const afterHard = scheduleReview(hard, "good", new Date(hard.dueAt));
		expect(
			Date.parse(afterHard.dueAt) - Date.parse(afterHard.lastReviewedAt),
		).toBe(7 * DAY);
		const again = scheduleReview(afterHard, "again", new Date(afterHard.dueAt));
		expect(again.streak).toBe(0);
		expect(Date.parse(again.dueAt) - Date.parse(again.lastReviewedAt)).toBe(
			10 * 60_000,
		);
		const recovered = scheduleReview(again, "good", new Date(again.dueAt));
		expect(recovered.reviews).toBe(6);
		expect(recovered.streak).toBe(1);
		expect(
			Date.parse(recovered.dueAt) - Date.parse(recovered.lastReviewedAt),
		).toBe(DAY);
		expect(first.reviews).toBe(1);
	});

	test("easy skips a stage and repeated successes cap at 180 elapsed days", () => {
		let review = scheduleReview(undefined, "easy", NOW);
		review = scheduleReview(review, "easy", new Date(review.dueAt));
		expect(review.streak).toBe(4);
		expect(Date.parse(review.dueAt) - Date.parse(review.lastReviewedAt)).toBe(
			14 * DAY,
		);
		for (let i = 0; i < 15; i++) {
			review = scheduleReview(
				review,
				i % 2 === 0 ? "good" : "easy",
				new Date(review.dueAt),
			);
			expect(
				Date.parse(review.dueAt) - Date.parse(review.lastReviewedAt),
			).toBeLessThanOrEqual(180 * DAY);
		}
		expect(review.streak).toBe(8);
		expect(review.reviews).toBe(17);
		expect(Date.parse(review.dueAt) - Date.parse(review.lastReviewedAt)).toBe(
			180 * DAY,
		);
	});

	test("rejects invalid grades, clocks, backward time, and exhausted counters", () => {
		for (const value of [undefined, null, 0, "", "Good", "pass"]) {
			expect(isReviewGrade(value)).toBe(false);
		}
		for (const value of ["again", "hard", "good", "easy"])
			expect(isReviewGrade(value)).toBe(true);
		expect(() =>
			scheduleReview(undefined, "pass" as ReviewGrade, NOW),
		).toThrow();
		expect(() => scheduleReview(undefined, "good", new Date(NaN))).toThrow();
		const previous = scheduleReview(undefined, "good", NOW);
		expect(() =>
			scheduleReview(previous, "good", new Date(NOW.getTime() - 1)),
		).toThrow(/clock|precede|time/i);
		expect(() =>
			scheduleReview(
				{ ...previous, reviews: Number.MAX_SAFE_INTEGER },
				"good",
				NOW,
			),
		).toThrow();
		expect(() => scheduleReview(previous, "hard", NOW)).not.toThrow();
	});
});

describe("practice review history persistence", () => {
	test("treats a missing file as an empty history without creating it", async () => {
		const path = join(TEST_ROOT, "missing.json");
		expect(await readReviewHistory(path)).toEqual({ version: 1, entries: {} });
		expect(existsSync(path)).toBe(false);
	});

	test("preserves other entries and round-trips successive atomic replacements", async () => {
		const path = join(TEST_ROOT, "roundtrip.json");
		const first = await recordReview(path, KEY, "good", NOW);
		const other = await recordReview(path, OTHER_KEY, "hard", NOW);
		const second = await recordReview(path, KEY, "easy", new Date(first.dueAt));
		expect(await readReviewHistory(path)).toEqual({
			version: 1,
			entries: { [KEY]: second, [OTHER_KEY]: other },
		});
		expect(second.reviews).toBe(2);
		expect(second.streak).toBe(3);
		expect(Date.parse(second.dueAt) - Date.parse(second.lastReviewedAt)).toBe(
			7 * DAY,
		);
		await expectNoWriteArtifacts(path);
	});

	test("concurrent readers only observe complete persisted snapshots", async () => {
		const path = join(TEST_ROOT, "snapshots.json");
		await recordReview(path, KEY, "good", NOW);
		let writing = true;
		let observed = 0;
		const reader = (async () => {
			while (writing) {
				const snapshot = await readReviewHistory(path);
				expect(Object.keys(snapshot.entries)).toEqual([KEY]);
				expect(snapshot.entries[KEY]!.reviews).toBeGreaterThanOrEqual(1);
				expect(snapshot.entries[KEY]!.reviews).toBeLessThanOrEqual(13);
				observed++;
				await Bun.sleep(1);
			}
		})();
		try {
			for (let i = 0; i < 12; i++) await recordReview(path, KEY, "good", NOW);
		} finally {
			writing = false;
			await reader;
		}
		expect(observed).toBeGreaterThan(0);
		expect((await readReviewHistory(path)).entries[KEY]!.reviews).toBe(13);
		await expectNoWriteArtifacts(path);
	});

	test("refuses an existing writer lock and leaves it for its owner", async () => {
		const path = join(TEST_ROOT, "locked.json");
		await recordReview(path, KEY, "good", NOW);
		const before = await readFile(path, "utf8");
		await writeFile(`${path}.lock`, "active writer");
		await expect(recordReview(path, KEY, "easy", NOW)).rejects.toThrow(
			/locked/i,
		);
		expect(await readFile(path, "utf8")).toBe(before);
		expect(await readFile(`${path}.lock`, "utf8")).toBe("active writer");
		await rm(`${path}.lock`);
		await expectNoWriteArtifacts(path);
	});

	test("serializes successful concurrent writers without losing recorded attempts", async () => {
		const path = join(TEST_ROOT, "writers.json");
		const outcomes = await Promise.allSettled(
			Array.from({ length: 8 }, () => recordReview(path, KEY, "good", NOW)),
		);
		const successful = outcomes.filter(
			(result) => result.status === "fulfilled",
		);
		expect(successful.length).toBeGreaterThan(0);
		for (const outcome of outcomes) {
			if (outcome.status === "rejected")
				expect(String(outcome.reason)).toMatch(/locked/i);
		}
		expect((await readReviewHistory(path)).entries[KEY]!.reviews).toBe(
			successful.length,
		);
		await expectNoWriteArtifacts(path);
	});

	test("round-trips canonical dates across the extended ISO year boundary", async () => {
		const path = join(TEST_ROOT, "extended-year.json");
		const review = await recordReview(
			path,
			KEY,
			"good",
			new Date("9999-12-31T00:00:00.000Z"),
		);
		expect(review.dueAt).toBe("+010000-01-01T00:00:00.000Z");
		expect((await readReviewHistory(path)).entries[KEY]).toEqual(review);
		await expectNoWriteArtifacts(path);
	});

	test.each([
		["broken-json", "{ truncated"],
		["future-version", JSON.stringify({ version: 2, entries: {} })],
		["array", JSON.stringify([])],
		[
			"bad-key",
			JSON.stringify({
				version: 1,
				entries: { wrong: record(NOW.toISOString()) },
			}),
		],
		[
			"bad-grade",
			JSON.stringify({
				version: 1,
				entries: { [KEY]: { ...record(NOW.toISOString()), grade: "pass" } },
			}),
		],
		[
			"zero-reviews",
			JSON.stringify({
				version: 1,
				entries: { [KEY]: { ...record(NOW.toISOString()), reviews: 0 } },
			}),
		],
		[
			"impossible-streak",
			JSON.stringify({
				version: 1,
				entries: { [KEY]: { ...record(NOW.toISOString()), streak: 3 } },
			}),
		],
		[
			"noncanonical-date",
			JSON.stringify({
				version: 1,
				entries: { [KEY]: record("2026-10-19T10:30:00Z") },
			}),
		],
		[
			"invalid-date",
			JSON.stringify({
				version: 1,
				entries: { [KEY]: record("2026-02-30T10:30:00.000Z") },
			}),
		],
		[
			"backward-due",
			JSON.stringify({
				version: 1,
				entries: { [KEY]: record("2026-09-30T10:30:00.000Z") },
			}),
		],
	] as const)(
		"preserves %s history byte-for-byte on read and attempted write",
		async (name, original) => {
			const path = join(TEST_ROOT, `${name}.json`);
			await writeFile(path, original);
			await expect(readReviewHistory(path)).rejects.toThrow();
			await expect(recordReview(path, KEY, "good", NOW)).rejects.toThrow();
			expect(await readFile(path, "utf8")).toBe(original);
			await expectNoWriteArtifacts(path);
		},
	);

	test("preserves valid history when a future review or invalid clock prevents scheduling", async () => {
		const path = join(TEST_ROOT, "future-clock.json");
		await recordReview(path, KEY, "good", new Date(NOW.getTime() + DAY));
		const before = await readFile(path, "utf8");
		await expect(recordReview(path, KEY, "good", NOW)).rejects.toThrow();
		await expect(
			recordReview(path, KEY, "good", new Date(NaN)),
		).rejects.toThrow();
		expect(await readFile(path, "utf8")).toBe(before);
		await expectNoWriteArtifacts(path);
	});

	test("preserves history instead of persisting an unsafe review counter", async () => {
		const path = join(TEST_ROOT, "counter-limit.json");
		const original = JSON.stringify({
			version: 1,
			entries: {
				[KEY]: {
					...record(NOW.toISOString()),
					reviews: Number.MAX_SAFE_INTEGER,
				},
			},
		});
		await writeFile(path, original);
		await expect(recordReview(path, KEY, "good", NOW)).rejects.toThrow();
		expect(await readFile(path, "utf8")).toBe(original);
		await expectNoWriteArtifacts(path);
	});

	test("rejects invalid identities without creating history or a lock", async () => {
		const path = join(TEST_ROOT, "bad-identity.json");
		await expect(recordReview(path, "../outside", "good", NOW)).rejects.toThrow(
			/identity/i,
		);
		expect(existsSync(path)).toBe(false);
		await expectNoWriteArtifacts(path);
	});
});

describe("practice review planning", () => {
	test("orders oldest due first, includes the exact boundary, and retains unseen catalog order", () => {
		const oldest = target("oldest");
		const boundary = target("boundary");
		const future = target("future");
		const unseenA = target("unseenA");
		const unseenB = target("unseenB");
		const targets = [unseenB, future, boundary, oldest, unseenA];
		const history: ReviewHistory = {
			version: 1,
			entries: {
				[reviewKey(oldest)]: record(
					new Date(NOW.getTime() - 60_000).toISOString(),
				),
				[reviewKey(boundary)]: record(NOW.toISOString()),
				[reviewKey(future)]: record(new Date(NOW.getTime() + 1).toISOString()),
				[OTHER_KEY]: record(NOW.toISOString()),
			},
		};
		const before = JSON.stringify(history);
		expect(planReviews(targets, history, NOW)).toEqual({
			due: [oldest, boundary],
			unseen: [unseenB, unseenA],
		});
		expect(targets).toEqual([unseenB, future, boundary, oldest, unseenA]);
		expect(JSON.stringify(history)).toBe(before);
	});

	test("keeps catalog order for equal due times and returns no future items", () => {
		const a = target("a");
		const b = target("b");
		const history: ReviewHistory = {
			version: 1,
			entries: {
				[reviewKey(a)]: record(NOW.toISOString()),
				[reviewKey(b)]: record(NOW.toISOString()),
			},
		};
		expect(planReviews([b, a], history, NOW)).toEqual({
			due: [b, a],
			unseen: [],
		});
		expect(planReviews([a, b], history, new Date(NOW.getTime() - 1))).toEqual({
			due: [],
			unseen: [],
		});
		expect(planReviews([], history, NOW)).toEqual({ due: [], unseen: [] });
	});

	test("rejects an invalid planning clock instead of hiding due reviews", () => {
		expect(() =>
			planReviews(
				[target("solve")],
				{ version: 1, entries: {} },
				new Date(NaN),
			),
		).toThrow();
	});

	test("sorts due reviews chronologically when ISO year widths differ", () => {
		const earlier = target("earlier");
		const later = target("later");
		const history: ReviewHistory = {
			version: 1,
			entries: {
				[reviewKey(earlier)]: record("9999-12-31T00:00:00.000Z"),
				[reviewKey(later)]: record("+010000-01-01T00:00:00.000Z"),
			},
		};
		expect(
			planReviews(
				[later, earlier],
				history,
				new Date("+010000-01-02T00:00:00.000Z"),
			).due,
		).toEqual([earlier, later]);
	});
});
