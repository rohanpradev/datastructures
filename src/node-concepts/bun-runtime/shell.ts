import { $ } from "bun";

const ENV_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/i;

/**
 * Runs a simple Bun Shell command and reads stdout as text.
 *
 * Interview angle:
 * Bun Shell is cross-platform and returns JavaScript-friendly results through
 * .text(), .json(), .blob(), and streams.
 */
export async function bunVersionFromShell(): Promise<string> {
	return (await $`bun --version`.quiet().text()).trim();
}

/**
 * Demonstrates safe interpolation in Bun Shell.
 *
 * Interview angle:
 * Template interpolation is escaped by default, which avoids the classic
 * "user input becomes shell syntax" bug.
 */
export async function safeEcho(value: string): Promise<string> {
	return (await $`echo ${value}`.quiet().text()).trimEnd();
}

/**
 * Runs a command with a per-command environment override.
 *
 * Time: dominated by process startup.
 * Space: O(1).
 */
export async function readEnvWithBunShell(
	name: string,
	value: string,
): Promise<string> {
	if (!ENV_NAME_PATTERN.test(name)) {
		throw new Error(`Invalid environment variable name: ${name}`);
	}

	const script = `console.log(process.env[${JSON.stringify(name)}] ?? "")`;

	return (
		await $`bun -e ${script}`
			.env({ ...process.env, [name]: value })
			.quiet()
			.text()
	).trim();
}
