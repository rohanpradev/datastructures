#!/usr/bin/env bun
/**
 * Practice Template Generator
 *
 * This script generates empty implementation templates for practice.
 * It extracts function signatures, types, and JSDoc comments while
 * removing the implementation logic, allowing learners to practice
 * coding against the existing test suite.
 *
 * Uses Bun's native file I/O APIs for optimal performance.
 */

import { readdirSync, statSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

const SRC_DIR = join(process.cwd(), "src");
const PRACTICE_DIR = join(process.cwd(), "practice");

const EXCLUDE_PATTERNS = [
	/\.test\.ts$/,
	/tests?/,
	/index\.ts$/,
	/node_modules/,
];

function shouldProcess(filePath: string): boolean {
	const relativePath = relative(SRC_DIR, filePath);
	return !EXCLUDE_PATTERNS.some((pattern) => pattern.test(relativePath));
}

function extractFunctionInfo(content: string): Array<{
	comment: string;
	signature: string;
	name: string;
}> {
	const functions: Array<{ comment: string; signature: string; name: string }> =
		[];

	const functionRegex =
		/\/\*\*[\s\S]*?\*\/\s*export\s+function\s+(\w+)\s*(<[^>]+>)?\s*\([^)]*\)\s*:\s*[^{]+/g;

	let match;
	while ((match = functionRegex.exec(content)) !== null) {
		const fullMatch = match[0];
		const functionName = match[1];
		const commentMatch = fullMatch.match(/\/\*\*[\s\S]*?\*\//);
		const comment = commentMatch ? commentMatch[0] : "";
		const signature = fullMatch.replace(/\/\*\*[\s\S]*?\*\/\s*/, "");

		functions.push({
			comment,
			signature,
			name: functionName || "unknown",
		});
	}

	return functions;
}

function extractClassInfo(content: string): Array<{
	comment: string;
	signature: string;
	methods: Array<{ comment: string; signature: string }>;
}> {
	const classes: Array<{
		comment: string;
		signature: string;
		methods: Array<{ comment: string; signature: string }>;
	}> = [];

	const classRegex =
		/\/\*\*[\s\S]*?\*\/\s*export\s+class\s+\w+[^{]*\{[\s\S]*?\n\}/g;

	let match;
	while ((match = classRegex.exec(content)) !== null) {
		const fullMatch = match[0];
		const classCommentMatch = fullMatch.match(/\/\*\*[\s\S]*?\*\//);
		const classComment = classCommentMatch ? classCommentMatch[0] : "";
		const classSignatureMatch = fullMatch.match(/export\s+class\s+[^{]+/);
		const classSignature = classSignatureMatch ? classSignatureMatch[0] : "";

		const methods: Array<{ comment: string; signature: string }> = [];
		const methodRegex =
			/\/\*\*[\s\S]*?\*\/\s*(?:public|private|protected)?\s*(?:static)?\s*\w+\s*(<[^>]+>)?\s*\([^)]*\)\s*:\s*[^{]+/g;

		let methodMatch;
		while ((methodMatch = methodRegex.exec(fullMatch)) !== null) {
			const methodFull = methodMatch[0];
			const methodCommentMatch = methodFull.match(/\/\*\*[\s\S]*?\*\//);
			const methodComment = methodCommentMatch ? methodCommentMatch[0] : "";
			const methodSignature = methodFull.replace(/\/\*\*[\s\S]*?\*\/\s*/, "");

			methods.push({
				comment: methodComment,
				signature: methodSignature,
			});
		}

		classes.push({
			comment: classComment,
			signature: classSignature,
			methods,
		});
	}

	return classes;
}

function generatePracticeTemplate(content: string, filePath: string): string {
	const relativePath = relative(SRC_DIR, filePath);

	let template = `/**
 * Practice Template: ${relativePath}
 *
 * This file contains function signatures and documentation.
 * Implement the functions to make the tests pass.
 *
 * Run tests: bun test ${relativePath.replace(/\.ts$/, ".test.ts")}
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

	const functions = extractFunctionInfo(content);
	for (const func of functions) {
		template += `${func.comment}\n`;
		template += `${func.signature} {\n`;
		template += `\t// TODO: Implement ${func.name}\n`;
		template += `\tthrow new Error("Not implemented: ${func.name}");\n`;
		template += `}\n\n`;
	}

	const classes = extractClassInfo(content);
	for (const cls of classes) {
		template += `${cls.comment}\n`;
		template += `${cls.signature} {\n`;
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

			if (!(await Bun.file(practiceDir).exists())) {
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

		const relativePath = relative(SRC_DIR, fullPath);
		const practiceTestPath = join(PRACTICE_DIR, relativePath);
		const implGuess = relativePath.replace(/\.test\.ts$/, ".ts");
		const implPracticePath = join(PRACTICE_DIR, implGuess);

		if (!(await Bun.file(implPracticePath).exists())) {
			console.log(`Skipped test (no implementation): ${relativePath}`);
			continue;
		}

		await mkdir(dirname(practiceTestPath), { recursive: true });
		await Bun.write(practiceTestPath, Bun.file(fullPath));

		console.log(`Copied test: ${relativePath}`);
	}
}

async function createReadme() {
	const readme = `# DSA Practice Templates

This directory contains practice templates with empty implementations.

## How to Use

1. Choose a topic from the directory structure
2. Implement the functions in the template files
3. Run tests to verify your implementation

## Running Tests

\`\`\`bash
# Run all generated practice tests
bun test practice

# Run a specific test file
bun test practice/algorithms/tests/sorting.test.ts

# Run tests for a specific data structure
bun test practice/data-structures/tests/binary-search-tree.test.ts
\`\`\`

## Directory Structure

\`\`\`
practice/
|-- algorithms/
|   |-- arrays/          # Array manipulation exercises
|   |-- recursion/       # Fibonacci and recursive problems
|   \`-- sorting/         # Sorting algorithms
|-- data-structures/
|   |-- binary-search-tree/
|   |-- graph/
|   |-- hash-table/
|   |-- heap/
|   |-- queue/
|   |-- singly-linked-list/
|   \`-- stack/
\`-- README.md
\`\`\`

## Tips

- Read the JSDoc comments carefully; they contain algorithm hints
- Start with simpler problems before moving to advanced ones
- Check time and space complexity requirements in the comments
- Run tests frequently to catch errors early

## Example Workflow

1. Open \`practice/algorithms/sorting/sorting.ts\`
2. Find the \`bubbleSort\` function with TODO comments
3. Implement the function
4. Run \`bun test practice/algorithms/tests/sorting.test.ts\`
5. Fix failing tests
6. Move to the next function

## Coding Standards

All templates follow these conventions:
- Clear variable names
- Comprehensive JSDoc comments
- Type safety with TypeScript
- Consistent formatting with Biome

Happy Coding!
`;

	await Bun.write(join(PRACTICE_DIR, "README.md"), readme);
	console.log("Created README.md");
}

async function main() {
	console.log("Generating practice templates...\n");

	if (await Bun.file(PRACTICE_DIR).exists()) {
		console.log("Cleaning existing practice directory...");
		await rm(PRACTICE_DIR, { recursive: true, force: true });
	}

	await mkdir(PRACTICE_DIR, { recursive: true });

	await processDirectory(SRC_DIR);

	console.log("\nCopying test files...\n");
	await copyTestFiles(SRC_DIR);

	console.log("\nCreating documentation...\n");
	await createReadme();

	console.log("\nPractice templates generated successfully.");
	console.log(`Location: ${PRACTICE_DIR}`);
	console.log("\nRun 'bun test practice' to verify the generated templates.");
}

main().catch((error) => {
	console.error("Error generating practice templates:", error);
	process.exit(1);
});
