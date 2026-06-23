const BASE62_ALPHABET =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE62_BASE = BigInt(BASE62_ALPHABET.length);

/**
 * Creates a sortable UUID v7 with Bun's native generator.
 *
 * Prefer this for application/database IDs when you do not need to teach or
 * customize Snowflake bit layout yourself.
 */
export function createSortableUuid(): string {
	return Bun.randomUUIDv7();
}

/**
 * Encodes a non-negative integer into a Base62 string.
 *
 * System design use:
 * - URL shortener codes
 * - compact public IDs
 */
export function encodeBase62(value: number | bigint): string {
	let current = BigInt(value);
	if (current < 0n) throw new Error("value must be non-negative");
	if (current === 0n) return "0";

	let encoded = "";
	while (current > 0n) {
		const remainder = Number(current % BASE62_BASE);
		encoded = BASE62_ALPHABET[remainder] + encoded;
		current /= BASE62_BASE;
	}

	return encoded;
}

/**
 * Decodes a Base62 string back into a bigint.
 */
export function decodeBase62(code: string): bigint {
	if (code.length === 0) throw new Error("code must not be empty");

	let value = 0n;
	for (const char of code) {
		const digit = BASE62_ALPHABET.indexOf(char);
		if (digit === -1) throw new Error(`invalid Base62 character: ${char}`);

		value = value * BASE62_BASE + BigInt(digit);
	}

	return value;
}

/**
 * Options for configuring a Snowflake-style ID generator.
 */
export interface SnowflakeOptions {
	workerId: number;
	epochMs?: bigint;
	nowMs?: () => bigint;
}

/**
 * Snowflake-style 64-bit sortable ID generator.
 *
 * Layout:
 * - 41 bits: timestamp delta in milliseconds
 * - 10 bits: worker ID
 * - 12 bits: per-millisecond sequence
 */
export class SnowflakeIdGenerator {
	private readonly workerId: bigint;
	private readonly epochMs: bigint;
	private readonly nowMs: () => bigint;
	private lastTimestamp = -1n;
	private sequence = 0n;

	constructor(options: SnowflakeOptions) {
		if (options.workerId < 0 || options.workerId > 1023) {
			throw new Error("workerId must be between 0 and 1023");
		}

		this.workerId = BigInt(options.workerId);
		this.epochMs = options.epochMs ?? 1_577_836_800_000n; // 2020-01-01
		this.nowMs = options.nowMs ?? (() => BigInt(Date.now()));
	}

	/**
	 * Generates the next unique Snowflake ID.
	 * Time Complexity: O(1)
	 * Space Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Get current timestamp
	 * 2. Check for clock drift (clock going backwards) - throw error if detected
	 * 3. If same millisecond, increment sequence counter
	 * 4. If new millisecond, reset sequence to 0
	 * 5. Combine: (timestamp << 22) | (workerId << 12) | sequence
	 *
	 * Guarantees:
	 * - Globally unique across worker instances
	 * - Sortable by timestamp
	 * - Per-millisecond sequence prevents collisions
	 * - Throws if clock moves backwards or sequence exhausted
	 *
	 * @returns Next 64-bit Snowflake ID as a bigint
	 * @throws Error if clock moved backwards or sequence exhausted for the millisecond
	 *
	 * @example
	 * const gen = new SnowflakeIdGenerator({ workerId: 1 });
	 * const id1 = gen.nextId(); // 123456789...
	 * const id2 = gen.nextId(); // 123456789... (incremented)
	 */
	nextId(): bigint {
		const timestamp = this.nowMs();

		if (timestamp < this.lastTimestamp) {
			throw new Error("clock moved backwards");
		}

		if (timestamp === this.lastTimestamp) {
			this.sequence++;
			if (this.sequence > 4095n) {
				throw new Error("sequence exhausted for current millisecond");
			}
		} else {
			this.sequence = 0n;
			this.lastTimestamp = timestamp;
		}

		return (
			((timestamp - this.epochMs) << 22n) |
			(this.workerId << 12n) |
			this.sequence
		);
	}
}
