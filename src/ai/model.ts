import { type ModelMessage, stepCountIs, ToolLoopAgent, tool } from "ai";
import * as z from "zod/v4";
import { messageText } from "./persistence";
import type { ResourceRegistry } from "./registry";
import type { TutorMessage } from "./schema";
import type { LearningResource, SpecialistId } from "./state";

export interface TutorGeneration {
	finishReason: string | undefined;
	inputTokens: number | undefined;
	outputTokens: number | undefined;
	responseTimeMs: number;
	text: string;
	totalTokens: number | undefined;
}

export interface TutorModel {
	generate(input: {
		citations: LearningResource[];
		history: TutorMessage[];
		modelId: string;
		prompt: string;
		specialist: {
			id: SpecialistId;
			instructions: string;
		};
	}): Promise<TutorGeneration>;
}

function toModelMessages(
	history: TutorMessage[],
	prompt: string,
): ModelMessage[] {
	const messages: ModelMessage[] = history
		.filter(
			(message) => message.role === "user" || message.role === "assistant",
		)
		.map((message) => ({ content: messageText(message), role: message.role }));
	messages.push({ content: prompt, role: "user" });
	return messages;
}

function systemInstructions(
	citations: LearningResource[],
	specialist: { id: SpecialistId; instructions: string },
): string {
	const trustedContext = citations
		.map(
			(resource) =>
				`- ${resource.title}: ${resource.summary} (${resource.url})`,
		)
		.join("\n");

	return `You are an expert TypeScript engineering tutor. Give correct, practical, production-grade guidance.

Active specialist: ${specialist.id}
Specialist focus: ${specialist.instructions}

Rules:
- Prefer modern TypeScript with strict compiler settings, explicit boundaries, and small testable units.
- Explain tradeoffs and failure modes; do not claim there is one universally best design.
- Use only the provided trusted resource registry for factual citations. Never invent URLs.
- Cite relevant claims with Markdown links.
- Tools are read-only. Use them when the supplied context is insufficient.
- Never request or expose secrets, execute code, or imply that unverified generated code was run.
- Keep code examples focused and compilable.

Initially relevant trusted resources:
${trustedContext || "No initial match. Search the trusted registry before citing sources."}`;
}

export class AiSdkTutorModel implements TutorModel {
	constructor(private readonly resources: ResourceRegistry) {}

	async generate(input: {
		citations: LearningResource[];
		history: TutorMessage[];
		modelId: string;
		prompt: string;
		specialist: { id: SpecialistId; instructions: string };
	}): Promise<TutorGeneration> {
		const searchResources = tool({
			description:
				"Search the curated, authoritative TypeScript and AI engineering resource registry.",
			execute: async ({ limit, query }) => this.resources.search(query, limit),
			inputSchema: z.object({
				limit: z.number().int().min(1).max(5).default(3),
				query: z.string().trim().min(1).max(300),
			}),
			strict: true,
		});
		const getResource = tool({
			description: "Get one trusted resource by its exact registry ID.",
			execute: async ({ id }) =>
				this.resources.get(id) ?? { error: "Resource not found." },
			inputSchema: z.object({ id: z.string().trim().min(1).max(100) }),
			strict: true,
		});
		const tools = { getResource, searchResources };
		const agent = new ToolLoopAgent({
			id: "typescript-tutor",
			instructions: systemInstructions(input.citations, input.specialist),
			maxOutputTokens: 4_000,
			maxRetries: 2,
			model: input.modelId,
			stopWhen: stepCountIs(8),
			temperature: 0.2,
			toolOrder: ["searchResources", "getResource"],
			tools,
		});

		const startedAt = performance.now();
		const result = await agent.generate({
			messages: toModelMessages(input.history, input.prompt),
			timeout: {
				stepMs: 30_000,
				toolMs: 5_000,
				totalMs: 90_000,
			},
		});

		return {
			finishReason: result.finishReason,
			inputTokens: result.totalUsage.inputTokens,
			outputTokens: result.totalUsage.outputTokens,
			responseTimeMs: Math.round(performance.now() - startedAt),
			text: result.text,
			totalTokens: result.totalUsage.totalTokens,
		};
	}
}
