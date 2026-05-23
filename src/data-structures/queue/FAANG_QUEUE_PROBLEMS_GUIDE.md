# FAANG Queue Problems Guide

This guide covers interview-ready queue problems. Queues (FIFO) are simpler than stacks but critical for BFS, rate limiting, and system design.

## Why Queues Matter in Interviews

Queues test:
- **System thinking** (request queues, task scheduling)
- **Algorithm efficiency** (BFS correctness, level-by-level processing)
- **Edge case handling** (empty queue, single element)
- **Real-world patterns** (producer-consumer, throttling)

Research references:
- [Google Tech Dev Guide: BFS](https://techdevguide.withgoogle.com/)
- [LeetCode Queue Tag](https://leetcode.com/tag/queue/)

---

## Core Queue Patterns

### Pattern 1: Breadth-First Search (BFS)

**Interview signal:** "Shortest path" or "Find closest" or "Level order"

**When to use:**
- Shortest path in unweighted graph
- Nearest element finding
- Level-order tree traversal
- Connection problems (distance, hops)

**Key idea:** Visit neighbors in FIFO order. First element found is closest.

```typescript
function bfs(
  startNode: Node,
  targetValue: number
): Node | null {
  const queue: Node[] = [startNode];
  const visited = new Set<Node>([startNode]);
  let queueIndex = 0;
  
  while (queueIndex < queue.length) {
    const node = queue[queueIndex++];
    
    if (node.value === targetValue) {
      return node; // Found! BFS guarantees it's closest
    }
    
    for (const neighbor of node.neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return null; // Not found
}
```

**Complexity:**
- Time: O(V + E) — visit vertices and edges (all connections)
- Space: O(V) — queue and visited set in worst case

**Interview talking points:**
- "BFS guarantees finding closest/shortest path in unweighted graph"
- "Visited set prevents cycles and duplicate processing"
- "Using array with index instead of shift() keeps O(1) operations"

---

### Pattern 2: Level-Order Group Processing

**Interview signal:** "Process level by level" or "Groups"

**When to use:**
- Process all nodes at current level before moving to next
- Collect output grouped by distance/level
- Multi-source BFS (start from multiple sources)

**Key idea:** Track how many items are at current level.

```typescript
function levelOrderGroups(startNode: Node): number[][] {
  const result: number[][] = [];
  const queue: Node[] = [startNode];
  let queueIndex = 0;
  
  while (queueIndex < queue.length) {
    // All items currently in queue are one level
    const levelSize = queue.length - queueIndex;
    const levelValues: number[] = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue[queueIndex++];
      levelValues.push(node.value);
      
      for (const neighbor of node.neighbors) {
        queue.push(neighbor);
      }
    }
    
    result.push(levelValues);
  }
  
  return result;
}
```

**Complexity:**
- Time: O(V + E)
- Space: O(V)

**Key technique:** `levelSize = queue.length - queueIndex` lets you know how many items are at this level without modifying queue.

---

### Pattern 3: Deque (Double-Ended Queue)

**Interview signal:** "Remove from front and back" or "Sliding window"

**When to use:**
- Sliding window problems (add right, remove left)
- Monotonic deque (maintain decreasing/increasing order)
- Moving window max/min

**Key idea:** Allow operations at both ends for flexibility.

```typescript
class Deque<T> {
  private items: T[] = [];
  
  addFirst(value: T): void {
    this.items.unshift(value);
  }
  
  addLast(value: T): void {
    this.items.push(value);
  }
  
  removeFirst(): T | undefined {
    return this.items.shift();
  }
  
  removeLast(): T | undefined {
    return this.items.pop();
  }
  
  peekFirst(): T | undefined {
    return this.items[0];
  }
  
  peekLast(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

// Sliding window maximum using deque
function maxSlidingWindow(
  nums: number[],
  windowSize: number
): number[] {
  const deque: Deque<number> = new Deque();
  const result: number[] = [];
  
  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (
      deque.peekFirst() !== undefined &&
      deque.peekFirst()! < i - windowSize + 1
    ) {
      deque.removeFirst();
    }
    
    // Remove smaller elements (monotonic decreasing)
    while (
      deque.peekLast() !== undefined &&
      nums[deque.peekLast()!] < nums[i]
    ) {
      deque.removeLast();
    }
    
    deque.addLast(i);
    
    // First valid max at window size
    if (i >= windowSize - 1) {
      result.push(nums[deque.peekFirst()!]);
    }
  }
  
  return result;
}
```

**Complexity:**
- Time: O(n) — each element added/removed once
- Space: O(k) — k is window size

---

## Interview Strategy for Queue Problems

### Step 1: Clarify

Ask your interviewer:
- "Is it a single-source or multi-source BFS?"
- "Do I need the path itself or just distance?"
- "Can nodes be visited multiple times?"
- "Is there a weight on edges?" (if yes, use Dijkstra, not BFS)

### Step 2: Identify Pattern

| Problem Type | Pattern | Data Structure |
|---|---|---|
| Shortest path, unweighted | BFS | Queue |
| Level-order processing | Group-level BFS | Queue with level tracking |
| Sliding window min/max | Monotonic deque | Deque |
| State exploration | Multi-queue BFS | Multiple queues (one per state) |

### Step 3: Code Template

```typescript
function solve(startNode: Node): ReturnType {
  const queue: Node[] = [startNode];
  const visited = new Set<Node>([startNode]);
  let queueIndex = 0;
  
  while (queueIndex < queue.length) {
    const node = queue[queueIndex++];
    
    // Process node
    // Check exit condition
    
    // Explore neighbors
    for (const neighbor of node.neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}
```

---

## Common Queue Mistakes to Avoid

1. **Using `.shift()` repeatedly** → O(n) per shift!
   - ✅ Use index pointer instead: `queue[queueIndex++]`

2. **Forgetting visited set** → Infinite loop in cycles
   - ✅ Always mark as visited before pushing

3. **BFS on weighted graph** → Wrong answer!
   - ✅ Use Dijkstra or Bellman-Ford for weights

4. **Not handling empty queue check** → NullPointerException
   - ✅ Check `queueIndex < queue.length` condition

5. **Adding duplicates to queue** → Inefficiency or wrong answer
   - ✅ Check visited set before adding

---

## Edge Cases to Test

1. **Single node** → Return immediately, process correctly
2. **No neighbors** → Process and terminate
3. **Cycle present** → Visited set handles it
4. **No valid answer** → Return empty or null
5. **Very large graph** → Space complexity becomes critical

Example voice-through:
> "For single node: add to queue, process, no neighbors, done. For cycle: mark visited before adding neighbors, so we don't re-add same node. For empty input: check before starting loop."

---

## Complexity Always

Queue problems are usually:
- **Time:** O(V + E) — visit all nodes and edges
- **Space:** O(V) — queue in worst case holds all nodes

Make sure to state this clearly:
> "Time complexity is O(V + E) because we visit each vertex once and examine each edge once. Space is O(V) for the queue and visited set, which in worst case can hold all vertices."

---

## Quick Reference: Queue Problem Checklist

Before submitting:
- [ ] Checked if input is empty/single node
- [ ] Used visited set (prevents cycles)
- [ ] Used index pointer, not shift()
- [ ] Tested cycle handling
- [ ] Verified BFS is appropriate (not weighted graph)
- [ ] Stated O(V+E) time, O(V) space
- [ ] Explained why BFS is optimal choice
- [ ] Tested with simple example out loud

---

## Next Steps

1. Implement basic BFS from a starting node
2. Implement level-order BFS with grouping
3. Try multi-source BFS (start from multiple sources simultaneously)
4. Study monotonic deque for sliding window problems
5. Compare BFS vs DFS: know when each is better
