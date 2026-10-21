import { MinHeap } from "@/data-structures/heap/heap";

export interface WeightedEdge {
	to: number;
	weight: number;
}

export interface Route {
	distance: number;
	path: number[];
}

/**
 * Dijkstra for a delivery network with nonnegative integer travel times.
 * Vertices are indices in the adjacency list; parallel edges are allowed.
 * Invariant: the smallest non-stale heap entry has its final shortest distance.
 * A->B=9, A->C=2, C->B=1 settles B at 3, not at first discovery (9).
 *
 * Lazy decrease-key inserts a new candidate and ignores obsolete entries.
 * Including validation: O(V + E + E log(E+1)) time, O(V+E) auxiliary space.
 * Unreachable returns null; a source-to-itself route has cost 0.
 * Negative weights need another algorithm; unsafe integer totals are rejected.
 */
export function shortestPath(
	graph: readonly (readonly WeightedEdge[])[],
	source: number,
	target: number,
): Route | null {
	const validVertex = (v: number) =>
		Number.isInteger(v) && v >= 0 && v < graph.length;
	if (!validVertex(source) || !validVertex(target)) {
		throw new RangeError("source and target must be graph vertices");
	}
	// Validate even unreachable edges so a bad input never silently looks valid.
	for (const edges of graph) {
		for (const edge of edges) {
			if (
				!validVertex(edge.to) ||
				!Number.isSafeInteger(edge.weight) ||
				edge.weight < 0
			) {
				throw new RangeError(
					"edges need valid vertices and nonnegative safe weights",
				);
			}
		}
	}
	const distance = Array<number>(graph.length).fill(Infinity);
	const parent = Array<number>(graph.length).fill(-1);
	const frontier = new MinHeap<{ vertex: number; cost: number }>(
		[],
		(a, b) => a.cost - b.cost,
	);
	distance[source] = 0;
	frontier.insert({ cost: 0, vertex: source });
	while (!frontier.isEmpty()) {
		const current = frontier.remove()!;
		if (current.cost !== distance[current.vertex]) continue;
		if (current.vertex === target) {
			const path: number[] = [];
			for (let v = target; v !== -1; v = parent[v]) path.push(v);
			return { distance: current.cost, path: path.reverse() };
		}
		for (const edge of graph[current.vertex]) {
			const candidate = current.cost + edge.weight;
			if (!Number.isSafeInteger(candidate)) {
				throw new RangeError("route cost exceeds safe integer arithmetic");
			}
			// Strict improvement avoids infinite insertion on zero-weight cycles.
			if (candidate < distance[edge.to]) {
				distance[edge.to] = candidate;
				parent[edge.to] = current.vertex;
				frontier.insert({ cost: candidate, vertex: edge.to });
			}
		}
	}
	return null;
}
