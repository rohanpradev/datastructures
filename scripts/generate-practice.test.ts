import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import {
	auditPracticeCatalogCompleteness,
	discoverPracticeTargets,
	findBestTarget,
	formatFocusedTestCommand,
	parseArgs,
	pickRandomTarget,
	runPracticeSmokeTests,
	searchTargets,
	toManifestEntry,
	writeFocusedPractice,
} from "./generate-practice";

const TEST_ROOT = join(process.cwd(), "practice", "__script-test__");

type PracticeTargets = ReturnType<typeof discoverPracticeTargets>;

let targets: PracticeTargets;

beforeAll(() => {
	targets = discoverPracticeTargets();
});

afterAll(async () => {
	await rm(TEST_ROOT, { recursive: true, force: true });
});

describe("generate-practice CLI model", () => {
	test("parses every supported noninteractive mode", () => {
		expect(parseArgs(["--all", "--clean"]).all).toBe(true);
		expect(parseArgs(["--dashboard"]).dashboard).toBe(true);
		expect(parseArgs(["--manifest"]).manifest).toBe(true);
		expect(parseArgs(["--audit-targets"]).auditTargets).toBe(true);
		expect(parseArgs(["--smoke-test"]).smokeTest).toBe(true);
		expect(parseArgs(["--validate-all-focused"]).validateAll).toBe(true);
		expect(parseArgs(["--list=system design"]).listQuery).toBe("system design");
		expect(parseArgs(["--random", "expert"]).randomQuery).toBe("expert");
		expect(
			parseArgs(["--random", "medium", "graph", "--seed", "cohort-a"]),
		).toMatchObject({ randomQuery: "medium graph", seed: "cohort-a" });
		expect(parseArgs(["--problem=twoSum"]).problemQuery).toBe("twoSum");
		expect(parseArgs(["twoSum"]).problemQuery).toBe("twoSum");
		expect(parseArgs(["two", "sum"]).problemQuery).toBe("two sum");
		expect(parseArgs(["--run"]).run).toBe(true);
		expect(parseArgs(["--watch"]).watch).toBe(true);
		expect(parseArgs(["--status"]).status).toBe(true);
		expect(() => parseArgs(["--problem"])).toThrow(
			"--problem requires a search term",
		);
		expect(() => parseArgs(["--unknown"])).toThrow(
			"Unknown option: --unknown",
		);
		expect(() => parseArgs(["--run", "--watch"])).toThrow(
			"Choose one mode at a time",
		);
		expect(() => parseArgs(["--seed", "cohort-a"])).toThrow(
			"--seed can only be used with --random",
		);
	});

	test("discovers stable selectable targets with unique slugs", () => {
		expect(targets.length).toBeGreaterThan(200);

		const slugs = new Set(targets.map((target) => target.slug));
		expect(slugs.size).toBe(targets.length);

		for (const target of targets) {
			expect(target.testBlocks.length).toBeGreaterThan(0);
			expect(target.sourceFiles.length).toBeGreaterThan(0);
			expect(target.targetSymbols.length).toBeGreaterThan(0);
			expect(target.testRelativePath).toEndWith(".test.ts");
		}
	});

	test("maps every eligible runnable block exactly once", () => {
		const audit = auditPracticeCatalogCompleteness(targets);

		expect(audit.testFiles).toBeGreaterThan(0);
		expect(audit.runnableBlocks).toBeGreaterThanOrEqual(audit.selectableBlocks);
		expect(audit.eligibleBlocks).toBe(audit.coveredBlocks);
		expect(audit.coveredBlocks).toBeGreaterThanOrEqual(targets.length);
	});

	test("supports learner-level, mode, difficulty, and problem search filters", () => {
		expect(searchTargets(targets, "beginner").length).toBeGreaterThan(0);
		expect(searchTargets(targets, "intermediate").length).toBeGreaterThan(0);
		expect(searchTargets(targets, "advanced").length).toBeGreaterThan(0);
		expect(searchTargets(targets, "expert").length).toBeGreaterThan(0);
		expect(searchTargets(targets, "coding").length).toBeGreaterThan(0);
		expect(searchTargets(targets, "runtime").length).toBeGreaterThan(0);
		expect(searchTargets(targets, "system design").length).toBeGreaterThan(0);
		expect(searchTargets(targets, "hard").length).toBeGreaterThan(0);
		expect(searchTargets(targets, "medium graph").length).toBeGreaterThan(0);
		expect(findBestTarget(targets, "twoSum")?.title).toBe("twoSum");
		expect(findBestTarget(targets, String(targets[0]!.id))).toBe(targets[0]);
		expect(findBestTarget(targets, "nosuchtarget")).toBeNull();
	});

	test("makes seeded random practice reproducible", () => {
		const first = pickRandomTarget(targets, "medium", "cohort-a");
		const second = pickRandomTarget(targets, "medium", "cohort-a");

		expect(first).not.toBeNull();
		expect(second?.slug).toBe(first?.slug);
	});

	test("builds complete learning manifest entries", () => {
		const entries = targets.map(toManifestEntry);

		expect(entries.length).toBe(targets.length);
		expect(entries.some((entry) => entry.level === "expert")).toBe(true);
		expect(entries.some((entry) => entry.interviewMode === "system design")).toBe(
			true,
		);
		expect(entries.some((entry) => entry.interviewMode === "runtime")).toBe(true);
		expect(findBestTarget(targets, "accountsMerge")?.pattern).toBe("graph");
		expect(toManifestEntry(findBestTarget(targets, "accountsMerge")!).level).toBe(
			"intermediate",
		);
		expect(findBestTarget(targets, "insertInterval")?.pattern).toBe("intervals");

		for (const entry of entries) {
			expect(entry.id).toBeGreaterThan(0);
			expect(entry.title.length).toBeGreaterThan(0);
			expect(entry.slug.length).toBeGreaterThan(0);
			expect(entry.topic.length).toBeGreaterThan(0);
			expect(entry.estimatedMinutes).toBeGreaterThan(0);
			expect(entry.learningObjectives.length).toBeGreaterThan(0);
			expect(entry.learnerChecklist.length).toBeGreaterThan(0);
			expect(entry.learnerChecklist.join(" ")).toContain("Trace one");
			expect(entry.complexityPrompt).toContain("complexity");
			expect(entry.readinessRubric.length).toBeGreaterThan(0);
			expect(entry.readinessRubric.join(" ")).toContain("Dry-run");
			expect(entry.spacedRepetitionDays[0]).toBe(1);
			expect(entry.enterpriseDiscussionPrompts.length).toBeGreaterThan(0);
			expect(entry.test).toEndWith(".test.ts");
			expect(entry.sources.length).toBeGreaterThan(0);
			expect(entry.exports.length).toBeGreaterThan(0);
		}
	});

	test("keeps parser and focused-filter smoke cases covered by bun test", () => {
		expect(() => runPracticeSmokeTests(targets)).not.toThrow();
	});
});

describe("generate-practice focused output", () => {
	test("prints a Bun command that works on Windows path filtering", () => {
		expect(formatFocusedTestCommand("algorithms\\tests\\two-sum.test.ts")).toBe(
			"bun test --cwd practice algorithms/tests/two-sum.test.ts",
		);
		expect(
			formatFocusedTestCommand("algorithms\\tests\\two-sum.test.ts", true),
		).toBe(
			"bun --watch test --cwd practice algorithms/tests/two-sum.test.ts",
		);
	});

	test("preserves learner code unless reset is explicit", async () => {
		const target = findBestTarget(targets, "twoSum");
		expect(target).not.toBeNull();

		const outputRoot = join(TEST_ROOT, "preserve-code");
		const implementationPath = join(
			outputRoot,
			"algorithms",
			"arrays",
			"two-sum.ts",
		);
		await rm(outputRoot, { recursive: true, force: true });
		await writeFocusedPractice(target!, outputRoot, false);
		await Bun.write(implementationPath, "// learner solution\n");

		await writeFocusedPractice(target!, outputRoot, false);
		expect(await Bun.file(implementationPath).text()).toBe(
			"// learner solution\n",
		);

		await writeFocusedPractice(target!, outputRoot, false, true);
		expect(await Bun.file(implementationPath).text()).toContain(
			"Not implemented: twoSum",
		);
	});

	test("discovers and rewrites relative source imports", async () => {
		const target = findBestTarget(targets, "sameValueZero");
		expect(target).not.toBeNull();

		const outputRoot = join(TEST_ROOT, "relative-imports");
		await rm(outputRoot, { recursive: true, force: true });
		const testPath = await writeFocusedPractice(target!, outputRoot, false);
		const generatedTest = await Bun.file(join(outputRoot, testPath)).text();

		expect(
			target?.sourceRelativePaths.map((path) => path.replaceAll("\\", "/")),
		).toContain("javascript-concepts/core-concepts.ts");
		expect(generatedTest).toContain('from "../same-value-zero"');
		expect(generatedTest).not.toContain('from "../core-concepts"');
	});

	test("writes focused practice files that Bun can load up to the stub", async () => {
		const target = findBestTarget(targets, "twoSum");
		expect(target).not.toBeNull();

		await rm(TEST_ROOT, { recursive: true, force: true });
		const testPath = await writeFocusedPractice(target!, TEST_ROOT, false);
		const implementationPath = join(TEST_ROOT, "algorithms", "arrays", "two-sum.ts");
		const generatedTestPath = join(TEST_ROOT, testPath);

		expect(existsSync(implementationPath)).toBe(true);
		expect(existsSync(generatedTestPath)).toBe(true);

		const implementation = await Bun.file(implementationPath).text();
		expect(implementation).toContain("Learning loop:");
		expect(implementation).toContain("Trace one sample, then implement twoSum.");

		const generatedTest = await Bun.file(generatedTestPath).text();
		expect(generatedTest).toContain('from "../arrays/two-sum"');
		expect(generatedTest).not.toContain('from "@/');

		const subprocess = Bun.spawn(
			[process.execPath, "test", "--cwd", TEST_ROOT, testPath],
			{
				stdout: "pipe",
				stderr: "pipe",
			},
		);
		const [stdoutText, stderrText, exitCode] = await Promise.all([
			readSubprocessText(subprocess.stdout),
			readSubprocessText(subprocess.stderr),
			subprocess.exited,
		]);
		const outputText = `${stdoutText}\n${stderrText}`;

		expect(exitCode).not.toBe(0);
		expect(outputText).toContain("Not implemented: twoSum");
		expect(outputText).not.toMatch(
			/Cannot find module|Could not resolve|does not provide an export named|SyntaxError/i,
		);
	});

	test("keeps complex function signatures syntactically valid", async () => {
		const target = findBestTarget(targets, "optimalFreelancing");
		expect(target).not.toBeNull();

		const outputRoot = join(TEST_ROOT, "complex-signature");
		await rm(outputRoot, { recursive: true, force: true });
		await writeFocusedPractice(target!, outputRoot, false);

		const implementation = await Bun.file(
			join(outputRoot, "algorithms", "arrays", "optimal-freelancing.ts"),
		).text();

		expect(implementation).toContain(
			"jobs: Array<{ deadline: number; payment: number }>",
		);
		expect(implementation).toContain(
			'throw new Error("Not implemented: optimalFreelancing");',
		);
	});

	test("preserves multiline source imports in generated implementations", async () => {
		const target = findBestTarget(targets, "findMiddleNode");
		expect(target).not.toBeNull();

		const outputRoot = join(TEST_ROOT, "multiline-imports");
		await rm(outputRoot, { recursive: true, force: true });
		await writeFocusedPractice(target!, outputRoot, false);

		const implementation = await Bun.file(
			join(
				outputRoot,
				"data-structures",
				"singly-linked-list",
				"problems",
				"find-middle-node.ts",
			),
		).text();
		const normalizedImplementation = implementation.replace(/\r\n/g, "\n");

		expect(normalizedImplementation).toContain(
			'import {\n\tNode,\n\tSinglyLinkedList,\n} from "@/data-structures/singly-linked-list/singly-linked-list";',
		);
		expect(normalizedImplementation).toContain(
			"export function findMiddleNode<T>(list: SinglyLinkedList<T>): Node<T> | null",
		);
	});

	test("splits practice imports from real helper imports", async () => {
		const target = findBestTarget(targets, "allPromises");
		expect(target).not.toBeNull();

		const outputRoot = join(TEST_ROOT, "helper-imports");
		await rm(outputRoot, { recursive: true, force: true });
		const testPath = await writeFocusedPractice(target!, outputRoot, false);

		const generatedTest = await Bun.file(join(outputRoot, testPath)).text();
		expect(generatedTest).toContain(
			'import { allPromises } from "../basics/all-promises";',
		);
		expect(generatedTest).toContain(
			'import { rejectedValue, resolvedValue } from "../../../../../src/node-concepts/basics/promise-types";',
		);
	});

	test("strips runtime initializers that can fire before class stubs", async () => {
		const target = findBestTarget(targets, "MedianFinder");
		expect(target).not.toBeNull();

		const outputRoot = join(TEST_ROOT, "class-initializers");
		await rm(outputRoot, { recursive: true, force: true });
		await writeFocusedPractice(target!, outputRoot, false);

		const implementation = await Bun.file(
			join(outputRoot, "data-structures", "heap", "median-finder.ts"),
		).text();

		expect(implementation).not.toContain("new MaxHeap");
		expect(implementation).not.toContain("new MinHeap");
		expect(implementation).toContain('throw new Error("Not implemented");');
	});

	test("handles object and template-literal return types in class methods", async () => {
		const bloomTarget = findBestTarget(targets, "BloomFilter");
		const typeScriptTarget = findBestTarget(targets, "modern TypeScript concepts");
		expect(bloomTarget).not.toBeNull();
		expect(typeScriptTarget).not.toBeNull();

		const outputRoot = join(TEST_ROOT, "method-return-types");
		await rm(outputRoot, { recursive: true, force: true });
		await writeFocusedPractice(bloomTarget!, outputRoot, false);
		await writeFocusedPractice(typeScriptTarget!, outputRoot, false);

		const bloomImplementation = await Bun.file(
			join(outputRoot, "node-concepts", "system-design", "bloom-filter.ts"),
		).text();
		const typeScriptImplementation = await Bun.file(
			join(
				outputRoot,
				"typescript-concepts",
				"modern-type-script-concepts.ts",
			),
		).text();

		expect(bloomImplementation).toContain(
			"stats(): { bitCount: number; byteCount: number; hashCount: number } {",
		);
		expect(typeScriptImplementation).toContain(
			"label(value: string): `value:${string}` {",
		);
		expect(typeScriptImplementation).toContain(
			"export const typeScriptFeatureCatalog",
		);
		expect(typeScriptImplementation).toContain(
			"export function disposableCleanup(cleanup: () => void): Disposable",
		);
	});
});

async function readSubprocessText(
	stream: ReadableStream<Uint8Array> | null,
): Promise<string> {
	if (!stream) return "";
	return new Response(stream).text();
}
