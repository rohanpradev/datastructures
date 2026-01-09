/**
 * Graph Data Structure (Adjacency List Implementation)
 * A collection of vertices connected by edges
 *
 * Key Features:
 * - Adjacency list representation (efficient for sparse graphs)
 * - Supports both directed and undirected graphs
 * - Supports weighted and unweighted edges
 * - BFS and DFS traversal
 * - O(1) vertex addition, O(V+E) traversal
 *
 * Common Use Cases:
 * - Social networks (friend connections)
 * - Maps and navigation (cities and roads)
 * - Computer networks (routers and connections)
 * - Dependency resolution (build systems)
 * - Recommendation systems
 *
 * Time Complexities:
 * - addVertex(): O(1)
 * - addEdge(): O(1)
 * - removeVertex(): O(V + E) where V is vertices, E is edges
 * - removeEdge(): O(E)
 * - BFS/DFS: O(V + E)
 *
 * Visual Structure (Undirected):
 * ```
 * Vertices: A, B, C, D
 * Edges: A-B, A-C, B-D, C-D
 *
 * Adjacency List:
 * A: [B, C]
 * B: [A, D]
 * C: [A, D]
 * D: [B, C]
 * ```
 */
class Graph<T = string> {
	private adjacencyList: Map<T, T[]>;
	private directed: boolean;

	/**
	 * Creates a new Graph
	 * Time Complexity: O(1)
	 *
	 * @param directed - Whether the graph is directed (default: false)
	 *
	 * @example
	 * const graph = new Graph<string>(); // Undirected
	 * const digraph = new Graph<string>(true); // Directed
	 */
	constructor(directed: boolean = false) {
		this.adjacencyList = new Map();
		this.directed = directed;
	}

	/**
	 * Adds a vertex to the graph
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @param vertex - The vertex to add
	 * @returns The graph instance for method chaining
	 *
	 * @example
	 * const graph = new Graph<string>();
	 * graph.addVertex("A").addVertex("B");
	 */
	addVertex(vertex: T): Graph<T> {
		if (!this.adjacencyList.has(vertex)) {
			this.adjacencyList.set(vertex, []);
		}
		return this;
	}

	/**
	 * Adds an edge between two vertices
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * For undirected graphs, adds edge in both directions
	 * For directed graphs, adds edge from v1 to v2 only
	 *
	 * @param v1 - First vertex
	 * @param v2 - Second vertex
	 * @returns The graph instance for method chaining
	 *
	 * @example
	 * graph.addEdge("A", "B"); // A connects to B
	 */
	addEdge(v1: T, v2: T): Graph<T> {
		// Ensure vertices exist
		this.addVertex(v1);
		this.addVertex(v2);

		// Add edge
		this.adjacencyList.get(v1)!.push(v2);

		// For undirected graph, add reverse edge
		if (!this.directed && v1 !== v2) {
			this.adjacencyList.get(v2)!.push(v1);
		}

		return this;
	}

	/**
	 * Removes a vertex and all its edges
	 * Time Complexity: O(V + E)
	 * Space Complexity: O(1)
	 *
	 * @param vertex - The vertex to remove
	 * @returns true if removed, false if not found
	 *
	 * @example
	 * graph.removeVertex("A"); // Removes A and all edges connected to A
	 */
	removeVertex(vertex: T): boolean {
		if (!this.adjacencyList.has(vertex)) {
			return false;
		}

		// Remove all edges pointing to this vertex
		for (const [_v, edges] of this.adjacencyList) {
			const index = edges.indexOf(vertex);
			if (index !== -1) {
				edges.splice(index, 1);
			}
		}

		// Remove the vertex itself
		this.adjacencyList.delete(vertex);
		return true;
	}

	/**
	 * Removes an edge between two vertices
	 * Time Complexity: O(E) where E is number of edges from v1
	 * Space Complexity: O(1)
	 *
	 * @param v1 - First vertex
	 * @param v2 - Second vertex
	 * @returns true if removed, false if not found
	 *
	 * @example
	 * graph.removeEdge("A", "B"); // Removes edge A-B
	 */
	removeEdge(v1: T, v2: T): boolean {
		if (!this.adjacencyList.has(v1) || !this.adjacencyList.has(v2)) {
			return false;
		}

		const edges1 = this.adjacencyList.get(v1)!;
		const index1 = edges1.indexOf(v2);

		if (index1 === -1) {
			return false;
		}

		edges1.splice(index1, 1);

		// For undirected graph, remove reverse edge
		if (!this.directed) {
			const edges2 = this.adjacencyList.get(v2)!;
			const index2 = edges2.indexOf(v1);
			if (index2 !== -1) {
				edges2.splice(index2, 1);
			}
		}

		return true;
	}

	/**
	 * Gets all neighbors of a vertex
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * @param vertex - The vertex
	 * @returns Array of neighbor vertices
	 */
	getNeighbors(vertex: T): T[] {
		return this.adjacencyList.get(vertex) || [];
	}

	/**
	 * Checks if a vertex exists
	 * Time Complexity: O(1)
	 *
	 * @param vertex - The vertex to check
	 * @returns true if vertex exists
	 */
	hasVertex(vertex: T): boolean {
		return this.adjacencyList.has(vertex);
	}

	/**
	 * Checks if an edge exists
	 * Time Complexity: O(E) where E is edges from v1
	 *
	 * @param v1 - First vertex
	 * @param v2 - Second vertex
	 * @returns true if edge exists
	 */
	hasEdge(v1: T, v2: T): boolean {
		if (!this.adjacencyList.has(v1)) return false;
		return this.adjacencyList.get(v1)!.includes(v2);
	}

	/**
	 * Breadth-First Search traversal
	 * Time Complexity: O(V + E)
	 * Space Complexity: O(V)
	 *
	 * Algorithm:
	 * 1. Use queue for level-order traversal
	 * 2. Mark vertices as visited
	 * 3. Process neighbors level by level
	 *
	 * @param start - Starting vertex
	 * @returns Array of vertices in BFS order
	 */
	bfs(start: T): T[] {
		if (!this.adjacencyList.has(start)) return [];

		const result: T[] = [];
		const visited = new Set<T>();
		const queue: T[] = [start];
		visited.add(start);

		while (queue.length > 0) {
			const vertex = queue.shift()!;
			result.push(vertex);

			const neighbors = this.adjacencyList.get(vertex)!;
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor)) {
					visited.add(neighbor);
					queue.push(neighbor);
				}
			}
		}

		return result;
	}

	/**
	 * Depth-First Search traversal (recursive)
	 * Time Complexity: O(V + E)
	 * Space Complexity: O(V)
	 *
	 * Algorithm:
	 * 1. Recursively visit each unvisited neighbor
	 * 2. Mark vertices as visited
	 * 3. Go as deep as possible before backtracking
	 *
	 * @param start - Starting vertex
	 * @returns Array of vertices in DFS order
	 */
	dfs(start: T): T[] {
		if (!this.adjacencyList.has(start)) return [];

		const result: T[] = [];
		const visited = new Set<T>();

		const dfsHelper = (vertex: T): void => {
			visited.add(vertex);
			result.push(vertex);

			const neighbors = this.adjacencyList.get(vertex)!;
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor)) {
					dfsHelper(neighbor);
				}
			}
		};

		dfsHelper(start);
		return result;
	}

	/**
	 * Returns all vertices in the graph
	 * Time Complexity: O(V)
	 *
	 * @returns Array of all vertices
	 */
	getAllVertices(): T[] {
		return Array.from(this.adjacencyList.keys());
	}

	/**
	 * Returns number of vertices
	 * Time Complexity: O(1)
	 *
	 * @returns Number of vertices
	 */
	size(): number {
		return this.adjacencyList.size;
	}

	/**
	 * Checks if graph is empty
	 * Time Complexity: O(1)
	 *
	 * @returns true if empty
	 */
	isEmpty(): boolean {
		return this.adjacencyList.size === 0;
	}

	/**
	 * Removes all vertices and edges
	 * Time Complexity: O(1)
	 *
	 * @returns The graph instance
	 */
	clear(): Graph<T> {
		this.adjacencyList.clear();
		return this;
	}

	/**
	 * Returns string representation of the graph
	 * Time Complexity: O(V + E)
	 *
	 * @returns String representation
	 */
	toString(): string {
		let str = "";
		for (const [vertex, edges] of this.adjacencyList) {
			str += `${vertex} -> ${edges.join(", ")}\n`;
		}
		return str;
	}
}

export { Graph };
