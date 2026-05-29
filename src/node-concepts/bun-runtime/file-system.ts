import { Glob } from "bun";

/**
 * Lightweight metadata returned from a BunFile reference.
 */
export interface BunFileSummary {
	exists: boolean;
	size: number;
	type: string;
}

/**
 * Reads and parses JSON with Bun.file().
 *
 * Interview angle:
 * Bun.file() creates a lazy file reference. The read only happens when you call
 * .json(), .text(), .arrayBuffer(), .stream(), or .bytes().
 *
 * Time: O(n), where n is the file size.
 * Space: O(n), because the parsed JSON must be held in memory.
 */
export async function readJsonFile<T>(path: string | URL): Promise<T> {
	const file = Bun.file(path, { type: "application/json" });

	if (!(await file.exists())) {
		throw new Error(`File not found: ${path.toString()}`);
	}

	return (await file.json()) as T;
}

/**
 * Writes pretty JSON with Bun.write().
 *
 * Interview angle:
 * Bun.write() accepts strings, Blob/BunFile, ArrayBuffer, typed arrays, and
 * Response objects, so it is a practical replacement for many small fs helpers.
 *
 * Time: O(n), where n is the serialized JSON length.
 * Space: O(n), for the serialized JSON string.
 */
export async function writeJsonFile(
	path: string | URL,
	value: unknown,
): Promise<number> {
	return Bun.write(path, `${JSON.stringify(value, null, 2)}\n`);
}

/**
 * Copies a file by passing a BunFile directly into Bun.write().
 *
 * Time: O(n), where n is the source file size.
 * Space: O(1) at the JavaScript level because Bun handles the file transfer.
 */
export async function copyFileWithBun(
	source: string | URL,
	destination: string | URL,
): Promise<number> {
	const sourceFile = Bun.file(source);

	if (!(await sourceFile.exists())) {
		throw new Error(`Source file not found: ${source.toString()}`);
	}

	return Bun.write(destination, sourceFile);
}

/**
 * Returns file metadata without forcing callers to read the file contents.
 *
 * Time: O(1) for metadata lookup.
 * Space: O(1).
 */
export async function summarizeFile(
	path: string | URL,
): Promise<BunFileSummary> {
	const file = Bun.file(path);

	return {
		exists: await file.exists(),
		size: file.size,
		type: file.type,
	};
}

/**
 * Scans files with Bun.Glob and returns stable, POSIX-style relative paths.
 *
 * Interview angle:
 * Glob scanning is common in CLIs, build tools, test runners, and static-site
 * generators. Sorting makes tests and CI deterministic.
 *
 * Time: O(n log n), where n is the number of matched files.
 * Space: O(n), for the returned file list.
 */
export async function scanFiles(
	root: string,
	pattern: string,
	options: { dot?: boolean } = {},
): Promise<string[]> {
	const glob = new Glob(pattern);
	const files: string[] = [];

	for await (const file of glob.scan({
		cwd: root,
		dot: options.dot ?? false,
		onlyFiles: true,
	})) {
		files.push(file.replaceAll("\\", "/"));
	}

	return files.sort();
}

/**
 * Checks whether one path matches a glob pattern without scanning the file
 * system. Useful for filtering changed files in scripts.
 *
 * Time: O(m), where m is the path length.
 * Space: O(1).
 */
export function matchesGlob(pattern: string, path: string): boolean {
	return new Glob(pattern).match(path);
}
