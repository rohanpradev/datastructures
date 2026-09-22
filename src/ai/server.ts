import { createApi } from "./api";
import { FunctionalTutorWorkflow, TypeScriptTutorGraph } from "./graphs";
import { createTutorMcpHandler } from "./mcp";
import { AiSdkTutorModel } from "./model";
import { OrchestrationRegistry, TutorOrchestrator } from "./orchestration";
import {
	createDatabase,
	migrateDatabase,
	TutorRepository,
} from "./persistence";
import { ModelRegistry, ResourceRegistry } from "./registry";
import { DrizzleSqliteCheckpointer } from "./sqlite-checkpoint";

const database = createDatabase();
migrateDatabase(database.db);

const repository = new TutorRepository(database.db);
const resources = new ResourceRegistry();
const models = new ModelRegistry();
const checkpointer = new DrizzleSqliteCheckpointer(database.db);
const orchestration = new OrchestrationRegistry();
const tutorModel = new AiSdkTutorModel(resources);
const graph = new TypeScriptTutorGraph({
	checkpointer,
	models,
	orchestration,
	repository,
	resources,
	tutorModel,
});
const functional = new FunctionalTutorWorkflow({
	checkpointer,
	models,
	orchestration,
	repository,
	resources,
	tutorModel,
});
const tutor = new TutorOrchestrator(graph, functional);
const mcp = createTutorMcpHandler({ models, orchestration, resources, tutor });
const fetch = createApi({
	mcp,
	models,
	orchestration,
	repository,
	resources,
	tutor,
});
const parsedPort = Number(process.env["AI_PORT"] ?? 3001);
if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65_535) {
	throw new Error("AI_PORT must be an integer between 1 and 65535.");
}

const server = Bun.serve({
	fetch,
	hostname: "127.0.0.1",
	// The agent has a 90-second total budget; allow its response to finish.
	idleTimeout: 120,
	port: parsedPort,
});
console.log(`TypeScript AI Tutor listening at ${server.url}docs`);

let closing = false;
async function close(): Promise<void> {
	if (closing) return;
	closing = true;
	// Drain requests before closing the database used to persist their turns.
	await server.stop(false);
	await mcp.close();
	database.close();
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
