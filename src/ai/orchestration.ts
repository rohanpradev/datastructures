import { ApiError } from "./json";
import type {
	LearningResource,
	OrchestrationDecision,
	OrchestrationMode,
	OrchestrationPattern,
	SpecialistId,
	SpecialistProfile,
	TutorRequest,
	TutorResponse,
} from "./state";

export interface TutorRunner {
	run(request: TutorRequest): Promise<TutorResponse>;
}

const patterns = [
	{
		bestFor:
			"Auditable, stateful workflows whose topology should be inspectable.",
		caveat:
			"Use a single agent when routing would not materially improve context or ownership.",
		description:
			"An explicit LangGraph StateGraph retrieves context, generates an answer, and persists the turn.",
		id: "workflow",
		implementation: "graph-api",
	},
	{
		bestFor:
			"Procedural control flow with replayable side effects and compact composition.",
		caveat: "Less visually explicit than a StateGraph for complex branching.",
		description:
			"A LangGraph entrypoint composes replayable tasks for retrieval, generation, and persistence.",
		id: "functional",
		implementation: "functional-api",
	},
	{
		bestFor:
			"Requests with a clear domain boundary that benefits from isolated specialist instructions.",
		caveat:
			"Adds routing complexity and should be justified with evaluation data.",
		description:
			"A bounded supervisor-style router selects exactly one specialist before the shared answer workflow.",
		id: "supervisor",
		implementation: "supervisor-router",
	},
	{
		bestFor:
			"Threads where the active specialist should persist and hand off as the topic changes.",
		caveat:
			"This is a provider-neutral handoff topology, not the experimental langgraph-swarm prebuilt package.",
		description:
			"A stateful handoff keeps the active specialist in the durable graph checkpoint across turns.",
		id: "swarm",
		implementation: "stateful-handoffs",
	},
] as const satisfies readonly OrchestrationPattern[];

const specialists = [
	{
		description: "Cross-domain TypeScript engineering guidance.",
		id: "generalist",
		instructions:
			"Integrate language, runtime, data, AI, and quality concerns without over-specializing.",
	},
	{
		description: "Type-system design, compiler behavior, and API contracts.",
		id: "typescript-language",
		instructions:
			"Prioritize strict typing, sound narrowing, inference boundaries, compiler behavior, and ergonomic public APIs.",
	},
	{
		description: "Bun/Node runtimes, databases, deployment, and protocols.",
		id: "runtime-platform",
		instructions:
			"Prioritize runtime semantics, typed persistence, protocol correctness, operational safety, and deployment tradeoffs.",
	},
	{
		description: "AI SDK, LangGraph, agents, tools, and context engineering.",
		id: "ai-architecture",
		instructions:
			"Prioritize bounded agent loops, context isolation, durable execution, tool safety, observability, and evaluation.",
	},
	{
		description:
			"Testing strategy, static analysis, resilience, and maintainability.",
		id: "testing-quality",
		instructions:
			"Prioritize executable tests, failure modes, typed linting, deterministic behavior, and measurable quality gates.",
	},
] as const satisfies readonly SpecialistProfile[];

const specialistSignals: Record<
	Exclude<SpecialistId, "generalist">,
	readonly string[]
> = {
	"ai-architecture": [
		"agent",
		"ai sdk",
		"checkpoint",
		"context",
		"graph",
		"handoff",
		"langchain",
		"langgraph",
		"llm",
		"mcp",
		"model",
		"prompt",
		"supervisor",
		"swarm",
		"tool",
	],
	"runtime-platform": [
		"api",
		"bun",
		"database",
		"deployment",
		"drizzle",
		"http",
		"node",
		"orm",
		"protocol",
		"runtime",
		"server",
		"sqlite",
	],
	"testing-quality": [
		"benchmark",
		"coverage",
		"eslint",
		"eval",
		"lint",
		"mock",
		"quality",
		"reliability",
		"test",
		"testing",
	],
	"typescript-language": [
		"compiler",
		"conditional type",
		"generic",
		"inference",
		"interface",
		"narrowing",
		"tsconfig",
		"type",
		"typescript",
		"union",
	],
};

const categorySpecialist: Record<LearningResource["category"], SpecialistId> = {
	"ai-engineering": "ai-architecture",
	database: "runtime-platform",
	language: "typescript-language",
	protocol: "runtime-platform",
	runtime: "runtime-platform",
	testing: "testing-quality",
};

function selectSpecialist(
	prompt: string,
	citations: readonly LearningResource[],
): SpecialistId {
	const normalized = prompt.toLowerCase();
	const scores = new Map<SpecialistId, number>();
	for (const [specialist, signals] of Object.entries(
		specialistSignals,
	) as Array<[Exclude<SpecialistId, "generalist">, readonly string[]]>) {
		for (const signal of signals) {
			if (normalized.includes(signal))
				scores.set(specialist, (scores.get(specialist) ?? 0) + 2);
		}
	}
	for (const citation of citations) {
		const specialist = categorySpecialist[citation.category];
		scores.set(specialist, (scores.get(specialist) ?? 0) + citation.score);
	}

	return (
		[...scores.entries()].sort(
			([leftId, leftScore], [rightId, rightScore]) =>
				rightScore - leftScore || leftId.localeCompare(rightId),
		)[0]?.[0] ?? "generalist"
	);
}

export class OrchestrationRegistry {
	readonly patterns = patterns;
	readonly specialists = specialists;

	decide(input: {
		citations: readonly LearningResource[];
		mode: OrchestrationMode;
		previousSpecialist?: SpecialistId | undefined;
		prompt: string;
	}): OrchestrationDecision {
		if (input.mode === "workflow" || input.mode === "functional") {
			return {
				handoffFrom: null,
				mode: input.mode,
				reason:
					input.mode === "workflow"
						? "The explicit graph workflow is the default for inspectable, durable execution."
						: "The Functional API was requested for compact, replayable procedural execution.",
				specialist: "generalist",
			};
		}

		const specialist = selectSpecialist(input.prompt, input.citations);
		const previous = input.previousSpecialist ?? "generalist";
		return {
			handoffFrom:
				input.mode === "swarm" && previous !== specialist ? previous : null,
			mode: input.mode,
			reason:
				input.mode === "supervisor"
					? `The bounded supervisor routed this request to ${specialist} using deterministic domain signals.`
					: previous === specialist
						? `The stateful handoff workflow kept ${specialist} active for this thread.`
						: `The stateful handoff workflow moved the thread from ${previous} to ${specialist}.`,
			specialist,
		};
	}

	getSpecialist(id: SpecialistId): SpecialistProfile {
		const specialist = specialists.find((candidate) => candidate.id === id);
		if (!specialist) throw new Error(`Unknown specialist ${id}.`);
		return specialist;
	}
}

export class TutorOrchestrator implements TutorRunner {
	private readonly activeThreads = new Set<string>();

	constructor(
		private readonly graph: TutorRunner,
		private readonly functional: TutorRunner,
	) {}

	async run(request: TutorRequest): Promise<TutorResponse> {
		const threadId = request.threadId ?? Bun.randomUUIDv7();
		// REST and MCP share this instance. Guard across all workflow modes so
		// two turns cannot read stale history or overwrite a shared checkpoint.
		if (this.activeThreads.has(threadId)) {
			throw new ApiError(
				409,
				"thread_busy",
				"A tutor run is already active for this thread.",
			);
		}
		this.activeThreads.add(threadId);
		try {
			const runner =
				request.orchestration === "functional" ? this.functional : this.graph;
			return await runner.run({ ...request, threadId });
		} finally {
			this.activeThreads.delete(threadId);
		}
	}
}
