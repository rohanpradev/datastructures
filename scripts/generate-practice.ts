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
import { mkdir } from "node:fs/promises";
import { join, relative, dirname } from "node:path";

const SRC_DIR = join(process.cwd(), "src");
const PRACTICE_DIR = join(process.cwd(), "practice");

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  /\.test\.ts$/,
  /tests?/,
  /index\.ts$/,
  /node_modules/,
];

/**
 * Check if a file should be processed
 */
function shouldProcess(filePath: string): boolean {
  const relativePath = relative(SRC_DIR, filePath);
  return !EXCLUDE_PATTERNS.some((pattern) => pattern.test(relativePath));
}

/**
 * Extract function signature and JSDoc comment
 */
function extractFunctionInfo(content: string): Array<{
  comment: string;
  signature: string;
  name: string;
}> {
  const functions: Array<{ comment: string; signature: string; name: string }> =
    [];

  // Match JSDoc comments followed by export function declarations
  const functionRegex =
    /\/\*\*[\s\S]*?\*\/\s*export\s+function\s+(\w+)\s*(<[^>]+>)?\s*\([^)]*\)\s*:\s*[^{]+/g;

  let match;
  while ((match = functionRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const functionName = match[1];

    // Extract the JSDoc comment
    const commentMatch = fullMatch.match(/\/\*\*[\s\S]*?\*\//);
    const comment = commentMatch ? commentMatch[0] : "";

    // Get the function signature (without the body)
    const signature = fullMatch.replace(/\/\*\*[\s\S]*?\*\/\s*/, "");

    functions.push({
      comment,
      signature,
      name: functionName || "unknown",
    });
  }

  return functions;
}

/**
 * Extract class definitions with methods
 */
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

  // Match export class declarations
  const classRegex =
    /\/\*\*[\s\S]*?\*\/\s*export\s+class\s+\w+[^{]*\{[\s\S]*?\n\}/g;

  let match;
  while ((match = classRegex.exec(content)) !== null) {
    const fullMatch = match[0];

    // Extract class JSDoc
    const classCommentMatch = fullMatch.match(/\/\*\*[\s\S]*?\*\//);
    const classComment = classCommentMatch ? classCommentMatch[0] : "";

    // Extract class signature (up to opening brace)
    const classSignatureMatch = fullMatch.match(/export\s+class\s+[^{]+/);
    const classSignature = classSignatureMatch ? classSignatureMatch[0] : "";

    // Extract methods
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

/**
 * Generate practice template from source file
 */
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

  // Extract imports (keep type imports)
  const importRegex = /^import\s+.*?;$/gm;
  const imports = content.match(importRegex);
  if (imports) {
    template += imports.join("\n") + "\n\n";
  }

  // Extract type definitions
  const typeRegex =
    /^export\s+(?:type|interface)\s+[\s\S]*?(?=\n(?:export|\/\*\*|$))/gm;
  const types = content.match(typeRegex);
  if (types) {
    template += types.join("\n\n") + "\n\n";
  }

  // Extract functions
  const functions = extractFunctionInfo(content);
  for (const func of functions) {
    template += `${func.comment}\n`;
    template += `${func.signature} {\n`;
    template += `\t// TODO: Implement ${func.name}\n`;
    template += `\tthrow new Error("Not implemented: ${func.name}");\n`;
    template += `}\n\n`;
  }

  // Extract classes (simplified - just show structure)
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

/**
 * Recursively process directory
 */
async function processDirectory(srcPath: string) {
  const items = readdirSync(srcPath);

  for (const item of items) {
    const fullPath = join(srcPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (item.endsWith(".ts") && shouldProcess(fullPath)) {
      // Use Bun.file() for reading
      const file = Bun.file(fullPath);
      const content = await file.text();

      const relativePath = relative(SRC_DIR, fullPath);
      const practiceFilePath = join(PRACTICE_DIR, relativePath);

      // Create directory if it doesn't exist
      const practiceDir = dirname(practiceFilePath);
      const dirExists = await Bun.file(practiceDir).exists();
      if (!dirExists) {
        await mkdir(practiceDir, { recursive: true });
      }

      // Generate template
      const template = generatePracticeTemplate(content, fullPath);

      // Use Bun.write() for writing
      await Bun.write(practiceFilePath, template);

      console.log(`✓ Generated: ${relativePath}`);
    }
  }
}

/**
 * Copy test files to practice directory
 */
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

    // Optional: skip tests with no implementation
    const implGuess = relativePath.replace(/\.test\.ts$/, ".ts");
    const implPracticePath = join(PRACTICE_DIR, implGuess);

    if (!(await Bun.file(implPracticePath).exists())) {
      console.log(`↷ Skipped test (no implementation): ${relativePath}`);
      continue;
    }

    await mkdir(dirname(practiceTestPath), { recursive: true });
    await Bun.write(practiceTestPath, Bun.file(fullPath));

    console.log(`✓ Copied test: ${relativePath}`);
  }
}

/**
 * Create README for practice directory
 */
async function createReadme() {
  const readme = `# DSA Practice Templates

This directory contains practice templates with empty implementations.

## How to Use

1. **Choose a topic** from the directory structure
2. **Implement the functions** in the template files
3. **Run tests** to verify your implementation

## Running Tests

\`\`\`bash
# Run all tests
bun test

# Run specific test file
bun test practice/algorithms/sorting/sorting.test.ts

# Run tests for a specific data structure
bun test practice/data-structures/tests/binary-search-tree.test.ts
\`\`\`

## Directory Structure

\`\`\`
practice/
├── algorithms/
│   ├── arrays/          # Array manipulation exercises
│   ├── recursion/       # Fibonacci and recursive problems
│   └── sorting/         # Sorting algorithms
├── data-structures/
│   ├── binary-search-tree/
│   ├── graph/
│   ├── hash-table/
│   ├── heap/
│   ├── queue/
│   ├── singly-linked-list/
│   └── stack/
└── README.md
\`\`\`

## Tips

- Read the JSDoc comments carefully - they contain algorithm hints
- Start with simpler problems (Stack, Queue) before moving to complex ones
- Check time/space complexity requirements in the comments
- Run tests frequently to catch errors early

## Example Workflow

1. Open \`practice/algorithms/sorting/sorting.ts\`
2. Find the \`bubbleSort\` function with TODO comment
3. Implement the function
4. Run \`bun test practice/algorithms/tests/sorting.test.ts\`
5. Fix any failing tests
6. Move to the next function

## Coding Standards

All templates follow these conventions:
- Clear variable names (no single letters except loop counters)
- Comprehensive JSDoc comments
- Type safety with TypeScript
- Consistent formatting with Biome

Happy Coding! 🚀
`;

  // Use Bun.write for creating README
  await Bun.write(join(PRACTICE_DIR, "README.md"), readme);
  console.log("✓ Created README.md");
}

// Main execution
async function main() {
  console.log("🎯 Generating practice templates...\n");

  // Clean up existing practice directory
  const practiceExists = await Bun.file(PRACTICE_DIR).exists();
  if (practiceExists) {
    console.log("Cleaning existing practice directory...");
    // Note: Could use rmdir with recursive for cleanup
  }

  // Create practice directory
  await mkdir(PRACTICE_DIR, { recursive: true });

  // Process source files
  await processDirectory(SRC_DIR);

  // Copy test files
  console.log("\n📋 Copying test files...\n");
  await copyTestFiles(SRC_DIR);

  // Create README
  console.log("\n📝 Creating documentation...\n");
  await createReadme();

  console.log("\n✅ Practice templates generated successfully!");
  console.log(`📁 Location: ${PRACTICE_DIR}`);
  console.log("\nRun 'bun test' in the practice directory to verify setup.");
}

// Run main function
main().catch((error) => {
  console.error("❌ Error generating practice templates:", error);
  process.exit(1);
});
