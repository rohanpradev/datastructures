const ENV_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/i;
const TEXT_TRANSFORM_SCRIPT =
	"const input = await Bun.stdin.text(); process.stdout.write(input.toUpperCase())";

export interface SpawnSummary {
	exitCode: number;
	maxRSS: number | null;
	stderr: string;
	stdout: string;
	success: boolean;
}

function validateEnvName(name: string): void {
	if (!ENV_NAME_PATTERN.test(name)) {
		throw new Error(`Invalid environment variable name: ${name}`);
	}
}

async function summarizeSubprocess(
	proc: Bun.ReadableSubprocess,
): Promise<SpawnSummary> {
	const [stdout, stderr, exitCode] = await Promise.all([
		proc.stdout.text(),
		proc.stderr.text(),
		proc.exited,
	]);
	const usage = proc.resourceUsage();

	return {
		exitCode,
		maxRSS: usage?.maxRSS ?? null,
		stderr: stderr.trimEnd(),
		stdout: stdout.trimEnd(),
		success: exitCode === 0,
	};
}

/**
 * Runs a subprocess asynchronously with explicit stdout/stderr pipes.
 *
 * Interview angle:
 * `Bun.spawn()` accepts command arrays directly, which avoids shell parsing
 * when you do not need shell syntax.
 */
export async function bunVersionFromSpawn(): Promise<SpawnSummary> {
	const proc = Bun.spawn(["bun", "--version"], {
		stderr: "pipe",
		stdout: "pipe",
	});

	return summarizeSubprocess(proc);
}

/**
 * Sends a Blob to a subprocess as stdin and reads stdout back as text.
 */
export async function uppercaseWithSpawn(input: string): Promise<SpawnSummary> {
	const proc = Bun.spawn(["bun", "-e", TEXT_TRANSFORM_SCRIPT], {
		stderr: "pipe",
		stdin: new Blob([input]),
		stdout: "pipe",
	});

	return summarizeSubprocess(proc);
}

/**
 * Runs a subprocess with scoped environment overrides.
 */
export async function readEnvWithSpawn(
	name: string,
	value: string,
): Promise<SpawnSummary> {
	validateEnvName(name);

	const script = `console.log(Bun.env[${JSON.stringify(name)}] ?? "")`;
	const proc = Bun.spawn(["bun", "-e", script], {
		env: { ...Bun.env, [name]: value },
		stderr: "pipe",
		stdout: "pipe",
	});

	return summarizeSubprocess(proc);
}

/**
 * Runs a short command synchronously when blocking the current isolate is
 * acceptable, such as a one-shot CLI check during startup.
 */
export function bunVersionFromSpawnSync(): SpawnSummary {
	const proc = Bun.spawnSync(["bun", "--version"], {
		maxBuffer: 1024 * 1024,
		stderr: "pipe",
		stdout: "pipe",
	});

	return {
		exitCode: proc.exitCode,
		maxRSS: proc.resourceUsage.maxRSS,
		stderr: proc.stderr.toString().trimEnd(),
		stdout: proc.stdout.toString().trimEnd(),
		success: proc.success,
	};
}
