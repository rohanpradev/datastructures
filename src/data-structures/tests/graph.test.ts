import { describe, expect, test } from "bun:test";
import { Graph } from "@/data-structures/graph/graph";

describe("Graph - Constructor", () => {
	test("should create empty undirected graph", () => {
		const graph = new Graph<string>();
		expect(graph.isEmpty()).toBe(true);
		expect(graph.size()).toBe(0);
	});

	test("should create empty directed graph", () => {
		const graph = new Graph<string>(true);
		expect(graph.isEmpty()).toBe(true);
	});
});

describe("Graph - AddVertex", () => {
	test("should add vertex", () => {
		const graph = new Graph<string>();
		graph.addVertex("A");
		expect(graph.hasVertex("A")).toBe(true);
		expect(graph.size()).toBe(1);
	});

	test("should not add duplicate vertex", () => {
		const graph = new Graph<string>();
		graph.addVertex("A").addVertex("A");
		expect(graph.size()).toBe(1);
	});

	test("should support method chaining", () => {
		const graph = new Graph<string>();
		graph.addVertex("A").addVertex("B").addVertex("C");
		expect(graph.size()).toBe(3);
	});
});

describe("Graph - AddEdge", () => {
	test("should add edge in undirected graph", () => {
		const graph = new Graph<string>();
		graph.addEdge("A", "B");
		expect(graph.hasEdge("A", "B")).toBe(true);
		expect(graph.hasEdge("B", "A")).toBe(true);
	});

	test("should add edge in directed graph", () => {
		const graph = new Graph<string>(true);
		graph.addEdge("A", "B");
		expect(graph.hasEdge("A", "B")).toBe(true);
		expect(graph.hasEdge("B", "A")).toBe(false);
	});

	test("should auto-add vertices if not exist", () => {
		const graph = new Graph<string>();
		graph.addEdge("A", "B");
		expect(graph.hasVertex("A")).toBe(true);
		expect(graph.hasVertex("B")).toBe(true);
	});

	test("should handle self-loop in directed graph", () => {
		const graph = new Graph<string>(true);
		graph.addEdge("A", "A");
		expect(graph.hasEdge("A", "A")).toBe(true);
	});
});

describe("Graph - RemoveVertex", () => {
	test("should remove vertex and its edges", () => {
		const graph = new Graph<string>();
		graph.addEdge("A", "B").addEdge("A", "C");
		expect(graph.removeVertex("A")).toBe(true);
		expect(graph.hasVertex("A")).toBe(false);
		expect(graph.hasEdge("B", "A")).toBe(false);
	});

	test("should return false for non-existent vertex", () => {
		const graph = new Graph<string>();
		expect(graph.removeVertex("A")).toBe(false);
	});
});

describe("Graph - RemoveEdge", () => {
	test("should remove edge in undirected graph", () => {
		const graph = new Graph<string>();
		graph.addEdge("A", "B");
		expect(graph.removeEdge("A", "B")).toBe(true);
		expect(graph.hasEdge("A", "B")).toBe(false);
		expect(graph.hasEdge("B", "A")).toBe(false);
	});

	test("should remove edge in directed graph", () => {
		const graph = new Graph<string>(true);
		graph.addEdge("A", "B");
		expect(graph.removeEdge("A", "B")).toBe(true);
		expect(graph.hasEdge("A", "B")).toBe(false);
	});

	test("should return false for non-existent edge", () => {
		const graph = new Graph<string>();
		graph.addVertex("A").addVertex("B");
		expect(graph.removeEdge("A", "B")).toBe(false);
	});
});

describe("Graph - GetNeighbors", () => {
	test("should return neighbors", () => {
		const graph = new Graph<string>();
		graph.addEdge("A", "B").addEdge("A", "C");
		const neighbors = graph.getNeighbors("A");
		expect(neighbors).toContain("B");
		expect(neighbors).toContain("C");
	});

	test("should return empty array for no neighbors", () => {
		const graph = new Graph<string>();
		graph.addVertex("A");
		expect(graph.getNeighbors("A")).toEqual([]);
	});

	test("should return empty array for non-existent vertex", () => {
		const graph = new Graph<string>();
		expect(graph.getNeighbors("A")).toEqual([]);
	});
});

describe("Graph - BFS", () => {
	test("should traverse graph in BFS order", () => {
		const graph = new Graph<string>();
		graph
			.addEdge("A", "B")
			.addEdge("A", "C")
			.addEdge("B", "D")
			.addEdge("C", "D");
		const result = graph.bfs("A");
		expect(result[0]).toBe("A");
		expect(result).toContain("B");
		expect(result).toContain("C");
		expect(result).toContain("D");
		expect(result.length).toBe(4);
	});

	test("should return empty for non-existent start", () => {
		const graph = new Graph<string>();
		expect(graph.bfs("A")).toEqual([]);
	});

	test("should handle single vertex", () => {
		const graph = new Graph<string>();
		graph.addVertex("A");
		expect(graph.bfs("A")).toEqual(["A"]);
	});

	test("should handle disconnected components", () => {
		const graph = new Graph<string>();
		graph.addEdge("A", "B").addEdge("C", "D");
		const result = graph.bfs("A");
		expect(result).toContain("A");
		expect(result).toContain("B");
		expect(result).not.toContain("C");
	});
});

describe("Graph - DFS", () => {
	test("should traverse graph in DFS order", () => {
		const graph = new Graph<string>();
		graph
			.addEdge("A", "B")
			.addEdge("A", "C")
			.addEdge("B", "D")
			.addEdge("C", "D");
		const result = graph.dfs("A");
		expect(result[0]).toBe("A");
		expect(result).toContain("B");
		expect(result).toContain("C");
		expect(result).toContain("D");
		expect(result.length).toBe(4);
	});

	test("should return empty for non-existent start", () => {
		const graph = new Graph<string>();
		expect(graph.dfs("A")).toEqual([]);
	});

	test("should handle single vertex", () => {
		const graph = new Graph<string>();
		graph.addVertex("A");
		expect(graph.dfs("A")).toEqual(["A"]);
	});
});

describe("Graph - Utility Methods", () => {
	test("getAllVertices should return all vertices", () => {
		const graph = new Graph<string>();
		graph.addVertex("A").addVertex("B").addVertex("C");
		const vertices = graph.getAllVertices();
		expect(vertices.length).toBe(3);
		expect(vertices).toContain("A");
		expect(vertices).toContain("B");
		expect(vertices).toContain("C");
	});

	test("clear should remove all vertices", () => {
		const graph = new Graph<string>();
		graph.addEdge("A", "B").addEdge("C", "D");
		graph.clear();
		expect(graph.isEmpty()).toBe(true);
		expect(graph.size()).toBe(0);
	});

	test("toString should return string representation", () => {
		const graph = new Graph<string>();
		graph.addEdge("A", "B");
		const str = graph.toString();
		expect(str).toContain("A");
		expect(str).toContain("B");
	});
});

describe("Graph - Integration Scenarios", () => {
	test("should build complex graph", () => {
		const graph = new Graph<number>();
		[1, 2, 3, 4, 5].forEach((v) => graph.addVertex(v));
		graph.addEdge(1, 2).addEdge(1, 3).addEdge(2, 4).addEdge(3, 4).addEdge(4, 5);

		expect(graph.size()).toBe(5);
		expect(graph.hasEdge(1, 2)).toBe(true);
		expect(graph.hasEdge(4, 5)).toBe(true);

		const bfs = graph.bfs(1);
		expect(bfs).toContain(1);
		expect(bfs).toContain(5);
	});

	test("should handle directed acyclic graph", () => {
		const graph = new Graph<string>(true);
		graph.addEdge("A", "B").addEdge("B", "C").addEdge("A", "C");

		expect(graph.hasEdge("A", "B")).toBe(true);
		expect(graph.hasEdge("B", "A")).toBe(false);

		const dfs = graph.dfs("A");
		expect(dfs[0]).toBe("A");
	});

	test("should handle graph modifications", () => {
		const graph = new Graph<string>();
		graph.addEdge("A", "B").addEdge("B", "C").addEdge("C", "D");

		graph.removeEdge("B", "C");
		expect(graph.hasEdge("B", "C")).toBe(false);

		graph.removeVertex("A");
		expect(graph.hasVertex("A")).toBe(false);
		expect(graph.size()).toBe(3);
	});
});
