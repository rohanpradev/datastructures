export interface JsonLinesParseResult<T> {
	done: boolean;
	read: number;
	values: T[];
}

/**
 * Strict wrapper around Bun's streaming JSONL parser.
 *
 * `Bun.JSONL.parse()` intentionally supports partial results. That is valuable
 * for streams but surprising for imports that must be all-or-nothing, so this
 * wrapper rejects syntax errors and incomplete trailing records explicitly.
 */
export function parseCompleteJsonLines<T>(
	input: string | Uint8Array,
	validate: (value: unknown) => value is T,
): JsonLinesParseResult<T> {
	const result = Bun.JSONL.parseChunk(input);
	if (result.error) throw result.error;
	if (!result.done)
		throw new Error("JSONL input ends with an incomplete record");
	if (!result.values.every(validate)) {
		throw new Error("JSONL record failed validation");
	}

	return {
		done: result.done,
		read: result.read,
		values: result.values,
	};
}

/**
 * Parses a human-authored JSON5 config and validates the unknown result before
 * it enters the typed application. Parsing syntax never proves domain shape.
 */
export function parseJson5Config<T>(
	input: string,
	validate: (value: unknown) => value is T,
): T {
	const value: unknown = Bun.JSON5.parse(input);
	if (!validate(value)) throw new Error("JSON5 config failed validation");
	return value;
}

/**
 * Renders course notes with raw HTML disabled and stable heading IDs.
 *
 * This reduces obvious script injection but is not a complete HTML sanitizer or
 * URL allowlist. Put untrusted public content through a dedicated policy layer.
 */
export function renderLearningMarkdown(input: string): string {
	return Bun.markdown.html(input, {
		headings: { ids: true },
		noHtmlBlocks: true,
		noHtmlSpans: true,
		tagFilter: true,
	});
}

/** Creates an expiring CSRF token bound to an application secret. */
export function createCsrfToken(secret: string, expiresInMs: number): string {
	if (secret.length < 32)
		throw new Error("CSRF secret must be at least 32 characters");
	if (!Number.isFinite(expiresInMs) || expiresInMs < 1) {
		throw new Error("expiresInMs must be at least 1");
	}

	return Bun.CSRF.generate(secret, { expiresIn: expiresInMs });
}

/**
 * Verifies token signature and age. CSRF tokens complement SameSite cookies and
 * origin checks; they do not replace authentication or authorization.
 */
export function verifyCsrfToken(
	token: string,
	secret: string,
	maxAgeMs: number,
): boolean {
	return Bun.CSRF.verify(token, { maxAge: maxAgeMs, secret });
}

/** Builds a deterministic in-memory tar archive for export/download workflows. */
export async function buildLearningArchive(
	files: Readonly<
		Record<string, string | Blob | ArrayBuffer | Uint8Array<ArrayBuffer>>
	>,
): Promise<Uint8Array> {
	return new Bun.Archive({ ...files }).bytes();
}

/** Reads selected entries without extracting untrusted paths onto the filesystem. */
export async function readLearningArchive(
	bytes: Uint8Array,
	glob: string | readonly string[] = "**",
): Promise<ReadonlyMap<string, string>> {
	const files = await new Bun.Archive(bytes).files(glob);
	const contents = new Map<string, string>();

	// Archive entry order is not an API contract. Sorting keeps CLI output,
	// snapshots, and tests reproducible across platforms and archive producers.
	const entries = [...files].sort(([left], [right]) =>
		left.localeCompare(right),
	);
	for (const [path, file] of entries) contents.set(path, await file.text());
	return contents;
}

/**
 * Previews a UTC cron schedule without registering an in-process or OS job.
 * Scheduling the work is easy; production designs still need idempotency,
 * leader election, misfire policy, monitoring, and retry ownership.
 */
export function nextCronOccurrence(
	expression: string,
	from: Date,
): Date | null {
	return Bun.cron.parse(expression, from);
}
