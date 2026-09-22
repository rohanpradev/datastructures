import { describe, expect, test } from "bun:test";
import * as z from "zod/v4";
import { parseJson } from "../json";

const schema = z.object({ text: z.string() });

describe("bounded JSON parsing", () => {
	test("cancels an oversized stream without draining the rest", async () => {
		let pulls = 0;
		let cancelled = false;
		const body = new ReadableStream<Uint8Array>(
			{
				pull(controller) {
					pulls++;
					controller.enqueue(new Uint8Array(17));
				},
				cancel() {
					cancelled = true;
				},
			},
			{ highWaterMark: 0 },
		);
		const request = new Request("http://localhost/", { method: "POST", body });
		await expect(parseJson(request, schema, 16)).rejects.toMatchObject({
			status: 413,
		});
		expect(cancelled).toBe(true);
		expect(pulls).toBe(1);
	});

	test("decodes UTF-8 split across chunks and accepts the exact byte limit", async () => {
		const bytes = new TextEncoder().encode(JSON.stringify({ text: "😀" }));
		let offset = 0;
		const body = new ReadableStream<Uint8Array>({
			pull(controller) {
				if (offset === bytes.length) controller.close();
				else controller.enqueue(bytes.slice(offset, ++offset));
			},
		});
		await expect(
			parseJson(
				new Request("http://localhost/", { method: "POST", body }),
				schema,
				bytes.length,
			),
		).resolves.toEqual({ text: "😀" });
	});

	test("counts bytes rather than characters", async () => {
		const body = JSON.stringify({ text: "😀" });
		await expect(
			parseJson(
				new Request("http://localhost/", { method: "POST", body }),
				schema,
				body.length,
			),
		).rejects.toMatchObject({ status: 413 });
	});

	test("cancels malformed UTF-8 input instead of leaving the stream open", async () => {
		let cancelled = false;
		const body = new ReadableStream<Uint8Array>(
			{
				pull(controller) {
					controller.enqueue(new Uint8Array([0xff]));
				},
				cancel() {
					cancelled = true;
				},
			},
			{ highWaterMark: 0 },
		);
		await expect(
			parseJson(
				new Request("http://localhost/", { method: "POST", body }),
				schema,
			),
		).rejects.toMatchObject({ status: 400 });
		expect(cancelled).toBe(true);
	});

	test("rejects an oversized declared length before reading", async () => {
		const request = new Request("http://localhost/", {
			method: "POST",
			body: "{}",
			headers: { "content-length": "100" },
		});
		await expect(parseJson(request, schema, 16)).rejects.toMatchObject({
			status: 413,
		});
	});

	test.each(["", "{", '{"text":1}'])(
		"rejects invalid input: %s",
		async (body) => {
			await expect(
				parseJson(
					new Request("http://localhost/", { method: "POST", body }),
					schema,
				),
			).rejects.toMatchObject({ status: body.includes("text") ? 422 : 400 });
		},
	);
});
