import * as z from "zod/v4";
import {
	learningResourceSchema,
	orchestrationCatalogSchema,
	searchResourcesRequestSchema,
	tutorRequestSchema,
	tutorResponseSchema,
} from "./state";

const errorSchema = z.object({
	error: z.object({ code: z.string(), message: z.string() }),
});

const threadSchema = z.object({
	id: z.uuid(),
	title: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

const runSchema = z.object({
	id: z.uuid(),
	threadId: z.uuid(),
	modelId: z.string(),
	status: z.enum(["running", "completed", "failed"]),
	startedAt: z.iso.datetime(),
	completedAt: z.iso.datetime().nullable(),
	error: z.string().nullable(),
	finishReason: z.string().nullable(),
	inputTokens: z.number().int().nullable(),
	outputTokens: z.number().int().nullable(),
	totalTokens: z.number().int().nullable(),
	responseTimeMs: z.number().int().nullable(),
});

export const openApiDocument = {
	components: {
		schemas: {
			ApiError: z.toJSONSchema(errorSchema),
			ThreadList: z.toJSONSchema(
				z.object({
					threads: z.array(threadSchema),
					nextOffset: z.number().int().nullable(),
				}),
			),
			RunStatus: z.toJSONSchema(z.object({ run: runSchema })),
			LearningResource: z.toJSONSchema(learningResourceSchema),
			GatewayModel: z.toJSONSchema(
				z.object({
					id: z.string(),
					name: z.string(),
					provider: z.string(),
				}),
			),
			OrchestrationCatalog: z.toJSONSchema(orchestrationCatalogSchema),
			SearchResourcesRequest: z.toJSONSchema(searchResourcesRequestSchema),
			TutorRequest: z.toJSONSchema(tutorRequestSchema),
			TutorResponse: z.toJSONSchema(tutorResponseSchema),
		},
	},
	info: {
		description:
			"A durable TypeScript engineering tutor powered by AI SDK 7, LangGraph, Drizzle ORM, and MCP v2.",
		title: "TypeScript AI Tutor API",
		version: "1.0.0",
	},
	openapi: "3.1.0",
	paths: {
		"/health": {
			get: {
				operationId: "getHealth",
				responses: {
					"200": {
						content: { "application/json": { schema: { type: "object" } } },
						description: "Service health and component versions.",
					},
				},
				summary: "Check service health",
			},
		},
		"/v1/orchestration/patterns": {
			get: {
				description:
					"Describes the supported Graph API, Functional API, bounded supervisor, and stateful handoff modes.",
				operationId: "listOrchestrationPatterns",
				responses: {
					"200": {
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/OrchestrationCatalog",
								},
							},
						},
						description: "Available orchestration patterns and specialists.",
					},
				},
				summary: "List orchestration patterns",
			},
		},
		"/v1/models": {
			get: {
				description:
					"Returns Vercel AI Gateway language models that support tool use, for populating a model selector.",
				operationId: "listGatewayModels",
				responses: {
					"200": {
						description: "Available Gateway models and the configured default.",
						content: {
							"application/json": {
								schema: {
									properties: {
										defaultModel: { type: "string" },
										models: {
											items: { $ref: "#/components/schemas/GatewayModel" },
											type: "array",
										},
									},
									required: ["defaultModel", "models"],
									type: "object",
								},
							},
						},
					},
					"502": { description: "The Gateway model catalog is unavailable." },
				},
				summary: "List models from Vercel AI Gateway",
			},
		},
		"/v1/resources/search": {
			post: {
				operationId: "searchResources",
				requestBody: {
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/SearchResourcesRequest" },
						},
					},
					required: true,
				},
				responses: {
					"200": {
						content: {
							"application/json": {
								schema: {
									properties: {
										resources: {
											items: { $ref: "#/components/schemas/LearningResource" },
											type: "array",
										},
									},
									required: ["resources"],
									type: "object",
								},
							},
						},
						description: "Ranked authoritative resources.",
					},
				},
				summary: "Search the trusted resource registry",
			},
		},
		"/v1/tutor/runs": {
			post: {
				description:
					"Runs the selected durable Graph API, Functional API, supervisor, or stateful-handoff mode and persists the completed turn.",
				operationId: "runTutor",
				requestBody: {
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/TutorRequest" },
						},
					},
					required: true,
				},
				responses: {
					"200": {
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/TutorResponse" },
							},
						},
						description: "Completed tutor response.",
					},
					"422": {
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/ApiError" },
							},
						},
						description: "Invalid request.",
					},
					"409": {
						description:
							"A run is already active for this thread. Retry after it finishes.",
					},
					"413": { description: "Request body exceeds 64 KiB." },
					"400": { description: "Malformed JSON or invalid UTF-8." },
				},
				summary: "Ask the TypeScript tutor",
			},
		},
		"/v1/threads": {
			get: {
				operationId: "listThreads",
				summary: "Browse saved tutor conversations",
				description:
					"Newest activity first, with ID as a deterministic tie-breaker. Follow nextOffset until null. Concurrent activity may reorder offset pages; restart from zero to refresh.",
				parameters: [
					{
						in: "query",
						name: "limit",
						schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
					},
					{
						in: "query",
						name: "offset",
						schema: { type: "integer", minimum: 0, default: 0 },
					},
				],
				responses: {
					"200": {
						description: "A page of saved threads.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/ThreadList" },
							},
						},
					},
					"422": { description: "Invalid pagination parameters." },
				},
			},
		},
		"/v1/threads/{threadId}/runs/{runId}": {
			get: {
				operationId: "getRunStatus",
				summary: "Read persisted run status and token usage",
				parameters: [
					{
						in: "path",
						name: "threadId",
						required: true,
						schema: { format: "uuid", type: "string" },
					},
					{
						in: "path",
						name: "runId",
						required: true,
						schema: { format: "uuid", type: "string" },
					},
				],
				responses: {
					"200": {
						description:
							"Run status, timing and aggregate usage; provider error details are redacted.",
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/RunStatus" },
							},
						},
					},
					"400": { description: "Invalid thread or run UUID." },
					"404": { description: "Run not found under this thread." },
				},
			},
		},
		"/v1/threads/{threadId}": {
			get: {
				operationId: "getThread",
				parameters: [
					{
						in: "path",
						name: "threadId",
						required: true,
						schema: { format: "uuid", type: "string" },
					},
				],
				responses: {
					"200": {
						content: { "application/json": { schema: { type: "object" } } },
						description: "Thread and validated UI message history.",
					},
					"404": { description: "Thread not found." },
				},
				summary: "Read a tutor thread",
			},
		},
		"/mcp": {
			post: {
				description:
					"MCP v2 (2026-07-28) Streamable HTTP endpoint with stateless 2025 compatibility.",
				operationId: "mcpExchange",
				responses: {
					"200": { description: "MCP JSON or scoped SSE response." },
				},
				summary: "Exchange an MCP message",
			},
		},
	},
	servers: [{ description: "Local Bun server", url: "http://127.0.0.1:3001" }],
} as const;

export function scalarDocument(): string {
	return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TypeScript AI Tutor API</title></head>
<body><div id="app"></div><script src="/docs/scalar.js"></script><script>Scalar.createApiReference('#app',{url:'/openapi.json',theme:'purple',layout:'modern',hideClientButton:false,showOperationId:true})</script></body>
</html>`;
}
