/**
 * LeetCode Problem: Number of Islands
 *
 * Problem: Count number of islands in 2D grid ('1' = land, '0' = water)
 *
 * Algorithm:
 * 1. Iterate through grid
 * 2. When finding unvisited land, increment island count
 * 3. Use DFS/BFS to mark entire island as visited
 * 4. Continue until all cells checked
 *
 * Time: O(rows * cols), Space: O(rows * cols)
 */
export function numIslands(grid: string[][]): number {
	if (!grid || grid.length === 0) return 0;

	const rows = grid.length;
	const cols = grid[0]!.length;
	let count = 0;

	const dfs = (r: number, c: number): void => {
		if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r]![c] === "0") {
			return;
		}

		grid[r]![c] = "0"; // Mark as visited

		// Visit all 4 directions
		dfs(r + 1, c);
		dfs(r - 1, c);
		dfs(r, c + 1);
		dfs(r, c - 1);
	};

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (grid[r]![c] === "1") {
				count++;
				dfs(r, c);
			}
		}
	}

	return count;
}

/**
 * LeetCode Problem: Course Schedule
 *
 * Problem: Can you finish all courses given prerequisites? (detect cycle in directed graph)
 *
 * Algorithm:
 * 1. Build adjacency list from prerequisites
 * 2. Use DFS with three states: unvisited, visiting, visited
 * 3. If we revisit a 'visiting' node, there's a cycle
 * 4. Return true if no cycles found
 *
 * Time: O(V + E), Space: O(V + E)
 */
export function canFinish(
	numCourses: number,
	prerequisites: number[][],
): boolean {
	const graph = new Map<number, number[]>();

	// Build adjacency list
	for (let i = 0; i < numCourses; i++) {
		graph.set(i, []);
	}
	for (const [course, prereq] of prerequisites) {
		graph.get(course!)!.push(prereq!);
	}

	const visiting = new Set<number>();
	const visited = new Set<number>();

	const hasCycle = (course: number): boolean => {
		if (visiting.has(course)) return true; // Cycle detected
		if (visited.has(course)) return false; // Already processed

		visiting.add(course);

		for (const prereq of graph.get(course)!) {
			if (hasCycle(prereq)) return true;
		}

		visiting.delete(course);
		visited.add(course);
		return false;
	};

	for (let i = 0; i < numCourses; i++) {
		if (hasCycle(i)) return false;
	}

	return true;
}

/**
 * LeetCode Problem: Clone Graph
 *
 * Problem: Deep clone an undirected graph
 *
 * Algorithm:
 * 1. Use hash map to track original -> clone mapping
 * 2. DFS through original graph
 * 3. For each node, create clone if not exists
 * 4. Recursively clone all neighbors
 *
 * Time: O(V + E), Space: O(V)
 */
export class GraphNode {
	val: number;
	neighbors: GraphNode[];

	constructor(val: number = 0, neighbors: GraphNode[] = []) {
		this.val = val;
		this.neighbors = neighbors;
	}
}

export function cloneGraph(node: GraphNode | null): GraphNode | null {
	if (!node) return null;

	const clones = new Map<GraphNode, GraphNode>();

	const clone = (node: GraphNode): GraphNode => {
		if (clones.has(node)) {
			return clones.get(node)!;
		}

		const newNode = new GraphNode(node.val);
		clones.set(node, newNode);

		for (const neighbor of node.neighbors) {
			newNode.neighbors.push(clone(neighbor));
		}

		return newNode;
	};

	return clone(node);
}

/**
 * LeetCode Problem: Shortest Path in Binary Matrix
 *
 * Problem: Find shortest path from top-left to bottom-right in grid
 *
 * Algorithm:
 * 1. Use BFS from start
 * 2. Track distance for each cell
 * 3. Explore 8 directions
 * 4. Return distance when reaching end
 *
 * Time: O(n²), Space: O(n²)
 */
export function shortestPathBinaryMatrix(grid: number[][]): number {
	const n = grid.length;
	if (grid[0]![0] === 1 || grid[n - 1]![n - 1] === 1) return -1;

	const directions = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];
	const queue: [number, number, number][] = [[0, 0, 1]]; // [row, col, distance]
	grid[0]![0] = 1; // Mark visited

	while (queue.length > 0) {
		const [r, c, dist] = queue.shift()!;

		if (r === n - 1 && c === n - 1) return dist;

		for (const [dr, dc] of directions) {
			const nr = r + dr!;
			const nc = c + dc!;

			if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr]![nc] === 0) {
				queue.push([nr, nc, dist + 1]);
				grid[nr]![nc] = 1; // Mark visited
			}
		}
	}

	return -1;
}

/**
 * LeetCode Problem: Pacific Atlantic Water Flow
 *
 * Problem: Find cells where water can flow to both Pacific and Atlantic oceans
 *
 * Algorithm:
 * 1. DFS from Pacific edges (top, left)
 * 2. DFS from Atlantic edges (bottom, right)
 * 3. Find cells reachable from both
 *
 * Time: O(rows * cols), Space: O(rows * cols)
 */
export function pacificAtlantic(heights: number[][]): number[][] {
	if (!heights || heights.length === 0) return [];

	const rows = heights.length;
	const cols = heights[0]!.length;
	const pacific = new Set<string>();
	const atlantic = new Set<string>();

	const dfs = (
		r: number,
		c: number,
		visited: Set<string>,
		prevHeight: number,
	): void => {
		const key = `${r},${c}`;
		if (
			r < 0 ||
			r >= rows ||
			c < 0 ||
			c >= cols ||
			visited.has(key) ||
			heights[r]![c]! < prevHeight
		) {
			return;
		}

		visited.add(key);
		const height = heights[r]![c]!;
		dfs(r + 1, c, visited, height);
		dfs(r - 1, c, visited, height);
		dfs(r, c + 1, visited, height);
		dfs(r, c - 1, visited, height);
	};

	// Start from Pacific edges
	for (let c = 0; c < cols; c++) {
		dfs(0, c, pacific, heights[0]![c]!);
		dfs(rows - 1, c, atlantic, heights[rows - 1]![c]!);
	}
	for (let r = 0; r < rows; r++) {
		dfs(r, 0, pacific, heights[r]![0]!);
		dfs(r, cols - 1, atlantic, heights[r]![cols - 1]!);
	}

	// Find intersection
	const result: number[][] = [];
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const key = `${r},${c}`;
			if (pacific.has(key) && atlantic.has(key)) {
				result.push([r, c]);
			}
		}
	}

	return result;
}

/**
 * Calculates the total time needed to inform all employees in a company.
 *
 * Each employee has exactly one direct manager (except the head).
 * Information flows from the head to subordinates, and each manager
 * takes a certain amount of time to inform their direct reports.
 *
 * @param employeeCount - Total number of employees
 * @param headEmployeeId - ID of the head of the company
 * @param managerOf - managerOf[i] is the direct manager of employee i (-1 for the head)
 * @param informTime - informTime[i] is the time employee i takes to inform subordinates
 * @returns The maximum time needed to inform all employees
 */
export function getTotalInformTime(
	employeeCount: number,
	headEmployeeId: number,
	managerOf: number[],
	informTime: number[],
): number {
	// Build an adjacency list where each manager maps to their direct subordinates
	const subordinatesByManager: number[][] = Array.from(
		{ length: employeeCount },
		() => [],
	);

	for (let employeeId = 0; employeeId < employeeCount; employeeId++) {
		const managerId = managerOf[employeeId];

		// Skip the head of the company (no manager)
		if (managerId === -1) continue;

		subordinatesByManager[managerId].push(employeeId);
	}

	// Start DFS from the head to compute the maximum inform time
	return getMaxInformTimeFrom(
		headEmployeeId,
		subordinatesByManager,
		informTime,
	);
}

/**
 * Recursively computes the maximum time needed to inform all employees
 * in the subtree rooted at the given employee.
 *
 * @param employeeId - Current employee
 * @param subordinatesByManager - Adjacency list of subordinates
 * @param informTime - Time each employee takes to inform subordinates
 * @returns Maximum inform time from this employee downward
 */
function getMaxInformTimeFrom(
	employeeId: number,
	subordinatesByManager: number[][],
	informTime: number[],
): number {
	const directSubordinates = subordinatesByManager[employeeId];

	// Base case: no subordinates, no extra time needed
	if (directSubordinates.length === 0) {
		return 0;
	}

	// Find the maximum time required among all subtrees
	let maxSubtreeTime = 0;
	for (const subordinateId of directSubordinates) {
		maxSubtreeTime = Math.max(
			maxSubtreeTime,
			getMaxInformTimeFrom(subordinateId, subordinatesByManager, informTime),
		);
	}

	// Add the current employee's inform time
	return maxSubtreeTime + informTime[employeeId];
}
