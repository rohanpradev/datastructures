import { END, START, StateGraph } from "@langchain/langgraph";
import type { TutorModel } from "../model";
import type { OrchestrationRegistry } from "../orchestration";
import type { TutorRepository } from "../persistence";
import type { ModelRegistry, ResourceRegistry } from "../registry";
import type { DrizzleSqliteCheckpointer } from "../sqlite-checkpoint";
import {
	type TutorRequest,
	type TutorResponse,
	TutorStateSchema,
	tutorResponseSchema,
} from "../state";

export interface TypeScriptTutorGraphDependencies {
	checkpointer: DrizzleSqliteCheckpointer;
	models: ModelRegistry;
	orchestration: OrchestrationRegistry;
	repository: TutorRepository;
	resources: ResourceRegistry;
	tutorModel: TutorModel;
}

export class TypeScriptTutorGraph {
	private readonly graph;

	constructor(private readonly dependencies: TypeScriptTutorGraphDependencies) {
		const { orchestration, repository, resources, tutorModel } = dependencies;
		this.graph = new StateGraph(TutorStateSchema)
			.addNode("retrieve_context", async (state) => ({
				citations: resources.search(state.prompt, 5),
			}))
			.addNode("route_specialist", async (state) => {
				const decision = orchestration.decide({
					citations: state.citations,
					mode: state.orchestration,
					previousSpecialist: state.activeSpecialist,
					prompt: state.prompt,
				});
				return {
					...(state.orchestration === "swarm"
						? { activeSpecialist: decision.specialist }
						: {}),
					handoffFrom: decision.handoffFrom,
					routingReason: decision.reason,
					selectedSpecialist: decision.specialist,
				};
			})
			.addNode("generate_answer", async (state) => {
				const history = await repository.listMessages(state.threadId);
				const generation = await tutorModel.generate({
					citations: state.citations,
					history,
					modelId: state.modelId,
					prompt: state.prompt,
					specialist: orchestration.getSpecialist(state.selectedSpecialist),
				});
				return {
					answer: generation.text,
					generation: {
						finishReason: generation.finishReason,
						inputTokens: generation.inputTokens,
						outputTokens: generation.outputTokens,
						responseTimeMs: generation.responseTimeMs,
						totalTokens: generation.totalTokens,
					},
				};
			})
			.addNode("persist_turn", async (state) => {
				if (!state.generation)
					throw new Error("The model did not produce run metrics.");
				await repository.appendTurn(
					state.threadId,
					state.runId,
					state.prompt,
					state.answer,
				);
				await repository.completeRun(state.runId, state.generation);
				return { status: "completed" as const };
			})
			.addEdge(START, "retrieve_context")
			.addEdge("retrieve_context", "route_specialist")
			.addEdge("route_specialist", "generate_answer")
			.addEdge("generate_answer", "persist_turn")
			.addEdge("persist_turn", END)
			.compile({ checkpointer: dependencies.checkpointer });
	}

	async run(request: TutorRequest): Promise<TutorResponse> {
		const threadId = request.threadId ?? Bun.randomUUIDv7();
		const runId = Bun.randomUUIDv7();
		const modelId = this.dependencies.models.resolve(request.model);
		await this.dependencies.repository.ensureThread(threadId, request.prompt);
		await this.dependencies.repository.startRun({
			id: runId,
			modelId,
			threadId,
		});

		try {
			const result = await this.graph.invoke(
				{
					answer: "",
					citations: [],
					handoffFrom: null,
					modelId,
					orchestration: request.orchestration ?? "workflow",
					prompt: request.prompt,
					routingReason: "",
					runId,
					selectedSpecialist: "generalist",
					status: "running",
					threadId,
				},
				{
					configurable: { thread_id: threadId },
					recursionLimit: 12,
				},
			);

			return tutorResponseSchema.parse({
				answer: result.answer,
				citations: result.citations,
				model: result.modelId,
				orchestration: {
					handoffFrom: result.handoffFrom,
					mode: result.orchestration,
					reason: result.routingReason,
					specialist: result.selectedSpecialist,
				},
				runId,
				threadId,
			});
		} catch (error) {
			await this.dependencies.repository.failRun(runId, error);
			throw error;
		}
	}
}
