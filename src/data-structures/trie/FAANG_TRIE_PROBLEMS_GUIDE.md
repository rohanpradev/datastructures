# FAANG Trie Problems Guide

This guide covers Trie (prefix tree) problems in FAANG interviews. Tries are high-yield for autocomplete, dictionary, and prefix problems.

## Why Tries Matter

Tries test:
- **Data structure design understanding** (when to use specialized structures)
- **Prefix matching patterns** (common in search systems)
- **Memory efficiency vs speed trade-offs** (when Trie beats hash map)
- **Real-world relevance** (autocomplete, spell-check, IP routing)

Research references:
- [LeetCode Trie Tag](https://leetcode.com/tag/trie/)
- [System Design: Autocomplete](https://www.system-design-interview.com/)

---

## When to Use a Trie

**Use Trie when:**
- Problem mentions "prefix", "autocomplete", "word search"
- You need to find all words with a common prefix
- You need fast prefix matching (faster than iterating a set)
- Multiple queries on same prefix

**Avoid Trie when:**
- Only need to check if word exists (use Set)
- Need to search for substrings, not prefixes (use hash map or suffix array)
- Memory is extremely limited (Trie has overhead)

| Operation | Set/Map | Trie | Winner |
|---|---|---|---|
| Insert word | O(1) | O(L) L=length | Set |
| Check exact word | O(1) | O(L) | Set |
| Check prefix exists | O(n) | O(L) | Trie |
| Find all words starting with prefix | O(n) | O(m + n) m=prefix length | Trie |
| Memory efficient for common prefixes | No | Yes | Trie |

---

## Core Trie Patterns

### Pattern 1: Trie Basics (Insert & Search)

**Interview signal:** "Dictionary" or "Word list"

**How it works:**
- Each path from root to node represents a prefix
- Mark end-of-word when full word is inserted
- Search by following path, check end-of-word flag

```typescript
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
}

class Trie {
  private root: TrieNode = new TrieNode();

  // Insert a word into Trie
  insert(word: string): void {
    let node = this.root;
    
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    
    node.isEndOfWord = true;
  }

  // Search for exact word
  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  // Check if prefix exists
  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  private findNode(prefix: string): TrieNode | null {
    let node = this.root;
    
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return null;
      }
      node = node.children.get(char)!;
    }
    
    return node;
  }
}
```

**Complexity:**
- Insert: O(L) where L = word length
- Search: O(L)
- Space: O(ALPHABET_SIZE * L * N) — depends on words

**Key insight:** Each character is a branch point. No hash collisions.

---

### Pattern 2: Autocomplete / All Words with Prefix

**Interview signal:** "Find all words starting with..." or "Autocomplete"

**How it works:**
- Find prefix node
- DFS from that node to collect all words
- Collect paths that have `isEndOfWord = true`

```typescript
class Trie {
  // ... existing code ...

  // Get all words starting with given prefix
  autoComplete(prefix: string): string[] {
    const result: string[] = [];
    const node = this.findNode(prefix);
    
    if (!node) return result;
    
    // DFS to find all words under this prefix
    this.dfs(node, prefix, result);
    return result;
  }

  private dfs(
    node: TrieNode,
    currentWord: string,
    result: string[]
  ): void {
    if (node.isEndOfWord) {
      result.push(currentWord);
    }
    
    for (const [char, childNode] of node.children) {
      this.dfs(childNode, currentWord + char, result);
    }
  }
}

// Example usage
const trie = new Trie();
trie.insert("apple");
trie.insert("app");
trie.insert("apricot");

console.log(trie.autoComplete("ap")); // ["app", "apple", "apricot"]
```

**Complexity:**
- Find prefix: O(L)
- DFS: O(N) where N = number of words with this prefix
- Total: O(L + N)

**Interview talking point:**
> "This is O(L + N) where L is prefix length and N is number of matching words. Much better than iterating all words O(V) or using regex O(V * L)."

---

### Pattern 3: Word Search in Trie

**Interview signal:** "Find word in grid" or "Boggle"

**How it works:**
- Use DFS on grid with Trie validation
- At each cell, check if current path is a valid Trie prefix
- Only explore valid paths

```typescript
function findWords(board: string[][], words: string[]): string[] {
  const trie = buildTrie(words);
  const result: string[] = [];
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      dfs(board, row, col, trie.root, "", result);
    }
  }
  
  return result;
}

function dfs(
  board: string[][],
  row: number,
  col: number,
  node: TrieNode,
  currentWord: string,
  result: string[]
): void {
  // Bounds and visited check
  if (
    row < 0 || row >= board.length ||
    col < 0 || col >= board[0].length ||
    board[row][col] === '#' // Marked as visited
  ) {
    return;
  }
  
  const char = board[row][col];
  
  // Check if path exists in Trie
  if (!node.children.has(char)) {
    return;
  }
  
  node = node.children.get(char)!;
  currentWord += char;
  
  // Found a word
  if (node.isEndOfWord) {
    result.push(currentWord);
    node.isEndOfWord = false; // Avoid duplicates
  }
  
  // Mark as visited
  board[row][col] = '#';
  
  // Explore neighbors
  dfs(board, row + 1, col, node, currentWord, result);
  dfs(board, row - 1, col, node, currentWord, result);
  dfs(board, row, col + 1, node, currentWord, result);
  dfs(board, row, col - 1, node, currentWord, result);
  
  // Restore
  board[row][col] = char;
}

function buildTrie(words: string[]): Trie {
  const trie = new Trie();
  for (const word of words) {
    trie.insert(word);
  }
  return trie;
}
```

**Complexity:**
- Build Trie: O(N * L) — N words, L average length
- DFS: O(R * C * 4^L) — exponential backtracking
- Space: O(N * L) for Trie

---

## Interview Strategy for Trie Problems

### Step 1: Clarify

Ask:
- "Can words be repeated in input?"
- "Case sensitive or insensitive?"
- "What alphabet? (ASCII, lowercase only, etc.)"
- "Memory constraints?"

### Step 2: Decide: Trie vs Alternative

```
Problem: Check if words exist?
  → Use Set (O(1) lookup)

Problem: Find all words with prefix?
  → Use Trie (O(L + M) where M = matching words)

Problem: Find common prefix?
  → Use Trie or horizontal scanning

Problem: Replace words efficiently?
  → Use Trie (skip invalid prefixes early)
```

### Step 3: Code Template

```typescript
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  // Can add metadata like frequency, suggestions, etc.
}

// Insert word
function insert(word: string, root: TrieNode): void {
  let node = root;
  for (const char of word) {
    if (!node.children.has(char)) {
      node.children.set(char, new TrieNode());
    }
    node = node.children.get(char)!;
  }
  node.isEndOfWord = true;
}

// Search word or prefix
function findNode(prefix: string, root: TrieNode): TrieNode | null {
  let node = root;
  for (const char of prefix) {
    if (!node.children.has(char)) {
      return null;
    }
    node = node.children.get(char)!;
  }
  return node;
}
```

---

## Common Trie Interview Mistakes

1. **Confusing search() and startsWith()** — one checks end-of-word, one doesn't
2. **Modifying Trie during iteration** — causes bugs, use copies or flags
3. **Forgetting to mark end-of-word** — can't distinguish "car" from "card"
4. **Using object {} instead of Map** — prototype pollution, less predictable
5. **Not pruning invalid prefixes** — defeats the purpose of Trie

---

## Edge Cases to Test

1. **Empty string** → Depends on requirements, usually allowed
2. **Single character** → Should work normally
3. **Duplicate insertions** → Should handle gracefully
4. **Prefix is full word** → `search("app")` when "apple" exists should return false
5. **No matching words** → Return empty array, not error

Example voice-through:
> "For empty string: handle in insert, it's a valid (though unusual) word. For duplicate: just set end-of-word again, harmless. For prefix: must check isEndOfWord flag, not just node existence."

---

## Complexity Always

Trie problems commonly have:
- **Insert:** O(L) where L = word length
- **Search:** O(L)
- **AutoComplete:** O(L + N) where N = matching words
- **Space:** O(ALPHABET_SIZE * TOTAL_LENGTH)

Always clarify:
> "Time is O(L) for insert/search where L is word length. Space is proportional to total character count across all words. This is better than Set for prefix queries."

---

## Quick Reference: Trie Problem Checklist

Before submitting:
- [ ] Tested empty string behavior
- [ ] Tested prefix vs full word
- [ ] Tested case sensitivity
- [ ] Used Map, not object
- [ ] Verified isEndOfWord logic
- [ ] Tested duplicate insertions
- [ ] Stated O(L) insert/search, O(L+N) autocomplete
- [ ] Explained when Trie beats Set/Map

---

## Next Steps

1. Implement basic Trie insert/search
2. Implement autoComplete with DFS
3. Practice Trie + DFS for word search problems
4. Study Trie deletion (harder, good follow-up)
5. Learn compressed Trie (advanced optimization)
