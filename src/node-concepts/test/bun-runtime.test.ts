import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	copyFileWithBun,
	matchesGlob,
	readJsonFile,
	scanFiles,
	summarizeFile,
	writeJsonFile,
} from "@/node-concepts/bun-runtime/file-system";
import { processSampleImageWithBun } from "@/node-concepts/bun-runtime/image-processing";
import {
	buildLearningArchive,
	createCsrfToken,
	nextCronOccurrence,
	parseCompleteJsonLines,
	parseJson5Config,
	readLearningArchive,
	renderLearningMarkdown,
	verifyCsrfToken,
} from "@/node-concepts/bun-runtime/modern-apis";
import {
	bunVersionFromSpawn,
	bunVersionFromSpawnSync,
	readEnvWithSpawn,
	uppercaseWithSpawn,
} from "@/node-concepts/bun-runtime/process-execution";
import {
	contentFingerprint,
	createSessionCookie,
	hashPassword,
	parseCookies,
	sha256Hex,
	verifyPassword,
} from "@/node-concepts/bun-runtime/security";
import {
	bunVersionFromShell,
	readEnvWithBunShell,
	safeEcho,
} from "@/node-concepts/bun-runtime/shell";

describe("Bun file I/O and Glob", () => {
	let tempDir = "";

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), "bun-runtime-"));
	});

	afterEach(async () => {
		await rm(tempDir, { force: true, recursive: true });
	});

	test("writes and reads JSON with Bun.file and Bun.write", async () => {
		const path = join(tempDir, "profile.json");

		const bytesWritten = await writeJsonFile(path, {
			level: "interview-ready",
			score: 100,
		});
		const profile = await readJsonFile<{ level: string; score: number }>(path);

		expect(bytesWritten).toBeGreaterThan(0);
		expect(profile).toEqual({ level: "interview-ready", score: 100 });
	});

	test("throws a clear error for missing JSON files", async () => {
		await expect(readJsonFile(join(tempDir, "missing.json"))).rejects.toThrow(
			"File not found",
		);
	});

	test("copies a file through a BunFile reference", async () => {
		const source = join(tempDir, "input.txt");
		const destination = join(tempDir, "output.txt");

		await Bun.write(source, "hello bun");
		const bytesWritten = await copyFileWithBun(source, destination);
		const summary = await summarizeFile(destination);

		expect(bytesWritten).toBeGreaterThanOrEqual(0);
		expect(await Bun.file(destination).text()).toBe("hello bun");
		expect(summary).toEqual({
			exists: true,
			size: 9,
			type: "text/plain;charset=utf-8",
		});
	});

	test("scans matching files with stable relative paths", async () => {
		await mkdir(join(tempDir, "nested"));
		await Bun.write(join(tempDir, "a.ts"), "");
		await Bun.write(join(tempDir, "nested", "b.ts"), "");
		await Bun.write(join(tempDir, "nested", "c.js"), "");

		const files = await scanFiles(tempDir, "**/*.ts");

		expect(files).toEqual(["a.ts", "nested/b.ts"]);
		expect(matchesGlob("*.ts", "index.ts")).toBe(true);
		expect(matchesGlob("*.ts", "src/index.ts")).toBe(false);
	});
});

describe("processSampleImageWithBun", () => {
	test("resizes and re-encodes image bytes without external packages", async () => {
		const result = await processSampleImageWithBun({
			targetHeight: 80,
			targetWidth: 120,
		});

		expect(result.source).toMatchObject({
			format: "bmp",
			height: 180,
			width: 320,
		});
		expect(result.output.format).toBe("webp");
		expect(result.output.mimeType).toBe("image/webp");
		expect(result.output.bytes).toBeGreaterThan(0);
		expect(result.output.width).toBeLessThanOrEqual(120);
		expect(result.output.height).toBeLessThanOrEqual(80);
		expect(result.operation).toMatchObject({
			filter: "lanczos3",
			fit: "inside",
			format: "webp",
		});
	});
});

describe("Bun hashing, password, and cookie APIs", () => {
	test("computes a known SHA-256 digest", () => {
		expect(sha256Hex("hello")).toBe(
			"2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
		);
	});

	test("creates deterministic non-cryptographic fingerprints", () => {
		expect(contentFingerprint("same input")).toBe(
			contentFingerprint("same input"),
		);
		expect(contentFingerprint("same input")).not.toBe(
			contentFingerprint("different input"),
		);
	});

	test("hashes and verifies passwords", async () => {
		const hash = await hashPassword("correct horse battery staple");

		expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
		expect(await verifyPassword("wrong password", hash)).toBe(false);
	});

	test("rejects short passwords before hashing", async () => {
		await expect(hashPassword("short")).rejects.toThrow(
			"at least 8 characters",
		);
	});

	test("creates and parses secure session cookies", () => {
		const header = createSessionCookie("session-123", {
			maxAge: 60,
			secure: false,
		});
		const parsed = parseCookies("session_id=session-123; theme=dark");

		expect(header).toContain("session_id=session-123");
		expect(header).toContain("HttpOnly");
		expect(header).toContain("SameSite=Lax");
		expect(header).toContain("Max-Age=60");
		expect(parsed).toEqual({
			session_id: "session-123",
			theme: "dark",
		});
	});
});

describe("Modern Bun API Patterns", () => {
	type ProgressEvent = { score: number; slug: string };
	const isProgressEvent = (value: unknown): value is ProgressEvent => {
		if (!value || typeof value !== "object") return false;
		const candidate = value as Partial<ProgressEvent>;
		return typeof candidate.score === "number" && typeof candidate.slug === "string";
	};

	test("strictly parses and validates complete JSONL imports", () => {
		const result = parseCompleteJsonLines(
			'{"slug":"two-sum","score":4}\n{"slug":"lru-cache","score":3}\n',
			isProgressEvent,
		);

		expect(result.done).toBe(true);
		expect(result.values).toEqual([
			{ score: 4, slug: "two-sum" },
			{ score: 3, slug: "lru-cache" },
		]);
		expect(() =>
			parseCompleteJsonLines('{"slug":"broken"', isProgressEvent),
		).toThrow();
		expect(() =>
			parseCompleteJsonLines('{"slug":"missing-score"}\n', isProgressEvent),
		).toThrow("JSONL record failed validation");
	});

	test("parses human-friendly JSON5 but keeps domain validation explicit", () => {
		const config = parseJson5Config(
			"{ level: 'advanced', minutes: 45, topics: ['queues',], }",
			(value): value is { level: string; minutes: number; topics: string[] } => {
				if (!value || typeof value !== "object") return false;
				const candidate = value as Record<string, unknown>;
				return (
					typeof candidate["level"] === "string" &&
					typeof candidate["minutes"] === "number" &&
					Array.isArray(candidate["topics"])
				);
			},
		);

		expect(config).toEqual({
			level: "advanced",
			minutes: 45,
			topics: ["queues"],
		});
	});

	test("renders GFM learning notes while disabling raw HTML", () => {
		const html = renderLearningMarkdown(
			"# Queue Design\n\n- [x] visibility timeout\n\n<script>alert(1)</script>",
		);

		expect(html).toContain('<h1 id="queue-design">Queue Design</h1>');
		expect(html).toContain('type="checkbox"');
		expect(html).not.toContain("<script>");
	});

	test("generates and verifies expiring CSRF tokens", () => {
		const secret = "a-secure-demo-secret-with-32-characters";
		const token = createCsrfToken(secret, 60_000);

		expect(verifyCsrfToken(token, secret, 60_000)).toBe(true);
		expect(
			verifyCsrfToken(token, "another-secure-secret-with-32-characters", 60_000),
		).toBe(false);
	});

	test("round-trips selected learning files through an in-memory archive", async () => {
		const bytes = await buildLearningArchive({
			"README.md": "# Course",
			"notes/queue.md": "visibility timeout",
			"notes/cache.md": "cache aside",
		});
		const files = await readLearningArchive(bytes, "notes/**");

		expect([...files]).toEqual([
			["notes/cache.md", "cache aside"],
			["notes/queue.md", "visibility timeout"],
		]);
	});

	test("previews UTC cron schedules without registering a job", () => {
		expect(
			nextCronOccurrence("0 9 * * MON-FRI", new Date("2026-07-17T10:00:00Z"))?.toISOString(),
		).toBe("2026-07-20T09:00:00.000Z");
	});
});

describe("Bun Shell", () => {
	test("reads Bun version from stdout", async () => {
		await expect(bunVersionFromShell()).resolves.toMatch(/^\d+\.\d+\.\d+/);
	});

	test("escapes interpolated user input", async () => {
		await expect(safeEcho("hello; echo unsafe")).resolves.toBe(
			"hello; echo unsafe",
		);
	});

	test("runs a command with a scoped environment variable", async () => {
		await expect(
			readEnvWithBunShell("BUN_CONCEPT_VALUE", "scoped-value"),
		).resolves.toBe("scoped-value");
	});

	test("rejects invalid environment variable names", async () => {
		await expect(readEnvWithBunShell("bad-name", "value")).rejects.toThrow(
			"Invalid environment variable name",
		);
	});
});

describe("bunVersionFromSpawn", () => {
	test("runs an async subprocess and captures stdout", async () => {
		const result = await bunVersionFromSpawn();

		expect(result.success).toBe(true);
		expect(result.exitCode).toBe(0);
		expect(result.stdout).toMatch(/^\d+\.\d+\.\d+/);
		expect(result.stderr).toBe("");
		expect(result.maxRSS).toBeGreaterThan(0);
	});
});

describe("uppercaseWithSpawn", () => {
	test("passes stdin to a subprocess and reads transformed stdout", async () => {
		const result = await uppercaseWithSpawn("hello spawn");

		expect(result).toMatchObject({
			exitCode: 0,
			stderr: "",
			stdout: "HELLO SPAWN",
			success: true,
		});
	});
});

describe("readEnvWithSpawn", () => {
	test("runs a subprocess with scoped environment variables", async () => {
		const result = await readEnvWithSpawn(
			"BUN_SPAWN_CONCEPT_VALUE",
			"spawned-value",
		);

		expect(result.stdout).toBe("spawned-value");
		expect(result.success).toBe(true);
	});

	test("rejects invalid spawn environment variable names", async () => {
		await expect(readEnvWithSpawn("bad-name", "value")).rejects.toThrow(
			"Invalid environment variable name",
		);
	});
});

describe("bunVersionFromSpawnSync", () => {
	test("runs a sync subprocess when blocking is acceptable", () => {
		const result = bunVersionFromSpawnSync();

		expect(result.success).toBe(true);
		expect(result.exitCode).toBe(0);
		expect(result.stdout).toMatch(/^\d+\.\d+\.\d+/);
		expect(result.maxRSS).toBeGreaterThan(0);
	});
});
