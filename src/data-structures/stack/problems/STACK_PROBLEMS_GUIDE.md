# Stack & Queue Problems - Practice Guide

## Overview

This guide covers stack and queue problems demonstrating LIFO (Last-In-First-Out) and FIFO (First-In-First-Out) patterns.

---

## Problem 1: Reverse String Using Stack

### Problem Statement

Reverse a string using a stack.

### Example

```
Input: "hello"
Output: "olleh"

Input: "world"
Output: "dlrow"
```

### Visual Explanation

```
String: "hello"

Push to stack (LIFO):
|   |    |   |    | l |    | l |    | l |
|   | →  | l | →  | l | →  | e | →  | e |
|   |    | l |    | e |    | e |    | h |
| h |    | e |    | h |    | h |    | h |
└───┘    └───┘    └───┘    └───┘    └───┘
push h   push e   push l   push l   push o

Pop from stack:
Pop: o → l → l → e → h
Result: "olleh"
```

### Algorithm

```
1. Create empty stack
2. Push each character onto stack
3. Pop all characters and build result
4. Return reversed string
```

### Implementation Steps

```typescript
export function reverseString(str: string): string {
  // TODO: Create stack (array)
  // TODO: Push each character
  // TODO: Pop all characters to build result
  // TODO: Return reversed string
}
```

### Complexity

- **Time:** O(n) - push n, pop n
- **Space:** O(n) - stack storage

---

## Problem 2: Balanced Parentheses (LeetCode 20)

### Problem Statement

Check if a string of parentheses is valid. Valid means:

1. Open brackets must be closed by same type
2. Open brackets must be closed in correct order

### Example

```
Input: "()"
Output: true

Input: "()[]{}"
Output: true

Input: "(]"
Output: false

Input: "([)]"
Output: false

Input: "{[]}"
Output: true
```

### Visual Explanation

```
String: "{[]}"

Step 1: {
Stack: ['{']

Step 2: [
Stack: ['{', '[']

Step 3: ]
  Top = '[', matches ']' ✓
  Pop
Stack: ['{']

Step 4: }
  Top = '{', matches '}' ✓
  Pop
Stack: []

Empty stack → Balanced! ✓

---

String: "([)]"

Step 1: (
Stack: ['(']

Step 2: [
Stack: ['(', '[']

Step 3: )
  Top = '[', doesn't match ')' ✗
  Invalid!
```

### Algorithm

```
1. Create empty stack
2. Create map of matching pairs: ) → (, ] → [, } → {
3. For each character:
   - If opening bracket: push to stack
   - If closing bracket:
     • If stack empty or top doesn't match: return false
     • Else: pop stack
4. Return true if stack is empty, false otherwise
```

### Implementation Steps

```typescript
export function isBalanced(str: string): boolean {
  // TODO: Create stack
  // TODO: Create map of closing → opening pairs
  // TODO: Loop through characters
  // TODO: Handle opening brackets
  // TODO: Handle closing brackets (check match)
  // TODO: Return true if stack empty
}
```

### Complexity

- **Time:** O(n) - single pass
- **Space:** O(n) - stack storage

---

## Problem 3: Sort Stack

### Problem Statement

Sort a stack (smallest on top) using only stack operations and one additional stack.

### Example

```
Input: [3, 1, 4, 2]  (4 on top)
Output: [4, 3, 2, 1]  (1 on top, sorted)
```

### Visual Explanation

```
Original stack:    Temp stack:
| 2 |              |   |
| 4 |              |   |
| 1 |              |   |
| 3 |              |   |
└───┘              └───┘

Step 1: Pop 2, temp empty
| 4 |              | 2 |
| 1 |              |   |
| 3 |              |   |
└───┘              └───┘

Step 2: Pop 4, 4 > 2
        Push 2 back, push 4 to temp
| 2 |              | 4 |
| 1 |              |   |
| 3 |              |   |
└───┘              └───┘

Step 3: Pop 2, 2 < 4
        Push 2 to temp
| 1 |              | 2 |
| 3 |              | 4 |
└───┘              └───┘

Step 4: Pop 1, 1 < 2
        Push 1 to temp
| 3 |              | 1 |
|   |              | 2 |
|   |              | 4 |
└───┘              └───┘

Step 5: Pop 3, 3 > 1
        Move 1,2 back, push 3
| 1 |              | 3 |
| 2 |              | 4 |
| 3 |              |   |
└───┘              └───┘

Continue until sorted...

Final:
| 1 |  ← smallest on top
| 2 |
| 3 |
| 4 |
└───┘
```

### Algorithm

```
1. Create temp stack
2. While original stack not empty:
   - temp = pop from original
   - While temp stack not empty AND top > temp:
     • Pop from temp to original
   - Push temp to temp stack
3. Move all from temp back to original
4. Return original
```

### Implementation Steps

```typescript
export function sortStack(stack: number[]): void {
  // TODO: Create temp stack
  // TODO: While original stack not empty
  // TODO: Pop element, find correct position in temp
  // TODO: Move elements back if needed
  // TODO: Push element to temp
  // TODO: Move all from temp back to original
}
```

### Complexity

- **Time:** O(n²) - nested while loops
- **Space:** O(n) - temp stack

---

## Problem 4: Queue Using Two Stacks (LeetCode 232)

### Problem Statement

Implement a queue using two stacks.

**Queue operations:**

- enqueue(x): Add element to back
- dequeue(): Remove element from front
- peek(): Get front element
- isEmpty(): Check if empty

### Example

```
enqueue(1)
enqueue(2)
peek() → 1
dequeue() → 1
isEmpty() → false
```

### Visual Explanation

```
Use two stacks: stack1 (enqueue), stack2 (dequeue)

Enqueue(1):
stack1: [1]
stack2: []

Enqueue(2):
stack1: [1, 2]  (2 on top)
stack2: []

Dequeue():
  If stack2 empty, move all from stack1:
  stack1: []
  stack2: [2, 1]  (1 on top)

  Pop from stack2:
  Result: 1

Enqueue(3):
stack1: [3]
stack2: [2]

Dequeue():
  stack2 not empty, pop:
  Result: 2

Dequeue():
  stack2 empty, move from stack1:
  stack1: []
  stack2: [3]

  Pop:
  Result: 3
```

### Algorithm

```
class QueueWithStacks:
	stack1 = []  // for enqueue
	stack2 = []  // for dequeue

	enqueue(x):
		stack1.push(x)

	dequeue():
		if stack2.isEmpty():
			while !stack1.isEmpty():
				stack2.push(stack1.pop())
		return stack2.pop()

	peek():
		if stack2.isEmpty():
			while !stack1.isEmpty():
				stack2.push(stack1.pop())
		return stack2.top()
```

### Implementation Steps

```typescript
class QueueUsingStacks<T> {
  private stack1: T[] = [];
  private stack2: T[] = [];

  enqueue(value: T): void {
    // TODO: Push to stack1
  }

  dequeue(): T | undefined {
    // TODO: If stack2 empty, move all from stack1
    // TODO: Pop from stack2
  }

  peek(): T | undefined {
    // TODO: If stack2 empty, move all from stack1
    // TODO: Return top of stack2
  }

  isEmpty(): boolean {
    // TODO: Check if both stacks empty
  }
}
```

### Complexity

- **Enqueue:** O(1)
- **Dequeue:** O(1) amortized (worst case O(n) when moving)
- **Space:** O(n)

---

## Problem 5: Min Stack (LeetCode 155)

### Problem Statement

Design a stack that supports push, pop, top, and retrieving minimum element in O(1) time.

### Example

```
push(3)
push(5)
push(2)
push(1)
getMin() → 1
pop()
getMin() → 2
pop()
getMin() → 3
```

### Visual Explanation

```
Use two stacks: main and min

Push(3):
main: [3]
min:  [3]  ← 3 is minimum so far

Push(5):
main: [3, 5]
min:  [3, 3]  ← still 3

Push(2):
main: [3, 5, 2]
min:  [3, 3, 2]  ← new minimum 2

Push(1):
main: [3, 5, 2, 1]
min:  [3, 3, 2, 1]  ← new minimum 1

getMin() → min.top() = 1

Pop():
main: [3, 5, 2]
min:  [3, 3, 2]

getMin() → 2
```

### Algorithm

```
class MinStack:
	mainStack = []
	minStack = []

	push(x):
		mainStack.push(x)
		if minStack.isEmpty() or x <= minStack.top():
			minStack.push(x)
		else:
			minStack.push(minStack.top())

	pop():
		mainStack.pop()
		minStack.pop()

	top():
		return mainStack.top()

	getMin():
		return minStack.top()
```

### Implementation Steps

```typescript
class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(value: number): void {
    // TODO: Push to main stack
    // TODO: Update min stack
  }

  pop(): number | undefined {
    // TODO: Pop from both stacks
  }

  top(): number | undefined {
    // TODO: Return top of main stack
  }

  getMin(): number | undefined {
    // TODO: Return top of min stack
  }
}
```

### Complexity

- **All operations:** O(1)
- **Space:** O(n) - two stacks

---

## Stack vs Queue Comparison

### Stack (LIFO)

```
Push → [3, 2, 1] → Pop
       ↓       ↑
     bottom   top

Operations:
- push(x): Add to top
- pop(): Remove from top
- peek(): View top
- isEmpty(): Check empty

Use cases:
- Function call stack
- Undo/Redo
- Expression evaluation
- Backtracking (DFS)
```

### Queue (FIFO)

```
Enqueue → [1, 2, 3] → Dequeue
          ↑       ↓
        front   back

Operations:
- enqueue(x): Add to back
- dequeue(): Remove from front
- peek(): View front
- isEmpty(): Check empty

Use cases:
- Task scheduling
- BFS traversal
- Print queue
- Request handling
```

---

## Common Patterns

### Parentheses Matching

```
Use stack to match pairs:
- Push opening brackets
- Pop and match closing brackets
```

### Next Greater Element

```
Use stack to track unseen elements:
while stack.top() < current:
	pop and update answer
push current
```

### Expression Evaluation

```
Two stacks: operands and operators
Process by operator precedence
```

### Monotonic Stack

```
Maintain increasing/decreasing stack
Pop elements that violate property
```

---

## Practice Tips

### Order to Practice

1. **Start with:** reverseString, isBalanced (basic operations)
2. **Then:** sortStack, queueUsingStacks (two-stack patterns)
3. **Finally:** minStack (optimization)

### Common Mistakes

1. ❌ Not checking if stack/queue is empty before pop
2. ❌ Forgetting to update auxiliary data structures
3. ❌ Off-by-one errors in indices
4. ❌ Not handling edge cases (empty, single element)
5. ❌ Modifying stack while iterating

### Testing Strategy

```typescript
✓ Empty stack/queue
✓ Single element
✓ Multiple elements
✓ All same values
✓ Mixed opening/closing brackets
✓ Unbalanced brackets
✓ Nested structures
```

---

# 📘 Understanding the `evaluate()` Function

_A line-by-line explanation with an example_

This function evaluates a **mathematical expression string** such as:

```
"3 + 5 * (2 - 1)"
```

It correctly handles:

- Numbers (multi-digit)
- Operators: `+ - * /`
- Parentheses
- Operator precedence (PEMDAS)

---

# 🧱 High-Level Idea

The algorithm uses **two stacks**:

1. **values stack** → stores numbers
2. **ops stack** → stores operators and parentheses

It follows the standard **Shunting Yard** / **Stack Evaluation** technique.

---

# 📦 Code Explained

```ts
function evaluate(expr: string): number {
```

Starts the function, accepting a string like `"3 + 2 * 5"`.

---

## 🧮 Stacks Setup

```ts
const values: number[] = [];
const ops: string[] = [];
```

- `values` holds numbers
- `ops` holds operators (`+ - * / (`)

---

## ⚖️ Operator Precedence Function

```ts
function precedence(op: string): number {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}
```

Defines which operators are “stronger”:

- `*` and `/` (2)
- `+` and `-` (1)

Used later when deciding whether an operator on the stack should be applied before adding a new one.

---

## 🧩 Operator Application Helper

```ts
function applyOp(op: string, b: number, a: number): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    default:
      throw new Error("Unknown operator: " + op);
  }
}
```

Takes two numbers (`a op b`) and computes the result.

Example:

```
applyOp('*', 5, 2) → 10
```

---

# 🔁 Main Loop — Scan Each Character

```ts
for (let i = 0; i < expr.length; i++) {
	const c = expr.charAt(i);
```

We walk through the expression one character at a time.

---

## ⏭️ Ignore Spaces

```ts
if (c === " ") continue;
```

Spaces are meaningless in math expressions.

---

## 1️⃣ If Digit → Build Full Number

```ts
if (!isNaN(Number(c))) {
  let num = 0;

  while (i < expr.length && !isNaN(Number(expr[i])) && expr[i] !== " ") {
    num = num * 10 + Number(expr[i]);
    i++;
  }

  i--;
  values.push(num);
  continue;
}
```

This block supports **multi-digit numbers** like `42`, not just `4` and `2`.

Example:
Expression: `"123 + 4"`

- Reads `'1'` → num = 1
- Reads `'2'` → num = 12
- Reads `'3'` → num = 123
- Pushes **123** to `values`

---

## 2️⃣ Opening Parenthesis

```ts
if (c === "(") {
  ops.push(c);
  continue;
}
```

Just push it onto the operator stack.

---

## 3️⃣ Closing Parenthesis

```ts
if (c === ")") {
  while (ops.length && ops[ops.length - 1] !== "(") {
    const op = ops.pop()!;
    const b = values.pop()!;
    const a = values.pop()!;
    values.push(applyOp(op, b, a));
  }

  ops.pop(); // remove '('
  continue;
}
```

When we hit `)`:

- Resolve everything **until** the matching `(`
- Remove that `(` from the operator stack

This handles sub-expressions like `(2 + 3)`.

---

## 4️⃣ Operator Handling

```ts
if (["+", "-", "*", "/"].includes(c!)) {
  while (ops.length && precedence(ops[ops.length - 1]!) >= precedence(c!)) {
    const op = ops.pop()!;
    const b = values.pop()!;
    const a = values.pop()!;
    values.push(applyOp(op, b, a));
  }

  ops.push(c!);
}
```

Before adding a new operator:

- If there’s an **older operator with higher or equal precedence**, apply it first.

Example:
Expression: `3 + 5 * 2`

- `+` is on stack
- See `*`
- Precedence(`*`) > precedence(`+`) → do **NOT** apply `+`
- Push `*`

---

# 🏁 Final Cleanup

```ts
while (ops.length) {
  const op = ops.pop()!;
  const b = values.pop()!;
  const a = values.pop()!;
  values.push(applyOp(op, b, a));
}
```

After scanning the whole string, apply any leftover operators.

---

## 🎉 Return Result

```ts
return values.pop()!;
```

The values stack should now contain **one final result**.

---

# ✅ Full Example Walkthrough

### Expression:

```
3 + 5 * (2 - 1)
```

### Step-by-step:

| Character              | Action                   | values stack | ops stack    |
| ---------------------- | ------------------------ | ------------ | ------------ |
| `3`                    | number → push            | [3]          | []           |
| `+`                    | push op                  | [3]          | [+]          |
| `5`                    | number → push            | [3,5]        | [+]          |
| `*`                    | higher precedence → push | [3,5]        | [+, *]       |
| `(`                    | push                     | [3,5]        | [+, *, (]    |
| `2`                    | push                     | [3,5,2]      | [+, *, (]    |
| `-`                    | push                     | [3,5,2]      | [+, *, (, -] |
| `1`                    | push                     | [3,5,2,1]    | [+, *, (, -] |
| `)`                    | resolve until `(`        | [3,5, 1]     | [+, *]       |
| (apply `-`: 2 - 1 = 1) |                          |              |              |

Now evaluate main expression left:

`5 * 1 = 5`
`3 + 5 = 8`

### Final result: **8**

---

## Problem: Node Depths (Binary Tree)

### Problem Statement

Given the root of a binary tree, calculate the **sum of the depths of all nodes** in the tree.

- The **depth** of the root node is `0`
- Each child node has a depth of **parent depth + 1**

### Example

Consider the following binary tree:

```
        1
       / \
      2   3
     / \
    4   5
```

**Depths:**

- Node `1` → depth `0`
- Node `2` → depth `1`
- Node `3` → depth `1`
- Node `4` → depth `2`
- Node `5` → depth `2`

**Sum of depths:**
`0 + 1 + 1 + 2 + 2 = 6`

---

### Visual Explanation (Depth-First Traversal)

We traverse the tree while keeping track of each node’s depth.

```
Stack (node, depth):

Start:
[(1, 0)]

Pop (1, 0):
sum = 0
Push children:
[(2, 1), (3, 1)]

Pop (3, 1):
sum = 1

Pop (2, 1):
sum = 2
Push children:
[(4, 2), (5, 2)]

Pop (5, 2):
sum = 4

Pop (4, 2):
sum = 6
```

Final result → **6**

---

### Algorithm (Iterative DFS)

```
function nodeDepths(root):
    stack ← [(root, 0)]
    sum ← 0

    while stack is not empty:
        node, depth ← stack.pop()
        sum ← sum + depth

        if node.left exists:
            stack.push(node.left, depth + 1)

        if node.right exists:
            stack.push(node.right, depth + 1)

    return sum
```

---

### Implementation (TypeScript)

```ts
/**
 * Calculates the sum of depths of all nodes in a binary tree.
 */
export function nodeDepths(root: TreeNode<number>): number {
  const stack = [{ node: root, depth: 0 }];
  let sumOfDepths = 0;

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const { node, depth } = current;
    sumOfDepths += depth;

    const nextDepth = depth + 1;

    if (node.left) {
      stack.push({ node: node.left, depth: nextDepth });
    }

    if (node.right) {
      stack.push({ node: node.right, depth: nextDepth });
    }
  }

  return sumOfDepths;
}
```

---

### Complexity Analysis

- **Time Complexity:** `O(n)`
  - Every node is visited exactly once

- **Space Complexity:** `O(h)`
  - `h` is the height of the tree (stack size)

---

### Key Concepts Used

- Binary Trees
- Depth-First Search (DFS)
- Stack (Iterative traversal)
- Tree node depth tracking

---

### DFS vs BFS for This Problem

**DFS (used here):**

- Uses a stack
- Easy to track depth
- Space-efficient for balanced trees

**BFS (alternative):**

- Uses a queue
- Also valid, but typically uses more memory level-by-level

---

## Complexity Cheat Sheet

| Problem              | Time           | Space | Key Technique      |
| -------------------- | -------------- | ----- | ------------------ |
| Reverse String       | O(n)           | O(n)  | Basic stack ops    |
| Balanced Parentheses | O(n)           | O(n)  | Stack matching     |
| Sort Stack           | O(n²)          | O(n)  | Two stacks         |
| Queue with Stacks    | O(1) amortized | O(n)  | Amortized analysis |
| Min Stack            | O(1)           | O(n)  | Auxiliary stack    |

Happy Coding! 🚀
