import { describe, expect, test } from "bun:test";
import { createGatewayModelCatalog } from "../gateway-models";

const catalog = {
	data: [
		{ id: "z/model", name: "Zed", type: "language", tags: ["tool-use"] },
		{ id: "a/model", type: "language", tags: ["tool-use"] },
		{ id: "a/image", type: "image", tags: ["tool-use"] },
		{ id: "a/chat", type: "language", tags: [] },
		{ id: "a/unknown" },
	],
};

describe("Gateway model catalog", () => {
	test("filters, sorts, coalesces concurrent requests, and expires the cache", async () => {
		let calls = 0;
		let time = 0;
		const list = createGatewayModelCatalog(
			async (url, init) => {
				calls++;
				expect(url).toBe("https://ai-gateway.vercel.sh/v1/models");
				expect(init.signal).toBeInstanceOf(AbortSignal);
				return Response.json(catalog);
			},
			() => time,
		);
		const [first, concurrent] = await Promise.all([list(), list()]);
		expect(first).toEqual([
			{ id: "a/model", name: "a/model", provider: "a" },
			{ id: "z/model", name: "Zed", provider: "z" },
		]);
		expect(concurrent).toEqual(first);
		expect(await list()).toEqual(first);
		expect(calls).toBe(1);
		time = 3_600_000;
		await list();
		expect(calls).toBe(2);
	});

	test("serves stale data during outages and bounds retry frequency", async () => {
		let calls = 0;
		let time = 0;
		let fail = false;
		const list = createGatewayModelCatalog(
			async () => {
				calls++;
				if (fail) throw new Error("private upstream details");
				return Response.json(catalog);
			},
			() => time,
		);
		const first = await list();
		fail = true;
		time = 3_600_000;
		expect(await list()).toEqual(first);
		expect(await list()).toEqual(first);
		expect(calls).toBe(2);
		fail = false;
		time += 30_000;
		expect(await list()).toEqual(first);
		expect(calls).toBe(3);
	});

	test.each(["http", "schema", "json", "throw"])(
		"sanitizes %s failure and recovers after backoff",
		async (failure) => {
			let calls = 0;
			let time = 0;
			const list = createGatewayModelCatalog(
				async () => {
					calls++;
					if (calls > 1) return Response.json({ data: [] });
					if (failure === "http")
						return new Response("upstream", { status: 503 });
					if (failure === "schema") return Response.json({ data: [{ id: 1 }] });
					if (failure === "json") return new Response("invalid json");
					throw new Error("private upstream details");
				},
				() => time,
			);
			await expect(list()).rejects.toMatchObject({
				status: 502,
				code: "gateway_catalog_unavailable",
			});
			await expect(list()).rejects.toThrow("temporarily unavailable");
			expect(calls).toBe(1);
			time = 30_000;
			expect(await list()).toEqual([]);
			expect(calls).toBe(2);
		},
	);
});
