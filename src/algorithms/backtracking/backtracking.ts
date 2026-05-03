const PHONE_DIGITS: Record<string, string> = {
	"2": "abc",
	"3": "def",
	"4": "ghi",
	"5": "jkl",
	"6": "mno",
	"7": "pqrs",
	"8": "tuv",
	"9": "wxyz",
};

/**
 * Returns all possible letter combinations for phone keypad digits.
 *
 * Pattern: backtracking
 * Time Complexity: O(4^n)
 * Space Complexity: O(n) recursion depth, excluding output
 */
export function letterCombinations(digits: string): string[] {
	if (digits.length === 0) return [];

	const result: string[] = [];
	const current: string[] = [];

	function backtrack(index: number): void {
		if (index === digits.length) {
			result.push(current.join(""));
			return;
		}

		const letters = PHONE_DIGITS[digits[index]!];
		if (!letters) return;

		for (const letter of letters) {
			current.push(letter);
			backtrack(index + 1);
			current.pop();
		}
	}

	backtrack(0);
	return result;
}

/**
 * Generates every valid string of n pairs of parentheses.
 *
 * Pattern: constrained backtracking
 * Time Complexity: O(Cn), where Cn is the nth Catalan number
 * Space Complexity: O(n) recursion depth, excluding output
 */
export function generateParentheses(n: number): string[] {
	const result: string[] = [];
	const current: string[] = [];

	function backtrack(open: number, close: number): void {
		if (current.length === n * 2) {
			result.push(current.join(""));
			return;
		}

		if (open < n) {
			current.push("(");
			backtrack(open + 1, close);
			current.pop();
		}

		if (close < open) {
			current.push(")");
			backtrack(open, close + 1);
			current.pop();
		}
	}

	backtrack(0, 0);
	return result;
}

/**
 * Returns true if a word exists in a board by moving horizontally/vertically.
 *
 * Pattern: backtracking on a grid
 * Time Complexity: O(rows * cols * 4^wordLength)
 * Space Complexity: O(wordLength)
 */
export function wordSearch(board: string[][], word: string): boolean {
	if (word.length === 0) return true;
	if (board.length === 0 || board[0]?.length === 0) return false;

	const rows = board.length;
	const cols = board[0]!.length;
	const directions: Array<[number, number]> = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
	];

	function backtrack(row: number, col: number, index: number): boolean {
		if (index === word.length) return true;
		if (
			row < 0 ||
			row >= rows ||
			col < 0 ||
			col >= cols ||
			board[row]![col] !== word[index]
		) {
			return false;
		}

		const original = board[row]![col]!;
		board[row]![col] = "#";

		for (const [rowOffset, colOffset] of directions) {
			if (backtrack(row + rowOffset, col + colOffset, index + 1)) {
				board[row]![col] = original;
				return true;
			}
		}

		board[row]![col] = original;
		return false;
	}

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (backtrack(row, col, 0)) return true;
		}
	}

	return false;
}
