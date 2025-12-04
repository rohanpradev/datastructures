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

## Complexity Cheat Sheet

| Problem | Time | Space | Key Technique |
|---------|------|-------|---------------|
| Reverse String | O(n) | O(n) | Basic stack ops |
| Balanced Parentheses | O(n) | O(n) | Stack matching |
| Sort Stack | O(n²) | O(n) | Two stacks |
| Queue with Stacks | O(1) amortized | O(n) | Amortized analysis |
| Min Stack | O(1) | O(n) | Auxiliary stack |

Happy Coding! 🚀
