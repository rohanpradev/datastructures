/**
 * One virtual-node position on the consistent hash ring.
 */
export interface RingNode<TNode> {
	node: TNode;
	virtualNode: number;
	hash: number;
}

/**
 * Consistent hash ring with virtual nodes.
 *
 * System design use:
 * - Shard cache keys, tenants, users, or media objects across many nodes.
 * - Rebalance only a fraction of keys when a node joins or leaves.
 */
export class ConsistentHashRing<TNode extends string> {
	private readonly ring: RingNode<TNode>[] = [];
	private readonly nodeSet = new Set<TNode>();

	constructor(
		nodes: TNode[] = [],
		private readonly virtualNodes = 100,
		private readonly hash = hashString,
	) {
		if (virtualNodes < 1) throw new Error("virtualNodes must be at least 1");
		for (const node of nodes) this.addNode(node);
	}

	/**
	 * Adds a physical node by placing many virtual nodes around the ring.
	 *
	 * Time: O((n + v) log(n + v)), where n is the existing number of virtual
	 * nodes and v is the configured virtual-node count. The implementation sorts
	 * the complete ring after insertion.
	 * Additional space: O(v) for the inserted positions.
	 */
	addNode(node: TNode): void {
		if (this.nodeSet.has(node)) return;

		this.nodeSet.add(node);
		for (let virtualNode = 0; virtualNode < this.virtualNodes; virtualNode++) {
			this.ring.push({
				node,
				virtualNode,
				hash: this.hash(`${node}:${virtualNode}`),
			});
		}

		this.ring.sort((left, right) => left.hash - right.hash);
	}

	/**
	 * Removes a physical node and all of its virtual-node positions.
	 *
	 * Time: O(n), where n is the number of virtual nodes in the ring.
	 * Space: O(1) besides the existing ring storage.
	 */
	removeNode(node: TNode): void {
		if (!this.nodeSet.delete(node)) return;

		for (let index = this.ring.length - 1; index >= 0; index--) {
			if (this.ring[index]?.node === node) this.ring.splice(index, 1);
		}
	}

	/**
	 * Returns the node responsible for a key.
	 *
	 * The key belongs to the first ring position at or after its hash. If the
	 * hash is past the end of the ring, ownership wraps to the first position.
	 *
	 * Time: O(log n), Space: O(1).
	 */
	getNode(key: string): TNode {
		if (this.ring.length === 0) throw new Error("hash ring has no nodes");

		const keyHash = this.hash(key);
		const index = this.findFirstRingIndexAtOrAfter(keyHash);
		return this.ring[index]?.node ?? this.ring[0]!.node;
	}

	/**
	 * Lists physical nodes currently present in the ring.
	 *
	 * Time: O(k), where k is the number of physical nodes.
	 */
	nodes(): TNode[] {
		return [...this.nodeSet];
	}

	/**
	 * Returns the number of virtual-node positions in the ring.
	 *
	 * Time: O(1).
	 */
	ringSize(): number {
		return this.ring.length;
	}

	private findFirstRingIndexAtOrAfter(keyHash: number): number {
		let left = 0;
		let right = this.ring.length - 1;
		let answer = this.ring.length;

		while (left <= right) {
			const middle = left + Math.floor((right - left) / 2);
			const middleHash = this.ring[middle]!.hash;

			if (middleHash >= keyHash) {
				answer = middle;
				right = middle - 1;
			} else {
				left = middle + 1;
			}
		}

		return answer === this.ring.length ? 0 : answer;
	}
}

/**
 * Deterministic non-cryptographic FNV-1a-style hash for examples and tests.
 *
 * This is good enough for learning consistent hashing mechanics. Production
 * systems should use a well-distributed, measured hash function for the keyspace.
 */
export function hashString(value: string): number {
	let hash = 2_166_136_261;

	for (let index = 0; index < value.length; index++) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16_777_619);
	}

	return hash >>> 0;
}
