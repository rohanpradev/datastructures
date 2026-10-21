/**
 * Mutable range sums for a live dashboard: add a correction to one minute,
 * then query any half-open interval [start, end) without scanning all minutes.
 *
 * Public indices are zero-based; internal indices are one-based so lowbit(i)
 * is nonzero. tree[i] owns exactly lowbit(i) consecutive values ending at i.
 * For [3, 1, 4, 2], tree[4] owns all four values; prefixSum(3) visits 3, 2.
 * Build O(n); add/prefixSum/rangeSum O(log n); storage O(n).
 * Number arithmetic can round: use integer cents/counts within safe bounds.
 */
export class FenwickTree {
	private readonly tree: number[];
	readonly length: number;

	constructor(values: readonly number[]) {
		// Bitwise lowbit uses signed 32-bit arithmetic; reject unsupported sizes.
		if (values.length >= 2 ** 30) {
			throw new RangeError("values must be finite and length below 2^30");
		}
		// Array.every skips holes; iteration exposes them as undefined.
		for (const value of values) {
			if (!Number.isFinite(value)) {
				throw new RangeError("values must be finite and length below 2^30");
			}
		}
		this.length = values.length;
		this.tree = [0, ...values];
		// Each completed block contributes once to its parent's larger block.
		// Repeated add() would build in O(n log n); this builds in O(n).
		for (let i = 1; i <= this.length; i++) {
			const parent = i + (i & -i);
			if (parent <= this.length) this.tree[parent] += this.tree[i];
		}
	}

	add(index: number, delta: number): void {
		this.checkBoundary(index);
		if (index === this.length || !Number.isFinite(delta)) {
			throw new RangeError("index must name a value and delta must be finite");
		}
		// Only ancestors whose block contains this point need to change.
		for (let i = index + 1; i <= this.length; i += i & -i) {
			this.tree[i] += delta;
		}
	}

	/** Sum of [0, end); end=0 is the identity, end=length is the total. */
	prefixSum(end: number): number {
		this.checkBoundary(end);
		let total = 0;
		// Removing the lowest set bit selects disjoint blocks, never double counts.
		for (let i = end; i > 0; i -= i & -i) total += this.tree[i];
		return total;
	}

	rangeSum(start: number, end: number): number {
		this.checkBoundary(start);
		this.checkBoundary(end);
		if (start > end) throw new RangeError("start must not exceed end");
		return this.prefixSum(end) - this.prefixSum(start);
	}

	private checkBoundary(index: number): void {
		if (!Number.isInteger(index) || index < 0 || index > this.length) {
			throw new RangeError("boundary must be an integer in [0, length]");
		}
	}
}
