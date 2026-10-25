import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const PROBES = {
	"disk-module": 'console.log((await import("./trusted.ts")).answer);',
	eval: 'console.log(eval("40 + 2"));',
	function: 'console.log(new Function("return 40 + 2")());',
	"data-javascript":
		'console.log((await import("data:text/javascript,export default 42")).default);',
	"data-json":
		'console.log((await import(\'data:application/json,{"answer":42}\', { with: { type: "json" } })).default.answer);',
} as const;

export type CodeGenerationProbe = keyof typeof PROBES;

export interface CodeGenerationResult {
	exitCode: number;
	stderr: string;
	stdout: string;
}

/**
 * Runs one fixed lesson under Bun 1.4.4's strict code-generation policy.
 *
 * Unlike a blacklist of eval APIs, strict mode rejects generated JavaScript
 * regardless of its entry point. JSON remains data and can still be imported.
 * Source execution still permits disk modules: only a compiled executable
 * restricts JavaScript imports to the files embedded during its build.
 *
 * These fixtures are trusted. This flag is not a sandbox: permitted code can
 * still access files, network, and subprocess APIs with the process's rights.
 * The helper deliberately accepts a fixed probe name rather than source text.
 */
export async function runCodeGenerationProbe(
	probe: CodeGenerationProbe,
): Promise<CodeGenerationResult> {
	const temporaryRoot = resolve(tmpdir());
	const directory = await mkdtemp(join(temporaryRoot, "bun-code-generation-"));
	// Verify the generated absolute target before its eventual recursive cleanup.
	if (dirname(resolve(directory)) !== temporaryRoot) {
		throw new Error("Code-generation fixture escaped its temporary root");
	}
	try {
		await Bun.write(join(directory, "trusted.ts"), "export const answer = 42;");
		const entry = join(directory, "probe.ts");
		await Bun.write(entry, PROBES[probe]);
		const child = Bun.spawn(
			[
				process.execPath,
				"--no-env-file",
				"--disallow-code-generation-from-strings=strict",
				entry,
			],
			{
				cwd: directory,
				env: { ...Bun.env, BUN_OPTIONS: "" },
				stderr: "pipe",
				stdout: "pipe",
				timeout: 3_000,
			},
		);
		const [stdout, stderr, exitCode] = await Promise.all([
			child.stdout.text(),
			child.stderr.text(),
			child.exited,
		]);
		return { exitCode, stderr: stderr.trim(), stdout: stdout.trim() };
	} finally {
		await rm(directory, { force: true, recursive: true });
	}
}
