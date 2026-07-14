import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { extractMarkdownLinks, validateMarkdownLinks } from "./validate-docs";

let testRoot = "";

afterEach(async () => {
	if (testRoot) await rm(testRoot, { force: true, recursive: true });
	testRoot = "";
});

describe("Markdown course link validation", () => {
	test("extracts links with one-based line numbers", () => {
		expect(
			extractMarkdownLinks(
				"# Guide\n\nRead [local](./topic.md) and [web](https://bun.com/docs).",
			),
		).toEqual([
			{ line: 3, target: "./topic.md" },
			{ line: 3, target: "https://bun.com/docs" },
		]);
	});

	test("reports missing local files while ignoring URLs and anchors", async () => {
		testRoot = await mkdtemp(join(tmpdir(), "docs-check-"));
		await Bun.write(join(testRoot, "README.md"), [
			"[good](./docs/topic.md)",
			"[missing](./docs/missing.md#section)",
			"[anchor](#local)",
			"[web](https://bun.com/docs)",
		].join("\n"));
		await Bun.write(join(testRoot, "docs", "topic.md"), "# Topic\n");

		const broken = await validateMarkdownLinks(testRoot);

		expect(broken).toHaveLength(1);
		expect(broken[0]).toMatchObject({
			file: "README.md",
			line: 2,
			target: "./docs/missing.md#section",
		});
	});
});
