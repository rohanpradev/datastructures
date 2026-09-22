import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import type { McpHttpHandler } from "@modelcontextprotocol/server";
import { createApi } from "../api";
import { FunctionalTutorWorkflow, TypeScriptTutorGraph } from "../graphs";
import { createTutorMcpHandler } from "../mcp";
import type { TutorGeneration, TutorModel } from "../model";
import { OrchestrationRegistry, TutorOrchestrator } from "../orchestration";
import {
	createDatabase,
	type DatabaseHandle,
	migrateDatabase,
	TutorRepository,
} from "../persistence";
import { ModelRegistry, ResourceRegistry } from "../registry";
import { DrizzleSqliteCheckpointer } from "../sqlite-checkpoint";

class FakeTutorModel implements TutorModel {
	readonly calls: string[] = [];

	async generate(input: { prompt: string }): Promise<TutorGeneration> {
		this.calls.push(input.prompt);
		return {
			finishReason: "stop",
			inputTokens: 12,
			outputTokens: 8,
			responseTimeMs: 5,
			text: `Typed answer for: ${input.prompt}`,
			totalTokens: 20,
		};
	}
}

async function mcpPayload(
	response: Response,
): Promise<Record<string, unknown>> {
	expect(response.status).toBe(200);
	const responseText = await response.text();
	const jsonText = response.headers
		.get("content-type")
		?.includes("text/event-stream")
		? responseText
				.split("\n")
				.find((line) => line.startsWith("data: "))
				?.slice(6)
		: responseText;
	expect(jsonText).toBeDefined();
	return JSON.parse(jsonText ?? "null") as Record<string, unknown>;
}

async function callMcp(
	api: (request: Request) => Promise<Response>,
	method: string,
	params: Record<string, unknown>,
): Promise<Record<string, unknown>> {
	return mcpPayload(
		await api(
			new Request("http://127.0.0.1:3001/mcp", {
				body: JSON.stringify({
					id: Bun.randomUUIDv7(),
					jsonrpc: "2.0",
					method,
					params,
				}),
				headers: {
					accept: "application/json, text/event-stream",
					"content-type": "application/json",
					host: "127.0.0.1:3001",
					"mcp-protocol-version": "2025-06-18",
					origin: "http://127.0.0.1:3001",
				},
				method: "POST",
			}),
		),
	);
}

describe("TypeScript AI tutor service", () => {
	let api: (request: Request) => Promise<Response>;
	let checkpointer: DrizzleSqliteCheckpointer;
	let database: DatabaseHandle;
	let fakeModel: FakeTutorModel;
	let graph: TypeScriptTutorGraph;
	let mcp: McpHttpHandler;
	let orchestration: OrchestrationRegistry;
	let repository: TutorRepository;
	let resources: ResourceRegistry;

	beforeEach(() => {
		database = createDatabase(":memory:");
		migrateDatabase(database.db);
		repository = new TutorRepository(database.db);
		resources = new ResourceRegistry();
		const models = new ModelRegistry("openai/test-model");
		checkpointer = new DrizzleSqliteCheckpointer(database.db);
		fakeModel = new FakeTutorModel();
		orchestration = new OrchestrationRegistry();
		graph = new TypeScriptTutorGraph({
			checkpointer,
			models,
			orchestration,
			repository,
			resources,
			tutorModel: fakeModel,
		});
		const functional = new FunctionalTutorWorkflow({
			checkpointer,
			models,
			orchestration,
			repository,
			resources,
			tutorModel: fakeModel,
		});
		const tutor = new TutorOrchestrator(graph, functional);
		mcp = createTutorMcpHandler({ models, orchestration, resources, tutor });
		api = createApi({
			mcp,
			models,
			orchestration,
			repository,
			resources,
			tutor,
		});
	});

	afterEach(async () => {
		if (mcp) await mcp.close();
		if (database) database.close();
	});

	test("ranks authoritative resources deterministically", () => {
		const results = resources.search("typed Drizzle SQLite queries", 3);
		expect(results[0]?.id).toBe("drizzle-bun-sqlite");
		expect(results).toHaveLength(3);
		expect(results.every((resource) => resource.score > 0)).toBe(true);
	});

	test("runs, checkpoints, and persists a graph turn", async () => {
		const threadId = Bun.randomUUIDv7();
		const result = await graph.run({
			prompt: "Explain discriminated unions",
			threadId,
		});

		expect(result.answer).toContain("discriminated unions");
		expect(result.citations.length).toBeGreaterThan(0);
		expect(result.orchestration).toMatchObject({
			mode: "workflow",
			specialist: "generalist",
		});
		expect(fakeModel.calls).toEqual(["Explain discriminated unions"]);
		expect(await repository.listMessages(threadId)).toHaveLength(2);
		expect(await repository.getRun(threadId, result.runId)).toMatchObject({
			status: "completed",
			totalTokens: 20,
		});
		expect(
			await checkpointer.getTuple({ configurable: { thread_id: threadId } }),
		).toBeDefined();
	});

	test("runs the replayable LangGraph Functional API workflow", async () => {
		const response = await api(
			new Request("http://127.0.0.1:3001/v1/tutor/runs", {
				body: JSON.stringify({
					orchestration: "functional",
					prompt: "Explain TypeScript conditional types",
				}),
				headers: { "content-type": "application/json" },
				method: "POST",
			}),
		);
		const result = (await response.json()) as {
			orchestration: { mode: string; specialist: string };
			runId: string;
			threadId: string;
		};

		expect(response.status).toBe(200);
		expect(result.orchestration).toEqual(
			expect.objectContaining({ mode: "functional", specialist: "generalist" }),
		);
		expect(await repository.listMessages(result.threadId)).toHaveLength(2);
		expect(
			await repository.getRun(result.threadId, result.runId),
		).toMatchObject({
			status: "completed",
		});
		expect(
			await checkpointer.getTuple({
				configurable: {
					thread_id: `${result.threadId}:functional`,
				},
			}),
		).toBeDefined();
	});

	test("routes bounded supervisors and persists swarm-style handoffs", async () => {
		const supervised = await graph.run({
			orchestration: "supervisor",
			prompt: "Design a LangGraph agent with MCP tools and checkpoints",
		});
		expect(supervised.orchestration).toMatchObject({
			handoffFrom: null,
			mode: "supervisor",
			specialist: "ai-architecture",
		});

		const threadId = Bun.randomUUIDv7();
		const runtimeTurn = await graph.run({
			orchestration: "swarm",
			prompt: "Tune Bun SQLite database runtime behavior",
			threadId,
		});
		expect(runtimeTurn.orchestration.specialist).toBe("runtime-platform");

		const languageTurn = await graph.run({
			orchestration: "swarm",
			prompt: "Explain discriminated union narrowing",
			threadId,
		});
		expect(languageTurn.orchestration).toMatchObject({
			handoffFrom: "runtime-platform",
			mode: "swarm",
			specialist: "typescript-language",
		});
	});

	test("serves JSON, OpenAPI, and self-hosted Scalar docs", async () => {
		const health = await api(new Request("http://127.0.0.1:3001/health"));
		expect(health.status).toBe(200);
		expect(await health.json()).toMatchObject({ status: "ok" });

		const openapi = await api(
			new Request("http://127.0.0.1:3001/openapi.json"),
		);
		expect(await openapi.json()).toMatchObject({ openapi: "3.1.0" });

		const docs = await api(new Request("http://127.0.0.1:3001/docs"));
		expect(await docs.text()).toContain("Scalar.createApiReference");

		const patterns = await api(
			new Request("http://127.0.0.1:3001/v1/orchestration/patterns"),
		);
		const patternCatalog = (await patterns.json()) as {
			patterns: Array<{ id: string }>;
			specialists: Array<{ id: string }>;
		};
		expect(patternCatalog.patterns.map(({ id }) => id)).toEqual([
			"workflow",
			"functional",
			"supervisor",
			"swarm",
		]);
		expect(patternCatalog.specialists[0]?.id).toBe("generalist");

		const resourceSearch = await api(
			new Request("http://127.0.0.1:3001/v1/resources/search", {
				body: JSON.stringify({ query: "Drizzle SQLite" }),
				headers: { "content-type": "application/json" },
				method: "POST",
			}),
		);
		const searchBody = (await resourceSearch.json()) as {
			resources: Array<{ id: string }>;
		};
		expect(searchBody.resources[0]?.id).toBe("drizzle-bun-sqlite");

		const run = await api(
			new Request("http://127.0.0.1:3001/v1/tutor/runs", {
				body: JSON.stringify({ prompt: "Explain TypeScript narrowing" }),
				headers: { "content-type": "application/json" },
				method: "POST",
			}),
		);
		const runBody = (await run.json()) as { threadId: string };
		const thread = await api(
			new Request(`http://127.0.0.1:3001/v1/threads/${runBody.threadId}`),
		);
		expect(await thread.json()).toMatchObject({
			messages: [{ role: "user" }, { role: "assistant" }],
		});

		const missing = await api(
			new Request(`http://127.0.0.1:3001/v1/threads/${Bun.randomUUIDv7()}`),
		);
		expect(missing.status).toBe(404);
	});

	test("serves the MCP v2 package with legacy stateless negotiation", async () => {
		const response = await api(
			new Request("http://127.0.0.1:3001/mcp", {
				body: JSON.stringify({
					id: 1,
					jsonrpc: "2.0",
					method: "initialize",
					params: {
						capabilities: {},
						clientInfo: { name: "test-client", version: "1.0.0" },
						protocolVersion: "2025-06-18",
					},
				}),
				headers: {
					accept: "application/json, text/event-stream",
					"content-type": "application/json",
					host: "127.0.0.1:3001",
					origin: "http://127.0.0.1:3001",
				},
				method: "POST",
			}),
		);

		const payload = (await mcpPayload(response)) as {
			result?: { serverInfo?: { name?: string } };
		};
		expect(payload.result?.serverInfo?.name).toBe("typescript-ai-tutor");
	});

	test("executes the registered MCP tools, resource, and prompts", async () => {
		const search = await callMcp(api, "tools/call", {
			arguments: { limit: 2, query: "Drizzle SQLite" },
			name: "search_typescript_resources",
		});
		const searchResult = search["result"] as {
			structuredContent: { resources: Array<{ id: string }> };
		};
		expect(searchResult.structuredContent.resources[0]?.id).toBe(
			"drizzle-bun-sqlite",
		);

		const tutor = await callMcp(api, "tools/call", {
			arguments: { prompt: "Explain TypeScript exhaustiveness" },
			name: "ask_typescript_tutor",
		});
		expect(tutor).toMatchObject({
			result: {
				structuredContent: {
					answer: "Typed answer for: Explain TypeScript exhaustiveness",
				},
			},
		});

		const resource = await callMcp(api, "resources/read", {
			uri: "typescript://resources/catalog",
		});
		expect(JSON.stringify(resource)).toContain("typescript-handbook");

		const orchestrationResource = await callMcp(api, "resources/read", {
			uri: "typescript://orchestration/patterns",
		});
		expect(JSON.stringify(orchestrationResource)).toContain("functional-api");

		const reviewPrompt = await callMcp(api, "prompts/get", {
			arguments: { code: "const value: unknown = 1;" },
			name: "review-typescript",
		});
		expect(JSON.stringify(reviewPrompt)).toContain("Review this TypeScript");

		const explainPrompt = await callMcp(api, "prompts/get", {
			arguments: { topic: "conditional types" },
			name: "explain-typescript",
		});
		expect(JSON.stringify(explainPrompt)).toContain("conditional types");
	});

	test("rejects invalid input before invoking the graph", async () => {
		const response = await api(
			new Request("http://127.0.0.1:3001/v1/tutor/runs", {
				body: JSON.stringify({ prompt: "" }),
				headers: { "content-type": "application/json" },
				method: "POST",
			}),
		);

		expect(response.status).toBe(422);
		expect(fakeModel.calls).toHaveLength(0);
	});

	test("honors the configured default model and validates explicit IDs", async () => {
		const models = new ModelRegistry("test/configured-model");
		expect(models.resolve()).toBe("test/configured-model");
		expect(models.resolve(" test/override ")).toBe("test/override");
		const result = await graph.run({ prompt: "Explain narrowing" });
		expect(result.model).toBe("openai/test-model");
		const response = await api(
			new Request("http://localhost/v1/tutor/runs", {
				method: "POST",
				body: JSON.stringify({
					prompt: "Explain types",
					model: "invalid-model",
				}),
			}),
		);
		expect(response.status).toBe(422);
		expect(fakeModel.calls).toHaveLength(1);
	});

	test("browses persisted threads with bounded pagination and deterministic ties", async () => {
		const ids = [
			Bun.randomUUIDv7(),
			Bun.randomUUIDv7(),
			Bun.randomUUIDv7(),
		].sort();
		for (const id of ids) await repository.ensureThread(id, `Topic ${id}`);
		database.client.run("UPDATE tutor_threads SET updated_at = 1000");
		const first = await api(new Request("http://localhost/v1/threads?limit=2"));
		expect(await first.json()).toMatchObject({
			threads: [{ id: ids[2] }, { id: ids[1] }],
			nextOffset: 2,
		});
		const last = await api(
			new Request("http://localhost/v1/threads?limit=2&offset=2"),
		);
		expect(await last.json()).toMatchObject({
			threads: [{ id: ids[0] }],
			nextOffset: null,
		});
		const empty = await api(
			new Request("http://localhost/v1/threads?offset=3"),
		);
		expect(await empty.json()).toEqual({ threads: [], nextOffset: null });
		for (const query of [
			"limit=0",
			"limit=101",
			"limit=NaN",
			"offset=-1",
			"offset=1.5",
		]) {
			expect(
				(await api(new Request(`http://localhost/v1/threads?${query}`))).status,
			).toBe(422);
		}
	});

	test("exposes run status only under its own thread", async () => {
		const result = await graph.run({ prompt: "Explain generics" });
		const path = `http://localhost/v1/threads/${result.threadId}/runs/${result.runId}`;
		const response = await api(new Request(path));
		expect(await response.json()).toMatchObject({
			run: { id: result.runId, status: "completed", totalTokens: 20 },
		});
		expect(
			(
				await api(
					new Request(
						`http://localhost/v1/threads/${Bun.randomUUIDv7()}/runs/${result.runId}`,
					),
				)
			).status,
		).toBe(404);
		await repository.failRun(
			result.runId,
			new Error("private provider details"),
		);
		const failure = await api(new Request(path));
		expect(await failure.json()).toMatchObject({
			run: { status: "failed", error: "The tutor run failed." },
		});
	});

	test("returns client errors for malformed path IDs", async () => {
		for (const id of ["%ZZ", "not-a-uuid"]) {
			expect(
				(await api(new Request(`http://localhost/v1/threads/${id}`))).status,
			).toBe(400);
		}
	});

	test("serves the actual Scalar bundle with revalidation after upgrades", async () => {
		const response = await api(new Request("http://localhost/docs/scalar.js"));
		expect(response.status).toBe(200);
		expect(response.headers.get("cache-control")).toBe("no-cache");
		expect((await response.text()).length).toBeGreaterThan(1000);
	});
});
