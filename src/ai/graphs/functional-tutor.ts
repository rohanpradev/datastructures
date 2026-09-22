import { entrypoint, task } from "@langchain/langgraph";
import type { TutorGeneration, TutorModel } from "../model";
import type { OrchestrationRegistry, TutorRunner } from "../orchestration";
import type { TutorRepository } from "../persistence";
import type { ModelRegistry, ResourceRegistry } from "../registry";
import type { DrizzleSqliteCheckpointer } from "../sqlite-checkpoint";
import {
	type GenerationMetrics,
	type LearningResource,
	type TutorRequest,
	type TutorResponse,
	tutorResponseSchema,
} from "../state";

export interface FunctionalTutorWorkflowDependencies {
	checkpointer: DrizzleSqliteCheckpointer;
	models: ModelRegistry;
	orchestration: OrchestrationRegistry;
	repository: TutorRepository;
	resources: ResourceRegistry;
	tutorModel: TutorModel;
}

interface FunctionalRunInput {
	modelId: string;
	prompt: string;
	runId: string;
	threadId: string;
}

function metrics(generation: TutorGeneration): GenerationMetrics {
	return {
		finishReason: generation.finishReason,
		inputTokens: generation.inputTokens,
		outputTokens: generation.outputTokens,
		responseTimeMs: generation.responseTimeMs,
		totalTokens: generation.totalTokens,
	};
}

export class FunctionalTutorWorkflow implements TutorRunner {
	private readonly workflow;

	constructor(
		private readonly dependencies: FunctionalTutorWorkflowDependencies,
	) {
		const { orchestration, repository, resources, tutorModel } = dependencies;
		const prepareRun = task(
			"functional_prepare_run",
			async (input: FunctionalRunInput) => {
				await repository.ensureThread(input.threadId, input.prompt);
				await repository.startRun({
					id: input.runId,
					modelId: input.modelId,
					threadId: input.threadId,
				});
				return input;
			},
		);
		const retrieveContext = task(
			"functional_retrieve_context",
			async (prompt: string): Promise<LearningResource[]> =>
				resources.search(prompt, 5),
		);
		const generateAnswer = task(
			"functional_generate_answer",
			async (input: FunctionalRunInput & { citations: LearningResource[] }) => {
				const history = await repository.listMessages(input.threadId);
				return tutorModel.generate({
					citations: input.citations,
					history,
					modelId: input.modelId,
					prompt: input.prompt,
					specialist: orchestration.getSpecialist("generalist"),
				});
			},
		);
		const persistTurn = task(
			"functional_persist_turn",
			async (input: FunctionalRunInput & { generation: TutorGeneration }) => {
				await repository.appendTurn(
					input.threadId,
					input.runId,
					input.prompt,
					input.generation.text,
				);
				await repository.completeRun(input.runId, metrics(input.generation));
				return true;
			},
		);

		this.workflow = entrypoint(
			{
				checkpointer: dependencies.checkpointer,
				name: "typescript_tutor_functional",
			},
			async (input: FunctionalRunInput) => {
				await prepareRun(input);
				const citations = await retrieveContext(input.prompt);
				const generation = await generateAnswer({ ...input, citations });
				await persistTurn({ ...input, generation });
				return {
					answer: generation.text,
					citations,
					model: input.modelId,
					orchestration: orchestration.decide({
						citations,
						mode: "functional",
						prompt: input.prompt,
					}),
					runId: input.runId,
					threadId: input.threadId,
				};
			},
		);
	}

	async run(request: TutorRequest): Promise<TutorResponse> {
		const threadId = request.threadId ?? Bun.randomUUIDv7();
		const runId = Bun.randomUUIDv7();
		const modelId = this.dependencies.models.resolve(request.model);
		try {
			const result = await this.workflow.invoke(
				{ modelId, prompt: request.prompt, runId, threadId },
				{
					configurable: {
						thread_id: `${threadId}:functional`,
					},
					recursionLimit: 12,
				},
			);
			return tutorResponseSchema.parse(result);
		} catch (error) {
			await this.dependencies.repository.failRun(runId, error);
			throw error;
		}
	}
}
