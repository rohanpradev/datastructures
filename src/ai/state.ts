import { StateSchema } from "@langchain/langgraph";
import * as z from "zod/v4";

export const resourceCategorySchema = z.enum([
	"ai-engineering",
	"database",
	"language",
	"protocol",
	"runtime",
	"testing",
]);

export const learningResourceSchema = z.object({
	category: resourceCategorySchema,
	id: z.string(),
	score: z.number().min(0).max(1),
	summary: z.string(),
	title: z.string(),
	url: z.string().url(),
});

export const orchestrationModeSchema = z.enum([
	"workflow",
	"functional",
	"supervisor",
	"swarm",
]);

export const specialistIdSchema = z.enum([
	"generalist",
	"typescript-language",
	"runtime-platform",
	"ai-architecture",
	"testing-quality",
]);

export const orchestrationDecisionSchema = z.object({
	handoffFrom: specialistIdSchema.nullable(),
	mode: orchestrationModeSchema,
	reason: z.string(),
	specialist: specialistIdSchema,
});

export const orchestrationPatternSchema = z.object({
	bestFor: z.string(),
	caveat: z.string(),
	description: z.string(),
	id: orchestrationModeSchema,
	implementation: z.enum([
		"graph-api",
		"functional-api",
		"supervisor-router",
		"stateful-handoffs",
	]),
});

export const specialistProfileSchema = z.object({
	description: z.string(),
	id: specialistIdSchema,
	instructions: z.string(),
});

export const orchestrationCatalogSchema = z.object({
	patterns: z.array(orchestrationPatternSchema),
	specialists: z.array(specialistProfileSchema),
});

export const modelIdSchema = z
	.string()
	.trim()
	.max(160)
	.regex(
		/^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._:/-]*$/iu,
		"Model IDs must use the provider/model format.",
	);

export const threadListQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(20),
	offset: z.coerce
		.number()
		.int()
		.min(0)
		.max(Number.MAX_SAFE_INTEGER - 100)
		.default(0),
});

export const tutorRequestSchema = z.object({
	model: modelIdSchema.optional(),
	orchestration: orchestrationModeSchema.optional(),
	prompt: z.string().trim().min(1).max(16_000),
	threadId: z.uuid().optional(),
});

export const tutorResponseSchema = z.object({
	answer: z.string(),
	citations: z.array(learningResourceSchema),
	model: z.string(),
	orchestration: orchestrationDecisionSchema,
	runId: z.uuid(),
	threadId: z.uuid(),
});

export const searchResourcesRequestSchema = z.object({
	limit: z.number().int().min(1).max(10).default(5),
	query: z.string().trim().min(1).max(500),
});

export const generationMetricsSchema = z.object({
	finishReason: z.string().optional(),
	inputTokens: z.number().int().nonnegative().optional(),
	outputTokens: z.number().int().nonnegative().optional(),
	responseTimeMs: z.number().int().nonnegative(),
	totalTokens: z.number().int().nonnegative().optional(),
});

export const TutorStateSchema = new StateSchema({
	activeSpecialist: specialistIdSchema.optional(),
	answer: z.string().default(""),
	citations: z.array(learningResourceSchema).default(() => []),
	generation: generationMetricsSchema.optional(),
	handoffFrom: specialistIdSchema.nullable().default(null),
	modelId: z.string(),
	orchestration: orchestrationModeSchema,
	prompt: z.string(),
	routingReason: z.string().default(""),
	runId: z.string(),
	selectedSpecialist: specialistIdSchema.default("generalist"),
	status: z.enum(["completed", "failed", "running"]).default("running"),
	threadId: z.string(),
});

export type LearningResource = z.infer<typeof learningResourceSchema>;
export type GenerationMetrics = z.infer<typeof generationMetricsSchema>;
export type OrchestrationDecision = z.infer<typeof orchestrationDecisionSchema>;
export type OrchestrationMode = z.infer<typeof orchestrationModeSchema>;
export type OrchestrationPattern = z.infer<typeof orchestrationPatternSchema>;
export type SpecialistProfile = z.infer<typeof specialistProfileSchema>;
export type SpecialistId = z.infer<typeof specialistIdSchema>;
export type TutorGraphState = typeof TutorStateSchema.State;
export type TutorRequest = z.infer<typeof tutorRequestSchema>;
export type TutorResponse = z.infer<typeof tutorResponseSchema>;
