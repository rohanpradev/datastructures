# Linked List Problems - Practice Guide

## Overview

This guide covers essential linked list problems demonstrating pointer manipulation, two-pointer techniques, and linked list traversal patterns.

---

## Problem 1: Find Middle Node (LeetCode 876)

### Problem Statement

Find the middle node of a singly linked list. If there are two middle nodes, return the second one.

### Example

```
Input: 1 → 2 → 3 → 4 → 5
Output: 3

Input: 1 → 2 → 3 → 4 → 5 → 6
Output: 4 (second middle)
```

### Visual Explanation (Fast & Slow Pointers)

```
Technique: Tortoise and Hare

Fast pointer moves 2 steps
Slow pointer moves 1 step

When fast reaches end, slow is at middle!

1 → 2 → 3 → 4 → 5
S   F             (start)

1 → 2 → 3 → 4 → 5
    S       F     (after 1 step)

1 → 2 → 3 → 4 → 5
        S       X (fast at end, slow at middle!)
```

### Algorithm

```
1. Initialize slow = head, fast = head
2. While fast and fast.next exist:
   - slow = slow.next (1 step)
   - fast = fast.next.next (2 steps)
3. Return slow (middle node)
```

### Implementation Steps

```typescript
export function findMiddleNode(head: Node | null): Node | null {
  // TODO: Initialize slow and fast pointers
  // TODO: Move fast 2 steps, slow 1 step until fast reaches end
  // TODO: Return slow pointer
}
```

### Complexity

- **Time:** O(n) - single traversal
- **Space:** O(1) - only two pointers

---

## Problem 2: Has Loop (Floyd's Cycle Detection)

### Problem Statement

Detect if a linked list has a cycle.

### Example

```
No cycle:
1 → 2 → 3 → 4 → null

Has cycle:
1 → 2 → 3 → 4
    ↑       ↓
    ← ← ← ←
```

### Visual Explanation

```
Fast pointer moves 2 steps
Slow pointer moves 1 step

If there's a cycle, they WILL meet!

1 → 2 → 3 → 4
↑           ↓
← ← ← ← ← ←

Step 1: S=1, F=1
Step 2: S=2, F=3
Step 3: S=3, F=1
Step 4: S=4, F=3
Step 5: S=1, F=1  ← MEET! Cycle detected

If no cycle, fast reaches null
```

### Algorithm

```
1. If list is empty, return false
2. Initialize slow = head, fast = head
3. While fast and fast.next exist:
   - slow = slow.next
   - fast = fast.next.next
   - If slow === fast:
     • Return true (cycle found)
4. Return false (no cycle)
```

### Implementation Steps

```typescript
export function hasLoop(head: Node | null): boolean {
  // TODO: Handle empty list
  // TODO: Initialize slow and fast pointers
  // TODO: Move pointers until they meet or fast reaches end
  // TODO: Return true if pointers meet, false otherwise
}
```

### Complexity

- **Time:** O(n) - at most n steps in cycle
- **Space:** O(1) - only two pointers

---

## Problem 3: Find Kth From End

### Problem Statement

Find the kth node from the end of the linked list (1-indexed).

### Example

```
List: 1 → 2 → 3 → 4 → 5
k=1 → 5
k=2 → 4
k=3 → 3
```

### Visual Explanation (Two-Pointer with Gap)

```
Create a gap of k between two pointers

k = 2, List: 1 → 2 → 3 → 4 → 5

Step 1: Move fast k steps ahead
1 → 2 → 3 → 4 → 5
S       F
    (gap = 2)

Step 2: Move both until fast reaches end
1 → 2 → 3 → 4 → 5
        S       F

Step 3: Slow is kth from end!
Result: 4
```

### Algorithm

```
1. Initialize slow = head, fast = head
2. Move fast k steps ahead:
   - For i from 0 to k-1:
     • If fast is null, k is too large (error)
     • fast = fast.next
3. Move both until fast reaches end:
   - While fast.next exists:
     • slow = slow.next
     • fast = fast.next
4. Return slow
```

### Implementation Steps

```typescript
export function findKthFromEnd(head: Node | null, k: number): Node | null {
  // TODO: Initialize slow and fast pointers
  // TODO: Move fast k steps ahead
  // TODO: Handle case where k > length
  // TODO: Move both pointers until fast reaches end
  // TODO: Return slow
}
```

### Complexity

- **Time:** O(n) - single traversal
- **Space:** O(1) - two pointers

---

## Problem 4: Remove Duplicates

### Problem Statement

Remove all duplicate values from a sorted linked list.

### Example

```
Input: 1 → 1 → 2 → 3 → 3 → 4
Output: 1 → 2 → 3 → 4
```

### Visual Explanation

```
1 → 1 → 2 → 3 → 3 → 4
C

Step 1: C.value = 1, next.value = 1 (duplicate!)
        Skip: C.next = C.next.next
1 → 2 → 3 → 3 → 4
C

Step 2: C.value = 1, next.value = 2 (different)
        Move: C = C.next
1 → 2 → 3 → 3 → 4
    C

Step 3: C.value = 2, next.value = 3 (different)
        Move: C = C.next
1 → 2 → 3 → 3 → 4
        C

Step 4: C.value = 3, next.value = 3 (duplicate!)
        Skip: C.next = C.next.next
1 → 2 → 3 → 4
        C

Step 5: C.value = 3, next.value = 4 (different)
        Done!
```

### Algorithm

```
1. If list empty, return null
2. current = head
3. While current and current.next exist:
   - If current.value === current.next.value:
     • current.next = current.next.next (skip duplicate)
   - Else:
     • current = current.next (move forward)
4. Return head
```

### Implementation Steps

```typescript
export function removeDuplicates(head: Node | null): Node | null {
  // TODO: Handle empty list
  // TODO: Initialize current pointer
  // TODO: Loop while current and current.next exist
  // TODO: If duplicate, skip node
  // TODO: Otherwise, move to next
  // TODO: Return head
}
```

### Complexity

- **Time:** O(n) - single traversal
- **Space:** O(1) - in-place modification

---

## Problem 5: Reverse Between (LeetCode 92)

### Problem Statement

Reverse nodes from position left to right (1-indexed).

### Example

```
Input: 1 → 2 → 3 → 4 → 5, left=2, right=4
Output: 1 → 4 → 3 → 2 → 5
```

### Visual Explanation

```
Original: 1 → 2 → 3 → 4 → 5
          ^   ^       ^   ^
       before L       R  after

Step 1: Find positions
before = node 1
L = node 2
R = node 4
after = node 5

Step 2: Reverse sublist 2→3→4
null ← 2 ← 3 ← 4

Step 3: Reconnect
1 → 4 → 3 → 2 → 5
^           ^   ^
before      L  after

before.next = R (1 → 4)
L.next = after (2 → 5)
```

### Algorithm

```
1. Create dummy node before head
2. Move to node before left position
3. Reverse sublist from left to right
4. Reconnect pointers
5. Return dummy.next
```

### Implementation Steps

```typescript
export function reverseBetween(
  head: Node | null,
  left: number,
  right: number,
): Node | null {
  // TODO: Create dummy node
  // TODO: Find node before left position
  // TODO: Reverse sublist
  // TODO: Reconnect pointers
  // TODO: Return dummy.next
}
```

### Complexity

- **Time:** O(n) - traverse and reverse
- **Space:** O(1) - in-place

---

## Problem 6: Partition List (LeetCode 86)

### Problem Statement

Partition list around value x such that all nodes < x come before nodes ≥ x.

### Example

```
Input: 1 → 4 → 3 → 2 → 5 → 2, x=3
Output: 1 → 2 → 2 → 4 → 3 → 5
```

### Visual Explanation

```
Create two lists: less and greater

Original: 1 → 4 → 3 → 2 → 5 → 2, x=3

Process each node:

Node 1: 1 < 3
less: 1

Node 4: 4 ≥ 3
less: 1
greater: 4

Node 3: 3 ≥ 3
less: 1
greater: 4 → 3

Node 2: 2 < 3
less: 1 → 2
greater: 4 → 3

Node 5: 5 ≥ 3
less: 1 → 2
greater: 4 → 3 → 5

Node 2: 2 < 3
less: 1 → 2 → 2
greater: 4 → 3 → 5

Combine: less + greater
Result: 1 → 2 → 2 → 4 → 3 → 5
```

### Algorithm

```
1. Create two dummy nodes (less, greater)
2. For each node:
   - If value < x: add to less list
   - Else: add to greater list
3. Connect less.tail to greater.head
4. Return less.head
```

### Implementation Steps

```typescript
export function partitionList(head: Node | null, x: number): Node | null {
  // TODO: Create two dummy nodes
  // TODO: Initialize pointers for both lists
  // TODO: Traverse original list
  // TODO: Add to appropriate list based on value
  // TODO: Connect less list to greater list
  // TODO: Return result
}
```

### Complexity

- **Time:** O(n) - single traversal
- **Space:** O(1) - reuse existing nodes

---

## Problem 7: Merge Two Sorted Lists (LeetCode 21)

### Problem Statement

Merge two sorted linked lists into one sorted list.

### Example

```
Input:
  list1: 1 → 2 → 4
  list2: 1 → 3 → 4
Output: 1 → 1 → 2 → 3 → 4 → 4
```

### Visual Explanation

```
list1: 1 → 2 → 4
list2: 1 → 3 → 4

dummy → result list
current = dummy

Step 1: Compare 1 and 1 (equal, take from list1)
dummy → 1
        ^
      current
list1: 2 → 4
list2: 1 → 3 → 4

Step 2: Compare 2 and 1 (1 smaller)
dummy → 1 → 1
            ^
          current
list1: 2 → 4
list2: 3 → 4

Step 3: Compare 2 and 3 (2 smaller)
dummy → 1 → 1 → 2
                ^
              current
list1: 4
list2: 3 → 4

Step 4: Compare 4 and 3 (3 smaller)
dummy → 1 → 1 → 2 → 3
                    ^
                  current
list1: 4
list2: 4

Step 5: Compare 4 and 4 (equal, take from list1)
dummy → 1 → 1 → 2 → 3 → 4
                        ^
                      current
list1: null
list2: 4

Step 6: list1 is null, attach remaining list2
dummy → 1 → 1 → 2 → 3 → 4 → 4
```

### Algorithm

```
1. Create dummy node
2. current = dummy
3. While both lists have nodes:
   - Compare current nodes
   - Attach smaller node to result
   - Move pointer in that list
4. Attach remaining nodes from non-empty list
5. Return dummy.next
```

### Implementation Steps

```typescript
export function mergeTwoLists(
  list1: Node | null,
  list2: Node | null,
): Node | null {
  // TODO: Create dummy node
  // TODO: Initialize current pointer
  // TODO: Compare and merge while both lists have nodes
  // TODO: Attach remaining nodes
  // TODO: Return dummy.next
}
```

### Complexity

- **Time:** O(n + m) - visit all nodes once
- **Space:** O(1) - reuse existing nodes

---

## Problem: Add Two Numbers (LeetCode 2)

### Problem Statement

You are given two non-empty linked lists representing two non-negative integers.
The digits are stored in **reverse order**, and each node contains a **single digit**.

Add the two numbers and return the sum as a linked list.

> You may assume the two numbers do not contain any leading zeros, except the number 0 itself.

---

### Example

```
Input:
l1: 2 → 4 → 3
l2: 5 → 6 → 4

Output:
7 → 0 → 8
```

**Explanation:**
342 + 465 = 807

---

### Visual Explanation

```
l1: 2 → 4 → 3
l2: 5 → 6 → 4

Carry starts at 0

Step 1:
2 + 5 + 0 = 7
Result: 7
Carry: 0

Step 2:
4 + 6 + 0 = 10
Result: 7 → 0
Carry: 1

Step 3:
3 + 4 + 1 = 8
Result: 7 → 0 → 8
Carry: 0

Final Result:
7 → 0 → 8
```

---

### Key Insight

For each digit addition:

```
digit = sum % 10      // stays in current node
carry = sum / 10      // moves to next node
```

Carry represents **overflow**, not a digit.

---

### Algorithm

```
1. Create a dummy head node for the result list
2. Initialize carry = 0
3. While there are nodes in l1 or l2:
   - Read values from current nodes (use 0 if null)
   - Add values and carry
   - Store (sum % 10) in a new node
   - Update carry = floor(sum / 10)
4. If carry remains, append a new node
5. Return dummy.next
```

---

### Implementation Steps

```typescript
export function addTwoNumbers(
  l1: Node<number> | null,
  l2: Node<number> | null,
): Node<number> | null {
  // TODO: Handle edge case when both lists are null
  // TODO: Create dummy head node
  // TODO: Initialize current pointer and carry
  // TODO: Traverse both lists while nodes remain
  // TODO: Add digits + carry and create new node
  // TODO: Append remaining carry if present
  // TODO: Return dummy.next
}
```

---

### Complexity

- **Time:** O(max(n, m)) — traverse both lists once
- **Space:** O(max(n, m)) — new list for result

---

### Notes

- Input lists are **not modified**
- Works for:
  - Different length lists
  - Large lists
  - Final carry overflow

- Uses only `Node<T>` — no linked list wrapper class

---

## Linked List Techniques Summary

### Two-Pointer Patterns

#### Fast & Slow (Tortoise & Hare)

```
Uses:
- Find middle node
- Detect cycle
- Find cycle start

Pattern:
slow = head
fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
```

#### Two-Pointer with Gap

```
Uses:
- Find kth from end
- Remove kth from end

Pattern:
fast = head
Move fast k steps
Move both until fast reaches end
```

### Dummy Node Pattern

```
Uses:
- Handle edge cases (empty list, delete head)
- Simplify pointer manipulation

Pattern:
dummy = new Node(0)
dummy.next = head
// work with dummy
return dummy.next
```

### Reversal Pattern

```
Uses:
- Reverse entire list
- Reverse sublist
- Reverse in k groups

Pattern:
prev = null
current = head
while current:
    next = current.next
    current.next = prev
    prev = current
    current = next
return prev
```

---

## Common Linked List Operations

### Traverse

```typescript
let current = head;
while (current) {
  // process current
  current = current.next;
}
```

### Insert at Beginning

```typescript
const newNode = new Node(value);
newNode.next = head;
head = newNode;
```

### Insert at End

```typescript
const newNode = new Node(value);
if (!head) {
  head = newNode;
} else {
  let current = head;
  while (current.next) {
    current = current.next;
  }
  current.next = newNode;
}
```

### Delete Node

```typescript
// Delete node with value
let current = head;
let prev = null;
while (current && current.value !== target) {
  prev = current;
  current = current.next;
}
if (current) {
  if (prev) {
    prev.next = current.next;
  } else {
    head = current.next;
  }
}
```

---

## Problem: Remove Duplicates from a Sorted Linked List

### Problem Statement

You are given a **sorted singly linked list**.
Your task is to **remove all duplicate values in place**, so that each value appears **only once**.

Constraints:

- The list is sorted in **non-decreasing order**
- You must modify the **existing list** (no extra list allowed)

---

### Example

```
Input:
1 → 1 → 2 → 3 → 3 → 3 → 4

Output:
1 → 2 → 3 → 4
```

---

### Key Insight

> Because the list is sorted, **duplicate values are always adjacent**.

This means:

- We only need to compare each node with its **next** node
- No extra memory is required

---

### Visual Explanation

```
Initial list:
1 → 1 → 2 → 3 → 3 → 4
^
current
```

**Step 1:**

```
current.value === current.next.value
→ skip the next node

1 → 2 → 3 → 3 → 4
^
current
```

**Step 2:**

```
current.value !== current.next.value
→ move forward

1 → 2 → 3 → 3 → 4
    ^
```

**Step 3:**

```
current.value === current.next.value
→ skip duplicate

1 → 2 → 3 → 4
          ^
```

---

### Algorithm (In-Place Pointer Manipulation)

```
1. Start from the head of the list
2. While current and current.next exist:
   a. If current.value == current.next.value:
      - Skip the next node
   b. Else:
      - Move current forward
3. Return the modified list
```

---

### Implementation (TypeScript)

```ts
export function removeDuplicatesFromSortedLinkedList(
  list: SinglyLinkedList<number>,
): SinglyLinkedList<number> {
  let current = list.head;

  while (current && current.next) {
    if (current.value === current.next.value) {
      current.next = current.next.next;
    } else {
      current = current.next;
    }
  }

  return list;
}
```

---

### Complexity Analysis

- **Time Complexity:** `O(n)`
  - Each node is visited once

- **Space Complexity:** `O(1)`
  - No extra memory used

---

### Edge Cases to Consider

- Empty list → return empty list
- Single node → no changes
- All values duplicated → one node remains
- No duplicates → list remains unchanged

---

### Common Mistakes

- ❌ Using extra data structures unnecessarily
- ❌ Forgetting to advance `current`
- ❌ Trying this approach on an **unsorted** list

---

### Learning Pattern

This problem teaches:

- Linked list traversal
- Pointer manipulation
- How **problem constraints** (sorted input) simplify solutions
- In-place algorithm design

---

## Practice Tips

### Order to Practice

1. **Start with:** findMiddleNode, hasLoop (two-pointer basics)
2. **Then:** findKthFromEnd, removeDuplicates (pointer manipulation)
3. **Finally:** reverseBetween, partitionList, mergeTwoLists (advanced)

### Common Mistakes

1. ❌ Not handling empty list
2. ❌ Losing reference to head
3. ❌ Not updating .next before moving pointer
4. ❌ Off-by-one errors in k
5. ❌ Forgetting to check null before accessing .next

### Testing Strategy

```typescript
✓ Empty list (null)
✓ Single node
✓ Two nodes
✓ List with cycle
✓ k larger than length
✓ Reverse entire list
✓ Reverse single node
```

### Drawing Diagrams

```
Always draw before coding!

1. Draw initial state
2. Draw each step
3. Mark pointers clearly
4. Show connections after changes
```

---

## Complexity Cheat Sheet

| Problem            | Time   | Space | Key Technique     |
| ------------------ | ------ | ----- | ----------------- |
| Find Middle        | O(n)   | O(1)  | Fast & Slow       |
| Has Loop           | O(n)   | O(1)  | Floyd's Detection |
| Find Kth From End  | O(n)   | O(1)  | Gap Two-Pointer   |
| Remove Duplicates  | O(n)   | O(1)  | Single Pointer    |
| Reverse Between    | O(n)   | O(1)  | Reversal Pattern  |
| Partition List     | O(n)   | O(1)  | Two Lists         |
| Merge Sorted Lists | O(n+m) | O(1)  | Dummy Node        |

Happy Coding! 🚀
