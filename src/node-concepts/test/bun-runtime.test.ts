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
