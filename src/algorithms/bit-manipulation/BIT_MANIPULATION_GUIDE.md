# Bit Manipulation Guide

Bit manipulation problems look strange at first, but interview versions usually use a few repeatable ideas.

## Core Ideas

- `x ^ x = 0`
- `x ^ 0 = x`
- XOR is order-independent
- `num & 1` tells whether the last bit is `1`
- `num >> 1` removes the last bit
- `>>> 0` treats a number as unsigned 32-bit in JavaScript/TypeScript

## Single Number

Function: `singleNumber`

Problem:

Every number appears twice except one number. Return the unique number.

Step-by-step:

1. Start `result = 0`.
2. XOR every number into `result`.
3. Duplicate numbers cancel each other.
4. The remaining value is the single number.

Example:

```ts
singleNumber([4, 1, 2, 1, 2]); // 4
```

Complexity:

- Time: `O(n)`
- Space: `O(1)`

## Counting Bits

Function: `countingBits`

Problem:

For every number from `0` to `n`, count how many `1` bits it has.

Step-by-step:

1. `counts[0] = 0`.
2. For each number, reuse the answer for `num >> 1`.
3. Add `1` if the last bit is set.

Formula:

```text
counts[num] = counts[num >> 1] + (num & 1)
```

Complexity:

- Time: `O(n)`
- Space: `O(n)`

## Missing Number

Function: `missingNumberXor`

Problem:

An array contains numbers from `0..n` with one missing. Return the missing number.

Step-by-step:

1. XOR all indices.
2. XOR all values.
3. XOR `n`.
4. Everything that appears in both index/value sets cancels.

Complexity:

- Time: `O(n)`
- Space: `O(1)`

## Reverse Bits

Function: `reverseBits`

Problem:

Reverse all 32 bits of an unsigned integer.

Step-by-step:

1. Start with `result = 0`.
2. Read the last bit of `value`.
3. Shift `result` left and add that bit.
4. Shift `value` right.
5. Repeat 32 times.

Complexity:

- Time: `O(1)` because it always loops 32 times
- Space: `O(1)`

