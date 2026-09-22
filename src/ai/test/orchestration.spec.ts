import { describe, expect, test } from "bun:test";
import { TutorOrchestrator, type TutorRunner } from "../orchestration";
import type { TutorRequest, TutorResponse } from "../state";

function answer(request: TutorRequest): TutorResponse {
	return {
		answer: request.prompt,
		citations: [],
		model: "test/model",
		orchestration: {
			mode: request.orchestration ?? "workflow",
			specialist: "generalist",
			handoffFrom: null,
			reason: "test",
		},
		runId: Bun.randomUUIDv7(),
		threadId: request.threadId!,
	};
}

describe("tutor concurrency", () => {
	test("rejects overlapping modes on one thread but allows other threads", async () => {
		const gate = Promise.withResolvers<void>();
		let calls = 0;
		const runner: TutorRunner = {
			async run(request) {
				calls++;
				await gate.promise;
				return answer(request);
			},
		};
		const tutor = new TutorOrchestrator(runner, runner);
		const threadId = Bun.randomUUIDv7();
		const first = tutor.run({ prompt: "first", threadId });
		try {
			await expect(
				tutor.run({
					prompt: "conflict",
					threadId,
					orchestration: "functional",
				}),
			).rejects.toMatchObject({ status: 409, code: "thread_busy" });
			const other = tutor.run({ prompt: "independent" });
			expect(calls).toBe(2);
			gate.resolve();
			await Promise.all([first, other]);
			await expect(
				tutor.run({ prompt: "next", threadId }),
			).resolves.toMatchObject({ answer: "next" });
		} finally {
			gate.resolve();
			await first;
		}
	});

	test("releases the thread guard after a failed run", async () => {
		let failed = false;
		const runner: TutorRunner = {
			async run(request) {
				if (!failed) {
					failed = true;
					throw new Error("provider unavailable");
				}
				return answer(request);
			},
		};
		const tutor = new TutorOrchestrator(runner, runner);
		const request = { prompt: "retry", threadId: Bun.randomUUIDv7() };
		await expect(tutor.run(request)).rejects.toThrow("provider unavailable");
		await expect(tutor.run(request)).resolves.toMatchObject({
			answer: "retry",
		});
	});
});
