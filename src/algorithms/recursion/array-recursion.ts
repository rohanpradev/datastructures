/**
 * Calculates the "product sum" of a potentially nested array of numbers.
 *
 * The product sum is defined as:
 * - The sum of all numbers in the array
 * - Where each nested array is summed and multiplied by its depth
 *
 * Depth rules:
 * - Top-level array has a multiplier of 1
 * - Each level of nesting increases the multiplier by 1
 *
 * Example:
 * productSum([1, [2, 3], [4, [5]]])
 * = 1
 * + (2 + 3) * 2
 * + (4 + (5 * 3)) * 2
 * = 1 + 10 + 26
 * = 37
 *
 * @param nums - An array containing numbers or nested arrays of numbers
 * @param multiplier - The depth-based multiplier (defaults to 1 for top-level)
 * @returns The calculated product sum
 */
type NestedNumberArray = Array<number | NestedNumberArray>;
export function productSum(
	nums: NestedNumberArray,
	multiplier: number = 1,
): number {
	let sum = 0;

	// Iterate through each value in the current array level
	for (const value of nums) {
		if (Array.isArray(value)) {
			// Recursively compute the product sum of nested arrays,
			// increasing the multiplier to reflect deeper nesting
			sum += productSum(value, multiplier + 1);
		} else {
			// Add plain numbers directly to the current level's sum
			sum += value;
		}
	}

	// Apply the multiplier for this depth level once
	return sum * multiplier;
}

/**
 * Calculates the number of distinct ways to reach the top of a staircase.
 *
 * You can take between 1 and `maxSteps` steps at a time.
 *
 * Example:
 * height = 3, maxSteps = 2
 *
 * Possible ways:
 * 1 + 1 + 1
 * 1 + 2
 * 2 + 1
 *
 * Total = 3 ways
 *  Memoization:
 * If we've already calculated the number of ways for this height,
 * return it instead of recalculating.
 * This reduces time complexity from exponential to O(height * maxSteps).
 *
 * @param height - Total number of steps in the staircase.
 * @param maxSteps - Maximum number of steps you can take in one move.
 * @returns The total number of distinct ways to reach the top.
 */
export function staircaseTraversal(height: number, maxSteps: number): number {
	const memo = new Map<number, number>();
	/**
	 * Recursive helper function.
	 *
	 * @param remainingHeight - Steps left to reach the top.
	 * @returns Number of ways to climb the remaining steps.
	 */
	function traverse(remainingHeight: number): number {
		// If we go below 0, this path is invalid
		if (remainingHeight < 0) return 0;

		// If exactly at the top, this is one valid way
		if (remainingHeight === 0) return 1;

		if (memo.has(remainingHeight)) return memo.get(remainingHeight)!;

		let totalWays = 0;

		// Try every possible step size (1 to maxSteps)
		for (let step = 1; step <= maxSteps; step++) {
			totalWays += traverse(remainingHeight - step);
		}

		memo.set(remainingHeight, totalWays);

		return totalWays;
	}

	return traverse(height);
}

/**
 * Represents a single cell value in the Minesweeper board.
 *
 * H → Hidden (unrevealed empty cell)
 * M → Mine
 * X → Exploded mine (when user clicks a mine)
 * 0-8 → Revealed cell showing number of adjacent mines
 */
type MinesweeperData =
	| "H"
	| "M"
	| "X"
	| "0"
	| "1"
	| "2"
	| "3"
	| "4"
	| "5"
	| "6"
	| "7"
	| "8";

/**
 * Reveals a cell in the Minesweeper board.
 *
 * Rules:
 * 1. If the clicked cell is a mine ("M"), it becomes "X" (game over).
 * 2. If the cell is not a mine:
 *    - Count adjacent mines.
 *    - If > 0 → reveal the number.
 *    - If 0 → reveal "0" and recursively reveal all hidden neighbors.
 *
 * This function mutates the board in-place and also returns it
 * for convenience.
 *
 * @param board - 2D Minesweeper board
 * @param row - Row index of clicked cell
 * @param column - Column index of clicked cell
 * @returns The updated board after reveal
 */
export function revealMinesweeper(
	board: MinesweeperData[][],
	row: number,
	column: number,
): MinesweeperData[][] {
	// If user clicks a mine → mark as exploded
	if (board[row][column] === "M") {
		board[row][column] = "X";
		return board;
	}

	// Get all valid surrounding cells (8 directions)
	const neighbours = getNeighbours(board, row, column);

	// Count how many adjacent cells contain mines
	let adjMines = 0;
	for (const [neighbourRow, neighbourCol] of neighbours) {
		if (board[neighbourRow][neighbourCol] === "M") {
			adjMines++;
		}
	}

	// If there are adjacent mines → reveal the count
	if (adjMines > 0) {
		board[row][column] = adjMines.toString() as MinesweeperData;
	} else {
		// If no adjacent mines → reveal as "0"
		board[row][column] = "0";

		// Recursively reveal all hidden neighbors
		for (const [neighbourRow, neighbourCol] of neighbours) {
			if (board[neighbourRow][neighbourCol] === "H") {
				revealMinesweeper(board, neighbourRow, neighbourCol);
			}
		}
	}

	return board;
}

/**
 * Returns all valid neighboring coordinates (8 directions)
 * around a given cell in a 2D grid.
 *
 * It automatically ignores out-of-bounds positions.
 *
 * @param board - Generic 2D matrix
 * @param row - Current row index
 * @param column - Current column index
 * @returns Array of valid [row, column] neighbor coordinates
 */
function getNeighbours<T>(
	board: T[][],
	row: number,
	column: number,
): Array<[number, number]> {
	// 8 possible movement directions (clockwise from Top)
	const dir = [
		[-1, 0], // Top
		[-1, 1], // Top-Right
		[0, 1], // Right
		[1, 1], // Bottom-Right
		[1, 0], // Bottom
		[1, -1], // Bottom-Left
		[0, -1], // Left
		[-1, -1], // Top-Left
	];

	const rowLen = board.length;
	const colLen = board[0].length;

	const neighbours: Array<[number, number]> = [];

	for (const [offRow, offCol] of dir) {
		const newRow = row + offRow;
		const newCol = column + offCol;

		// Skip invalid positions (outside board boundaries)
		if (newRow < 0 || newCol < 0 || newRow >= rowLen || newCol >= colLen) {
			continue;
		}

		neighbours.push([newRow, newCol]);
	}

	return neighbours;
}
