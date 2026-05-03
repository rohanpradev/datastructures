import { describe, expect, test } from "bun:test";
import {
	countingBits,
	missingNumberXor,
	reverseBits,
	singleNumber,
} from "@/algorithms/bit-manipulation/bit-manipulation";

describe("singleNumber", () => {
	test("finds the unique value when all others appear twice", () => {
		expect(singleNumber([2, 2, 1])).toBe(1);
		expect(singleNumber([4, 1, 2, 1, 2])).toBe(4);
	});
});

describe("countingBits", () => {
	test("counts set bits from 0 to n", () => {
		expect(countingBits(0)).toEqual([0]);
		expect(countingBits(2)).toEqual([0, 1, 1]);
		expect(countingBits(5)).toEqual([0, 1, 1, 2, 1, 2]);
	});
});

describe("missingNumberXor", () => {
	test("finds the missing number from 0..n", () => {
		expect(missingNumberXor([3, 0, 1])).toBe(2);
		expect(missingNumberXor([0, 1])).toBe(2);
		expect(missingNumberXor([9, 6, 4, 2, 3, 5, 7, 0, 1])).toBe(8);
	});
});

describe("reverseBits", () => {
	test("reverses 32-bit unsigned integers", () => {
		expect(reverseBits(0b00000010100101000001111010011100)).toBe(
			964176192,
		);
		expect(reverseBits(0)).toBe(0);
		expect(reverseBits(0xffffffff)).toBe(0xffffffff);
	});
});
