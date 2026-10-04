import {
	createMcpHandler,
	hostHeaderValidationResponse,
	localhostAllowedHostnames,
	localhostAllowedOrigins,
	type McpHttpHandler,
	McpServer,
	originValidationResponse,
} from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { ApiError } from "./json";
import type { OrchestrationRegistry, TutorRunner } from "./orchestration";
import type { ModelRegistry, ResourceRegistry } from "./registry";
import {
	learningResourceSchema,
	searchResourcesRequestSchema,
	tutorRequestSchema,
	tutorResponseSchema,
} from "./state";

export interface McpDependencies {
	models: ModelRegistry;
	orchestration: OrchestrationRegistry;
	resources: ResourceRegistry;
	tutor: TutorRunner;
}

function createTutorMcpServer(dependencies: McpDependencies): McpServer {
	const server = new McpServer(
		{ name: "typescript-ai-tutor", version: "2.0.0" },
		{
			cacheHints: {
				"resources/list": { cacheScope: "public", ttlMs: 300_000 },
				"resources/read": { cacheScope: "public", ttlMs: 300_000 },
				"tools/list": { cacheScope: "public", ttlMs: 300_000 },
			},
			instructions:
				"Use the tutor for TypeScript engineering questions, select advanced orchestration only when it adds value, and use the resource tool for deterministic authoritative references.",
		},
	);

	server.registerTool(
		"ask_typescript_tutor",
		{
			annotations: {
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: true,
				readOnlyHint: false,
			},
			description:
				"Run a durable TypeScript tutor workflow and persist the conversation turn.",
			inputSchema: tutorRequestSchema,
			outputSchema: tutorResponseSchema,
			title: "Ask TypeScript Tutor",
		},
		async (input) => {
			try {
				const output = await dependencies.tutor.run(input);
				return {
					content: [{ text: output.answer, type: "text" }],
					structuredContent: output,
				};
			} catch (error) {
				// The SDK turns thrown errors into client-visible tool results.
				// Provider errors may include prompts, credentials, or request details.
				if (!(error instanceof ApiError)) {
					console.error("MCP tutor run failed", error);
				}
				return {
					content: [
						{
							text:
								error instanceof ApiError
									? error.message
									: "The tutor run could not be completed.",
							type: "text",
						},
					],
					isError: true,
				};
			}
		},
	);

	server.registerTool(
		"search_typescript_resources",
		{
			annotations: {
				destructiveHint: false,
				idempotentHint: true,
				openWorldHint: false,
				readOnlyHint: true,
			},
			description:
				"Search a curated registry of authoritative TypeScript and AI engineering resources.",
			inputSchema: searchResourcesRequestSchema,
			outputSchema: z.object({ resources: z.array(learningResourceSchema) }),
			title: "Search TypeScript Resources",
		},
		async ({ limit, query }) => {
			const output = { resources: dependencies.resources.search(query, limit) };
			return {
				content: [{ text: JSON.stringify(output), type: "text" }],
				structuredContent: output,
			};
		},
	);

	server.registerResource(
		"typescript-resource-catalog",
		"typescript://resources/catalog",
		{
			cacheHint: { cacheScope: "public", ttlMs: 300_000 },
			description: "Curated authoritative resources available to the tutor.",
			mimeType: "application/json",
			title: "TypeScript Tutor Resource Catalog",
		},
		async (uri) => ({
			contents: [
				{
					mimeType: "application/json",
					text: JSON.stringify(dependencies.resources.all),
					uri: uri.href,
				},
			],
		}),
	);

	server.registerResource(
		"typescript-orchestration-catalog",
		"typescript://orchestration/patterns",
		{
			cacheHint: { cacheScope: "public", ttlMs: 300_000 },
			description:
				"Supported LangGraph workflow, Functional API, supervisor, and stateful-handoff patterns.",
			mimeType: "application/json",
			title: "TypeScript Tutor Orchestration Catalog",
		},
		async (uri) => ({
			contents: [
				{
					mimeType: "application/json",
					text: JSON.stringify({
						patterns: dependencies.orchestration.patterns,
						specialists: dependencies.orchestration.specialists,
					}),
					uri: uri.href,
				},
			],
		}),
	);

	server.registerPrompt(
		"review-typescript",
		{
			argsSchema: z.object({
				code: z.string().min(1).max(20_000),
				focus: z
					.string()
					.max(200)
					.default("correctness, type safety, maintainability, and tests"),
			}),
			description:
				"Create a rigorous TypeScript code-review request for the tutor.",
			title: "Review TypeScript",
		},
		({ code, focus }) => ({
			messages: [
				{
					content: {
						text: `Review this TypeScript for ${focus}. Rank findings by impact, explain each issue, and provide focused fixes.\n\n\`\`\`ts\n${code}\n\`\`\``,
						type: "text",
					},
					role: "user",
				},
			],
		}),
	);

	server.registerPrompt(
		"explain-typescript",
		{
			argsSchema: z.object({ topic: z.string().min(1).max(500) }),
			description: "Create a structured TypeScript learning request.",
			title: "Explain TypeScript",
		},
		({ topic }) => ({
			messages: [
				{
					content: {
						text: `Teach me ${topic} in TypeScript. Build from the mental model to a strict, practical example, common failure modes, and a short exercise. Cite authoritative sources.`,
						type: "text",
					},
					role: "user",
				},
			],
		}),
	);

	return server;
}

export function createTutorMcpHandler(
	dependencies: McpDependencies,
): McpHttpHandler {
	return createMcpHandler(() => createTutorMcpServer(dependencies), {
		legacy: "stateless",
		onerror: (error) => console.error("MCP request failed", error),
		responseMode: "auto",
	});
}

export async function serveMcp(
	handler: McpHttpHandler,
	request: Request,
): Promise<Response> {
	const rejected =
		hostHeaderValidationResponse(request, localhostAllowedHostnames()) ??
		originValidationResponse(request, localhostAllowedOrigins());
	return rejected ?? handler.fetch(request);
}
