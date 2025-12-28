# String Exercises - Practice Guide

## Overview

This guide covers essential string manipulation exercises, ideal for practicing common coding interview problems. These exercises focus on string operations like character counting, searching, and validation, which are useful in a variety of algorithmic contexts.

---

## Exercise 1: Can We Form the Document? (Custom Exercise)

### Problem Statement

Given two strings: `characters` and `document`, determine if the `document` can be generated using the characters in `characters`. Each character in `characters` can only be used once.

Return `true` if the document can be formed, otherwise return `false`.

### Example

Input: characters = "aabbcc", document = "abc"
Output: true
Explanation: All characters in 'document' are present in 'characters' with enough frequency.

Input: characters = "abc", document = "abb"
Output: false
Explanation: There aren't enough 'b's in 'characters' to form the document.

### Visual Explanation

characters = "aabbcc"
document = "abc"

Step 1: Initialize charMap = {}.

Step 2: Iterate through 'characters' and populate charMap with the count of each character.
charMap = { 'a': 2, 'b': 2, 'c': 2 }

Step 3: Iterate through 'document' to check if characters can be formed.

- 'a' is found in charMap with enough frequency, decrement count.
- 'b' is found in charMap with enough frequency, decrement count.
- 'c' is found in charMap with enough frequency, decrement count.

Step 4: All characters in 'document' can be formed, return true.

### Algorithm (Character Frequency Counting)

1. If length of 'characters' is smaller than length of 'document', return false.
2. Initialize a map to track the frequency of each character in 'characters'.
3. For each character in 'document':
   - Check if character exists in the map and if its count is greater than 0.
   - If yes, decrement its count; otherwise, return false.

4. If all characters in 'document' are processed successfully, return true.

### Function Implementation

```typescript
/**
 * Checks if a given document can be generated using the available characters.
 *
 * @param {string} characters - A string containing the available characters.
 * @param {string} document - A string representing the document to be generated.
 * @returns {boolean} - Returns `true` if the document can be generated, otherwise `false`.
 */
export function generateDocument(
  characters: string,
  document: string,
): boolean {
  // TODO: If the length of 'characters' is smaller than the length of 'document', return false.

  // TODO: Create a map (charMap) to store the frequency of each character in 'characters'.

  // TODO: Populate the charMap with frequencies of characters from the 'characters' string.

  // TODO: Loop through each character in 'document':
  //        - If the character isn't in charMap or its count is 0, return false.
  //        - Otherwise, decrement the count of the character in charMap.

  // TODO: If all characters in the document have been successfully accounted for, return true.

  return false; // Placeholder return statement.
}
```

### Complexity

- **Time Complexity:** O(n), where n is the length of the `document` string. We only make one pass through the `characters` and `document` strings.
- **Space Complexity:** O(m), where m is the number of distinct characters in the `characters` string. We store the frequency of each character in a map.

---

### Key Changes:

- **Function Implementation**: The implementation has been stripped of any code and replaced with `TODO` comments that explain each step. This leaves the exercise open-ended for learners to fill in.
- **Clarity**: The `TODO` comments are clear and help guide users in implementing the function.
- **Example**: The example and explanation have been maintained to help users understand the problem.
  Got it! Here’s a fully polished, **correctly formatted README.md** for **Exercise 2: First Non-Repeating Character**, ready to use. I’ve fixed the Markdown formatting, code blocks, numbering, and ensured everything is consistent and clean.

---

# String Exercises – Practice Guide

## Overview

This guide contains string-based coding exercises commonly asked in technical interviews.
These exercises focus on string traversal, character frequency counting, and algorithmic optimization.

---

## Exercise 2: First Non-Repeating Character

### Problem Statement

Given a string `str`, return the **first character that does not repeat** anywhere in the string.

- If all characters repeat, return `null`.
- The order of characters must be respected (first occurrence).

---

### Examples

```text
Input: "aabcc"
Output: "b"

Input: "aabb"
Output: null

Input: "abcd"
Output: "a"

Input: ""
Output: null
```

---

### Visual Explanation

Input string:

```
"aabcc"
```

Character frequency:

```
a → 2
b → 1
c → 2
```

Traversal:

```
a ❌ (repeats)
a ❌ (repeats)
b ✅ (appears once) → return "b"
```

---

### Algorithm (Optimized Approach)

1. If the string is empty, return `null`.
2. Create a map to count how many times each character appears.
3. Traverse the string and populate the frequency map.
4. Traverse the string again:
   - Return the first character with a count of exactly 1.

5. If no non-repeating character is found, return `null`.

---

### Function Implementation (with TODOs)

```ts
/**
 * Returns the first non-repeating character in a string.
 *
 * A non-repeating character is one that appears exactly once.
 * If no such character exists, the function returns null.
 *
 * @param str - The input string to analyze
 * @returns The first non-repeating character or null
 */
export function firstNonRepeatingCharacter(str: string): string | null {
  // TODO: Return null if the string is empty or falsy

  // TODO: Create a map to store the frequency of each character

  // TODO: Loop through the string and count occurrences of each character

  // TODO: Loop through the string again and return the first character
  //       whose frequency is exactly 1

  // TODO: If no non-repeating character exists, return null

  return null; // placeholder
}
```

---

### Complexity Analysis

- **Time Complexity:** O(n)
  - One pass to count characters
  - One pass to find the first unique character

- **Space Complexity:** O(n)
  - Space used for the frequency map

---

### Notes for Practice

- Start with a brute-force approach using nested loops.
- Optimize with a frequency map for O(n) performance.
- Be ready to explain why the optimized solution is faster than the brute-force one.

---

### Summary

This exercise helps reinforce:

- String traversal
- Hash maps for frequency counting
- Time and space complexity trade-offs
- Writing clean and readable algorithms

Mastering this pattern is useful for other problems like:

- First Unique Character
- Valid Anagram
- Character Frequency Sorting

---

# String Exercises – Practice Guide

## Overview

This guide contains string-based coding exercises commonly asked in technical interviews.
These exercises focus on string manipulation, hash maps, and algorithmic problem solving.

---

## Exercise 3: SemordNilap Pairs

### Problem Statement

A **semordnilap** pair is a pair of words where one word is the reverse of the other.

Given an array of words, return all semordnilap pairs. Each word can only appear in one pair.

---

### Examples

```text
Input: ["diaper", "repaid", "test", "tset", "loop"]
Output: [["diaper", "repaid"], ["test", "tset"]]

Input: ["loop", "pool", "god", "dog", "cat"]
Output: [["loop", "pool"], ["god", "dog"]]

Input: ["abc", "def"]
Output: []
```

---

### Visual Explanation

Input array:

```
["diaper", "repaid", "test", "tset", "loop"]
```

Step 1: Reverse each word and check for matches:

```
"diaper" → "repaid" ✅ match found
"test"   → "tset"   ✅ match found
"loop"   → "pool"   ❌ no match in remaining words
```

Step 2: Collect matched pairs:

```
[ ["diaper", "repaid"], ["test", "tset"] ]
```

---

### Algorithm (Optimized Approach)

1. Create a map to store words that are available to form pairs.
2. For each word in the array:
   - Reverse the word.
   - Check if the reversed word exists in the map:
     - If yes, add `[reversed, word]` to the result and remove it from the map.
     - If no, add the current word to the map for future pairing.

3. Return all collected pairs.

---

### Function Implementation (with TODOs)

```ts
/**
 * Finds all semordnilap pairs in an array of words.
 *
 * A semordnilap pair is a pair of words where one is the reverse of the other.
 * Each word can only be used in one pair.
 *
 * @param words - Array of words to check
 * @returns Array of semordnilap pairs
 */
export function semordNilap(words: string[]): [string, string][] {
  // TODO: Create a map to track words available for pairing

  // TODO: Create an array to store result pairs

  // TODO: For each word:
  //   1. Reverse the word
  //   2. If reversed exists in map, add pair and remove from map
  //   3. Otherwise, add the current word to the map

  // TODO: Return the array of pairs

  return []; // placeholder
}
```

---

### Complexity Analysis

- **Time Complexity:** O(n \* k)
  - n = number of words, k = average length of word (for reversing)

- **Space Complexity:** O(n)
  - Map stores words to track availability

---

### Notes for Practice

- Start with a brute-force approach: check all pairs → O(n²)
- Optimize using a hash map → O(n \* k)
- Consider edge cases like duplicates, empty arrays, and single-word arrays

---

### Summary

This exercise reinforces:

- String reversal and comparison
- Hash maps for efficient lookup
- Handling duplicates and unique constraints
- Algorithmic thinking for pairing problems

Mastering this pattern helps with:

- Anagram detection
- Reverse-word lookup problems
- Hash map optimization exercises

---
