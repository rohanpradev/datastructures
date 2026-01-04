import { describe, expect, test } from "bun:test";
import {
  canFinish,
  cloneGraph,
  GraphNode,
  numIslands,
  pacificAtlantic,
  shortestPathBinaryMatrix,
  getTotalInformTime,
} from "@/data-structures/graph/problems/leetcode-graph";

describe("numIslands", () => {
  test("should count islands in grid", () => {
    const grid = [
      ["1", "1", "1", "1", "0"],
      ["1", "1", "0", "1", "0"],
      ["1", "1", "0", "0", "0"],
      ["0", "0", "0", "0", "0"],
    ];
    expect(numIslands(grid)).toBe(1);
  });

  test("should handle multiple islands", () => {
    const grid = [
      ["1", "1", "0", "0", "0"],
      ["1", "1", "0", "0", "0"],
      ["0", "0", "1", "0", "0"],
      ["0", "0", "0", "1", "1"],
    ];
    expect(numIslands(grid)).toBe(3);
  });

  test("should handle empty grid", () => {
    expect(numIslands([])).toBe(0);
  });

  test("should handle all water", () => {
    const grid = [
      ["0", "0"],
      ["0", "0"],
    ];
    expect(numIslands(grid)).toBe(0);
  });

  test("should handle all land", () => {
    const grid = [
      ["1", "1"],
      ["1", "1"],
    ];
    expect(numIslands(grid)).toBe(1);
  });

  test("should handle single cell", () => {
    expect(numIslands([["1"]])).toBe(1);
    expect(numIslands([["0"]])).toBe(0);
  });
});

describe("canFinish", () => {
  test("should return true when courses can be finished", () => {
    expect(canFinish(2, [[1, 0]])).toBe(true);
    expect(canFinish(2, [])).toBe(true);
  });

  test("should return false when cycle exists", () => {
    expect(
      canFinish(2, [
        [1, 0],
        [0, 1],
      ]),
    ).toBe(false);
  });

  test("should handle complex dependencies", () => {
    expect(
      canFinish(4, [
        [1, 0],
        [2, 0],
        [3, 1],
        [3, 2],
      ]),
    ).toBe(true);
  });

  test("should handle single course", () => {
    expect(canFinish(1, [])).toBe(true);
  });

  test("should detect self-loop", () => {
    expect(canFinish(1, [[0, 0]])).toBe(false);
  });
});

describe("cloneGraph", () => {
  test("should clone graph", () => {
    const node1 = new GraphNode(1);
    const node2 = new GraphNode(2);
    const node3 = new GraphNode(3);
    const node4 = new GraphNode(4);

    node1.neighbors = [node2, node4];
    node2.neighbors = [node1, node3];
    node3.neighbors = [node2, node4];
    node4.neighbors = [node1, node3];

    const cloned = cloneGraph(node1);

    expect(cloned).not.toBe(node1);
    expect(cloned?.val).toBe(1);
    expect(cloned?.neighbors.length).toBe(2);
  });

  test("should handle null", () => {
    expect(cloneGraph(null)).toBeNull();
  });

  test("should handle single node", () => {
    const node = new GraphNode(1);
    const cloned = cloneGraph(node);
    expect(cloned?.val).toBe(1);
    expect(cloned?.neighbors.length).toBe(0);
  });
});

describe("shortestPathBinaryMatrix", () => {
  test("should find shortest path", () => {
    const grid = [
      [0, 1],
      [1, 0],
    ];
    expect(shortestPathBinaryMatrix(grid)).toBe(2);
  });

  test("should return -1 when no path exists", () => {
    const grid = [
      [1, 0],
      [1, 0],
    ];
    expect(shortestPathBinaryMatrix(grid)).toBe(-1);
  });

  test("should handle direct path", () => {
    const grid = [
      [0, 0, 0],
      [1, 1, 0],
      [1, 1, 0],
    ];
    expect(shortestPathBinaryMatrix(grid)).toBe(4);
  });

  test("should handle blocked start/end", () => {
    const grid = [
      [1, 0],
      [0, 0],
    ];
    expect(shortestPathBinaryMatrix(grid)).toBe(-1);
  });

  test("should handle single cell", () => {
    expect(shortestPathBinaryMatrix([[0]])).toBe(1);
    expect(shortestPathBinaryMatrix([[1]])).toBe(-1);
  });
});

describe("pacificAtlantic", () => {
  test("should find cells flowing to both oceans", () => {
    const heights = [
      [1, 2, 2, 3, 5],
      [3, 2, 3, 4, 4],
      [2, 4, 5, 3, 1],
      [6, 7, 1, 4, 5],
      [5, 1, 1, 2, 4],
    ];
    const result = pacificAtlantic(heights);
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContainEqual([0, 4]);
    expect(result).toContainEqual([1, 3]);
    expect(result).toContainEqual([1, 4]);
  });

  test("should handle empty grid", () => {
    expect(pacificAtlantic([])).toEqual([]);
  });

  test("should handle single cell", () => {
    const result = pacificAtlantic([[1]]);
    expect(result).toEqual([[0, 0]]);
  });

  test("should handle all cells flow to both", () => {
    const heights = [
      [1, 1],
      [1, 1],
    ];
    const result = pacificAtlantic(heights);
    expect(result.length).toBe(4);
  });
});

describe("Graph Problems - Integration", () => {
  test("should handle multiple problem types", () => {
    // Islands
    const grid = [
      ["1", "0"],
      ["0", "1"],
    ];
    expect(numIslands(grid)).toBe(2);

    // Courses
    expect(
      canFinish(3, [
        [1, 0],
        [2, 1],
      ]),
    ).toBe(true);

    // Path
    const pathGrid = [
      [0, 0],
      [0, 0],
    ];
    expect(shortestPathBinaryMatrix(pathGrid)).toBe(2);
  });
});

describe("getTotalInformTime", () => {
  test("should return 0 for a single employee", () => {
    const n = 1;
    const headId = 0;
    const manager = [-1];
    const informTime = [0];

    expect(getTotalInformTime(n, headId, manager, informTime)).toBe(0);
  });

  test("should handle a flat organization (all report to head)", () => {
    const n = 4;
    const headId = 0;
    const manager = [-1, 0, 0, 0];
    const informTime = [3, 0, 0, 0];

    /*
			Tree:
			        0 (3)
			      /  |  \
			     1   2   3

			All employees are informed in parallel.
		*/
    expect(getTotalInformTime(n, headId, manager, informTime)).toBe(3);
  });

  test("should handle a linear chain (worst-case depth)", () => {
    const n = 4;
    const headId = 0;
    const manager = [-1, 0, 1, 2];
    const informTime = [1, 2, 3, 0];

    /*
			Tree:
			0 (1)
			 ↓
			1 (2)
			 ↓
			2 (3)
			 ↓
			3

			Total time = 1 + 2 + 3 = 6
		*/
    expect(getTotalInformTime(n, headId, manager, informTime)).toBe(6);
  });

  test("should handle parallel subtrees correctly", () => {
    const n = 6;
    const headId = 2;
    const manager = [2, 2, -1, 2, 2, 2];
    const informTime = [0, 0, 1, 0, 0, 0];

    /*
			        2 (1)
			     /  /  |  \  \
			    0  1   3   4  5

			All employees informed in parallel.
		*/
    expect(getTotalInformTime(n, headId, manager, informTime)).toBe(1);
  });

  test("should handle deep and wide mixed hierarchy", () => {
    const n = 8;
    const headId = 0;
    const manager = [-1, 0, 0, 1, 3, 3, 2, 6];
    const informTime = [1, 2, 1, 2, 0, 0, 3, 0];

    /*
			              0 (1)
			           /           \
			        1 (2)          2 (1)
			         |               |
			        3 (2)           6 (3)
			       /     \             |
			      4       5            7

			Longest path:
			0 → 2 → 6 → 7 = 1 + 1 + 3 = 5
		*/
    expect(getTotalInformTime(n, headId, manager, informTime)).toBe(5);
  });

  test("should choose the longest path in an uneven tree", () => {
    const n = 7;
    const headId = 0;
    const manager = [-1, 0, 0, 1, 1, 2, 2];
    const informTime = [2, 3, 1, 0, 0, 4, 0];

    // Leaf employees do NOT contribute informTime
    // Longest valid path: 0 → 1 → 3 = 2 + 3 = 5
    expect(getTotalInformTime(n, headId, manager, informTime)).toBe(5);
  });

  test("should ignore inform time of leaf employees", () => {
    const n = 5;
    const headId = 0;
    const manager = [-1, 0, 1, 1, 1];
    const informTime = [0, 0, 5, 0, 0];

    // Employee 2 is a leaf → informTime ignored
    expect(getTotalInformTime(n, headId, manager, informTime)).toBe(0);
  });
});
