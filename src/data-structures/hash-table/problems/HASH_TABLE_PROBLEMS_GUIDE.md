# Hash Table Problems - Practice Guide

## Overview

This guide covers common hash table (hash map) problems demonstrating efficient lookups, counting, and grouping techniques.

---

## Problem 1: Two Sum (LeetCode 1)

### Problem Statement
Given an array and a target sum, find two numbers that add up to the target. Return their indices.

**Constraint:** Each input has exactly one solution, and you can't use the same element twice.

### Example
```
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

Input: nums = [3, 2, 4], target = 6
Output: [1, 2]
Explanation: nums[1] + nums[2] = 2 + 4 = 6
```

### Visual Explanation
```
Array: [2, 7, 11, 15], target = 9

Brute force (O(n²)):
2+7=9 ✓  2+11=13  2+15=17
         7+11=18  7+15=22
                  11+15=26

Hash map approach (O(n)):
map = {}

Step 1: num = 2
  complement = 9 - 2 = 7
  7 not in map? Add 2
  map = {2: 0}

Step 2: num = 7
  complement = 9 - 7 = 2
  2 in map! ✓
  Return [map[2], current_index] = [0, 1]

Only 2 iterations!
```

### Algorithm (Hash Map)
```
1. Create empty hash map
2. For each number with index:
   - Calculate complement = target - num
   - If complement in map:
     • Return [map[complement], current_index]
   - Add num to map: map[num] = index
3. Return [] (no solution)
```

### Implementation Steps
```typescript
export function twoSum(nums: number[], target: number): number[] {
	// TODO: Create hash map to store num → index
	
	// TODO: Loop through array with index
	
	// TODO: Calculate complement
	
	// TODO: Check if complement exists in map
	
	// TODO: If found, return indices
	
	// TODO: Add current number to map
	
	// TODO: Return empty array if no solution
}
```

### Complexity
- **Time:** O(n) - single pass with O(1) lookups
- **Space:** O(n) - hash map storage

---

## Problem 2: Group Anagrams (LeetCode 49)

### Problem Statement
Group strings that are anagrams of each other.

**Anagram:** Words with same letters but different order.

### Example
```
Input: ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [
  ["eat", "tea", "ate"],
  ["tan", "nat"],
  ["bat"]
]
```

### Visual Explanation
```
Key insight: Anagrams have same sorted characters!

"eat" → sorted: "aet"
"tea" → sorted: "aet"  ← Same key!
"tan" → sorted: "ant"
"ate" → sorted: "aet"  ← Same key!
"nat" → sorted: "ant"  ← Same key!
"bat" → sorted: "abt"

Hash map:
{
  "aet": ["eat", "tea", "ate"],
  "ant": ["tan", "nat"],
  "abt": ["bat"]
}

Return values: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
```

### Algorithm
```
1. Create hash map: sorted_string → list of words
2. For each word:
   - Sort characters to get key
   - Add word to map[key]
3. Return all values from map
```

### Step-by-Step Example
```
Input: ["eat", "tea", "tan"]

Step 1: "eat"
  key = "aet"
  map = {"aet": ["eat"]}

Step 2: "tea"
  key = "aet" (same as "eat")
  map = {"aet": ["eat", "tea"]}

Step 3: "tan"
  key = "ant"
  map = {
    "aet": ["eat", "tea"],
    "ant": ["tan"]
  }

Result: [["eat", "tea"], ["tan"]]
```

### Implementation Steps
```typescript
export function groupAnagrams(strs: string[]): string[][] {
	// TODO: Create hash map: key → string[]
	
	// TODO: Loop through strings
	
	// TODO: Sort characters to create key
	
	// TODO: Add string to map[key] array
	
	// TODO: Return all values from map
}
```

### Complexity
- **Time:** O(n × k log k) where k = average string length
  - n strings, each sorted in O(k log k)
- **Space:** O(n × k) - storing all strings

---

## Problem 3: Contains Duplicate (LeetCode 217)

### Problem Statement
Determine if any value appears at least twice in the array.

### Example
```
Input: [1, 2, 3, 1]
Output: true

Input: [1, 2, 3, 4]
Output: false
```

### Visual Explanation
```
Array: [1, 2, 3, 1]
seen = new Set()

Step 1: num = 1
  1 in seen? NO
  Add 1 → seen = {1}

Step 2: num = 2
  2 in seen? NO
  Add 2 → seen = {1, 2}

Step 3: num = 3
  3 in seen? NO
  Add 3 → seen = {1, 2, 3}

Step 4: num = 1
  1 in seen? YES! ✓
  Return true
```

### Algorithm
```
1. Create empty Set
2. For each number:
   - If number in set:
     • Return true (duplicate found)
   - Add number to set
3. Return false (no duplicates)
```

### Implementation Steps
```typescript
export function containsDuplicate(nums: number[]): boolean {
	// TODO: Create Set to track seen numbers
	
	// TODO: Loop through array
	
	// TODO: If number exists in set, return true
	
	// TODO: Add number to set
	
	// TODO: Return false if no duplicates found
}
```

### Complexity
- **Time:** O(n) - single pass
- **Space:** O(n) - set storage

---

## Problem 4: Valid Anagram (LeetCode 242)

### Problem Statement
Check if two strings are anagrams of each other.

### Example
```
Input: s = "anagram", t = "nagaram"
Output: true

Input: s = "rat", t = "car"
Output: false
```

### Visual Explanation
```
Method 1: Sort both strings
"anagram" → "aaagmnr"
"nagaram" → "aaagmnr"
Equal? YES → Anagrams!

Method 2: Character frequency count
s = "anagram"
freq = {a:3, n:1, g:1, r:1, m:1}

t = "nagaram"
Check each char exists with same count:
n:1 ✓, a:3 ✓, g:1 ✓, a:✓, r:1 ✓, a:✓, m:1 ✓
All match → Anagrams!
```

### Algorithm (Hash Map)
```
1. If lengths differ, return false
2. Create frequency map for s
3. For each char in t:
   - If char not in map or count is 0:
     • Return false
   - Decrement count
4. Return true
```

### Implementation Steps
```typescript
export function isAnagram(s: string, t: string): boolean {
	// TODO: Check if lengths are different
	
	// TODO: Create frequency map for first string
	
	// TODO: Loop through second string
	
	// TODO: Check char exists and decrement count
	
	// TODO: Return true if all chars matched
}
```

### Complexity
- **Time:** O(n) - two passes through strings
- **Space:** O(1) - at most 26 characters (lowercase English)

---

## Problem 5: Longest Consecutive Sequence (LeetCode 128)

### Problem Statement
Find the length of the longest consecutive elements sequence in an unsorted array.

**Must run in O(n) time.**

### Example
```
Input: [100, 4, 200, 1, 3, 2]
Output: 4
Explanation: Longest consecutive sequence is [1, 2, 3, 4]

Input: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
Output: 9
Explanation: [0, 1, 2, 3, 4, 5, 6, 7, 8]
```

### Visual Explanation
```
Array: [100, 4, 200, 1, 3, 2]

Naive: Sort then count → O(n log n) ❌

Hash Set approach → O(n) ✓

Step 1: Add all to set
set = {100, 4, 200, 1, 3, 2}

Step 2: For each number, check if it's a sequence START
num = 100:
  Is 99 in set? NO → Start of sequence!
  Count: 100, 101? NO → length = 1

num = 4:
  Is 3 in set? YES → Not start, skip

num = 1:
  Is 0 in set? NO → Start of sequence!
  Count: 1, 2✓, 3✓, 4✓, 5? NO → length = 4

num = 2, 3: Skip (not starts)

Longest = 4
```

### Algorithm
```
1. Add all numbers to hash set
2. For each number:
   - If (number - 1) not in set:
     • This is a sequence start
     • Count consecutive numbers
     • Update max length
3. Return max length
```

### Why This Works
```
By only starting from sequence beginnings:
- Each number checked at most twice
- Once when deciding if it's a start
- Once when counting in a sequence
- Total: O(n)
```

### Implementation Steps
```typescript
export function longestConsecutive(nums: number[]): number {
	// TODO: Handle empty array
	
	// TODO: Create Set from array
	
	// TODO: Initialize max length
	
	// TODO: Loop through each number
	
	// TODO: Check if it's a sequence start (num-1 not in set)
	
	// TODO: Count consecutive numbers
	
	// TODO: Update max length
	
	// TODO: Return max
}
```

### Complexity
- **Time:** O(n) - each number visited at most twice
- **Space:** O(n) - hash set storage

---

## Problem 6: Subarray Sum Equals K (LeetCode 560)

### Problem Statement
Find the total number of continuous subarrays whose sum equals k.

### Example
```
Input: nums = [1, 1, 1], k = 2
Output: 2
Explanation: [1,1] appears twice

Input: nums = [1, 2, 3], k = 3
Output: 2
Explanation: [1,2] and [3]
```

### Visual Explanation
```
Key insight: Use prefix sums!

If prefixSum[j] - prefixSum[i] = k
Then subarray from i+1 to j has sum k

Array: [1, 2, 3], k = 3

Prefix sums:
index:  0  1  2  3
prefix: 0  1  3  6
array:    [1, 2, 3]

For each prefix, check if (prefix - k) exists:

prefix = 0:
  0 - 3 = -3 in map? NO
  Add 0 → map = {0: 1}

prefix = 1:
  1 - 3 = -2 in map? NO
  Add 1 → map = {0:1, 1:1}

prefix = 3:
  3 - 3 = 0 in map? YES! count++
  (subarray [1,2] has sum 3)
  Add 3 → map = {0:1, 1:1, 3:1}

prefix = 6:
  6 - 3 = 3 in map? YES! count++
  (subarray [3] has sum 3)

Total: 2
```

### Algorithm
```
1. Create hash map: prefixSum → frequency
2. Initialize map with {0: 1} (empty subarray)
3. Track running sum = 0, count = 0
4. For each number:
   - sum += num
   - If (sum - k) in map:
     • count += map[sum - k]
   - Add sum to map (or increment count)
5. Return count
```

### Implementation Steps
```typescript
export function subarraySum(nums: number[], k: number): number {
	// TODO: Create hash map for prefix sums
	
	// TODO: Initialize with {0: 1}
	
	// TODO: Initialize sum and count
	
	// TODO: Loop through array
	
	// TODO: Update running sum
	
	// TODO: Check if (sum - k) exists in map
	
	// TODO: Add current sum to map
	
	// TODO: Return count
}
```

### Complexity
- **Time:** O(n) - single pass
- **Space:** O(n) - hash map storage

---

## Hash Table Techniques Summary

### Frequency Counting
```typescript
// Count occurrences
const freq = new Map<string, number>();
for (const item of items) {
	freq.set(item, (freq.get(item) || 0) + 1);
}
```

### Set for Existence Check
```typescript
// Check if value exists
const seen = new Set<number>();
for (const num of nums) {
	if (seen.has(num)) return true;
	seen.add(num);
}
```

### Complement Pattern (Two Sum)
```typescript
// Find pairs that sum to target
const map = new Map<number, number>();
for (let i = 0; i < nums.length; i++) {
	const complement = target - nums[i];
	if (map.has(complement)) {
		return [map.get(complement)!, i];
	}
	map.set(nums[i], i);
}
```

### Grouping Pattern (Anagrams)
```typescript
// Group items by key
const groups = new Map<string, string[]>();
for (const item of items) {
	const key = getKey(item);
	if (!groups.has(key)) groups.set(key, []);
	groups.get(key)!.push(item);
}
```

---

## Common Hash Table Operations

### Map Operations
```typescript
// Create
const map = new Map<string, number>();

// Set value
map.set("key", 42);

// Get value
const val = map.get("key");  // 42 or undefined

// Check existence
if (map.has("key")) { }

// Delete
map.delete("key");

// Size
map.size

// Iterate
for (const [key, value] of map) { }
```

### Set Operations
```typescript
// Create
const set = new Set<number>();

// Add
set.add(1);

// Check existence
if (set.has(1)) { }

// Delete
set.delete(1);

// Size
set.size

// Iterate
for (const item of set) { }
```

---

## Practice Tips

### Order to Practice
1. **Start with:** containsDuplicate, isAnagram (basics)
2. **Then:** twoSum, groupAnagrams (complement/grouping)
3. **Finally:** longestConsecutive, subarraySum (advanced)

### When to Use Hash Table
- ✅ Need O(1) lookups
- ✅ Counting frequencies
- ✅ Finding complements (two sum pattern)
- ✅ Grouping by key
- ✅ Checking existence
- ✅ Removing duplicates

### When NOT to Use
- ❌ Need sorted order (use BST)
- ❌ Memory constrained (hash tables use extra space)
- ❌ Need range queries (use segment tree)

### Common Mistakes
1. ❌ Forgetting to check if key exists before accessing
2. ❌ Not handling empty inputs
3. ❌ Using wrong data structure (Map vs Set)
4. ❌ Not initializing map with base case (e.g., {0: 1})
5. ❌ Mutating keys after adding to map/set

### Testing Strategy
```typescript
✓ Empty array
✓ Single element
✓ All duplicates
✓ No duplicates
✓ Negative numbers
✓ Zero values
✓ Large inputs (performance)
```

---

## Complexity Cheat Sheet

| Problem | Time | Space | Key Technique |
|---------|------|-------|---------------|
| Two Sum | O(n) | O(n) | Complement lookup |
| Group Anagrams | O(n·k log k) | O(n·k) | Sorted key grouping |
| Contains Duplicate | O(n) | O(n) | Set existence check |
| Valid Anagram | O(n) | O(1) | Frequency count |
| Longest Consecutive | O(n) | O(n) | Sequence start check |
| Subarray Sum | O(n) | O(n) | Prefix sum map |

---

## Hash Function Properties

### Good Hash Function
```
1. Deterministic (same input → same output)
2. Uniform distribution
3. Fast to compute
4. Minimize collisions
```

### Collision Resolution
```
1. Chaining (linked list at each bucket)
2. Open addressing (probe for next slot)
3. Robin Hood hashing
```

### Load Factor
```
load_factor = n / capacity

When load_factor > threshold:
  → Resize and rehash (typically at 0.75)
```

Happy Coding! 🚀
