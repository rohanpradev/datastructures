import { describe, expect, test } from "bun:test";
import { runCodeGenerationProbe } from "@/node-concepts/bun-runtime/code-generation";

describe("runCodeGenerationProbe", () => {
	test("source execution still permits trusted TypeScript modules on disk", async () => {
		const result = await runCodeGenerationProbe("disk-module");
		expect(result).toEqual({ exitCode: 0, stderr: "", stdout: "42" });
	});

	for (const probe of ["eval", "function", "data-javascript"] as const) {
		test(`rejects generated JavaScript through ${probe}`, async () => {
			const result = await runCodeGenerationProbe(probe);
			expect(result.exitCode).not.toBe(0);
			expect(result.stdout).toBe("");
			expect(result.stderr).toContain("EvalError");
			expect(result.stderr).toMatch(/code generation.*disallowed/i);
		});
	}

	test("allows data-URL JSON without treating it as generated JavaScript", async () => {
		const result = await runCodeGenerationProbe("data-json");
		expect(result).toEqual({ exitCode: 0, stderr: "", stdout: "42" });
	});
});
