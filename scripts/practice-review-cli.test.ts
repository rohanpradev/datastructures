import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import type { ReviewHistory } from "./practice-review";

const GENERATOR_PATH = join(import.meta.dir, "generate-practice.ts");
const SOURCE = `export function alpha(value: number): number { return value + 1; }
export function beta(value: number): number { return value * 2; }
export function gamma(value: number): number { return value - 1; }
`;
const SOURCE_TEST = `import { describe, expect, test } from "bun:test";
import { alpha, beta } from "../review-exercises";

describe("alpha", () => {
  test("increments a value", () => { expect(alpha(2)).toBe(3); });
});
describe("beta", () => {
  test("doubles a value", () => { expect(beta(2)).toBe(4); });
});
`;

type FixtureSession = {
	targetId: number;
	title: string;
	reviewKey: string;
	implementationPaths: string[];
	testPath: string;
};

class ReviewFixture {
	constructor(readonly root: string) {}

	path(...parts: string[]): string {
		return join(this.root, "practice", ...parts);
	}

	async session(): Promise<FixtureSession> {
		return Bun.file(this.path(".practice-session.json")).json();
	}

	async history(): Promise<ReviewHistory> {
		return Bun.file(this.path(".review-history.json")).json();
	}

	async writeHistory(history: ReviewHistory): Promise<void> {
		await Bun.write(this.path(".review-history.json"), JSON.stringify(history));
	}

	async cli(...args: string[]): Promise<{ code: number; output: string }> {
		const child = Bun.spawn([process.execPath, GENERATOR_PATH, ...args], {
			cwd: this.root,
			stdout: "pipe",
			stderr: "pipe",
			windowsHide: true,
		});
		const deadline = setTimeout(() => child.kill(), 10_000);
		try {
			const [stdout, stderr, code] = await Promise.all([
				new Response(child.stdout).text(),
				new Response(child.stderr).text(),
				child.exited,
			]);
			return { code, output: `${stdout}\n${stderr}` };
		} finally {
			clearTimeout(deadline);
		}
	}
}

async function withFixture(
	run: (fixture: ReviewFixture) => Promise<void>,
): Promise<void> {
	const parent = join(process.cwd(), "practice");
	await mkdir(parent, { recursive: true });
	const root = await mkdtemp(join(parent, "__review-cli-"));
	try {
		await Bun.write(
			join(root, "src", "algorithms", "review-exercises.ts"),
			SOURCE,
		);
		await Bun.write(
			join(root, "src", "algorithms", "tests", "review.test.ts"),
			SOURCE_TEST,
		);
		await run(new ReviewFixture(root));
	} finally {
		await rm(root, { recursive: true, force: true });
	}
}

describe("practice review CLI", () => {
	test("isolates simultaneous catalog validations and preserves an existing validation folder", async () => {
		await withFixture(async (fixture) => {
			const savedPath = fixture.path("__focused-validation__", "saved.txt");
			await Bun.write(savedPath, "learner notes");
			const results = await Promise.all([
				fixture.cli("--validate-all-focused"),
				fixture.cli("--validate-all-focused"),
			]);
			for (const result of results) {
				expect(result.code, result.output).toBe(0);
				expect(result.output).toContain(
					"Validated 2 focused practice target(s).",
				);
			}
			expect(await Bun.file(savedPath).text()).toBe("learner notes");
			expect(
				(await readdir(fixture.path())).filter((name) =>
					name.startsWith("__focused-validation__-"),
				),
			).toEqual([]);
		});
	});

	test("lists an untouched catalog without creating learner state", async () => {
		await withFixture(async (fixture) => {
			const result = await fixture.cli("--review");
			expect(result.code).toBe(0);
			expect(result.output).toContain("0 due · 2 unseen · 0 scheduled");
			expect(
				await Bun.file(fixture.path(".review-history.json")).exists(),
			).toBe(false);
			expect(
				await Bun.file(fixture.path(".practice-session.json")).exists(),
			).toBe(false);
		});
	});

	test("creates a session and records a good review under its stable identity", async () => {
		await withFixture(async (fixture) => {
			const next = await fixture.cli("--next");
			expect(next.code).toBe(0);
			expect(next.output).toContain("Starting an unseen target.");
			const session = await fixture.session();
			expect(session.title).toBe("alpha");
			expect(session.reviewKey).toMatch(/^[a-f0-9]{64}$/);
			expect(
				await Bun.file(fixture.path(session.implementationPaths[0]!)).exists(),
			).toBe(true);
			expect(await Bun.file(fixture.path(session.testPath)).exists()).toBe(
				true,
			);

			const grade = await fixture.cli("--grade", "good");
			expect(grade.code, grade.output).toBe(0);
			expect(grade.output).toContain("Recorded good: alpha");
			const history = await fixture.history();
			expect(history.version).toBe(1);
			expect(Object.keys(history.entries)).toEqual([session.reviewKey]);
			const record = history.entries[session.reviewKey]!;
			expect(record).toMatchObject({ grade: "good", reviews: 1, streak: 1 });
			expect(Date.parse(record.dueAt) - Date.parse(record.lastReviewedAt)).toBe(
				86_400_000,
			);
			expect((await fixture.session()).reviewKey).toBe(session.reviewKey);
			expect((await fixture.cli("--review")).output).toContain(
				"0 due · 1 unseen · 1 scheduled",
			);
		});
	});

	test("returns to a due review before an unseen item and leaves future reviews scheduled", async () => {
		await withFixture(async (fixture) => {
			expect((await fixture.cli("--next", "export:alpha")).code).toBe(0);
			const alpha = await fixture.session();
			expect((await fixture.cli("--grade=good")).code).toBe(0);
			const history = await fixture.history();
			history.entries[alpha.reviewKey]!.lastReviewedAt =
				"2000-01-01T00:00:00.000Z";
			history.entries[alpha.reviewKey]!.dueAt = "2000-01-02T00:00:00.000Z";
			await fixture.writeHistory(history);

			expect((await fixture.cli("--review")).output).toContain(
				"1 due · 1 unseen · 0 scheduled",
			);
			const due = await fixture.cli("--next");
			expect(due.code).toBe(0);
			expect(due.output).toContain("Returning to the oldest due review.");
			expect((await fixture.session()).reviewKey).toBe(alpha.reviewKey);

			history.entries[alpha.reviewKey]!.dueAt = "2099-01-01T00:00:00.000Z";
			await fixture.writeHistory(history);
			expect((await fixture.cli("--next")).code).toBe(0);
			expect((await fixture.session()).title).toBe("beta");
			const betaSession = await Bun.file(
				fixture.path(".practice-session.json"),
			).text();
			const scheduled = await fixture.cli("--next=export:alpha");
			expect(scheduled.code).toBe(0);
			expect(scheduled.output).toContain("All matching targets are scheduled.");
			expect(
				await Bun.file(fixture.path(".practice-session.json")).text(),
			).toBe(betaSession);
		});
	});

	test("preserves learner implementations and added cases when reviewing or regenerating", async () => {
		await withFixture(async (fixture) => {
			expect((await fixture.cli("--next", "export:alpha")).code).toBe(0);
			const session = await fixture.session();
			const implementationPath = fixture.path(session.implementationPaths[0]!);
			const testPath = fixture.path(session.testPath);
			const implementation =
				"export function alpha(value: number): number { return 1 + value; }\n";
			const learnerTest = `${await Bun.file(testPath).text()}\ntest("learner added zero", () => { expect(alpha(0)).toBe(1); });\n`;
			await Bun.write(implementationPath, implementation);
			await Bun.write(testPath, learnerTest);
			expect((await fixture.cli("--grade", "good")).code).toBe(0);
			const history = await fixture.history();
			history.entries[session.reviewKey]!.lastReviewedAt =
				"2000-01-01T00:00:00.000Z";
			history.entries[session.reviewKey]!.dueAt = "2000-01-02T00:00:00.000Z";
			await fixture.writeHistory(history);

			for (const args of [["--next"], ["--problem", "export:alpha"]]) {
				expect((await fixture.cli(...args)).code).toBe(0);
				expect(await Bun.file(implementationPath).text()).toBe(implementation);
				expect(await Bun.file(testPath).text()).toBe(learnerTest);
			}
		});
	});

	test("rejects corrupt history without changing history, session, or learner work", async () => {
		await withFixture(async (fixture) => {
			expect((await fixture.cli("--next")).code).toBe(0);
			const session = await fixture.session();
			const sessionBefore = await Bun.file(
				fixture.path(".practice-session.json"),
			).text();
			const implementationPath = fixture.path(session.implementationPaths[0]!);
			const testPath = fixture.path(session.testPath);
			const implementationBefore = await Bun.file(implementationPath).text();
			const testBefore = await Bun.file(testPath).text();
			for (const raw of [
				"{broken",
				JSON.stringify({ version: 2, entries: {} }),
			]) {
				await Bun.write(fixture.path(".review-history.json"), raw);
				for (const args of [["--review"], ["--next"], ["--grade", "good"]]) {
					const result = await fixture.cli(...args);
					expect(result.code).toBe(1);
					expect(result.output).toMatch(/invalid.*history|history.*invalid/i);
					expect(
						await Bun.file(fixture.path(".review-history.json")).text(),
					).toBe(raw);
					expect(
						await Bun.file(fixture.path(".practice-session.json")).text(),
					).toBe(sessionBefore);
					expect(await Bun.file(implementationPath).text()).toBe(
						implementationBefore,
					);
					expect(await Bun.file(testPath).text()).toBe(testBefore);
					expect(
						await Bun.file(fixture.path(".review-history.json.lock")).exists(),
					).toBe(false);
				}
			}
		});
	});

	test("rejects a grade when the reference cases changed after the session began", async () => {
		await withFixture(async (fixture) => {
			expect((await fixture.cli("--next", "export:alpha")).code).toBe(0);
			const sessionBefore = await Bun.file(
				fixture.path(".practice-session.json"),
			).text();
			await Bun.write(
				join(fixture.root, "src", "algorithms", "tests", "review.test.ts"),
				SOURCE_TEST.replace(
					"expect(alpha(2)).toBe(3)",
					"expect(alpha(3)).toBe(4)",
				),
			);
			const result = await fixture.cli("--grade", "good");
			expect(result.code).toBe(1);
			expect(result.output).toContain("reference tests have changed");
			expect(
				await Bun.file(fixture.path(".review-history.json")).exists(),
			).toBe(false);
			expect(
				await Bun.file(fixture.path(".practice-session.json")).text(),
			).toBe(sessionBefore);
		});
	});

	test("catalog additions cannot redirect an active grade through its old numeric ID", async () => {
		await withFixture(async (fixture) => {
			expect((await fixture.cli("--next", "export:alpha")).code).toBe(0);
			const alpha = await fixture.session();
			expect(alpha.targetId).toBe(1);
			await Bun.write(
				join(fixture.root, "src", "algorithms", "tests", "a-catalog.test.ts"),
				`import { describe, expect, test } from "bun:test";
import { gamma } from "../review-exercises";
describe("gamma", () => { test("decrements", () => { expect(gamma(2)).toBe(1); }); });
`,
			);
			const catalog = await fixture.cli("--list");
			expect(catalog.code).toBe(0);
			expect(catalog.output).toMatch(/1\. gamma/);
			expect(catalog.output).toMatch(/2\. alpha/);
			const grade = await fixture.cli("--grade", "good");
			expect(grade.code).toBe(0);
			expect(grade.output).toContain("Recorded good: alpha");
			expect(Object.keys((await fixture.history()).entries)).toEqual([
				alpha.reviewKey,
			]);
		});
	});
});
