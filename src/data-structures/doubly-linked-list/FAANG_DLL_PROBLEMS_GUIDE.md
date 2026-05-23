# FAANG Doubly Linked List Problems Guide

This guide covers doubly linked list patterns in interviews. Doubly linked lists are useful when you need bidirectional traversal (e.g., LRU cache, browser history, undo/redo).

## When to Use Doubly Linked List

**Use DLL when:**
- Need O(1) removal at both ends (deque-like)
- Need bidirectional traversal
- Building LRU cache, browser history, or undo systems
- Need O(1) removal given a node reference

**Use Singly Linked List when:**
- Only need forward traversal
- Memory is critical (extra pointer overhead)
- Problem specifies singly linked list

**Use Array/Vector when:**
- Need random access by index
- Memory is abundant and predictable

---

## Doubly Linked List Node Structure

```typescript
class DLLNode<T> {
  value: T;
  next: DLLNode<T> | null = null;
  prev: DLLNode<T> | null = null;
  
  constructor(value: T) {
    this.value = value;
  }
}
```

**Key difference from SLL:** Both `next` and `prev` pointers.

---

## Core Doubly Linked List Patterns

### Pattern 1: Deque Operations (Add/Remove Both Ends)

**Interview signal:** "Queue" or "Deque" or "Add/remove from both ends"

**How it works:**
- Maintain `head` and `tail` pointers
- All operations O(1)
- Update both directions when modifying

```typescript
class Deque<T> {
  private head: DLLNode<T> | null = null;
  private tail: DLLNode<T> | null = null;
  private length: number = 0;

  // Add to front: O(1)
  addFirst(value: T): void {
    const newNode = new DLLNode(value);
    
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    
    this.length++;
  }

  // Add to back: O(1)
  addLast(value: T): void {
    const newNode = new DLLNode(value);
    
    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    
    this.length++;
  }

  // Remove from front: O(1)
  removeFirst(): T | undefined {
    if (!this.head) return undefined;
    
    const value = this.head.value;
    
    if (this.head === this.tail) {
      this.head = this.tail = null;
    } else {
      this.head = this.head.next!;
      this.head.prev = null;
    }
    
    this.length--;
    return value;
  }

  // Remove from back: O(1)
  removeLast(): T | undefined {
    if (!this.tail) return undefined;
    
    const value = this.tail.value;
    
    if (this.head === this.tail) {
      this.head = this.tail = null;
    } else {
      this.tail = this.tail.prev!;
      this.tail.next = null;
    }
    
    this.length--;
    return value;
  }
}
```

**Complexity:**
- All operations: O(1)
- Space: O(n) for n elements

**Interview talking point:**
> "Deque with doubly linked list gives O(1) for all operations. This is better than array-based deque which has O(n) for resizing."

---

### Pattern 2: LRU Cache (Most Important!)

**Interview signal:** "Cache", "LRU", "Most recently used"

**Problem:** Implement a cache with O(1) get and O(1) put, evicting least recently used item when full.

**Why DLL:** 
- Move accessed item to front: O(1) with DLL (O(n) with SLL)
- Remove least recent (tail): O(1)
- Hash map for O(1) node lookups

```typescript
class LRUCache {
  private capacity: number;
  private cache: Map<number, DLLNode<[key: number, value: number]>>;
  private head: DLLNode<[number, number]> | null; // Most recent
  private tail: DLLNode<[number, number]> | null; // Least recent

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    
    // Dummy nodes to avoid null checks
    this.head = new DLLNode([-1, -1]);
    this.tail = new DLLNode([-1, -1]);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    if (!this.cache.has(key)) {
      return -1;
    }
    
    const node = this.cache.get(key)!;
    this.moveToHead(node); // Mark as recently used
    return node.value[1];
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      // Update existing
      const node = this.cache.get(key)!;
      node.value = [key, value];
      this.moveToHead(node);
    } else {
      // Add new
      const newNode = new DLLNode([key, value]);
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      
      // Evict if over capacity
      if (this.cache.size > this.capacity) {
        const removed = this.removeTail();
        this.cache.delete(removed[0]);
      }
    }
  }

  private moveToHead(node: DLLNode<[number, number]>): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  private addToHead(node: DLLNode<[number, number]>): void {
    node.next = this.head!.next;
    node.prev = this.head;
    this.head!.next!.prev = node;
    this.head!.next = node;
  }

  private removeNode(node: DLLNode<[number, number]>): void {
    const prev = node.prev!;
    const next = node.next!;
    prev.next = next;
    next.prev = prev;
  }

  private removeTail(): [number, number] {
    const node = this.tail!.prev!;
    this.removeNode(node);
    return node.value;
  }
}
```

**Complexity:**
- get: O(1)
- put: O(1)
- Space: O(capacity)

**Interview talking points:**
- "DLL enables O(1) move to front"
- "Hash map enables O(1) node lookup"
- "Dummy head/tail nodes simplify edge cases"
- "When cache is full, remove tail (oldest)"

---

### Pattern 3: Browser History (Undo/Redo)

**Interview signal:** "Undo", "Redo", "Browser back/forward"

**How it works:**
- DLL maintains history
- Current pointer shows where we are
- Moving back/forward updates pointer

```typescript
class BrowserHistory {
  private history: DLLNode<string>;
  private current: DLLNode<string>;

  constructor(homepage: string) {
    this.current = new DLLNode(homepage);
    this.history = this.current;
  }

  visit(url: string): void {
    const newNode = new DLLNode(url);
    this.current.next = newNode;
    newNode.prev = this.current;
    this.current = newNode;
  }

  back(steps: number): string {
    while (steps > 0 && this.current.prev) {
      this.current = this.current.prev;
      steps--;
    }
    return this.current.value;
  }

  forward(steps: number): string {
    while (steps > 0 && this.current.next) {
      this.current = this.current.next;
      steps--;
    }
    return this.current.value;
  }
}
```

**Complexity:**
- visit: O(1)
- back/forward: O(steps)
- Space: O(n) history size

---

## Interview Strategy for DLL Problems

### Step 1: Identify the Need for DLL

```
Need efficient:
  ✓ Remove from front → DLL or deque
  ✓ Remove from back → DLL or deque
  ✓ Move item to front → DLL (SLL would be O(n))
  ✓ LRU eviction → DLL + hash map
```

### Step 2: Use Dummy Nodes

Always use dummy `head` and `tail` nodes. They eliminate edge case handling:

```typescript
// ✅ GOOD - no null checks
this.head.next = node;
node.prev = this.head;

// ❌ BAD - lots of null checks
if (!this.head) { }
else { }
```

### Step 3: Common Operations

```typescript
// Add after node
function addAfter(node: DLLNode, newNode: DLLNode): void {
  newNode.next = node.next;
  newNode.prev = node;
  node.next!.prev = newNode;
  node.next = newNode;
}

// Remove node
function removeNode(node: DLLNode): void {
  node.prev!.next = node.next;
  node.next!.prev = node.prev;
}

// Move node to head
function moveToHead(node: DLLNode): void {
  removeNode(node);
  addAfter(head, node);
}
```

---

## Common DLL Mistakes

1. **Forgetting to update `prev` pointer** → Broken traversal
2. **Not using dummy nodes** → Complex null checks everywhere
3. **Incorrect removal in LRU** → Wrong item gets evicted
4. **Memory leak in some languages** → DLL nodes might not be garbage collected
5. **Off-by-one in capacity check** → Evict at wrong time

---

## Edge Cases to Test

1. **Empty DLL** → Add to dummy nodes only
2. **Single element** → head.next = tail, tail.prev = head
3. **Capacity 1** → New item immediately evicts old item
4. **Access after removal** → Should handle gracefully
5. **Sequential back/forward** → Don't go past boundaries

Example voice-through (LRU):
> "With capacity 1: add first item → works. Add second item → first is evicted, cache has only one. Access existing: move to head, don't re-add. Evict when size > capacity, not when size == capacity."

---

## Complexity Summary

| Operation | Array | SLL | DLL |
|---|---|---|---|
| Add front | O(n) | O(1) | O(1) |
| Add back | O(1) | O(n) | O(1) |
| Remove front | O(n) | O(1) | O(1) |
| Remove back | O(1) | O(n) | O(1) |
| Move to front | O(n) | O(n) | O(1)* |

*With node reference (not searching)

---

## Quick Reference: DLL Problem Checklist

Before submitting:
- [ ] Used dummy head/tail nodes
- [ ] Tested empty case
- [ ] Tested single element
- [ ] Tested add to front/back
- [ ] Tested remove from front/back
- [ ] For LRU: tested capacity = 1
- [ ] For LRU: verified eviction logic
- [ ] Updated both `next` and `prev`
- [ ] Stated all operations O(1)
- [ ] Explained why DLL > SLL for this problem

---

## Next Steps

1. Implement basic DLL with add/remove
2. Implement Deque with O(1) all operations
3. Implement LRU Cache (very common interview!)
4. Try browser history or undo/redo
5. Compare: DLL vs Array for deque operations
