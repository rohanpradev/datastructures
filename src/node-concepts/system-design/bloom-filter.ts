/**
 * Sizing inputs for building a Bloom filter.
 */
export interface BloomFilterOptions {
	expectedItems: number;
	falsePositiveRate: number;
}

/**
 * Bloom filter for fast approximate membership checks.
 *
 * System design use:
 * - Avoid expensive database/cache lookups for keys that definitely do not exist.
 * - Accept possible false positives, never false negatives for inserted values.
 */
export class BloomFilter {
	private readonly bits: Uint8Array;
	private readonly bitCount: number;
	private readonly hashCount: number;

	constructor(options: BloomFilterOptions) {
		if (options.expectedItems < 1) {
			throw new Error("expectedItems must be at least 1");
		}
		if (options.falsePositiveRate <= 0 || options.falsePositiveRate >= 1) {
			throw new Error("falsePositiveRate must be between 0 and 1");
		}

		this.bitCount = optimalBitCount(
			options.expectedItems,
			options.falsePositiveRate,
		);
		this.hashCount = optimalHashCount(this.bitCount, options.expectedItems);
		this.bits = new Uint8Array(Math.ceil(this.bitCount / 8));
	}

	/**
	 * Inserts a value by setting each derived hash position in the bit array.
	 *
	 * Time: O(k), where k is the hash count. Space: O(1) after construction.
	 */
	add(value: string): void {
		for (const bitIndex of this.bitIndexes(value)) {
			this.bits[Math.floor(bitIndex / 8)]! |= 1 << (bitIndex % 8);
		}
	}

	/**
	 * Checks approximate membership.
	 *
	 * Returns false when the value is definitely absent. Returns true when the
	 * value may be present, because different values can set the same bits.
	 *
	 * Time: O(k), where k is the hash count. Space: O(1).
	 */
	mightContain(value: string): boolean {
		for (const bitIndex of this.bitIndexes(value)) {
			const byte = this.bits[Math.floor(bitIndex / 8)]!;
			if ((byte & (1 << (bitIndex % 8))) === 0) return false;
		}

		return true;
	}

	/**
	 * Exposes sizing decisions for tests and interview discussion.
	 *
	 * Time: O(1).
	 */
	stats(): { bitCount: number; byteCount: number; hashCount: number } {
		return {
			bitCount: this.bitCount,
			byteCount: this.bits.length,
			hashCount: this.hashCount,
		};
	}

	private *bitIndexes(value: string): Iterable<number> {
		const firstHash = hashWithSeed(value, 0x811c9dc5);
		const secondHash = hashWithSeed(value, 0x9e3779b9) || 1;

		for (let index = 0; index < this.hashCount; index++) {
			yield (firstHash + index * secondHash) % this.bitCount;
		}
	}
}

/**
 * Calculates the bit-array size needed for the expected item count and target
 * false-positive rate.
 */
export function optimalBitCount(
	expectedItems: number,
	falsePositiveRate: number,
): number {
	return Math.ceil(
		-(expectedItems * Math.log(falsePositiveRate)) / Math.LN2 ** 2,
	);
}

/**
 * Calculates the number of hash probes that minimizes false positives for a
 * fixed bit-array size and expected item count.
 */
export function optimalHashCount(
	bitCount: number,
	expectedItems: number,
): number {
	return Math.max(1, Math.round((bitCount / expectedItems) * Math.LN2));
}

function hashWithSeed(value: string, seed: number): number {
	let hash = seed;

	for (let index = 0; index < value.length; index++) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16_777_619);
	}

	return hash >>> 0;
}
