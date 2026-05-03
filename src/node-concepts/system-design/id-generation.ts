const BASE62_ALPHABET =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE62_BASE = BigInt(BASE62_ALPHABET.length);

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
