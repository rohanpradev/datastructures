import type { TreeNode } from "@/data-structures/binary-search-tree/binary-search-tree";
import { Stack } from "@/data-structures/stack/stack";

/**
 * LeetCode Problem: Reverse String Using Stack
 *
 * Problem Statement:
 * Given a string, reverse it using a stack data structure.
 *
 * Why Use a Stack?
 * - Stack provides LIFO (Last In First Out) behavior
 * - Perfect for reversing sequences
 * - Characters pushed in order will pop in reverse order
 * - Simple and intuitive solution
 *
 * Algorithm:
 * 1. Create an empty stack
 * 2. Push each character from the string onto the stack
 * 3. Pop all characters from the stack to build reversed string
 * 4. Return the reversed string
 *
 * Time Complexity: O(n)
 * - Push all characters: O(n)
 * - Pop all characters: O(n)
 * - Total: O(n)
 *
 * Space Complexity: O(n)
 * - Stack stores all n characters
 *
 * Visual Example:
 * ```
 * Input: "hello"
 *
 * Step 1 - Push characters:
 * Stack (bottom to top): h -> e -> l -> l -> o
 *
 * Step 2 - Pop characters:
 * Pop 'o' -> result = "o"
 * Pop 'l' -> result = "ol"
 * Pop 'l' -> result = "oll"
 * Pop 'e' -> result = "olle"
 * Pop 'h' -> result = "olleh"
 *
 * Output: "olleh"
 * ```
 *
 * Edge Cases:
 * - Empty string: Return empty string
 * - Single character: Return same character
 * - Palindrome: Returns reverse (which happens to be same)
 * - String with spaces: Spaces are also reversed
 *
 * Common Mistakes:
 * - Forgetting to handle empty string
 * - Not preserving spaces and special characters
 * - Trying to modify string in place (strings are immutable)
 *
 * @param str - The string to reverse
 * @returns The reversed string
 *
 * @example
 * reverseString("hello");
 * // Returns: "olleh"
 *
 * @example
 * reverseString("Stack");
 * // Returns: "kcatS"
 *
 * @example
 * reverseString("");
 * // Returns: ""
 */
export function reverseString(str: string): string {
	// Handle empty string
	if (str.length === 0) {
		return "";
	}

	// Create stack to hold characters
	const stack = new Stack<string>();

	// Push all characters onto stack
	for (const char of str) {
		stack.push(char);
	}

	// Pop all characters to build reversed string
	let reversed = "";
	while (!stack.isEmpty()) {
		const char = stack.pop();
		if (char !== undefined) {
			reversed += char;
		}
	}

	return reversed;
}

/**
 * LeetCode Problem: Parentheses Balanced (Valid Parentheses)
 *
 * Problem Statement:
 * Given a string containing just the characters '(', ')', '{', '}', '[' and ']',
 * determine if the input string is valid. An input string is valid if:
 * 1. Open brackets must be closed by the same type of brackets
 * 2. Open brackets must be closed in the correct order
 * 3. Every close bracket has a corresponding open bracket of the same type
 *
 * Why Use a Stack?
 * - Stack maintains the order of opening brackets
 * - LIFO ensures most recent opening matches with closing
 * - Natural fit for nested structures
 * - Efficiently tracks unmatched brackets
 *
 * Algorithm:
 * 1. Create an empty stack
 * 2. Iterate through each character in the string
 * 3. If opening bracket: push onto stack
 * 4. If closing bracket:
 *    - Check if stack is empty (unmatched closing bracket)
 *    - Pop from stack and check if it matches the closing bracket
 *    - If no match, return false
 * 5. After iteration, check if stack is empty (all brackets matched)
 *
 * Time Complexity: O(n)
 * - Single pass through the string
 * - Each character processed once
 *
 * Space Complexity: O(n)
 * - Worst case: all opening brackets pushed to stack
 *
 * Visual Example 1 (Valid):
 * ```
 * Input: "({[]})"
 *
 * Step 1: '(' -> Stack: ['(']
 * Step 2: '{' -> Stack: ['(', '{']
 * Step 3: '[' -> Stack: ['(', '{', '[']
 * Step 4: ']' -> Pop '[', matches ✓ -> Stack: ['(', '{']
 * Step 5: '}' -> Pop '{', matches ✓ -> Stack: ['(']
 * Step 6: ')' -> Pop '(', matches ✓ -> Stack: []
 *
 * Stack empty -> Valid!
 * ```
 *
 * Visual Example 2 (Invalid):
 * ```
 * Input: "([)]"
 *
 * Step 1: '(' -> Stack: ['(']
 * Step 2: '[' -> Stack: ['(', '[']
 * Step 3: ')' -> Pop '[', doesn't match ✗
 *
 * Invalid!
 * ```
 *
 * Edge Cases:
 * - Empty string: Valid (no unmatched brackets)
 * - Only opening brackets: Invalid
 * - Only closing brackets: Invalid
 * - Mismatched types: "(]" -> Invalid
 * - Wrong order: "([)]" -> Invalid
 * - Single bracket: "(" or ")" -> Invalid
 *
 * Common Mistakes:
 * - Not checking if stack is empty before popping
 * - Not verifying that bracket types match
 * - Not checking if stack is empty at the end
 * - Forgetting to handle empty string case
 *
 * Interview Insights:
 * - Classic stack problem
 * - Tests understanding of LIFO principle
 * - Can be extended to other matching problems (HTML tags, etc.)
 * - Often asked in coding interviews at major tech companies
 *
 * @param str - The string containing brackets to validate
 * @returns true if brackets are balanced, false otherwise
 *
 * @example
 * isBalanced("()");
 * // Returns: true
 *
 * @example
 * isBalanced("()[]{}");
 * // Returns: true
 *
 * @example
 * isBalanced("(]");
 * // Returns: false
 *
 * @example
 * isBalanced("([)]");
 * // Returns: false
 *
 * @example
 * isBalanced("{[()]}");
 * // Returns: true
 */
export function isBalanced(str: string): boolean {
	// Handle empty string (considered valid)
	if (str.length === 0) {
		return true;
	}

	// Create stack to track opening brackets
	const stack = new Stack<string>();

	// Map closing brackets to their matching opening brackets
	const pairs: Record<string, string> = {
		")": "(",
		"}": "{",
		"]": "[",
	};

	// Process each character
	for (const char of str) {
		// If opening bracket, push to stack
		if (char === "(" || char === "{" || char === "[") {
			stack.push(char);
		}
		// If closing bracket
		else if (char === ")" || char === "}" || char === "]") {
			// Check if there's a matching opening bracket
			if (stack.isEmpty()) {
				return false; // Closing bracket with no opening
			}

			const top = stack.pop();
			// Verify the brackets match
			if (top !== pairs[char]) {
				return false; // Mismatched bracket types
			}
		}
		// Ignore non-bracket characters (if any)
	}

	// All brackets should be matched (stack should be empty)
	return stack.isEmpty();
}

/**
 * LeetCode Problem: Sort Stack
 *
 * Problem Statement:
 * Sort a stack such that the smallest items are on the top.
 * You can use an additional temporary stack, but you may not copy
 * the elements into any other data structure (such as an array).
 *
 * Constraints:
 * - Can only use one additional stack
 * - Cannot use array or other data structures
 * - Must use push, pop, peek, and isEmpty operations only
 *
 * Why This Is Challenging:
 * - Limited to stack operations only
 * - Cannot access elements in the middle
 * - Must maintain sorted order while transferring elements
 * - Requires careful element placement strategy
 *
 * Algorithm (Using Temporary Stack):
 * 1. Create a temporary stack to hold sorted elements
 * 2. While original stack is not empty:
 *    a. Pop element from original stack (call it 'temp')
 *    b. While temporary stack is not empty AND top > temp:
 *       - Pop from temporary stack
 *       - Push back to original stack
 *    c. Push temp onto temporary stack
 * 3. Transfer all elements from temporary stack back to original stack
 *
 * Time Complexity: O(n²)
 * - For each element (n elements)
 * - May need to move many elements back (up to n elements)
 * - Worst case: reverse sorted input
 *
 * Space Complexity: O(n)
 * - Additional temporary stack holds up to n elements
 *
 * Visual Example:
 * ```
 * Input Stack (top to bottom): [3, 1, 4, 2]
 *
 * Step 1: Pop 3, tempStack is empty
 * tempStack: [3]
 * originalStack: [1, 4, 2]
 *
 * Step 2: Pop 1, 3 > 1, so move 3 back
 * tempStack: [1]
 * originalStack: [3, 4, 2]
 *
 * Step 3: Pop 3, 1 < 3, push 3
 * tempStack: [1, 3]
 * originalStack: [4, 2]
 *
 * Step 4: Pop 4, 3 < 4, push 4
 * tempStack: [1, 3, 4]
 * originalStack: [2]
 *
 * Step 5: Pop 2, 4 > 2, move 4 back, 3 > 2, move 3 back
 * tempStack: [1, 2, 3, 4]
 * originalStack: []
 *
 * Final: Copy back to original
 * Result (top to bottom): [1, 2, 3, 4]
 * ```
 *
 * Edge Cases:
 * - Empty stack: No operation needed
 * - Single element: Already sorted
 * - Already sorted: Quick pass through
 * - Reverse sorted: Worst case, maximum operations
 * - Duplicate values: Handled correctly (stable sort)
 *
 * Common Mistakes:
 * - Forgetting to move elements back to original stack at end
 * - Not handling the case where temp is larger than all elements in tempStack
 * - Incorrectly comparing elements (wrong direction)
 * - Losing elements during transfer
 *
 * Interview Insights:
 * - Tests understanding of stack limitations
 * - Demonstrates problem-solving with constraints
 * - Shows ability to work with limited operations
 * - Can discuss trade-offs (time vs space vs constraints)
 *
 * Alternative Approaches:
 * - Recursive approach (uses call stack as additional space)
 * - If array allowed, would be O(n log n) with proper sort
 *
 * @param stack - The stack to sort (modified in place)
 *
 * @example
 * const stack = new Stack<number>(3);
 * stack.push(1).push(4).push(2);
 * sortStack(stack);
 * // Stack now (top to bottom): [1, 2, 3, 4]
 *
 * @example
 * const stack = new Stack<number>(5);
 * stack.push(1).push(9).push(3);
 * sortStack(stack);
 * // Stack now (top to bottom): [1, 3, 5, 9]
 */
export function sortStack(stack: Stack<number>): void {
	// Handle empty stack
	if (stack.isEmpty()) {
		return;
	}

	// Create temporary stack to hold sorted elements
	const tempStack = new Stack<number>();

	// Process all elements from original stack
	while (!stack.isEmpty()) {
		// Remove top element from original stack
		const temp = stack.pop();

		if (temp === undefined) {
			break;
		}

		// Move elements from tempStack back to original stack
		// while they are greater than temp
		while (!tempStack.isEmpty()) {
			const tempTop = tempStack.peek();

			// If top of tempStack is greater than temp,
			// move it back to original stack
			if (tempTop !== undefined && tempTop > temp) {
				const moved = tempStack.pop();
				if (moved !== undefined) {
					stack.push(moved);
				}
			} else {
				break;
			}
		}

		// Push temp onto tempStack in its correct sorted position
		tempStack.push(temp);
	}

	// Transfer all elements back to original stack
	// This reverses the order, so smallest is now on top
	while (!tempStack.isEmpty()) {
		const element = tempStack.pop();
		if (element !== undefined) {
			stack.push(element);
		}
	}
}

/**
 * Queue Using Two Stacks
 *
 * Problem Statement:
 * Implement a queue using two stacks. The queue should support
 * standard queue operations: enqueue (add to rear) and dequeue (remove from front).
 *
 * Why Use Two Stacks?
 * - Stack is LIFO, Queue is FIFO
 * - Need to reverse order twice to achieve FIFO
 * - First stack: accepts new elements
 * - Second stack: serves as reverse buffer for dequeue
 *
 * Key Insight:
 * - Enqueue: Push to stack1
 * - Dequeue: Pop from stack2
 *   - If stack2 is empty, transfer all from stack1 to stack2
 *   - This reverses the order, making oldest element accessible
 *
 * Visual Example:
 * ```
 * Operations: enqueue(1), enqueue(2), enqueue(3), dequeue()
 *
 * After enqueue(1), enqueue(2), enqueue(3):
 * stack1 (top to bottom): [3, 2, 1]
 * stack2: []
 *
 * On dequeue():
 * Step 1: Transfer stack1 to stack2
 * stack1: []
 * stack2 (top to bottom): [1, 2, 3]
 *
 * Step 2: Pop from stack2
 * Returns: 1
 * stack1: []
 * stack2 (top to bottom): [2, 3]
 *
 * Next dequeue() directly pops from stack2 (no transfer needed)
 * Returns: 2
 * ```
 *
 * Time Complexity:
 * - enqueue(): O(1) - Just push to stack1
 * - dequeue(): Amortized O(1)
 *   - Individual operation might be O(n) if transfer needed
 *   - But each element is transferred at most once
 *   - Over n operations, total cost is O(n), so O(1) per operation
 *
 * Space Complexity: O(n)
 * - Two stacks combined store all n elements
 *
 * Why Amortized O(1)?
 * - Each element is pushed to stack1 once: O(1)
 * - Each element is transferred to stack2 once: O(1)
 * - Each element is popped from stack2 once: O(1)
 * - Total: 3 operations per element = O(1) per element
 *
 * Edge Cases:
 * - Dequeue from empty queue: Return undefined
 * - Multiple dequeues without enqueue: Use stack2 until empty
 * - Multiple enqueues without dequeue: Stack1 grows
 * - Alternating enqueue/dequeue: Frequent transfers
 *
 * Common Mistakes:
 * - Transferring on every dequeue (inefficient)
 * - Not checking if stack2 has elements before transferring
 * - Losing elements during transfer
 * - Not handling empty queue case
 *
 * Interview Insights:
 * - Classic design problem
 * - Tests understanding of stack and queue properties
 * - Demonstrates amortized analysis
 * - Shows ability to combine data structures creatively
 *
 * Follow-up Questions:
 * - What if we used array instead? (Easier but less educational)
 * - Can we implement stack using two queues? (Yes, but less efficient)
 * - How to optimize for more enqueues than dequeues? (Current design is optimal)
 */
export class QueueUsingStacks<T> {
	private stack1: Stack<T>; // For enqueue operations
	private stack2: Stack<T>; // For dequeue operations

	/**
	 * Creates a new queue using two stacks
	 * Time Complexity: O(1)
	 *
	 * @example
	 * const queue = new QueueUsingStacks<number>();
	 */
	constructor() {
		this.stack1 = new Stack<T>();
		this.stack2 = new Stack<T>();
	}

	/**
	 * Adds an element to the rear of the queue
	 * Time Complexity: O(1)
	 *
	 * Algorithm:
	 * 1. Simply push element onto stack1
	 * 2. No transfer needed for enqueue
	 *
	 * @param value - The value to enqueue
	 *
	 * @example
	 * queue.enqueue(1);
	 * queue.enqueue(2);
	 * queue.enqueue(3);
	 */
	enqueue(value: T): void {
		this.stack1.push(value);
	}

	/**
	 * Removes and returns the element from the front of the queue
	 * Time Complexity: Amortized O(1)
	 *
	 * Algorithm:
	 * 1. If stack2 is empty, transfer all elements from stack1 to stack2
	 *    - This reverses the order, making oldest element accessible
	 * 2. Pop from stack2 (this is the oldest element)
	 * 3. Return the popped value (or undefined if queue was empty)
	 *
	 * @returns The dequeued value, or undefined if queue is empty
	 *
	 * @example
	 * queue.enqueue(1);
	 * queue.enqueue(2);
	 * queue.dequeue(); // Returns: 1
	 * queue.dequeue(); // Returns: 2
	 */
	dequeue(): T | undefined {
		// If stack2 is empty, transfer elements from stack1
		if (this.stack2.isEmpty()) {
			// Transfer all elements from stack1 to stack2
			// This reverses the order
			while (!this.stack1.isEmpty()) {
				const element = this.stack1.pop();
				if (element !== undefined) {
					this.stack2.push(element);
				}
			}
		}

		// Pop from stack2 (oldest element)
		return this.stack2.pop();
	}

	/**
	 * Returns the element at the front without removing it
	 * Time Complexity: Amortized O(1)
	 *
	 * @returns The front element, or undefined if queue is empty
	 *
	 * @example
	 * queue.enqueue(1);
	 * queue.peek(); // Returns: 1
	 * queue.peek(); // Returns: 1 (not removed)
	 */
	peek(): T | undefined {
		// If stack2 is empty, transfer elements from stack1
		if (this.stack2.isEmpty()) {
			while (!this.stack1.isEmpty()) {
				const element = this.stack1.pop();
				if (element !== undefined) {
					this.stack2.push(element);
				}
			}
		}

		return this.stack2.peek();
	}

	/**
	 * Checks if the queue is empty
	 * Time Complexity: O(1)
	 *
	 * @returns true if queue is empty, false otherwise
	 */
	isEmpty(): boolean {
		return this.stack1.isEmpty() && this.stack2.isEmpty();
	}
}

/**
 * Evaluates a mathematical expression represented as a string.
 * Supports +, -, *, /, and parentheses.
 *
 * Time Complexity: O(n)
 * - Each character is processed once
 * - Stack operations are O(1)
 *
 * Algorithm Overview:
 * 1. Process the expression left to right
 * 2. Use two stacks:
 *    - values[] → stores numbers
 *    - ops[] → stores operators (+ - * / and '(')
 * 3. For each character:
 *    - If it's a number → parse the full number and push to values
 *    - If it's '(' → push to ops
 *    - If it's ')' → evaluate until matching '('
 *    - If it's an operator:
 *        • Apply previously stacked operators with higher or equal precedence
 *        • Then push the new operator
 * 4. After the loop, apply all remaining operators
 *
 * Example:
 * evaluate("( 1 + 3 + ( 4 * 2 ) - 6 )")
 * → 6
 */
export function evaluate(expr: string): number {
	/** Stack storing numeric values */
	const values: number[] = [];

	/** Stack storing operators (+ - * / '(') */
	const ops: string[] = [];

	/**
	 * Returns precedence level of an operator.
	 * Higher number → higher precedence.
	 *
	 * @param op - operator character
	 */
	function precedence(op: string): number {
		if (op === "+" || op === "-") return 1;
		if (op === "*" || op === "/") return 2;
		return 0;
	}

	/**
	 * Applies an operator to two numbers.
	 *
	 * @param op - operator (+ - * /)
	 * @param b  - second operand
	 * @param a  - first operand
	 * @returns result of a (op) b
	 *
	 * Example:
	 * applyOp('+', 3, 1) → 4
	 */
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

	/** Main evaluation loop */
	for (let i = 0; i < expr.length; i++) {
		const c = expr.charAt(i);

		// Skip spaces
		if (c === " ") continue;

		/**
		 * 1. If digit → build the full number
		 * Supports multi-digit values (e.g., 42)
		 */
		if (!Number.isNaN(Number(c))) {
			let num = 0;

			// Build number character-by-character
			while (
				i < expr.length &&
				!Number.isNaN(Number(expr[i])) &&
				expr[i] !== " "
			) {
				num = num * 10 + Number(expr[i]);
				i++;
			}

			// Step back since loop moved one extra position
			i--;

			values.push(num);
			continue;
		}

		/** 2. Opening parenthesis → push to ops */
		if (c === "(") {
			ops.push(c);
			continue;
		}

		/**
		 * 3. Closing parenthesis → resolve entire sub-expression
		 * Evaluate until matching '(' is found
		 */
		if (c === ")") {
			while (ops.length && ops[ops.length - 1] !== "(") {
				const op = ops.pop()!;
				const b = values.pop()!;
				const a = values.pop()!;
				values.push(applyOp(op, b, a));
			}

			// Remove the '(' from the stack
			ops.pop();
			continue;
		}

		/**
		 * 4. Operator encountered (+ - * /)
		 *
		 * Before pushing the operator:
		 * - Apply any operators already on the stack with higher or equal precedence
		 */
		if (["+", "-", "*", "/"].includes(c!)) {
			while (ops.length && precedence(ops[ops.length - 1]!) >= precedence(c!)) {
				const op = ops.pop()!;
				const b = values.pop()!;
				const a = values.pop()!;
				values.push(applyOp(op, b, a));
			}

			// Push the current operator
			ops.push(c!);
		}
	}

	/** 5. Apply remaining operators after full scan */
	while (ops.length) {
		const op = ops.pop()!;
		const b = values.pop()!;
		const a = values.pop()!;
		values.push(applyOp(op, b, a));
	}

	/** Final value in the values stack is the result */
	return values.pop()!;
}

/**
 * Calculates the sum of depths of all nodes in a binary tree.
 *
 * The depth of the root node is `0`.
 * Each child node has a depth equal to its parent’s depth + 1.
 *
 * This implementation uses an **iterative depth-first traversal**
 * with a stack to avoid recursion.
 *
 * Time Complexity: O(n)
 *   - Each node is visited exactly once.
 *
 * Space Complexity: O(h)
 *   - Where `h` is the height of the tree (stack size).
 *
 * @param root - The root node of the binary tree
 * @returns The sum of depths for all nodes in the tree
 */
export function nodeDepths(root: TreeNode<number>): number {
	// Stack stores nodes along with their depth
	const stack: Array<{ node: TreeNode<number>; depth: number }> = [
		{ node: root, depth: 0 },
	];

	let sumOfDepths = 0;

	while (stack.length > 0) {
		const current = stack.pop();
		if (!current) continue;

		const { node, depth } = current;

		// Add the current node's depth to the total
		sumOfDepths += depth;

		const nextDepth = depth + 1;

		// Push children only if they exist
		if (node.left) {
			stack.push({ node: node.left, depth: nextDepth });
		}

		if (node.right) {
			stack.push({ node: node.right, depth: nextDepth });
		}
	}

	return sumOfDepths;
}
