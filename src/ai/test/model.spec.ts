import { expect, spyOn, test } from "bun:test";
import { type Tool, ToolLoopAgent } from "ai";
import { AiSdkTutorModel } from "../model";
import { ResourceRegistry } from "../registry";

type RegistryTools = {
	getResource: Tool<{ id: string }, unknown>;
	searchResources: Tool<{ query: string; limit: number }, unknown>;
};

test("records token usage across every agent step", async () => {
	const generate = spyOn(ToolLoopAgent.prototype, "generate").mockResolvedValue(
		{
			finishReason: "stop",
			text: "Answer after using a tool",
			usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
			totalUsage: { inputTokens: 30, outputTokens: 12, totalTokens: 42 },
		} as Awaited<ReturnType<ToolLoopAgent["generate"]>>,
	);
	try {
		const resources = new ResourceRegistry();
		const result = await new AiSdkTutorModel(new ResourceRegistry()).generate({
			citations: resources.search("TypeScript", 2),
			history: ["system", "user", "assistant"].map((role, sequence) => ({
				id: Bun.randomUUIDv7(),
				threadId: Bun.randomUUIDv7(),
				runId: Bun.randomUUIDv7(),
				createdAt: new Date(),
				sequence,
				role: role as "system" | "user" | "assistant",
				parts: [{ type: "text" as const, text: `${role} history` }],
			})),
			modelId: "test/model",
			prompt: "Explain types",
			specialist: { id: "generalist", instructions: "Explain clearly" },
		});
		expect(result).toMatchObject({
			inputTokens: 30,
			outputTokens: 12,
			totalTokens: 42,
		});
		expect(generate.mock.calls[0]?.[0]).toMatchObject({
			messages: [
				{ role: "user", content: "user history" },
				{ role: "assistant", content: "assistant history" },
				{ role: "user", content: "Explain types" },
			],
		});
	} finally {
		generate.mockRestore();
	}
});

test("agent tools only retrieve from the trusted registry", async () => {
	const generate = spyOn(
		ToolLoopAgent.prototype,
		"generate",
	).mockImplementation(async function (
		this: ToolLoopAgent<never, RegistryTools>,
	) {
		const options = { toolCallId: "test", messages: [], context: {} };
		const search = this.tools.searchResources.execute;
		const lookup = this.tools.getResource.execute;
		expect(search).toBeDefined();
		expect(lookup).toBeDefined();
		const found = await search!({ query: "Drizzle SQLite", limit: 1 }, options);
		expect(found).toMatchObject([{ id: "drizzle-bun-sqlite" }]);
		expect(await lookup!({ id: "drizzle-bun-sqlite" }, options)).toMatchObject({
			id: "drizzle-bun-sqlite",
		});
		expect(
			await lookup!({ id: "https://untrusted.example/" }, options),
		).toEqual({ error: "Resource not found." });
		return { finishReason: "stop", text: "done", totalUsage: {} } as Awaited<
			ReturnType<ToolLoopAgent["generate"]>
		>;
	});
	try {
		await new AiSdkTutorModel(new ResourceRegistry()).generate({
			citations: [],
			history: [],
			modelId: "test/model",
			prompt: "Explain types",
			specialist: { id: "generalist", instructions: "Explain clearly" },
		});
	} finally {
		generate.mockRestore();
	}
});
