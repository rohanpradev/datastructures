/**
 * Rotates a square matrix 90 degrees clockwise in-place.
 *
 * Pattern: transpose + reverse rows
 * Time Complexity: O(n^2)
 * Space Complexity: O(1)
 */
export function rotateImage(matrix: number[][]): number[][] {
	const n = matrix.length;

	for (let row = 0; row < n; row++) {
		for (let col = row + 1; col < n; col++) {
			[matrix[row]![col], matrix[col]![row]] = [
				matrix[col]![row]!,
				matrix[row]![col]!,
			];
		}
	}

	for (const row of matrix) {
		row.reverse();
	}

	return matrix;
}

/**
 * Sets an entire row and column to zero if any cell is zero.
 *
 * Pattern: use first row/column as marker storage
 * Time Complexity: O(rows * cols)
 * Space Complexity: O(1)
 */
export function setMatrixZeroes(matrix: number[][]): number[][] {
	if (matrix.length === 0 || matrix[0]?.length === 0) return matrix;

	const rows = matrix.length;
	const cols = matrix[0]!.length;
	let firstRowHasZero = false;
	let firstColHasZero = false;

	for (let col = 0; col < cols; col++) {
		if (matrix[0]![col] === 0) firstRowHasZero = true;
	}

	for (let row = 0; row < rows; row++) {
		if (matrix[row]![0] === 0) firstColHasZero = true;
	}

	for (let row = 1; row < rows; row++) {
		for (let col = 1; col < cols; col++) {
			if (matrix[row]![col] === 0) {
				matrix[row]![0] = 0;
				matrix[0]![col] = 0;
			}
		}
	}

	for (let row = 1; row < rows; row++) {
		for (let col = 1; col < cols; col++) {
			if (matrix[row]![0] === 0 || matrix[0]![col] === 0) {
				matrix[row]![col] = 0;
			}
		}
	}

	if (firstRowHasZero) {
		for (let col = 0; col < cols; col++) matrix[0]![col] = 0;
	}

	if (firstColHasZero) {
		for (let row = 0; row < rows; row++) matrix[row]![0] = 0;
	}

	return matrix;
}

/**
 * Determines whether a number is happy.
 *
 * Pattern: cycle detection with a Set
 * Time Complexity: O(log n) per transformation until cycle
 * Space Complexity: O(log n)
 */
export function isHappyNumber(n: number): boolean {
	const seen = new Set<number>();
	let current = n;

	while (current !== 1 && !seen.has(current)) {
		seen.add(current);
		let next = 0;

		while (current > 0) {
			const digit = current % 10;
			next += digit * digit;
			current = Math.floor(current / 10);
		}

		current = next;
	}

	return current === 1;
}
