# FAANG String Problems Guide

This guide explains the extra string problems added for interview prep.

## Valid Anagram

File: `src/algorithms/strings/string-exercises.ts`  
Function: `isAnagram`

Problem:

Return `true` if two strings contain the same characters with the same frequencies.

Example:

```ts
isAnagram("anagram", "nagaram"); // true
isAnagram("rat", "car"); // false
```

### Beginner Intuition

Two strings are anagrams if every letter appears the same number of times in both strings.

You could sort both strings and compare them, but sorting costs `O(n log n)`.

Counting letters is faster.

### Step-By-Step

1. If lengths differ, return `false`.
2. Create a count array for letters `a` to `z`.
3. For each index:
   - add `1` for the character in the first string
   - subtract `1` for the character in the second string
4. At the end, every count must be `0`.

### Why It Works

Every increment from the first string must be canceled by a matching decrement from the second string.

### Edge Cases

- Different lengths
- Same letters but different counts
- Empty strings
- Repeated characters

### Complexity

- Time: `O(n)`
- Space: `O(1)` for lowercase English letters

---

## Group Anagrams

File: `src/algorithms/strings/string-exercises.ts`  
Function: `groupAnagrams`

Problem:

Group words that are anagrams of each other.

Example:

```ts
groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);
// [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```

### Beginner Intuition

Anagrams share the same character counts. So we need a way to create the same key for words that are anagrams.

For `"eat"` and `"tea"`, the count of letters is:

```text
a: 1
e: 1
t: 1
```

That count can become a map key.

### Step-By-Step

1. Create a `Map` from signature to list of words.
2. For each word:
   - count its letters
   - turn the counts into a string key
   - push the word into that key's group
3. Return all map values.

### Why It Works

All anagrams produce the same frequency signature, so they land in the same group.

### Edge Cases

- Empty string
- One word
- Multiple single-word groups
- Duplicate words

### Complexity

- Time: `O(n * k)`, where `n` is number of words and `k` is max word length
- Space: `O(n * k)`

