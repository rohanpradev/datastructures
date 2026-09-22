import { type LearningResource, modelIdSchema } from "./state";

type ResourceDefinition = Omit<LearningResource, "score"> & {
	keywords: readonly string[];
};

const resources = [
	{
		category: "language",
		id: "typescript-handbook",
		keywords: [
			"typescript",
			"types",
			"generics",
			"narrowing",
			"union",
			"unions",
			"discriminated",
			"classes",
			"functions",
		],
		summary:
			"The canonical guide to TypeScript's type system and language features.",
		title: "TypeScript Handbook",
		url: "https://www.typescriptlang.org/docs/handbook/intro.html",
	},
	{
		category: "language",
		id: "typescript-release-notes",
		keywords: [
			"typescript",
			"latest",
			"release",
			"migration",
			"compiler",
			"tsconfig",
		],
		summary:
			"Official release notes for current TypeScript behavior and migrations.",
		title: "TypeScript Release Notes",
		url: "https://www.typescriptlang.org/docs/handbook/release-notes/overview.html",
	},
	{
		category: "language",
		id: "typescript-eslint",
		keywords: ["typescript", "lint", "eslint", "static analysis", "quality"],
		summary:
			"Typed linting guidance for correctness rules beyond the compiler.",
		title: "typescript-eslint Typed Linting",
		url: "https://typescript-eslint.io/getting-started/typed-linting/",
	},
	{
		category: "runtime",
		id: "bun-typescript",
		keywords: ["bun", "typescript", "runtime", "test", "sqlite", "server"],
		summary:
			"Bun's official TypeScript runtime, testing, and server documentation.",
		title: "Bun TypeScript Guide",
		url: "https://bun.sh/docs/typescript",
	},
	{
		category: "ai-engineering",
		id: "ai-sdk-agents",
		keywords: [
			"ai sdk",
			"agent",
			"tools",
			"tool loop",
			"streaming",
			"typescript",
		],
		summary: "Official AI SDK guidance for bounded, typed tool-loop agents.",
		title: "AI SDK: Building Agents",
		url: "https://ai-sdk.dev/docs/agents/building-agents",
	},
	{
		category: "ai-engineering",
		id: "ai-sdk-tools",
		keywords: ["ai sdk", "tools", "zod", "schema", "approval", "typescript"],
		summary:
			"Typed tool schemas, execution, approvals, and lifecycle behavior in AI SDK Core.",
		title: "AI SDK Core: Tools",
		url: "https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling",
	},
	{
		category: "ai-engineering",
		id: "langgraph-graph-api",
		keywords: [
			"langgraph",
			"graph",
			"state",
			"workflow",
			"durable",
			"typescript",
		],
		summary:
			"Official LangGraph graph and state API for durable agent workflows.",
		title: "LangGraph Graph API",
		url: "https://docs.langchain.com/oss/javascript/langgraph/graph-api",
	},
	{
		category: "ai-engineering",
		id: "langgraph-persistence",
		keywords: [
			"langgraph",
			"persistence",
			"checkpoint",
			"thread",
			"sqlite",
			"durable",
		],
		summary:
			"Checkpoint, thread, replay, and durable execution semantics for LangGraph.",
		title: "LangGraph Persistence",
		url: "https://docs.langchain.com/oss/javascript/langgraph/persistence",
	},
	{
		category: "ai-engineering",
		id: "langgraph-functional-api",
		keywords: [
			"langgraph",
			"functional",
			"entrypoint",
			"task",
			"workflow",
			"durable",
			"typescript",
		],
		summary:
			"Official procedural workflow API using entrypoints and replayable tasks on the LangGraph runtime.",
		title: "LangGraph Functional API",
		url: "https://docs.langchain.com/oss/javascript/langgraph/functional-api",
	},
	{
		category: "ai-engineering",
		id: "langgraph-workflows-agents",
		keywords: [
			"langgraph",
			"workflow",
			"agent",
			"router",
			"parallel",
			"orchestrator",
			"evaluator",
		],
		summary:
			"Official guide to deterministic workflows, agents, routing, parallelization, orchestrator-worker, and evaluator patterns.",
		title: "LangGraph Workflows and Agents",
		url: "https://docs.langchain.com/oss/javascript/langgraph/workflows-agents",
	},
	{
		category: "ai-engineering",
		id: "langchain-multi-agent",
		keywords: [
			"langchain",
			"multi agent",
			"supervisor",
			"subagent",
			"handoff",
			"router",
			"swarm",
			"context",
		],
		summary:
			"Official decision guide for subagents, handoffs, routers, skills, and custom multi-agent workflows.",
		title: "LangChain Multi-Agent Patterns",
		url: "https://docs.langchain.com/oss/javascript/langchain/multi-agent",
	},
	{
		category: "ai-engineering",
		id: "langchain-handoffs",
		keywords: [
			"langchain",
			"handoff",
			"swarm",
			"active agent",
			"state",
			"multi agent",
		],
		summary:
			"Official state-driven handoff pattern for persisting an active agent across conversation turns.",
		title: "LangChain Multi-Agent Handoffs",
		url: "https://docs.langchain.com/oss/javascript/langchain/multi-agent/handoffs",
	},
	{
		category: "database",
		id: "drizzle-bun-sqlite",
		keywords: [
			"drizzle",
			"orm",
			"sqlite",
			"bun",
			"database",
			"typesafe",
			"query",
		],
		summary: "The official type-safe Drizzle adapter and setup for Bun SQLite.",
		title: "Drizzle ORM with Bun SQLite",
		url: "https://orm.drizzle.team/docs/get-started/bun-sqlite-new",
	},
	{
		category: "protocol",
		id: "mcp-typescript-v2",
		keywords: [
			"mcp",
			"v2",
			"typescript",
			"tools",
			"resources",
			"prompts",
			"server",
		],
		summary: "Official MCP v2 TypeScript SDK documentation and examples.",
		title: "MCP TypeScript SDK v2",
		url: "https://ts.sdk.modelcontextprotocol.io/v2/",
	},
	{
		category: "protocol",
		id: "mcp-streamable-http",
		keywords: ["mcp", "http", "transport", "origin", "security", "stateless"],
		summary:
			"The current MCP Streamable HTTP transport and security requirements.",
		title: "MCP Streamable HTTP Specification",
		url: "https://modelcontextprotocol.io/specification/2026-07-28/basic/transports#streamable-http",
	},
	{
		category: "ai-engineering",
		id: "vercel-ai-source",
		keywords: [
			"github",
			"ai sdk",
			"typescript",
			"provider",
			"streaming",
			"tools",
		],
		summary:
			"Production TypeScript reference implementation behind the provider-neutral AI SDK.",
		title: "Vercel AI SDK Source",
		url: "https://github.com/vercel/ai",
	},
	{
		category: "ai-engineering",
		id: "openai-agents-js",
		keywords: [
			"github",
			"agent",
			"typescript",
			"guardrail",
			"tracing",
			"approval",
			"handoff",
		],
		summary:
			"A strong reference for explicit agent orchestration, guardrails, approvals, and tracing.",
		title: "OpenAI Agents SDK for JavaScript",
		url: "https://github.com/openai/openai-agents-js",
	},
	{
		category: "ai-engineering",
		id: "deepagents-js",
		keywords: [
			"github",
			"agent",
			"typescript",
			"langgraph",
			"planning",
			"context",
			"sandbox",
		],
		summary:
			"A LangGraph-native TypeScript harness demonstrating planning and context separation.",
		title: "Deep Agents JS",
		url: "https://github.com/langchain-ai/deepagentsjs",
	},
	{
		category: "ai-engineering",
		id: "deepseek-agent-catalog",
		keywords: ["deepseek", "agent", "harness", "mcp", "typescript", "github"],
		summary:
			"DeepSeek's official catalog of agent projects and MCP-capable harnesses.",
		title: "Awesome DeepSeek Agent",
		url: "https://github.com/deepseek-ai/awesome-deepseek-agent",
	},
	{
		category: "testing",
		id: "bun-test",
		keywords: ["bun", "test", "mock", "typescript", "coverage"],
		summary:
			"Bun's official fast TypeScript test runner and mocking documentation.",
		title: "Bun Test Runner",
		url: "https://bun.sh/docs/test",
	},
] as const satisfies readonly ResourceDefinition[];

const wordPattern = /[a-z0-9][a-z0-9+#.-]*/giu;

function terms(value: string): Set<string> {
	return new Set(
		(value.toLowerCase().match(wordPattern) ?? []).filter(
			(term) => term.length > 1,
		),
	);
}

function scoreResource(
	resource: ResourceDefinition,
	query: Set<string>,
): number {
	const title = terms(resource.title);
	const keywords = terms(resource.keywords.join(" "));
	const summary = terms(resource.summary);
	let points = 0;
	for (const term of query) {
		if (title.has(term)) points += 4;
		if (keywords.has(term)) points += 3;
		if (summary.has(term)) points += 1;
	}
	return query.size === 0 ? 0 : Math.min(1, points / (query.size * 4));
}

export class ResourceRegistry {
	readonly all = resources.map(({ keywords: _keywords, ...resource }) => ({
		...resource,
		score: 1,
	}));

	get(id: string): LearningResource | undefined {
		return this.all.find((resource) => resource.id === id);
	}

	search(query: string, limit = 5): LearningResource[] {
		const queryTerms = terms(query);
		return resources
			.map((resource) => ({
				resource,
				score: scoreResource(resource, queryTerms),
			}))
			.filter(({ score }) => score > 0)
			.sort(
				(left, right) =>
					right.score - left.score ||
					left.resource.title.localeCompare(right.resource.title),
			)
			.slice(0, Math.max(1, Math.min(10, limit)))
			.map(({ resource: { keywords: _keywords, ...resource }, score }) => ({
				...resource,
				score,
			}));
	}
}

export class ModelRegistry {
	readonly defaultModelId: string;

	constructor(defaultModelId = process.env["AI_MODEL"] ?? "openai/gpt-5.5") {
		this.defaultModelId = modelIdSchema.parse(defaultModelId);
	}

	resolve(requested?: string): string {
		return requested === undefined
			? this.defaultModelId
			: modelIdSchema.parse(requested);
	}
}
