/**
 * Mutable range aggregates with point assignment and half-open queries.
 * Choose an associative combine(left, right) and a two-sided identity:
 * sum/0, min/Infinity, or string concatenation/"". Order is preserved, so
 * commutativity and an inverse are not required.
 *
 * Invariant: each node combines its left block followed by its right block.
 * Leaves are padded to a power of two with the identity. A query selects
 * disjoint blocks, keeping separate left/right accumulators to preserve order.
 * [3,1,4,1,5], sum => query(1,4)=6; set(2,9) => query(1,4)=11.
 *
 * Build O(n), set/query O(log n), storage O(n), query auxiliary space O(1),
 * assuming combine takes O(1) time and stores an O(1)-size result.
 * Values and identity are treated as immutable; combine must be pure and total.
 * Object values are not deep-cloned, and associativity is the caller's contract.
 */
export class SegmentTree<T> {
	readonly length: number;
	private readonly leafCount: number;
	private readonly tree: T[];
	private readonly identity: T;
	private readonly combine: (left: T, right: T) => T;

	constructor(
		values: readonly T[],
		identity: T,
		combine: (left: T, right: T) => T,
	) {
		this.length = values.length;
		this.identity = identity;
		this.combine = combine;
		let leafCount = 1;
		while (leafCount < this.length) leafCount *= 2;
		this.leafCount = leafCount;
		this.tree = Array<T>(2 * leafCount).fill(identity);
		for (let i = 0; i < this.length; i++) {
			this.tree[leafCount + i] = values[i];
		}
		for (let node = leafCount - 1; node > 0; node--) {
			this.tree[node] = combine(this.tree[2 * node], this.tree[2 * node + 1]);
		}
	}

	/** Assign one value; only its O(log n) ancestor blocks need rebuilding. */
	set(index: number, value: T): void {
		this.checkBoundary(index);
		if (index === this.length) {
			throw new RangeError("index must name a value in [0, length)");
		}
		let node = this.leafCount + index;
		this.tree[node] = value;
		while (node > 1) {
			node = Math.floor(node / 2);
			this.tree[node] = this.combine(
				this.tree[2 * node],
				this.tree[2 * node + 1],
			);
		}
	}

	/** Combine values in [start, end); an empty interval returns identity. */
	query(start: number, end: number): T {
		this.checkBoundary(start);
		this.checkBoundary(end);
		if (start > end) throw new RangeError("start must not exceed end");
		if (start === end) return this.identity;
		let left = this.leafCount + start;
		let right = this.leafCount + end;
		let before = this.identity;
		let after = this.identity;
		while (left < right) {
			if (left % 2 === 1) {
				before = this.combine(before, this.tree[left]);
				left++;
			}
			if (right % 2 === 1) {
				right--;
				// Right blocks arrive in reverse order, so prepend rather than append.
				after = this.combine(this.tree[right], after);
			}
			left = Math.floor(left / 2);
			right = Math.floor(right / 2);
		}
		return this.combine(before, after);
	}

	private checkBoundary(index: number): void {
		if (!Number.isInteger(index) || index < 0 || index > this.length) {
			throw new RangeError("boundary must be an integer in [0, length]");
		}
	}
}
