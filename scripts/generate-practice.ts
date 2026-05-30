#!/usr/bin/env bun
/**
 * Focused Practice Template Generator
 *
 * Default behavior is intentionally narrow: pick one problem, generate the
 * matching empty implementation module and a focused test file for that
 * problem only.
 *
 * Useful commands:
 * - bun run practice
 * - bun run practice -- --list heap
 * - bun run practice -- --problem kthLargestElement
 * - bun run practice -- --all --clean
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { basename, dirname, join, relative } from "node:path";

const SRC_DIR = join(process.cwd(), "src");
const PRACTICE_DIR = join(process.cwd(), "practice");

const EXCLUDE_PATTERNS = [
	/\.test\.ts$/,
	/tests?/,
	/index\.ts$/,
	/node_modules/,
];

type CliOptions = {
	all: boolean;
	clean: boolean;
	help: boolean;
	listQuery: string | null;
	manifest: boolean;
	problemQuery: string | null;
	randomQuery: string | null;
	smokeTest: boolean;
	validateAll: boolean;
	auditTargets: boolean;
};

type ImportSymbol = {
	localName: string;
	importedName: string;
	importPath: string;
};

type LocalImport = {
	importPath: string;
	statement: string;
	symbols: ImportSymbol[];
};

type RunnableBlockKind = "describe" | "test" | "it";
type RunnableBlockModifier = "only" | "skip" | "todo" | null;

type DescribeBlock = {
	kind: RunnableBlockKind;
	modifier: RunnableBlockModifier;
	title: string;
	start: number;
	end: number;
	text: string;
};

type PracticeTarget = {
	id: number;
	difficulty: PracticeDifficulty;
	pattern: PracticePattern;
	title: string;
	slug: string;
	topic: string;
	testFile: string;
	sourceFiles: string[];
	testBlocks: DescribeBlock[];
	testRelativePath: string;
	sourceRelativePaths: string[];
	targetImportPaths: string[];
	targetSymbols: ImportSymbol[];
};

type PracticeDifficulty = "easy" | "medium" | "hard";
type PracticePattern =
	| "async backend"
	| "backtracking"
	| "binary search"
	| "bun runtime"
	| "dynamic programming"
	| "graph"
	| "hash map"
	| "heap"
	| "implementation"
	| "recursion"
	| "sorting"
	| "stack"
	| "sliding window"
	| "tree"
	| "two pointers"
	| "prefix sum";

type PracticeManifestEntry = {
	id: number;
	title: string;
	slug: string;
	topic: string;
	pattern: PracticePattern;
	difficulty: PracticeDifficulty;
	learningObjectives: string[];
	learnerChecklist: string[];
	complexityPrompt: string;
	test: string;
	sources: string[];
	exports: string[];
};

type ExportInfo = {
	localName: string;
	exportedName: string;
	isDefault: boolean;
};

function shouldProcess(filePath: string): boolean {
	const relativePath = relative(SRC_DIR, filePath);
	return !EXCLUDE_PATTERNS.some((pattern) => pattern.test(relativePath));
}

function parseArgs(args: string[]): CliOptions {
	const options: CliOptions = {
		all: false,
		clean: false,
		help: false,
		listQuery: null,
		manifest: false,
		problemQuery: null,
		randomQuery: null,
		smokeTest: false,
		validateAll: false,
		auditTargets: false,
	};

	for (let index = 0; index < args.length; index++) {
		const arg = args[index]!;

		if (arg === "--all") {
			options.all = true;
		} else if (arg === "--validate-all-focused") {
			options.validateAll = true;
		} else if (arg === "--audit-targets") {
			options.auditTargets = true;
		} else if (arg === "--smoke-test") {
			options.smokeTest = true;
		} else if (arg === "--manifest") {
			options.manifest = true;
		} else if (arg === "--clean") {
			options.clean = true;
		} else if (arg === "--help" || arg === "-h") {
			options.help = true;
		} else if (arg === "--list") {
			const next = args[index + 1];
			if (next && !next.startsWith("--")) {
				options.listQuery = next;
				index++;
			} else {
				options.listQuery = "";
			}
		} else if (arg.startsWith("--list=")) {
			options.listQuery = arg.slice("--list=".length);
		} else if (arg === "--random" || arg === "-r") {
			const next = args[index + 1];
			if (next && !next.startsWith("--")) {
				options.randomQuery = next;
				index++;
			} else {
				options.randomQuery = "";
			}
		} else if (arg.startsWith("--random=")) {
			options.randomQuery = arg.slice("--random=".length);
		} else if (arg === "--problem" || arg === "-p") {
			const next = args[index + 1];
			if (!next || next.startsWith("--")) {
				throw new Error("--problem requires a search term");
			}
			options.problemQuery = next;
			index++;
		} else if (arg.startsWith("--problem=")) {
			options.problemQuery = arg.slice("--problem=".length);
		} else if (!arg.startsWith("--") && options.problemQuery === null) {
			options.problemQuery = arg;
		}
	}

	return options;
}

function printHelp(): void {
	console.log(`Focused practice generator

Usage:
  bun run practice
  bun run practice -- --list [search]
  bun run practice -- --problem <search>
  bun run practice -- --random [search]
  bun run practice -- --manifest
  bun run practice -- --all --clean
  bun run practice -- --validate-all-focused
  bun run practice -- --audit-targets
  bun run practice -- --smoke-test

Default:
  Interactive search and pick one problem.

Options:
  --list [search]      List available focused practice targets.
  --problem <search>   Generate the best matching target non-interactively.
  --random [search]    Generate one random target, optionally filtered.
  --manifest           Write practice/practice-manifest.json for dashboards.
  --all                Generate every template and every test file.
  --validate-all-focused
                       Generate every focused target into isolated folders.
  --audit-targets      Check that focused targets map cleanly to main exports.
  --smoke-test         Exercise parser/filter edge cases that can leak tests.
  --clean              Remove practice/ before generating.
  --help               Show this help text.
`);
}

function extractFunctionInfo(content: string): Array<{
	comment: string;
	signature: string;
	name: string;
	isExported: boolean;
}> {
	const functions: Array<{
		comment: string;
		signature: string;
		name: string;
		isExported: boolean;
	}> = [];

	const functionRegex =
		/(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*(?:<[^>{]+>)?\s*\(/g;

	let match;
	while ((match = functionRegex.exec(content)) !== null) {
		const openBraceIndex = content.indexOf("{", match.index);
		if (openBraceIndex === -1) continue;

		const signature = content.slice(match.index, openBraceIndex).trim();
		const functionName = match[1];
		const beforeFunction = content.slice(0, match.index);
		const commentMatch = beforeFunction.match(
			/\/\*\*(?:(?!\/\*\*)[\s\S])*?\*\/\s*$/,
		);
		const comment = commentMatch ? commentMatch[0].trimEnd() : "";

		functions.push({
			comment,
			signature,
			name: functionName || "unknown",
			isExported: signature.startsWith("export "),
		});

		const closeBraceIndex = findMatchingBrace(content, openBraceIndex);
		if (closeBraceIndex !== -1) {
			functionRegex.lastIndex = closeBraceIndex + 1;
		}
	}

	return functions;
}

function extractConstFunctionInfo(content: string): Array<{
	comment: string;
	signature: string;
	name: string;
	isExported: boolean;
}> {
	const functions: Array<{
		comment: string;
		signature: string;
		name: string;
		isExported: boolean;
	}> = [];
	const constRegex =
		/(\/\*\*(?:(?!\/\*\*)[\s\S])*?\*\/\s*)?((?:export\s+)?const\s+(\w+)\s*(?::\s*[^=]+)?=\s*(?:async\s*)?(?:<[^>{]+>\s*)?\([^)]*\)\s*(?::\s*[^=]+)?=>)/g;

	let match;
	while ((match = constRegex.exec(content)) !== null) {
		const signature = match[2]?.trim() ?? "";
		const functionName = match[3];
		const comment = match[1]?.trimEnd() ?? "";

		functions.push({
			comment,
			signature,
			name: functionName || "unknown",
			isExported: signature.startsWith("export "),
		});
	}

	return functions;
}

function extractClassInfo(content: string): Array<{
	comment: string;
	signature: string;
	name: string;
	isExported: boolean;
	fields: string[];
	methods: Array<{ comment: string; signature: string }>;
}> {
	const classes: Array<{
		comment: string;
		signature: string;
		name: string;
		isExported: boolean;
		fields: string[];
		methods: Array<{ comment: string; signature: string }>;
	}> = [];

	const classRegex = /(?:export\s+(?:default\s+)?)?class\s+\w+[^{]*\{/g;

	let match;
	while ((match = classRegex.exec(content)) !== null) {
		const openBraceIndex = content.indexOf("{", match.index);
		const closeBraceIndex = findMatchingBrace(content, openBraceIndex);
		if (closeBraceIndex === -1) continue;

		const beforeClass = content.slice(0, match.index);
		const classCommentMatch = beforeClass.match(
			/\/\*\*(?:(?!\/\*\*)[\s\S])*?\*\/\s*$/,
		);
		const classComment = classCommentMatch ? classCommentMatch[0].trimEnd() : "";
		const classSignature = match[0].slice(0, -1).trim();
		const className = getClassName(classSignature);
		const classBody = content.slice(openBraceIndex + 1, closeBraceIndex);
		const fields = extractClassFields(classBody);
		const methods = extractClassMethods(classBody);

		classes.push({
			comment: classComment,
			signature: classSignature,
			name: className,
			isExported: classSignature.startsWith("export "),
			fields,
			methods,
		});

		classRegex.lastIndex = closeBraceIndex + 1;
	}

	return classes;
}

function extractClassFields(classBody: string): string[] {
	const fields: string[] = [];
	let statementStart = 0;
	let depth = 0;
	let state: "code" | "line-comment" | "block-comment" | "string" = "code";
	let quote = "";

	for (let index = 0; index < classBody.length; index++) {
		const char = classBody[index];
		const next = classBody[index + 1];

		if (state === "line-comment") {
			if (char === "\n") state = "code";
			continue;
		}

		if (state === "block-comment") {
			if (char === "*" && next === "/") {
				state = "code";
				index++;
			}
			continue;
		}

		if (state === "string") {
			if (char === "\\") {
				index++;
				continue;
			}
			if (char === quote) {
				state = "code";
			}
			continue;
		}

		if (char === "/" && next === "/") {
			state = "line-comment";
			index++;
			continue;
		}

		if (char === "/" && next === "*") {
			state = "block-comment";
			index++;
			continue;
		}

		if (char === '"' || char === "'" || char === "`") {
			state = "string";
			quote = char;
			continue;
		}

		if (char === "{") {
			depth++;
			continue;
		}

		if (char === "}") {
			depth--;
			if (depth === 0) statementStart = index + 1;
			continue;
		}

		if (char !== ";" || depth !== 0) continue;

		const candidate = classBody.slice(statementStart, index + 1).trim();
		statementStart = index + 1;
		const field = candidate
			.replace(/^\/\*\*(?:(?!\/\*\*)[\s\S])*?\*\/\s*/, "")
			.trim();

		if (isClassFieldDeclaration(field)) {
			fields.push(field);
		}
	}

	return fields;
}

function isClassFieldDeclaration(value: string): boolean {
	return /^(?:(?:public|private|protected)\s+)?(?:readonly\s+)?[#A-Za-z_$]\w*[!?]?\s*(?::[^;=]+)?(?:=\s*[^;]+)?;$/.test(
		value,
	);
}

function findMatchingBrace(content: string, openBraceIndex: number): number {
	return findMatchingDelimiter(content, openBraceIndex, "{", "}");
}

function findMatchingDelimiter(
	content: string,
	openIndex: number,
	openChar: string,
	closeChar: string,
): number {
	if (content[openIndex] !== openChar) return -1;

	let depth = 0;
	let state: "code" | "line-comment" | "block-comment" | "string" = "code";
	let quote = "";

	for (let index = openIndex; index < content.length; index++) {
		const char = content[index];
		const next = content[index + 1];

		if (state === "line-comment") {
			if (char === "\n") state = "code";
			continue;
		}

		if (state === "block-comment") {
			if (char === "*" && next === "/") {
				state = "code";
				index++;
			}
			continue;
		}

		if (state === "string") {
			if (char === "\\") {
				index++;
				continue;
			}
			if (char === quote) {
				state = "code";
			}
			continue;
		}

		if (char === "/" && next === "/") {
			state = "line-comment";
			index++;
			continue;
		}

		if (char === "/" && next === "*") {
			state = "block-comment";
			index++;
			continue;
		}

		if (char === '"' || char === "'" || char === "`") {
			state = "string";
			quote = char;
			continue;
		}

		if (char === openChar) {
			depth++;
			continue;
		}

		if (char === closeChar) {
			depth--;
			if (depth === 0) return index;
		}
	}

	return -1;
}

function extractClassMethods(
	classBody: string,
): Array<{ comment: string; signature: string }> {
	const methods: Array<{ comment: string; signature: string }> = [];
	const methodRegex =
		/(\/\*\*(?:(?!\/\*\*)[\s\S])*?\*\/\s*)?((?:constructor\s*\([^)]*\))|(?:(?:public|private|protected)\s*)?(?:static\s+)?\w+\s*(?:<[^>{]+>)?\s*\([^)]*\)\s*:\s*[^{]+)(?=\s*\{)/g;

	let match;
	while ((match = methodRegex.exec(classBody)) !== null) {
		const comment = match[1]?.trimEnd() ?? "";
		const signature = match[2]?.trim() ?? "";

		if (signature.length === 0) continue;

		methods.push({ comment, signature });
	}

	return methods;
}

function getClassName(signature: string): string {
	const match = signature.match(/class\s+(\w+)/);
	return match?.[1] ?? "";
}

function collectExportInfo(content: string): ExportInfo[] {
	const exports: ExportInfo[] = [];

	for (const match of content.matchAll(
		/export\s+(?:async\s+)?function\s+(\w+)/g,
	)) {
		const name = match[1]!;
		exports.push({ localName: name, exportedName: name, isDefault: false });
	}

	for (const match of content.matchAll(/export\s+const\s+(\w+)/g)) {
		const name = match[1]!;
		exports.push({ localName: name, exportedName: name, isDefault: false });
	}

	for (const match of content.matchAll(/export\s+class\s+(\w+)/g)) {
		const name = match[1]!;
		exports.push({ localName: name, exportedName: name, isDefault: false });
	}

	for (const match of content.matchAll(/export\s+default\s+class\s+(\w+)/g)) {
		const name = match[1]!;
		exports.push({ localName: name, exportedName: "default", isDefault: true });
	}

	for (const match of content.matchAll(/export\s+default\s+(\w+)\s*;/g)) {
		const name = match[1]!;
		exports.push({ localName: name, exportedName: "default", isDefault: true });
	}

	for (const match of content.matchAll(/export\s+\{([^}]+)\};/g)) {
		for (const rawPart of match[1]!.split(",")) {
			const part = rawPart.trim();
			if (!part) continue;

			const aliasParts = part.split(/\s+as\s+/);
			const localName = aliasParts[0]!.trim();
			const exportedName = (aliasParts[1] ?? aliasParts[0])!.trim();

			exports.push({ localName, exportedName, isDefault: false });
		}
	}

	return uniqueExportInfo(exports);
}

function uniqueExportInfo(exports: ExportInfo[]): ExportInfo[] {
	const seen = new Set<string>();
	const result: ExportInfo[] = [];

	for (const exportInfo of exports) {
		const key = `${exportInfo.localName}:${exportInfo.exportedName}`;
		if (seen.has(key)) continue;

		seen.add(key);
		result.push(exportInfo);
	}

	return result;
}

function findExportInfo(
	exports: ExportInfo[],
	localName: string,
	allowedExports?: Set<string>,
): ExportInfo | null {
	const matches = exports.filter((exportInfo) => exportInfo.localName === localName);
	if (matches.length === 0) return null;

	if (allowedExports) {
		return (
			matches.find(
				(exportInfo) =>
					allowedExports.has(exportInfo.localName) ||
					allowedExports.has(exportInfo.exportedName),
			) ?? null
		);
	}

	return matches.find((exportInfo) => exportInfo.isDefault) ?? matches[0]!;
}

function shouldGenerateDeclaration(
	localName: string,
	isDirectExport: boolean,
	exportInfo: ExportInfo | null,
	allowedExports?: Set<string>,
): boolean {
	if (allowedExports) {
		return (
			allowedExports.has(localName) ||
			(exportInfo !== null &&
				(allowedExports.has(exportInfo.localName) ||
					allowedExports.has(exportInfo.exportedName)))
		);
	}

	return isDirectExport || exportInfo !== null;
}

function makeExportedSignature(
	signature: string,
	isDirectExport: boolean,
	exportInfo: ExportInfo | null,
): string {
	if (isDirectExport) return signature;
	if (exportInfo?.isDefault) return `export default ${signature}`;
	return `export ${signature}`;
}

function generatePracticeTemplate(
	content: string,
	filePath: string,
	allowedExports?: Set<string>,
): string {
	const relativePath = relative(SRC_DIR, filePath);

	let template = `/**
 * Practice Template: ${relativePath}
 *
 * This file contains empty implementations for the selected source module.
 * A focused generated test will call only the problem you selected.
 */

`;

	const importRegex = /^import\s+.*?;$/gm;
	const imports = content.match(importRegex);
	if (imports) {
		template += imports.join("\n") + "\n\n";
	}

	const typeRegex =
		/^export\s+(?:type|interface)\s+[\s\S]*?(?=\n(?:export|\/\*\*|$))/gm;
	const types = content.match(typeRegex);
	if (types) {
		template += types.join("\n\n") + "\n\n";
	}

	const exportInfos = collectExportInfo(content);
	const functions = extractFunctionInfo(content);
	for (const func of functions) {
		const exportInfo = findExportInfo(exportInfos, func.name, allowedExports);
		if (
			!shouldGenerateDeclaration(
				func.name,
				func.isExported,
				exportInfo,
				allowedExports,
			)
		) {
			continue;
		}

		template += `${func.comment}\n`;
		template += `${makeExportedSignature(func.signature, func.isExported, exportInfo)} {\n`;
		template += `\t// TODO: Implement ${func.name}\n`;
		template += `\tthrow new Error("Not implemented: ${func.name}");\n`;
		template += `}\n\n`;
	}

	const constFunctions = extractConstFunctionInfo(content);
	for (const func of constFunctions) {
		const exportInfo = findExportInfo(exportInfos, func.name, allowedExports);
		if (
			!shouldGenerateDeclaration(
				func.name,
				func.isExported,
				exportInfo,
				allowedExports,
			)
		) {
			continue;
		}

		template += `${func.comment}\n`;
		template += `${makeExportedSignature(func.signature, func.isExported, exportInfo)} {\n`;
		template += `\t// TODO: Implement ${func.name}\n`;
		template += `\tthrow new Error("Not implemented: ${func.name}");\n`;
		template += `};\n\n`;
	}

	const classes = extractClassInfo(content);
	for (const cls of classes) {
		const exportInfo = findExportInfo(exportInfos, cls.name, allowedExports);
		if (
			!shouldGenerateDeclaration(
				cls.name,
				cls.isExported,
				exportInfo,
				allowedExports,
			)
		) {
			continue;
		}

		template += `${cls.comment}\n`;
		template += `${makeExportedSignature(cls.signature, cls.isExported, exportInfo)} {\n`;
		for (const field of cls.fields) {
			template += `\t${field}\n`;
		}
		if (cls.fields.length > 0) template += "\n";
		if (!cls.methods.some((method) => method.signature.startsWith("constructor"))) {
			template += `\tconstructor(..._args: unknown[]) {\n`;
			template += `\t\tthrow new Error("Not implemented");\n`;
			template += `\t}\n\n`;
		}
		for (const method of cls.methods) {
			template += `\t${method.comment}\n`;
			template += `\t${method.signature} {\n`;
			template += `\t\tthrow new Error("Not implemented");\n`;
			template += `\t}\n\n`;
		}
		template += `}\n\n`;
	}

	return template;
}

function walkFiles(directory: string): string[] {
	const result: string[] = [];

	for (const item of readdirSync(directory)) {
		const fullPath = join(directory, item);
		const stat = statSync(fullPath);

		if (stat.isDirectory()) {
			result.push(...walkFiles(fullPath));
		} else {
			result.push(fullPath);
		}
	}

	return result;
}

async function processDirectory(srcPath: string) {
	const items = readdirSync(srcPath);

	for (const item of items) {
		const fullPath = join(srcPath, item);
		const stat = statSync(fullPath);

		if (stat.isDirectory()) {
			await processDirectory(fullPath);
		} else if (item.endsWith(".ts") && shouldProcess(fullPath)) {
			const content = await Bun.file(fullPath).text();
			const relativePath = relative(SRC_DIR, fullPath);
			const practiceFilePath = join(PRACTICE_DIR, relativePath);
			const practiceDir = dirname(practiceFilePath);

			if (!existsSync(practiceDir)) {
				await mkdir(practiceDir, { recursive: true });
			}

			await Bun.write(
				practiceFilePath,
				generatePracticeTemplate(content, fullPath),
			);

			console.log(`Generated: ${relativePath}`);
		}
	}
}

async function copyTestFiles(srcDir: string) {
	const items = readdirSync(srcDir);

	for (const item of items) {
		const fullPath = join(srcDir, item);
		const stat = statSync(fullPath);

		if (stat.isDirectory()) {
			await copyTestFiles(fullPath);
			continue;
		}

		if (!item.endsWith(".test.ts")) continue;

		const content = await Bun.file(fullPath).text();
		const relativePath = relative(SRC_DIR, fullPath);
		const practiceTestPath = join(PRACTICE_DIR, relativePath);
		const importPaths = Array.from(
			content.matchAll(/from\s+["']@\/([^"']+)["']/g),
			(match) => match[1],
		);

		if (importPaths.length === 0) {
			console.log(`Skipped test (no local imports): ${relativePath}`);
			continue;
		}

		const missingImport = await findMissingPracticeImport(importPaths);
		if (missingImport) {
			console.log(`Skipped test (no implementation): ${missingImport}`);
			continue;
		}

		const rewrittenContent = rewriteAllTestImports(content, practiceTestPath);

		await mkdir(dirname(practiceTestPath), { recursive: true });
		await Bun.write(practiceTestPath, rewrittenContent);

		console.log(`Copied test: ${relativePath}`);
	}
}

async function findMissingPracticeImport(
	importPaths: string[],
): Promise<string | null> {
	for (const importPath of importPaths) {
		const practiceModulePath = join(PRACTICE_DIR, `${importPath}.ts`);
		if (!(await Bun.file(practiceModulePath).exists())) {
			return importPath;
		}
	}

	return null;
}

function rewriteAllTestImports(content: string, practiceTestPath: string): string {
	return rewriteTestImports(content, practiceTestPath, null);
}

function rewriteTestImports(
	content: string,
	practiceTestPath: string,
	targetImportPaths: Set<string> | null,
): string {
	return content.replace(/from\s+["']@\/([^"']+)["']/g, (match, importPath: string) => {
		if (targetImportPaths !== null && !targetImportPaths.has(importPath)) {
			return match;
		}

		const targetPathWithoutExtension = join(PRACTICE_DIR, importPath);
		let relativeImport = relative(
			dirname(practiceTestPath),
			targetPathWithoutExtension,
		).replaceAll("\\", "/");

		if (!relativeImport.startsWith(".")) {
			relativeImport = `./${relativeImport}`;
		}

		return `from "${relativeImport}"`;
	});
}

function parseLocalImports(content: string): LocalImport[] {
	const imports: LocalImport[] = [];
	const importRegex = /^import\s+([^;]*?)\s+from\s+["']@\/([^"']+)["'];/gm;

	let match;
	while ((match = importRegex.exec(content)) !== null) {
		const statement = match[0];
		const specifier = match[1]!.trim();
		const importPath = match[2]!;

		imports.push({
			importPath,
			statement,
			symbols: parseImportSymbols(specifier, importPath),
		});
	}

	return imports;
}

function parseImportSymbols(specifier: string, importPath: string): ImportSymbol[] {
	const symbols: ImportSymbol[] = [];
	let remaining = specifier.replace(/^type\s+/, "").trim();

	const namedStart = remaining.indexOf("{");
	if (namedStart > 0) {
		const defaultName = remaining.slice(0, namedStart).replace(/,$/, "").trim();
		if (defaultName) {
			symbols.push({
				localName: defaultName,
				importedName: "default",
				importPath,
			});
		}
		remaining = remaining.slice(namedStart);
	}

	if (!remaining.startsWith("{")) {
		if (remaining.startsWith("* as ")) {
			const namespaceName = remaining.slice("* as ".length).trim();
			symbols.push({
				localName: namespaceName,
				importedName: "*",
				importPath,
			});
		} else if (remaining.length > 0) {
			symbols.push({
				localName: remaining,
				importedName: "default",
				importPath,
			});
		}
		return symbols;
	}

	const namedEnd = remaining.lastIndexOf("}");
	if (namedEnd === -1) return symbols;

	const namedContent = remaining.slice(1, namedEnd);
	for (const rawPart of namedContent.split(",")) {
		const part = rawPart.trim().replace(/^type\s+/, "");
		if (!part) continue;

		const aliasParts = part.split(/\s+as\s+/);
		const importedName = aliasParts[0]!.trim();
		const localName = (aliasParts[1] ?? aliasParts[0])!.trim();

		symbols.push({ localName, importedName, importPath });
	}

	return symbols;
}

function parseTopLevelRunnableBlocks(content: string): DescribeBlock[] {
	const blocks: DescribeBlock[] = [];
	const runnableRegex = /\b(describe|test|it)\b/g;
	let topLevelEnd = -1;
	let match;

	while ((match = runnableRegex.exec(content)) !== null) {
		if (match.index < topLevelEnd) continue;
		if (!isCodeAtTopLevel(content, match.index)) continue;

		const block = parseTopLevelRunnableBlockAt(
			content,
			match.index,
			match[1] as RunnableBlockKind,
		);
		if (!block) continue;

		blocks.push(block);
		topLevelEnd = block.end;
		runnableRegex.lastIndex = block.end;
	}

	return blocks;
}

function parseTopLevelRunnableBlockAt(
	content: string,
	start: number,
	kind: RunnableBlockKind,
): DescribeBlock | null {
	let cursor = start + kind.length;
	let modifier: RunnableBlockModifier = null;

	while (true) {
		cursor = skipWhitespace(content, cursor);
		if (content[cursor] !== ".") break;

		const propertyMatch = content
			.slice(cursor + 1)
			.match(/^(only|skip|todo|each)\b/);
		if (!propertyMatch) return null;

		const property = propertyMatch[1]!;
		cursor += property.length + 1;

		if (property === "only" || property === "skip" || property === "todo") {
			modifier = property;
			continue;
		}

		cursor = skipWhitespace(content, cursor);
		if (content[cursor] !== "(") return null;

		const eachCloseIndex = findMatchingDelimiter(content, cursor, "(", ")");
		if (eachCloseIndex === -1) return null;
		cursor = eachCloseIndex + 1;
	}

	cursor = skipWhitespace(content, cursor);
	if (content[cursor] !== "(") return null;

	const titleStart = skipWhitespace(content, cursor + 1);
	const title = parseStringLiteral(content, titleStart);
	if (!title) return null;

	const closeParenIndex = findMatchingDelimiter(content, cursor, "(", ")");
	if (closeParenIndex === -1) return null;

	let end = closeParenIndex + 1;
	while (/\s/.test(content[end] ?? "")) end++;
	if (content[end] === ";") end++;

	return {
		kind,
		modifier,
		title: title.value,
		start,
		end,
		text: content.slice(start, end),
	};
}

function parseStringLiteral(
	content: string,
	start: number,
): { value: string; end: number } | null {
	const quote = content[start];
	if (quote !== '"' && quote !== "'" && quote !== "`") return null;

	let value = "";
	for (let index = start + 1; index < content.length; index++) {
		const char = content[index];

		if (char === "\\") {
			value += content.slice(index, index + 2);
			index++;
			continue;
		}

		if (char === quote) {
			return { value, end: index + 1 };
		}

		value += char;
	}

	return null;
}

function skipWhitespace(content: string, start: number): number {
	let index = start;
	while (/\s/.test(content[index] ?? "")) index++;
	return index;
}

function isCodeAtTopLevel(content: string, targetIndex: number): boolean {
	let nesting = 0;
	let state: "code" | "line-comment" | "block-comment" | "string" = "code";
	let quote = "";

	for (let index = 0; index < targetIndex; index++) {
		const char = content[index];
		const next = content[index + 1];

		if (state === "line-comment") {
			if (char === "\n") state = "code";
			continue;
		}

		if (state === "block-comment") {
			if (char === "*" && next === "/") {
				state = "code";
				index++;
			}
			continue;
		}

		if (state === "string") {
			if (char === "\\") {
				index++;
				continue;
			}
			if (char === quote) {
				state = "code";
			}
			continue;
		}

		if (char === "/" && next === "/") {
			state = "line-comment";
			index++;
			continue;
		}

		if (char === "/" && next === "*") {
			state = "block-comment";
			index++;
			continue;
		}

		if (char === '"' || char === "'" || char === "`") {
			state = "string";
			quote = char;
			continue;
		}

		if (char === "{" || char === "(" || char === "[") {
			nesting++;
			continue;
		}

		if (char === "}" || char === ")" || char === "]") {
			nesting--;
		}
	}

	return state === "code" && nesting === 0;
}

function filterToTestBlocks(
	content: string,
	selectedBlocks: DescribeBlock[],
): string {
	const blocks = parseTopLevelRunnableBlocks(content);
	const selectedKeys = new Set(
		selectedBlocks.map((block) => `${block.start}:${block.end}`),
	);
	let result = "";
	let cursor = 0;

	for (const block of blocks) {
		result += content.slice(cursor, block.start);
		if (selectedKeys.has(`${block.start}:${block.end}`)) {
			result += content.slice(block.start, block.end);
		}
		cursor = block.end;
	}

	result += content.slice(cursor);
	return result.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function discoverPracticeTargets(): PracticeTarget[] {
	const testFiles = walkFiles(SRC_DIR).filter((filePath) =>
		filePath.endsWith(".test.ts"),
	);
	const targets: PracticeTarget[] = [];
	const usedSlugs = new Map<string, number>();

	for (const testFile of testFiles) {
		const content = readFileSync(testFile, "utf8");
		const imports = parseLocalImports(content);
		const runnableBlocks = parseTopLevelRunnableBlocks(content);
		const describes = runnableBlocks.filter(
			(block) => block.kind === "describe" && isSelectablePracticeBlock(block),
		);

		for (const describeBlock of describes) {
			if (isRouteIntegrationTarget(describeBlock, imports)) continue;

			const targetSymbols = chooseTargetSymbols(
				describeBlock,
				imports,
				testFile,
			);
			if (targetSymbols.length === 0) continue;

			addPracticeTarget(
				targets,
				usedSlugs,
				testFile,
				describeBlock.title,
				[describeBlock],
				targetSymbols,
			);
		}

		const looseTestGroups = new Map<
			string,
			{ blocks: DescribeBlock[]; targetSymbols: ImportSymbol[] }
		>();
		for (const testBlock of runnableBlocks.filter(
			(block) =>
				(block.kind === "test" || block.kind === "it") &&
				isSelectablePracticeBlock(block),
		)) {
			if (isRouteIntegrationTarget(testBlock, imports)) continue;

			const targetSymbols = chooseTargetSymbols(testBlock, imports, testFile);
			if (targetSymbols.length === 0) continue;

			const key = symbolGroupKey(targetSymbols);
			const group = looseTestGroups.get(key) ?? {
				blocks: [],
				targetSymbols,
			};
			group.blocks.push(testBlock);
			looseTestGroups.set(key, group);
		}

		for (const group of looseTestGroups.values()) {
			addPracticeTarget(
				targets,
				usedSlugs,
				testFile,
				titleFromTargetSymbols(group.targetSymbols),
				group.blocks,
				group.targetSymbols,
			);
		}
	}

	return targets;
}

function isSelectablePracticeBlock(block: DescribeBlock): boolean {
	return block.modifier !== "skip" && block.modifier !== "todo";
}

function addPracticeTarget(
	targets: PracticeTarget[],
	usedSlugs: Map<string, number>,
	testFile: string,
	title: string,
	testBlocks: DescribeBlock[],
	targetSymbols: ImportSymbol[],
): void {
	const targetImportPaths = unique(targetSymbols.map((symbol) => symbol.importPath));
	if (targetImportPaths.length === 0) return;

	const sourceFiles = targetImportPaths
		.map((importPath) => join(SRC_DIR, `${importPath}.ts`))
		.filter((sourceFile) => existsSync(sourceFile) && shouldProcess(sourceFile));

	if (sourceFiles.length === 0) return;

	const baseSlug = slugify(title);
	const seen = usedSlugs.get(baseSlug) ?? 0;
	usedSlugs.set(baseSlug, seen + 1);
	const slug = seen === 0 ? baseSlug : `${baseSlug}-${seen + 1}`;
	const sourceRelativePaths = sourceFiles.map((sourceFile) =>
		relative(SRC_DIR, sourceFile),
	);

	targets.push({
		id: targets.length + 1,
		difficulty: inferDifficulty(title, sourceRelativePaths),
		pattern: inferPattern(title, sourceRelativePaths),
		title,
		slug,
		topic: inferTopic(sourceRelativePaths),
		testFile,
		sourceFiles,
		testBlocks,
		testRelativePath: relative(SRC_DIR, testFile),
		sourceRelativePaths,
		targetImportPaths,
		targetSymbols,
	});
}

function symbolGroupKey(symbols: ImportSymbol[]): string {
	return uniqueSymbols(symbols)
		.map((symbol) => `${symbol.importPath}:${symbol.importedName}:${symbol.localName}`)
		.sort()
		.join("|");
}

function titleFromTargetSymbols(symbols: ImportSymbol[]): string {
	const names = uniqueSymbols(symbols).map((symbol) => symbol.localName);
	return names.length === 1 ? names[0]! : names.join(" + ");
}

function inferTopic(sourceRelativePaths: string[]): string {
	const firstPath = sourceRelativePaths[0]?.replaceAll("\\", "/") ?? "";
	const parts = firstPath.split("/");

	if (parts[0] === "algorithms") return `algorithms/${parts[1] ?? "general"}`;
	if (parts[0] === "data-structures") {
		return `data-structures/${parts[1] ?? "general"}`;
	}
	if (parts[0] === "javascript-concepts") return "javascript-concepts";
	if (parts[0] === "node-concepts") return `node-concepts/${parts[1] ?? "general"}`;

	return parts[0] || "general";
}

function inferPattern(
	title: string,
	sourceRelativePaths: string[],
): PracticePattern {
	const text = normalizeForSearch(`${title} ${sourceRelativePaths.join(" ")}`);
	const rules: Array<[RegExp, PracticePattern]> = [
		[/twopointers|threenumber|smallestdifference|squared|palindrome/, "two pointers"],
		[/sliding|substring|window/, "sliding window"],
		[/prefix|zerosum|subarray|subarraysum/, "prefix sum"],
		[
			/binarytree|binarysearchtree|treenode|bst|trie|depth|ancestor|invert|symmetric|pathsum|successor/,
			"tree",
		],
		[/graph|island|river|path|course|topological/, "graph"],
		[/heap|topk|median|kthlargestelement|mergeksorted/, "heap"],
		[/binarysearch(?!tree)|lowerbound|rotatedsorted|sortedmatrix|koko/, "binary search"],
		[/stack|parentheses|nextgreater|monotonic/, "stack"],
		[/dynamic|dp|ways|knapsack|coin|editdistance/, "dynamic programming"],
		[/backtracking|permutation|combination|subset|nqueen/, "backtracking"],
		[/recursion|fibonacci|staircase|minesweeper|productsum/, "recursion"],
		[/sort|interval|merge/, "sorting"],
		[/hash|map|set|duplicate|majority/, "hash map"],
		[/promise|async|concurrency|retry|timeout|circuit|pubsub/, "async backend"],
		[/file|glob|shell|sqlite|cookie|password|hashing/, "bun runtime"],
	];

	return rules.find(([pattern]) => pattern.test(text))?.[1] ?? "implementation";
}

function inferDifficulty(
	title: string,
	sourceRelativePaths: string[],
): PracticeDifficulty {
	const text = normalizeForSearch(`${title} ${sourceRelativePaths.join(" ")}`);

	if (
		/dynamicprogramming|backtracking|graph|heap|systemdesign|consistenthash|bloom|snowflake|circuit|median|largestrectangle|wordsearch|hard/.test(
			text,
		)
	) {
		return "hard";
	}

	if (
		/tree|bst|trie|linkedlist|recursion|bit|interval|matrix|async|sqlite|lru|cache|minstack|queueusingstacks|dailytemperatures|kth|substring|window|threesum|rotated|medium/.test(
			text,
		)
	) {
		return "medium";
	}

	return "easy";
}

function isRouteIntegrationTarget(
	block: DescribeBlock,
	imports: LocalImport[],
): boolean {
	return imports.some(
		(localImport) =>
			localImport.importPath === "node-concepts/server" &&
			localImport.symbols.some(
				(symbol) =>
					symbol.localName === "server" &&
					isSymbolUsed(symbol.localName, block.text),
			),
	);
}

function chooseTargetSymbols(
	block: DescribeBlock,
	imports: LocalImport[],
	testFile: string,
): ImportSymbol[] {
	const usedSymbols = imports.flatMap((localImport) =>
		localImport.symbols.filter((symbol) => isSymbolUsed(symbol.localName, block.text)),
	);

	const titleKey = normalizeForSearch(block.title);
	const exactOrContained = usedSymbols.filter((symbol) => {
		const symbolKey = normalizeForSearch(symbol.localName);
		return symbolKey.length > 0 && titleKey.includes(symbolKey);
	});

	if (exactOrContained.length > 0) {
		return uniqueSymbols(exactOrContained);
	}

	const problemPaths = unique(
		usedSymbols
			.filter((symbol) => symbol.importPath.includes("/problems/"))
			.map((symbol) => symbol.importPath),
	);
	if (problemPaths.length > 0) {
		return uniqueSymbols(
			usedSymbols.filter((symbol) => problemPaths.includes(symbol.importPath)),
		);
	}

	const usedPaths = unique(usedSymbols.map((symbol) => symbol.importPath));
	if (usedPaths.length === 1) return uniqueSymbols(usedSymbols);

	const testBase = basename(testFile, ".test.ts");
	const matchingTestBase = usedPaths.filter((importPath) =>
		basename(importPath).includes(testBase),
	);
	if (matchingTestBase.length > 0) {
		return uniqueSymbols(
			usedSymbols.filter((symbol) => matchingTestBase.includes(symbol.importPath)),
		);
	}

	return [];
}

function auditPracticeTargets(targets: PracticeTarget[]): void {
	const warnings: string[] = [];

	for (const target of targets) {
		const titleKey = normalizeForSearch(target.title);
		const symbols = target.targetSymbols.map((symbol) => symbol.localName);
		const symbolMatchesTitle = symbols.some((symbol) => {
			const symbolKey = normalizeForSearch(symbol);
			return (
				symbolKey.length > 0 &&
				(titleKey.includes(symbolKey) || symbolKey.includes(titleKey))
			);
		});

		if (
			!symbolMatchesTitle &&
			!isAcceptedBroadPracticeTitle(target.title)
		) {
			warnings.push(
				`${target.id}. "${target.title}" selects ${symbols.join(", ")} from ${target.sourceRelativePaths.join(", ")}`,
			);
		}

		const groupedByImport = new Map<string, string[]>();
		for (const symbol of target.targetSymbols) {
			const group = groupedByImport.get(symbol.importPath) ?? [];
			group.push(symbol.localName);
			groupedByImport.set(symbol.importPath, group);
		}

		for (const [importPath, group] of groupedByImport) {
			if (group.length <= 1 || isAcceptedBroadPracticeTitle(target.title)) {
				continue;
			}

			warnings.push(
				`${target.id}. "${target.title}" selects multiple exports from ${importPath}: ${group.join(", ")}`,
			);
		}
	}

	if (warnings.length > 0) {
		throw new Error(
			`Practice target audit found ${warnings.length} naming/selection issue(s):\n${warnings.join("\n")}`,
		);
	}

	console.log(
		`Audited ${targets.length} focused practice target(s): names and selected exports are consistent.`,
	);
}

function isAcceptedBroadPracticeTitle(title: string): boolean {
	return /\b(?:integration|comparison|edge cases?|properties|patterns?|concepts?|constructor|different data types|utility methods|traversals?|load factor|capacity|boundary values|fifo verification|lifo verification|helpers?|file i\/o|glob|hashing|password|cookie|shell|sqlite|database|vs)\b/i.test(
		title,
	);
}

function isSymbolUsed(symbol: string, text: string): boolean {
	const escaped = escapeRegExp(symbol);
	return new RegExp(`(^|[^A-Za-z0-9_$])${escaped}([^A-Za-z0-9_$]|$)`).test(
		text,
	);
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function unique<T>(values: T[]): T[] {
	return Array.from(new Set(values));
}

function uniqueSymbols(symbols: ImportSymbol[]): ImportSymbol[] {
	const seen = new Set<string>();
	const result: ImportSymbol[] = [];

	for (const symbol of symbols) {
		const key = `${symbol.importPath}:${symbol.importedName}:${symbol.localName}`;
		if (seen.has(key)) continue;

		seen.add(key);
		result.push(symbol);
	}

	return result;
}

function normalizeForSearch(value: string): string {
	return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slugify(value: string): string {
	const slug = value
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	return slug || "practice-problem";
}

function formatTarget(target: PracticeTarget): string {
	return `${target.id}. ${target.title}  (${target.difficulty}, ${target.pattern}, ${target.topic})  [${target.sourceRelativePaths.join(", ")}]`;
}

function searchTargets(targets: PracticeTarget[], query: string): PracticeTarget[] {
	const normalizedQuery = normalizeForSearch(query);
	if (normalizedQuery.length === 0) return targets;

	return targets.filter((target) => {
		const haystack = normalizeForSearch(
			[
				target.title,
				target.slug,
				target.topic,
				target.pattern,
				target.difficulty,
				target.testRelativePath,
				...target.sourceRelativePaths,
			].join(" "),
		);
		return haystack.includes(normalizedQuery);
	});
}

function findBestTarget(
	targets: PracticeTarget[],
	query: string,
): PracticeTarget | null {
	const matches = searchTargets(targets, query);
	if (matches.length === 0) return null;

	const normalizedQuery = normalizeForSearch(query);
	return (
		matches.find((target) => normalizeForSearch(target.title) === normalizedQuery) ??
		matches.find((target) => normalizeForSearch(target.slug) === normalizedQuery) ??
		matches[0]!
	);
}

function pickRandomTarget(
	targets: PracticeTarget[],
	query: string,
): PracticeTarget | null {
	const matches = searchTargets(targets, query);
	if (matches.length === 0) return null;

	return matches[Math.floor(Math.random() * matches.length)]!;
}

function toManifestEntry(target: PracticeTarget): PracticeManifestEntry {
	return {
		id: target.id,
		title: target.title,
		slug: target.slug,
		topic: target.topic,
		pattern: target.pattern,
		difficulty: target.difficulty,
		learningObjectives: inferLearningObjectives(target),
		learnerChecklist: buildLearnerChecklist(target),
		complexityPrompt: buildComplexityPrompt(target),
		test: target.testRelativePath.replaceAll("\\", "/"),
		sources: target.sourceRelativePaths.map((sourcePath) =>
			sourcePath.replaceAll("\\", "/"),
		),
		exports: target.targetSymbols.map((symbol) => symbol.importedName),
	};
}

function inferLearningObjectives(target: PracticeTarget): string[] {
	const objectivesByPattern: Record<PracticePattern, string[]> = {
		"async backend": [
			"model failure modes before coding the happy path",
			"separate concurrency, timeout, retry, and state ownership concerns",
		],
		backtracking: [
			"define the decision tree and pruning rule",
			"restore mutable state after each recursive choice",
		],
		"binary search": [
			"prove the search-space invariant",
			"choose inclusive or exclusive bounds deliberately",
		],
		"bun runtime": [
			"use Bun-native APIs directly where they simplify the implementation",
			"keep runtime behavior observable through focused tests",
		],
		"dynamic programming": [
			"state the recurrence before writing the table",
			"identify the base cases and transition order",
		],
		graph: [
			"choose BFS, DFS, topological sort, or union-find from the graph shape",
			"track visited state so cycles and repeated work are handled explicitly",
		],
		"hash map": [
			"trade extra memory for constant-time lookup",
			"define the key, value, and duplicate-handling behavior",
		],
		heap: [
			"keep only the candidates needed by priority",
			"maintain the heap invariant after every insert or removal",
		],
		implementation: [
			"match the public API contract exactly",
			"explain the data representation and edge cases",
		],
		recursion: [
			"define the base case before the recursive case",
			"describe what each stack frame is responsible for",
		],
		sorting: [
			"choose between mutation, stability, and extra memory",
			"reason about best, average, and worst-case behavior",
		],
		stack: [
			"use last-in-first-out state to defer decisions",
			"identify when a monotonic stack removes repeated scanning",
		],
		"sliding window": [
			"maintain a valid window invariant",
			"move each boundary monotonically to keep the solution linear",
		],
		tree: [
			"separate node-local work from subtree recursion",
			"use ordering or prefix invariants when the tree type provides them",
		],
		"two pointers": [
			"move pointers based on a sorted-order or boundary invariant",
			"avoid nested scans when one pass is sufficient",
		],
		"prefix sum": [
			"turn range queries into differences of accumulated state",
			"seed the prefix map for ranges that start at index zero",
		],
	};

	return objectivesByPattern[target.pattern];
}

function buildLearnerChecklist(target: PracticeTarget): string[] {
	const checklist = [
		"Write the brute-force idea and why it is too slow.",
		`Name the pattern: ${target.pattern}.`,
		"List empty, one-item, duplicate, boundary, and no-solution cases.",
		"Implement the reference API without changing exported names.",
		"Run the focused test, then add one missed edge-case test before reviewing the source.",
	];

	if (target.difficulty !== "easy") {
		checklist.splice(
			2,
			0,
			"Write the invariant or recurrence in one sentence before coding.",
		);
	}

	return checklist;
}

function buildComplexityPrompt(target: PracticeTarget): string {
	const variableHint = target.topic.includes("graph")
		? "Use V/E for graph problems or rows/cols for grid problems."
		: target.topic.includes("tree") || target.pattern === "tree"
			? "Use n for nodes and h for tree height."
			: target.pattern === "dynamic programming"
				? "Name the table dimensions and whether output space is excluded."
				: target.pattern === "heap"
					? "Use n for input size and k for heap width when applicable."
					: "Use n for input size and call out any secondary dimension.";

	return `State time and auxiliary space complexity. ${variableHint}`;
}

async function writePracticeManifest(targets: PracticeTarget[]): Promise<void> {
	await mkdir(PRACTICE_DIR, { recursive: true });

	const manifest = {
		generatedAt: new Date().toISOString(),
		totalTargets: targets.length,
		targets: targets.map(toManifestEntry),
	};

	await Bun.write(
		join(PRACTICE_DIR, "practice-manifest.json"),
		`${JSON.stringify(manifest, null, 2)}\n`,
	);

	console.log(`Wrote practice/practice-manifest.json with ${targets.length} target(s).`);
}

async function promptForTarget(targets: PracticeTarget[]): Promise<PracticeTarget> {
	const readline = createInterface({ input, output });

	try {
		while (true) {
			const query = (
				await readline.question(
					"Search problem/topic (examples: heap, two sum, median, binary tree): ",
				)
			).trim();
			const matches = searchTargets(targets, query).slice(0, 25);

			if (matches.length === 0) {
				console.log("No matches. Try a different search term.");
				continue;
			}

			console.log("");
			for (const target of matches) {
				console.log(formatTarget(target));
			}

			const answer = (
				await readline.question("\nChoose a number from the list: ")
			).trim();
			const selectedId = Number(answer);
			const selected = matches.find((target) => target.id === selectedId);

			if (selected) return selected;
			console.log("Invalid selection. Search again.\n");
		}
	} finally {
		readline.close();
	}
}

function getFocusedImplementationPath(importPath: string, slug: string): string {
	const parts = importPath.split("/");
	parts[parts.length - 1] = slug;
	return `${parts.join("/")}.ts`;
}

function toRelativeImport(
	fromFilePath: string,
	toRelativePracticePath: string,
): string {
	const targetPathWithoutExtension = join(
		PRACTICE_DIR,
		toRelativePracticePath.replace(/\.ts$/, ""),
	);
	let relativeImport = relative(dirname(fromFilePath), targetPathWithoutExtension)
		.replaceAll("\\", "/");

	if (!relativeImport.startsWith(".")) {
		relativeImport = `./${relativeImport}`;
	}

	return relativeImport;
}

function buildImportSpecifier(symbols: ImportSymbol[]): string {
	const defaultSymbol = symbols.find((symbol) => symbol.importedName === "default");
	const namedSymbols = symbols.filter(
		(symbol) => symbol.importedName !== "default" && symbol.importedName !== "*",
	);
	const namespaceSymbol = symbols.find((symbol) => symbol.importedName === "*");

	if (namespaceSymbol) {
		return `* as ${namespaceSymbol.localName}`;
	}

	const parts: string[] = [];
	if (defaultSymbol) parts.push(defaultSymbol.localName);

	if (namedSymbols.length > 0) {
		const named = namedSymbols
			.map((symbol) =>
				symbol.importedName === symbol.localName
					? symbol.importedName
					: `${symbol.importedName} as ${symbol.localName}`,
			)
			.join(", ");
		parts.push(`{ ${named} }`);
	}

	return parts.join(", ");
}

function rewriteFocusedTestImports(
	content: string,
	practiceTestPath: string,
	target: PracticeTarget,
	practicePathByImportPath: Map<string, string>,
): string {
	let rewritten = content;
	const imports = parseLocalImports(content);

	for (const localImport of imports) {
		const selectedSymbols = target.targetSymbols.filter(
			(symbol) =>
				symbol.importPath === localImport.importPath &&
				isSymbolUsed(symbol.localName, content),
		);
		const practiceRelativePath = practicePathByImportPath.get(
			localImport.importPath,
		);

		if (practiceRelativePath && selectedSymbols.length > 0) {
			const importSpecifier = buildImportSpecifier(selectedSymbols);
			const relativeImport = toRelativeImport(
				practiceTestPath,
				practiceRelativePath,
			);
			const replacement = `import ${importSpecifier} from "${relativeImport}";`;

			rewritten = rewritten.replace(localImport.statement, replacement);
			continue;
		}

		const helperRelativeImport = toRelativeSourceImport(
			practiceTestPath,
			localImport.importPath,
		);
		rewritten = rewritten.replace(
			localImport.statement,
			localImport.statement.replace(
				/from\s+["']@\/[^"']+["'];/,
				`from "${helperRelativeImport}";`,
			),
		);
	}

	return rewritten.replace(/\n{3,}/g, "\n\n");
}

function toRelativeSourceImport(
	fromFilePath: string,
	sourceImportPath: string,
): string {
	const targetPathWithoutExtension = join(SRC_DIR, sourceImportPath);
	let relativeImport = relative(dirname(fromFilePath), targetPathWithoutExtension)
		.replaceAll("\\", "/");

	if (!relativeImport.startsWith(".")) {
		relativeImport = `./${relativeImport}`;
	}

	return relativeImport;
}

async function generateFocusedPractice(target: PracticeTarget): Promise<void> {
	await writeFocusedPractice(target, PRACTICE_DIR, true);
}

async function writeFocusedPractice(
	target: PracticeTarget,
	outputRoot: string,
	printSummary: boolean,
): Promise<string> {
	await mkdir(outputRoot, { recursive: true });

	const practicePathByImportPath = new Map<string, string>();
	const generatedImplementationPaths: string[] = [];

	for (const importPath of target.targetImportPaths) {
		const sourceFile = join(SRC_DIR, `${importPath}.ts`);
		const content = await Bun.file(sourceFile).text();
		const selectedSymbols = target.targetSymbols.filter(
			(symbol) => symbol.importPath === importPath,
		);
		const selectedExports = new Set(
			selectedSymbols.map((symbol) =>
				symbol.importedName === "default" ? symbol.localName : symbol.importedName,
			),
		);
		const outputRelativePath = getFocusedImplementationPath(
			importPath,
			target.slug,
		);
		const practiceFilePath = join(outputRoot, outputRelativePath);

		practicePathByImportPath.set(importPath, outputRelativePath);
		generatedImplementationPaths.push(outputRelativePath);

		await mkdir(dirname(practiceFilePath), { recursive: true });
		await Bun.write(
			practiceFilePath,
			generatePracticeTemplate(content, sourceFile, selectedExports),
		);
		if (printSummary) {
			console.log(`Generated implementation: ${outputRelativePath}`);
		}
	}

	const sourceTestContent = await Bun.file(target.testFile).text();
	if (target.testBlocks.length === 0) {
		throw new Error(`Target has no selected test blocks: ${target.title}`);
	}

	const testOutputRelativePath = join(
		dirname(target.testRelativePath),
		`${target.slug}.test.ts`,
	);
	const practiceTestPath = join(outputRoot, testOutputRelativePath);
	const focusedTestContent = rewriteFocusedTestImports(
		filterToTestBlocks(sourceTestContent, target.testBlocks),
		practiceTestPath,
		target,
		practicePathByImportPath,
	);

	await mkdir(dirname(practiceTestPath), { recursive: true });
	await Bun.write(practiceTestPath, focusedTestContent);
	await createReadme(outputRoot);

	if (printSummary) {
		console.log(`Generated focused test: ${testOutputRelativePath}`);
		console.log("\nPractice ready.");
		console.log(
			`Target: ${target.title} (${target.difficulty}, ${target.pattern}, ${target.topic})`,
		);
		console.log(`Implement: practice/${generatedImplementationPaths.join(", practice/")}`);
		console.log(`Run: bun test practice/${testOutputRelativePath.replaceAll("\\", "/")}`);
		console.log(`Complexity prompt: ${buildComplexityPrompt(target)}`);
	}

	return testOutputRelativePath.replaceAll("\\", "/");
}

function assertGeneratedTestMatchesTarget(
	testContent: string,
	target: PracticeTarget,
): void {
	const generatedBlocks = parseTopLevelRunnableBlocks(testContent);
	const normalizedTestContent = normalizeGeneratedTestText(testContent);
	const expectedSummary = target.testBlocks
		.map((block) => `${block.kind}("${block.title}")`)
		.join(", ");
	const generatedSummary = generatedBlocks
		.map((block) => `${block.kind}("${block.title}")`)
		.join(", ");

	if (generatedBlocks.length !== target.testBlocks.length) {
		throw new Error(
			`Focused test block mismatch. Expected ${target.testBlocks.length} block(s): ${expectedSummary}. Generated ${generatedBlocks.length}: ${generatedSummary}.`,
		);
	}

	for (const block of target.testBlocks) {
		if (!normalizedTestContent.includes(normalizeGeneratedTestText(block.text))) {
			throw new Error(
				`Focused test does not contain selected ${block.kind} block: ${block.title}`,
			);
		}
	}
}

function normalizeGeneratedTestText(value: string): string {
	return value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function runPracticeSmokeTests(targets: PracticeTarget[]): void {
	const syntheticTest = `
import { describe, expect, it, test } from "bun:test";
import { alpha as renamedAlpha, beta, gamma } from '@/fake/source';

// test("comment leak", () => { beta(); });
const fake = "describe(\\"string leak\\", () => { beta(); })";

test.skip("skipped beta", () => {
\tbeta();
}, { timeout: 10 });

test.todo("todo beta");

test.only("loose beta 1", () => {
\tbeta();
}, 1000);

it.each([[1], [2]])("loose beta %i", (value) => {
\tbeta(value);
});

describe("alpha target", function () {
\ttest("nested alpha", () => {
\t\trenamedAlpha();
\t});
});

describe("duplicate", () => {
\trenamedAlpha();
});

describe("duplicate", () => {
\tgamma();
});
`;

	const blocks = parseTopLevelRunnableBlocks(syntheticTest);
	assertSmoke(
		blocks.length === 7,
		`expected 7 top-level blocks in synthetic smoke test, got ${blocks.length}`,
	);
	assertSmoke(
		blocks.some(
			(block) => block.kind === "test" && block.modifier === "skip",
		),
		"did not parse test.skip as a removable top-level block",
	);
	assertSmoke(
		blocks.some(
			(block) => block.kind === "test" && block.modifier === "todo",
		),
		"did not parse test.todo as a removable top-level block",
	);
	assertSmoke(
		blocks.some(
			(block) => block.kind === "test" && block.modifier === "only",
		),
		"did not parse test.only as a selectable top-level block",
	);
	assertSmoke(
		blocks.some((block) => block.kind === "it" && block.title === "loose beta %i"),
		"did not parse it.each(...) as a top-level block",
	);
	assertSmoke(
		!blocks.some((block) => block.title.includes("leak")),
		"parsed fake test calls from comments or strings",
	);

	const imports = parseLocalImports(syntheticTest);
	const alphaBlock = getSmokeBlock(blocks, "alpha target");
	const alphaSymbols = chooseTargetSymbols(
		alphaBlock,
		imports,
		join(SRC_DIR, "synthetic.test.ts"),
	);
	assertSmoke(
		alphaSymbols.length === 1 &&
			alphaSymbols[0]?.importedName === "alpha" &&
			alphaSymbols[0]?.localName === "renamedAlpha",
		"did not preserve aliased import selection",
	);

	const betaBlock = getSmokeBlock(blocks, "loose beta 1");
	const betaSymbols = chooseTargetSymbols(
		betaBlock,
		imports,
		join(SRC_DIR, "synthetic.test.ts"),
	);
	assertSmoke(
		betaSymbols.length === 1 && betaSymbols[0]?.localName === "beta",
		"did not infer the target symbol for a loose top-level test",
	);

	const filteredAlpha = filterToTestBlocks(syntheticTest, [alphaBlock]);
	assertSmoke(
		filteredAlpha.includes('describe("alpha target"') &&
			filteredAlpha.includes('test("nested alpha"'),
		"selected describe block was not preserved",
	);
	assertSmoke(
		!filteredAlpha.includes("loose beta 1") &&
			!filteredAlpha.includes("skipped beta") &&
			!filteredAlpha.includes("todo beta"),
		"unselected top-level tests leaked into a focused describe target",
	);

	const duplicateBlocks = blocks.filter((block) => block.title === "duplicate");
	assertSmoke(duplicateBlocks.length === 2, "duplicate title blocks were not parsed");
	const filteredDuplicate = filterToTestBlocks(syntheticTest, [duplicateBlocks[1]!]);
	assertSmoke(
		filteredDuplicate.includes("gamma();") &&
			!filteredDuplicate.includes("renamedAlpha();"),
		"duplicate title filtering did not use exact block identity",
	);

	const selectableBlocks = blocks.filter(isSelectablePracticeBlock);
	assertSmoke(
		!selectableBlocks.some((block) => block.modifier === "skip") &&
			!selectableBlocks.some((block) => block.modifier === "todo"),
		"skip/todo blocks are selectable practice targets",
	);

	const tandemTarget = findBestTarget(targets, "tandemBicycle");
	assertSmoke(tandemTarget !== null, "tandemBicycle target was not discovered");
	assertSmoke(
		tandemTarget.testBlocks.length === 6 &&
			tandemTarget.testBlocks.every((block) => block.kind === "test"),
		"loose tandemBicycle tests were not grouped into one focused target",
	);

	const monotonicTarget = findBestTarget(targets, "monotonicArray");
	assertSmoke(monotonicTarget !== null, "monotonicArray target was not discovered");
	const monotonicSourceTest = readFileSync(monotonicTarget.testFile, "utf8");
	const monotonicFocusedTest = filterToTestBlocks(
		monotonicSourceTest,
		monotonicTarget.testBlocks,
	);
	assertSmoke(
		!/\btandemBicycle\s*\(/.test(monotonicFocusedTest),
		"tandemBicycle calls leaked into monotonicArray focused test",
	);
	assertSmoke(
		parseTopLevelRunnableBlocks(monotonicFocusedTest).length ===
			monotonicTarget.testBlocks.length,
		"monotonicArray focused test has extra top-level runnable blocks",
	);

	const duplicateAddTwoNumberTargets = searchTargets(targets, "addTwoNumbers").filter(
		(target) => target.title === "addTwoNumbers",
	);
	assertSmoke(
		duplicateAddTwoNumberTargets.length >= 2 &&
			duplicateAddTwoNumberTargets[0]?.testBlocks[0]?.start !==
				duplicateAddTwoNumberTargets[1]?.testBlocks[0]?.start,
		"duplicate addTwoNumbers targets do not keep distinct source blocks",
	);

	console.log("Smoke tested focused practice parser and filter edge cases.");
}

function getSmokeBlock(blocks: DescribeBlock[], title: string): DescribeBlock {
	const block = blocks.find((candidate) => candidate.title === title);
	assertSmoke(block !== undefined, `missing synthetic block: ${title}`);
	return block;
}

function assertSmoke(
	condition: unknown,
	message: string,
): asserts condition {
	if (!condition) {
		throw new Error(`Smoke test failed: ${message}`);
	}
}

async function createReadme(outputRoot = PRACTICE_DIR) {
	const readme = `# Focused DSA Practice

This directory is generated by \`bun run practice\`.

## Generate One Problem

\`\`\`bash
bun run practice
bun run practice:easy
bun run practice:medium
bun run practice:hard
bun run practice -- --list heap
bun run practice -- --problem kthLargestElement
bun run practice -- --random graph
bun run practice -- --manifest
\`\`\`

The generator creates:

- One empty implementation module under \`practice/\`
- One focused test file that runs only the selected problem's tests
- Supporting imports still point at \`src/\`, so you only implement the chosen problem

## Run The Focused Test

Use the command printed by the generator, for example:

\`\`\`bash
bun test practice/data-structures/tests/kth-largest-element.test.ts
bun test practice/data-structures/tests --test-name-pattern kthLargestElement
\`\`\`

## Generate Everything

Use this only when you intentionally want every practice file and every test:

\`\`\`bash
bun run practice -- --all --clean
\`\`\`

## Build A Practice Dashboard

\`\`\`bash
bun run practice -- --manifest
\`\`\`

This writes \`practice/practice-manifest.json\` with every focused target, topic,
pattern, difficulty, source file, test file, export, learning objectives,
attempt checklist, and complexity prompt. It is intentionally plain JSON so it
can feed a Bun CLI, SQLite tracker, spreadsheet, or dashboard.

## Validate The Practice System

\`\`\`bash
bun run practice:audit
bun run practice:validate
\`\`\`

\`practice:audit\` checks that focused test titles map cleanly to exported source
APIs. \`practice:validate\` generates every focused target in isolation and catches
broken imports or missing stubs.

## Learning Loop

1. Generate one problem.
2. State the pattern and invariant before coding.
3. Read the JSDoc in the generated implementation file.
4. Implement only the selected export.
5. Run the focused test, then add one edge-case test if you missed anything.
6. Compare with \`src/\` only after you have a passing attempt.
7. Write down the pattern, invariant, edge cases, and complexity.

## Interview Self-Review

- Could you explain why this pattern fits in under 60 seconds?
- Did your solution handle empty input, duplicates, boundaries, and no-solution cases?
- Did you avoid slow JavaScript operations such as repeated \`.shift()\` in hot loops?
- Can you state time and space complexity without looking at the code?
- Can you describe the production version if the problem is backend/system design?

## Source Naming Contract

- Use \`export function problemName(...)\` for standalone algorithm problems.
- Use \`export class StructureName\` for data structures and stateful interview APIs.
- Keep small helpers unexported unless tests intentionally import them as their own practice target.
- Keep each top-level \`describe("problemName")\` aligned with the exported function/class it tests.
- Use broad titles like "Integration", "Comparison", or "Edge Cases" only when the block intentionally covers multiple exports.
`;

	await Bun.write(join(outputRoot, "README.md"), readme);
}

async function validateAllFocusedTargets(targets: PracticeTarget[]): Promise<void> {
	const validationRoot = join(PRACTICE_DIR, "__focused-validation__");

	if (existsSync(validationRoot)) {
		await rm(validationRoot, { recursive: true, force: true });
	}

	await mkdir(validationRoot, { recursive: true });

	const failures: string[] = [];

	try {
		for (const target of targets) {
			const targetRoot = join(validationRoot, `${target.id}-${target.slug}`);

			try {
				const testPath = await writeFocusedPractice(target, targetRoot, false);
				const testFilePath = join(targetRoot, testPath);
				const testContent = await Bun.file(testFilePath).text();

				if (/from\s+["']@\//.test(testContent)) {
					throw new Error("Focused test still contains an unresolved src alias");
				}

				assertGeneratedTestMatchesTarget(testContent, target);

				for (const importPath of target.targetImportPaths) {
					const generatedPath = join(
						targetRoot,
						getFocusedImplementationPath(importPath, target.slug),
					);
					const generatedContent = await Bun.file(generatedPath).text();

					const selectedSymbols = target.targetSymbols.filter(
						(symbol) => symbol.importPath === importPath,
					);
					const hasStub = selectedSymbols.some((symbol) =>
						generatedContent.includes(`Not implemented: ${symbol.localName}`),
					);
					const hasClassStub =
						generatedContent.includes("export class ") ||
						generatedContent.includes("export default class ");

					if (!hasStub && !hasClassStub) {
						throw new Error(
							`Generated implementation has no practice stub: ${generatedPath}`,
						);
					}
				}

				console.log(`Validated ${target.id}/${targets.length}: ${target.title}`);
			} catch (error) {
				failures.push(
					`${target.id}. ${target.title}: ${
						error instanceof Error ? error.message : String(error)
					}`,
				);
				console.error(`Failed ${target.id}/${targets.length}: ${target.title}`);
			}
		}

		if (failures.length > 0) {
			throw new Error(
				`Focused validation failed for ${failures.length} target(s):\n${failures.join("\n")}`,
			);
		}

		console.log(`Validated ${targets.length} focused practice target(s).`);
	} finally {
		await rm(validationRoot, { recursive: true, force: true });
	}
}

async function generateAll(clean: boolean): Promise<void> {
	console.log("Generating all practice templates...\n");

	if (clean && existsSync(PRACTICE_DIR)) {
		console.log("Cleaning existing practice directory...");
		await rm(PRACTICE_DIR, { recursive: true, force: true });
	}

	await mkdir(PRACTICE_DIR, { recursive: true });

	await processDirectory(SRC_DIR);

	console.log("\nCopying test files...\n");
	await copyTestFiles(SRC_DIR);

	console.log("\nCreating documentation...\n");
	await createReadme();

	console.log("\nAll practice templates generated.");
	console.log(`Location: ${PRACTICE_DIR}`);
}

async function main() {
	const options = parseArgs(Bun.argv.slice(2));

	if (options.help) {
		printHelp();
		return;
	}

	if (options.all) {
		await generateAll(options.clean);
		return;
	}

	const targets = discoverPracticeTargets();

	if (options.manifest) {
		await writePracticeManifest(targets);
		return;
	}

	if (options.auditTargets) {
		auditPracticeTargets(targets);
		return;
	}

	if (options.smokeTest) {
		runPracticeSmokeTests(targets);
		return;
	}

	if (options.validateAll) {
		await validateAllFocusedTargets(targets);
		return;
	}

	if (options.listQuery !== null) {
		const matches = searchTargets(targets, options.listQuery);
		for (const target of matches) {
			console.log(formatTarget(target));
		}
		console.log(`\n${matches.length} target(s) found.`);
		return;
	}

	if (options.clean && existsSync(PRACTICE_DIR)) {
		await rm(PRACTICE_DIR, { recursive: true, force: true });
	}

	const target =
		options.randomQuery !== null
			? pickRandomTarget(targets, options.randomQuery)
			: options.problemQuery
				? findBestTarget(targets, options.problemQuery)
				: await promptForTarget(targets);

	if (!target) {
		throw new Error(
			`No practice target matched: ${options.randomQuery ?? options.problemQuery}`,
		);
	}

	await generateFocusedPractice(target);
}

main().catch((error) => {
	console.error("Error generating practice templates:", error);
	process.exit(1);
});
