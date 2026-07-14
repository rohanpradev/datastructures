import { Glob } from "bun";
import { existsSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

export interface MarkdownLink {
	line: number;
	target: string;
}

export interface BrokenMarkdownLink extends MarkdownLink {
	file: string;
	resolvedPath: string;
}

const MARKDOWN_LINK = /!?\[[^\]]*\]\(([^)]+)\)/g;

function targetWithoutTitle(rawTarget: string): string {
	const trimmed = rawTarget.trim();
	if (trimmed.startsWith("<")) {
		const closing = trimmed.indexOf(">");
		return closing === -1 ? trimmed : trimmed.slice(1, closing);
	}

	// Paths containing spaces should use Markdown's <path with spaces> form.
	// A whitespace suffix in the plain form is therefore an optional link title.
	return trimmed.split(/\s+["']/u, 1)[0] ?? trimmed;
}

/** Extracts local and external Markdown links with stable one-based line numbers. */
export function extractMarkdownLinks(markdown: string): MarkdownLink[] {
	const links: MarkdownLink[] = [];

	for (const match of markdown.matchAll(MARKDOWN_LINK)) {
		const target = targetWithoutTitle(match[1] ?? "");
		const beforeMatch = markdown.slice(0, match.index);
		links.push({
			line: beforeMatch.split("\n").length,
			target,
		});
	}

	return links;
}

function isExternalOrAnchor(target: string): boolean {
	return (
		target.length === 0 ||
		target.startsWith("#") ||
		/^(?:https?:|mailto:|data:|app:)/iu.test(target)
	);
}

/**
 * Finds relative Markdown links whose target file or directory does not exist.
 * URL reachability is deliberately separate: network checks are flaky and do
 * not belong in the default local quality gate.
 */
export async function validateMarkdownLinks(
	root = process.cwd(),
): Promise<BrokenMarkdownLink[]> {
	const broken: BrokenMarkdownLink[] = [];
	const markdownFiles = new Set<string>();

	// Separate scans are slightly more verbose than a brace expression, but they
	// also work when a temporary test/course root contains only one top-level file.
	for (const sourcePattern of [
		"README.md",
		"LEARNING_PATH.md",
		"docs/**/*.md",
		"src/**/*.md",
	]) {
		const glob = new Glob(sourcePattern);
		for await (const relativeFile of glob.scan({ cwd: root, onlyFiles: true })) {
			markdownFiles.add(relativeFile);
		}
	}

	for (const relativeFile of [...markdownFiles].sort()) {
		const file = resolve(root, relativeFile);
		const markdown = await Bun.file(file).text();

		for (const link of extractMarkdownLinks(markdown)) {
			if (isExternalOrAnchor(link.target)) continue;

			const pathOnly = link.target.split(/[?#]/u, 1)[0] ?? "";
			let decodedPath: string;
			try {
				decodedPath = decodeURIComponent(pathOnly);
			} catch {
				decodedPath = pathOnly;
			}
			const resolvedPath = resolve(dirname(file), decodedPath);

			if (!existsSync(resolvedPath)) {
				broken.push({
					...link,
					file: relative(root, file).replaceAll("\\", "/"),
					resolvedPath,
				});
			}
		}
	}

	return broken.sort(
		(left, right) =>
			left.file.localeCompare(right.file) || left.line - right.line,
	);
}

if (import.meta.main) {
	const broken = await validateMarkdownLinks();
	if (broken.length === 0) {
		console.log("Validated local links in course Markdown.");
	} else {
		for (const link of broken) {
			console.error(`${link.file}:${link.line} -> ${link.target}`);
		}
		console.error(`Found ${broken.length} broken local Markdown link(s).`);
		process.exitCode = 1;
	}
}
