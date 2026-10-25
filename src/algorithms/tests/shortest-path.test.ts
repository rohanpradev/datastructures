import { describe, expect, test } from "bun:test";
import {
	shortestPath,
	type WeightedEdge,
} from "@/algorithms/graphs/shortest-path";

describe("shortestPath", () => {
	test("finds a cheaper indirect route and reconstructs its vertices", () => {
		const graph = [
			[
				{ to: 1, weight: 9 },
				{ to: 2, weight: 2 },
			],
			[],
			[{ to: 1, weight: 1 }],
		];
		expect(shortestPath(graph, 0, 1)).toEqual({ distance: 3, path: [0, 2, 1] });
		expect(shortestPath(graph, 1, 0)).toBeNull();
		expect(shortestPath(graph, 1, 1)).toEqual({ distance: 0, path: [1] });
	});

	test("handles obsolete entries, parallel edges and zero-cost cycles", () => {
		const graph = [
			[
				{ to: 1, weight: 9 },
				{ to: 1, weight: 8 },
				{ to: 2, weight: 2 },
			],
			[{ to: 3, weight: 20 }],
			[
				{ to: 1, weight: 1 },
				{ to: 0, weight: 0 },
			],
			[],
		];
		expect(shortestPath(graph, 0, 3)).toEqual({
			distance: 23,
			path: [0, 2, 1, 3],
		});
	});

	test("matches Bellman-Ford on a reproducible family of directed graphs", () => {
		for (let seed = 1; seed <= 20; seed++) {
			const graph: WeightedEdge[][] = Array.from({ length: 8 }, () => []);
			for (let from = 0; from < 8; from++) {
				for (let to = 0; to < 8; to++) {
					if ((from * 13 + to * 7 + seed) % 4 === 0) {
						graph[from].push({ to, weight: (from + to * seed) % 11 });
					}
				}
			}
			const distance = Array<number>(8).fill(Infinity);
			distance[0] = 0;
			for (let pass = 0; pass < 7; pass++) {
				for (let from = 0; from < 8; from++) {
					for (const { to, weight } of graph[from])
						distance[to] = Math.min(distance[to], distance[from] + weight);
				}
			}
			for (let to = 0; to < 8; to++) {
				expect(shortestPath(graph, 0, to)?.distance ?? Infinity).toBe(
					distance[to],
				);
			}
		}
	});

	test("rejects bad vertices, negative weights, and unsafe arithmetic", () => {
		for (const weight of [-1, 0.5, NaN, Infinity]) {
			expect(() => shortestPath([[{ to: 1, weight }], []], 0, 1)).toThrow(
				RangeError,
			);
		}
		expect(() => shortestPath([], 0, 0)).toThrow(RangeError);
		expect(() => shortestPath([[]], 0.5, 0)).toThrow(RangeError);
		expect(() => shortestPath([[{ to: 2, weight: 1 }]], 0, 0)).toThrow(
			RangeError,
		);
		expect(() =>
			shortestPath(
				[
					[{ to: 1, weight: Number.MAX_SAFE_INTEGER }],
					[{ to: 2, weight: 1 }],
					[],
				],
				0,
				2,
			),
		).toThrow(RangeError);
	});
});
