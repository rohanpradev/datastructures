import { resolve } from "node:path";
import type { McpHttpHandler } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { ApiError, errorResponse, jsonResponse, parseJson } from "./json";
import { serveMcp } from "./mcp";
import { openApiDocument, scalarDocument } from "./openapi";
import type { OrchestrationRegistry, TutorRunner } from "./orchestration";
import type { TutorRepository } from "./persistence";
import type { ModelRegistry, ResourceRegistry } from "./registry";
import {
	searchResourcesRequestSchema,
	threadListQuerySchema,
	tutorRequestSchema,
} from "./state";

const scalarBundlePath = resolve(
	import.meta.dir,
	"../../node_modules/@scalar/api-reference/dist/browser/standalone.js",
);
const threadPath = /^\/v1\/threads\/([^/]+)$/u;
const runPath = /^\/v1\/threads\/([^/]+)\/runs\/([^/]+)$/u;

function pathId(value: string): string {
	try {
		return z.uuid().parse(decodeURIComponent(value));
	} catch {
		throw new ApiError(
			400,
			"invalid_id",
			"Thread and run IDs must be valid UUIDs.",
		);
	}
}

export interface ApiDependencies {
	mcp: McpHttpHandler;
	models: ModelRegistry;
	orchestration: OrchestrationRegistry;
	repository: TutorRepository;
	resources: ResourceRegistry;
	tutor: TutorRunner;
}

export function createApi(dependencies: ApiDependencies) {
	return async function fetch(request: Request): Promise<Response> {
		try {
			const url = new URL(request.url);
			if (url.pathname === "/mcp") return serveMcp(dependencies.mcp, request);

			if (request.method === "GET" && url.pathname === "/health") {
				return jsonResponse({
					components: {
						aiSdk: "7",
						database: "drizzle-orm@1.0.0-rc.4/bun:sqlite",
						graph: "langgraph/graph+functional",
						mcp: "2.0.0/spec-2026-07-28",
						orchestration: "workflow+supervisor+stateful-handoffs",
					},
					defaultModel: dependencies.models.defaultModelId,
					status: "ok",
				});
			}

			if (request.method === "GET" && url.pathname === "/openapi.json") {
				return jsonResponse(openApiDocument);
			}

			if (
				request.method === "GET" &&
				url.pathname === "/v1/orchestration/patterns"
			) {
				return jsonResponse({
					patterns: dependencies.orchestration.patterns,
					specialists: dependencies.orchestration.specialists,
				});
			}

			if (request.method === "GET" && url.pathname === "/docs") {
				return new Response(scalarDocument(), {
					headers: { "content-type": "text/html; charset=utf-8" },
				});
			}

			if (request.method === "GET" && url.pathname === "/docs/scalar.js") {
				return new Response(Bun.file(scalarBundlePath), {
					headers: {
						"cache-control": "no-cache",
						"content-type": "text/javascript; charset=utf-8",
					},
				});
			}

			if (request.method === "POST" && url.pathname === "/v1/tutor/runs") {
				const input = await parseJson(request, tutorRequestSchema);
				return jsonResponse(await dependencies.tutor.run(input));
			}

			if (
				request.method === "POST" &&
				url.pathname === "/v1/resources/search"
			) {
				const input = await parseJson(request, searchResourcesRequestSchema);
				return jsonResponse({
					resources: dependencies.resources.search(input.query, input.limit),
				});
			}

			if (request.method === "GET" && url.pathname === "/v1/threads") {
				const query = threadListQuerySchema.safeParse(
					Object.fromEntries(url.searchParams),
				);
				if (!query.success) {
					throw new ApiError(
						422,
						"validation_error",
						"limit must be 1–100 and offset a non-negative integer.",
					);
				}
				return jsonResponse(
					await dependencies.repository.listThreads(query.data),
				);
			}

			const runMatch =
				request.method === "GET" ? runPath.exec(url.pathname) : null;
			if (runMatch?.[1] && runMatch[2]) {
				const run = await dependencies.repository.getRun(
					pathId(runMatch[1]),
					pathId(runMatch[2]),
				);
				if (!run)
					throw new ApiError(404, "run_not_found", "Tutor run not found.");
				// Provider errors stay in local storage; they can contain request details.
				return jsonResponse({
					run: { ...run, error: run.error ? "The tutor run failed." : null },
				});
			}

			const threadMatch =
				request.method === "GET" ? threadPath.exec(url.pathname) : null;
			if (threadMatch?.[1]) {
				const threadId = pathId(threadMatch[1]);
				const thread = await dependencies.repository.getThread(threadId);
				if (!thread)
					throw new ApiError(
						404,
						"thread_not_found",
						"Tutor thread not found.",
					);
				const messages = await dependencies.repository.listMessages(threadId);
				return jsonResponse({ messages, thread });
			}

			throw new ApiError(404, "not_found", "Route not found.");
		} catch (error) {
			return errorResponse(error);
		}
	};
}
