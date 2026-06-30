/**
 * Binary search in a sorted array.
 *
 * Pattern: binary search
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
export function binarySearch(nums: number[], target: number): number {
	let left = 0;
	let right = nums.length - 1;

	while (left <= right) {
		const mid = left + Math.floor((right - left) / 2);
		const value = nums[mid]!;

		if (value === target) return mid;
		if (value < target) left = mid + 1;
		else right = mid - 1;
	}

	return -1;
}

/**
 * Returns the first index whose value is greater than or equal to target.
 *
 * Pattern: lower-bound binary search
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
export function lowerBound(nums: number[], target: number): number {
	let left = 0;
	let right = nums.length;

	while (left < right) {
		const mid = left + Math.floor((right - left) / 2);

		if (nums[mid]! < target) left = mid + 1;
		else right = mid;
	}

	return left;
}

/**
 * Searches a rotated sorted array with distinct values.
 *
 * Pattern: modified binary search
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
export function searchRotatedSortedArray(
	nums: number[],
	target: number,
): number {
	let left = 0;
	let right = nums.length - 1;

	while (left <= right) {
		const mid = left + Math.floor((right - left) / 2);
		const midValue = nums[mid]!;

		if (midValue === target) return mid;

		if (nums[left]! <= midValue) {
			if (nums[left]! <= target && target < midValue) right = mid - 1;
			else left = mid + 1;
		} else {
			if (midValue < target && target <= nums[right]!) left = mid + 1;
			else right = mid - 1;
		}
	}

	return -1;
}

/**
 * Returns the maximum profit from one stock buy and one sell.
 *
 * Pattern: one-pass greedy
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export function maxProfit(prices: number[]): number {
	let minPrice = Infinity;
	let bestProfit = 0;

	for (const price of prices) {
		minPrice = Math.min(minPrice, price);
		bestProfit = Math.max(bestProfit, price - minPrice);
	}

	return bestProfit;
}

/**
 * Returns the longest run of consecutive integers.
 *
 * Pattern: hash set
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function longestConsecutiveRun(nums: number[]): number {
	const values = new Set(nums);
	let best = 0;

	for (const num of values) {
		if (values.has(num - 1)) continue;

		let current = num;
		let length = 1;

		while (values.has(current + 1)) {
			current++;
			length++;
		}

		best = Math.max(best, length);
	}

	return best;
}

/**
 * Returns the k most frequent numbers in any order.
 *
 * Pattern: frequency map + bucket sort
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function topKFrequentElements(nums: number[], k: number): number[] {
	if (k <= 0 || nums.length === 0) return [];

	const counts = new Map<number, number>();
	for (const num of nums) {
		counts.set(num, (counts.get(num) ?? 0) + 1);
	}

	const buckets = Array.from({ length: nums.length + 1 }, () => [] as number[]);
	for (const [num, count] of counts) {
		buckets[count]!.push(num);
	}

	const result: number[] = [];
	for (
		let count = buckets.length - 1;
		count >= 0 && result.length < k;
		count--
	) {
		for (const num of buckets[count]!) {
			result.push(num);
			if (result.length === k) break;
		}
	}

	return result;
}

/**
 * Returns all unique triplets that sum to zero.
 *
 * Pattern: sorting + two pointers
 * Time Complexity: O(n^2)
 * Space Complexity: O(n) for sorting copy, excluding output
 */
export function threeSum(nums: number[]): number[][] {
	const sorted = [...nums].sort((a, b) => a - b);
	const result: number[][] = [];

	for (let i = 0; i < sorted.length - 2; i++) {
		if (i > 0 && sorted[i] === sorted[i - 1]) continue;

		let left = i + 1;
		let right = sorted.length - 1;

		while (left < right) {
			const sum = sorted[i]! + sorted[left]! + sorted[right]!;

			if (sum === 0) {
				result.push([sorted[i]!, sorted[left]!, sorted[right]!]);
				left++;
				right--;

				while (left < right && sorted[left] === sorted[left - 1]) left++;
				while (left < right && sorted[right] === sorted[right + 1]) right--;
			} else if (sum < 0) {
				left++;
			} else {
				right--;
			}
		}
	}

	return result;
}

/**
 * Returns the largest area formed by two vertical lines.
 *
 * Pattern: two pointers
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export function containerWithMostWater(heights: number[]): number {
	let left = 0;
	let right = heights.length - 1;
	let best = 0;

	while (left < right) {
		const width = right - left;
		const height = Math.min(heights[left]!, heights[right]!);
		best = Math.max(best, width * height);

		if (heights[left]! < heights[right]!) {
			left++;
		} else {
			right--;
		}
	}

	return best;
}

/**
 * Computes trapped rain water between bars.
 *
 * Pattern: two pointers
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export function trapRainWater(heights: number[]): number {
	let left = 0;
	let right = heights.length - 1;
	let leftMax = 0;
	let rightMax = 0;
	let water = 0;

	while (left < right) {
		if (heights[left]! < heights[right]!) {
			leftMax = Math.max(leftMax, heights[left]!);
			water += leftMax - heights[left]!;
			left++;
		} else {
			rightMax = Math.max(rightMax, heights[right]!);
			water += rightMax - heights[right]!;
			right--;
		}
	}

	return water;
}

/**
 * Finds the length of the longest substring without repeated characters.
 *
 * Pattern: sliding window
 * Time Complexity: O(n)
 * Space Complexity: O(k), where k is the character set size
 */
export function lengthOfLongestSubstring(input: string): number {
	const lastSeen = new Map<string, number>();
	let left = 0;
	let best = 0;

	for (let right = 0; right < input.length; right++) {
		const char = input[right]!;
		const previousIndex = lastSeen.get(char);

		if (previousIndex !== undefined && previousIndex >= left) {
			left = previousIndex + 1;
		}

		lastSeen.set(char, right);
		best = Math.max(best, right - left + 1);
	}

	return best;
}

/**
 * Returns the smallest substring in source containing every character in target.
 *
 * Pattern: variable-size sliding window
 * Time Complexity: O(n + m)
 * Space Complexity: O(k)
 */
export function minWindowSubstring(source: string, target: string): string {
	if (target.length === 0 || source.length < target.length) return "";

	const required = new Map<string, number>();
	for (const char of target) {
		required.set(char, (required.get(char) ?? 0) + 1);
	}

	let missing = target.length;
	let left = 0;
	let bestStart = 0;
	let bestLength = Infinity;

	for (let right = 0; right < source.length; right++) {
		const char = source[right]!;
		const needed = required.get(char);

		if (needed !== undefined) {
			if (needed > 0) missing--;
			required.set(char, needed - 1);
		}

		while (missing === 0) {
			const windowLength = right - left + 1;
			if (windowLength < bestLength) {
				bestStart = left;
				bestLength = windowLength;
			}

			const leftChar = source[left]!;
			const leftNeeded = required.get(leftChar);
			if (leftNeeded !== undefined) {
				required.set(leftChar, leftNeeded + 1);
				if (leftNeeded + 1 > 0) missing++;
			}
			left++;
		}
	}

	return bestLength === Infinity
		? ""
		: source.slice(bestStart, bestStart + bestLength);
}

/**
 * Counts subarrays whose sum equals k.
 *
 * Pattern: prefix sum + hash map
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function subarraySumEqualsK(nums: number[], k: number): number {
	const prefixCounts = new Map<number, number>([[0, 1]]);
	let prefix = 0;
	let count = 0;

	for (const num of nums) {
		prefix += num;
		count += prefixCounts.get(prefix - k) ?? 0;
		prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1);
	}

	return count;
}

/**
 * Returns maximum values for every fixed-size sliding window.
 *
 * Pattern: monotonic deque
 * Time Complexity: O(n)
 * Space Complexity: O(k)
 */
export function slidingWindowMaximum(nums: number[], k: number): number[] {
	if (k <= 0 || nums.length === 0) return [];

	const result: number[] = [];
	const deque: number[] = [];
	let head = 0;

	for (let right = 0; right < nums.length; right++) {
		while (head < deque.length && deque[head]! <= right - k) {
			head++;
		}

		while (
			deque.length > head &&
			nums[deque[deque.length - 1]!]! <= nums[right]!
		) {
			deque.pop();
		}

		deque.push(right);

		if (right >= k - 1) {
			result.push(nums[deque[head]!]!);
		}
	}

	return result;
}

/**
 * Checks whether brackets close in the correct order.
 *
 * Pattern: stack
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function validParentheses(input: string): boolean {
	const stack: string[] = [];
	const closingToOpening = new Map<string, string>([
		[")", "("],
		["]", "["],
		["}", "{"],
	]);

	for (const char of input) {
		if (char === "(" || char === "[" || char === "{") {
			stack.push(char);
		} else if (closingToOpening.has(char)) {
			if (stack.pop() !== closingToOpening.get(char)) return false;
		}
	}

	return stack.length === 0;
}

/**
 * Returns how many days until a warmer temperature for each day.
 *
 * Pattern: monotonic stack
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function dailyTemperatures(temperatures: number[]): number[] {
	const waits = new Array<number>(temperatures.length).fill(0);
	const stack: number[] = [];

	for (let day = 0; day < temperatures.length; day++) {
		while (
			stack.length > 0 &&
			temperatures[stack[stack.length - 1]!]! < temperatures[day]!
		) {
			const previousDay = stack.pop()!;
			waits[previousDay] = day - previousDay;
		}

		stack.push(day);
	}

	return waits;
}

/**
 * Computes the largest rectangle area in a histogram.
 *
 * Pattern: monotonic stack
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
export function largestRectangleArea(heights: number[]): number {
	const stack: number[] = [];
	let best = 0;

	for (let index = 0; index <= heights.length; index++) {
		const currentHeight = index === heights.length ? 0 : heights[index]!;

		while (
			stack.length > 0 &&
			heights[stack[stack.length - 1]!]! > currentHeight
		) {
			const height = heights[stack.pop()!]!;
			const leftBoundary = stack[stack.length - 1] ?? -1;
			const width = index - leftBoundary - 1;
			best = Math.max(best, height * width);
		}

		stack.push(index);
	}

	return best;
}

/**
 * Finds the minimum eating speed to finish all piles within h hours.
 *
 * Pattern: binary search on answer
 * Time Complexity: O(n log maxPile)
 * Space Complexity: O(1)
 */
export function kokoEatingBananas(piles: number[], h: number): number {
	let left = 1;
	let right = Math.max(...piles);

	while (left < right) {
		const speed = left + Math.floor((right - left) / 2);
		const hours = piles.reduce(
			(total, pile) => total + Math.ceil(pile / speed),
			0,
		);

		if (hours <= h) right = speed;
		else left = speed + 1;
	}

	return left;
}

/**
 * Returns an array where result[i] is the product of all values except nums[i].
 *
 * Pattern: prefix/suffix products
 * Time Complexity: O(n)
 * Space Complexity: O(1) auxiliary space, excluding output
 */
export function productExceptSelf(nums: number[]): number[] {
	const result = new Array<number>(nums.length).fill(1);

	let prefix = 1;
	for (let i = 0; i < nums.length; i++) {
		result[i] = prefix;
		prefix *= nums[i]!;
	}

	let suffix = 1;
	for (let i = nums.length - 1; i >= 0; i--) {
		result[i] *= suffix;
		suffix *= nums[i]!;
	}

	return result.map((value) => (Object.is(value, -0) ? 0 : value));
}

/**
 * Determines whether a person can attend every meeting.
 *
 * Pattern: intervals
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
export function canAttendMeetings(intervals: Array<[number, number]>): boolean {
	const sorted = [...intervals].sort((a, b) => a[0] - b[0]);

	for (let i = 1; i < sorted.length; i++) {
		if (sorted[i]![0] < sorted[i - 1]![1]) return false;
	}

	return true;
}

/**
 * Merges overlapping intervals into non-overlapping ranges.
 *
 * Pattern: intervals
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
export function mergeOverlappingIntervals(
	intervals: Array<[number, number]>,
): Array<[number, number]> {
	if (intervals.length === 0) return [];

	const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
	const merged: Array<[number, number]> = [];

	for (const [start, end] of sorted) {
		const previous = merged[merged.length - 1];

		if (!previous || previous[1] < start) {
			merged.push([start, end]);
		} else {
			previous[1] = Math.max(previous[1], end);
		}
	}

	return merged;
}

/**
 * Returns the minimum rooms required to host all meetings.
 *
 * Pattern: intervals + sweep line
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
export function minMeetingRooms(intervals: Array<[number, number]>): number {
	const events: Array<[time: number, delta: number]> = [];

	for (const [start, end] of intervals) {
		events.push([start, 1], [end, -1]);
	}

	events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

	let rooms = 0;
	let maxRooms = 0;

	for (const [, delta] of events) {
		rooms += delta;
		maxRooms = Math.max(maxRooms, rooms);
	}

	return maxRooms;
}

/**
 * Returns the minimum number of intervals to remove so the rest do not overlap.
 *
 * Pattern: greedy intervals
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
export function eraseOverlapIntervals(
	intervals: Array<[number, number]>,
): number {
	if (intervals.length < 2) return 0;

	const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
	let removals = 0;
	let previousEnd = sorted[0]![1];

	for (let i = 1; i < sorted.length; i++) {
		const [start, end] = sorted[i]!;
		if (start < previousEnd) {
			removals++;
		} else {
			previousEnd = end;
		}
	}

	return removals;
}

/**
 * Generates every subset of the input numbers.
 *
 * Pattern: backtracking
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(n) recursion depth, excluding output
 */
export function subsets(nums: number[]): number[][] {
	const result: number[][] = [];
	const current: number[] = [];

	function backtrack(index: number): void {
		if (index === nums.length) {
			result.push([...current]);
			return;
		}

		backtrack(index + 1);

		current.push(nums[index]!);
		backtrack(index + 1);
		current.pop();
	}

	backtrack(0);
	return result;
}

/**
 * Returns unique combinations that sum to target.
 *
 * Pattern: backtracking with pruning
 * Time Complexity: exponential in the number of candidates
 * Space Complexity: O(target / minCandidate) recursion depth, excluding output
 */
export function combinationSum(
	candidates: number[],
	target: number,
): number[][] {
	const sorted = [...candidates].sort((a, b) => a - b);
	const result: number[][] = [];
	const current: number[] = [];

	function backtrack(startIndex: number, remaining: number): void {
		if (remaining === 0) {
			result.push([...current]);
			return;
		}

		for (let i = startIndex; i < sorted.length; i++) {
			const candidate = sorted[i]!;
			if (candidate > remaining) break;

			current.push(candidate);
			backtrack(i, remaining - candidate);
			current.pop();
		}
	}

	backtrack(0, target);
	return result;
}

/**
 * Returns all permutations of the input numbers.
 *
 * Pattern: backtracking
 * Time Complexity: O(n * n!)
 * Space Complexity: O(n) recursion depth, excluding output
 */
export function permutations(nums: number[]): number[][] {
	const result: number[][] = [];
	const current: number[] = [];
	const used = new Array<boolean>(nums.length).fill(false);

	function backtrack(): void {
		if (current.length === nums.length) {
			result.push([...current]);
			return;
		}

		for (let i = 0; i < nums.length; i++) {
			if (used[i]) continue;

			used[i] = true;
			current.push(nums[i]!);
			backtrack();
			current.pop();
			used[i] = false;
		}
	}

	backtrack();
	return result;
}

/**
 * Counts islands in a grid of "1" land and "0" water.
 *
 * Pattern: graph DFS over a matrix
 * Time Complexity: O(rows * cols)
 * Space Complexity: O(rows * cols)
 */
export function numIslands(grid: string[][]): number {
	if (grid.length === 0 || grid[0]?.length === 0) return 0;

	const rows = grid.length;
	const cols = grid[0]!.length;
	const visited = Array.from({ length: rows }, () =>
		new Array<boolean>(cols).fill(false),
	);
	const directions: Array<[number, number]> = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
	];

	function dfs(row: number, col: number): void {
		if (
			row < 0 ||
			row >= rows ||
			col < 0 ||
			col >= cols ||
			visited[row]![col] ||
			grid[row]![col] === "0"
		) {
			return;
		}

		visited[row]![col] = true;
		for (const [rowOffset, colOffset] of directions) {
			dfs(row + rowOffset, col + colOffset);
		}
	}

	let islands = 0;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (!visited[row]![col] && grid[row]![col] === "1") {
				islands++;
				dfs(row, col);
			}
		}
	}

	return islands;
}

/**
 * Determines whether all courses can be completed.
 *
 * Pattern: graph topological sort
 * Time Complexity: O(courses + prerequisites)
 * Space Complexity: O(courses + prerequisites)
 */
export function canFinishCourses(
	numCourses: number,
	prerequisites: Array<[number, number]>,
): boolean {
	const graph = Array.from({ length: numCourses }, () => [] as number[]);
	const indegree = new Array<number>(numCourses).fill(0);

	for (const [course, prereq] of prerequisites) {
		graph[prereq]!.push(course);
		indegree[course]++;
	}

	const queue: number[] = [];
	for (let course = 0; course < numCourses; course++) {
		if (indegree[course] === 0) queue.push(course);
	}

	let completed = 0;
	let head = 0;
	while (head < queue.length) {
		const course = queue[head++]!;
		completed++;

		for (const nextCourse of graph[course]!) {
			indegree[nextCourse]--;
			if (indegree[nextCourse] === 0) queue.push(nextCourse);
		}
	}

	return completed === numCourses;
}

/**
 * Finds the shortest path from top-left to bottom-right in an 8-direction grid.
 *
 * Pattern: BFS shortest path
 * Time Complexity: O(n^2)
 * Space Complexity: O(n^2)
 */
export function shortestPathBinaryMatrix(grid: number[][]): number {
	const n = grid.length;
	if (n === 0 || grid[0]?.length === 0 || grid[0]![0] === 1) return -1;
	if (grid[n - 1]![n - 1] === 1) return -1;

	const directions: Array<[number, number]> = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];
	const queue: Array<[number, number, number]> = [[0, 0, 1]];
	grid[0]![0] = 1;

	let head = 0;
	while (head < queue.length) {
		const [row, col, distance] = queue[head++]!;
		if (row === n - 1 && col === n - 1) return distance;

		for (const [rowOffset, colOffset] of directions) {
			const nextRow = row + rowOffset;
			const nextCol = col + colOffset;

			if (
				nextRow < 0 ||
				nextCol < 0 ||
				nextRow >= n ||
				nextCol >= n ||
				grid[nextRow]![nextCol] !== 0
			) {
				continue;
			}

			grid[nextRow]![nextCol] = 1;
			queue.push([nextRow, nextCol, distance + 1]);
		}
	}

	return -1;
}

/**
 * Returns minutes until all oranges rot, or -1 if impossible.
 *
 * Pattern: multi-source BFS over a matrix
 * Time Complexity: O(rows * cols)
 * Space Complexity: O(rows * cols)
 */
export function rottingOranges(grid: number[][]): number {
	if (grid.length === 0 || grid[0]?.length === 0) return 0;

	const rows = grid.length;
	const cols = grid[0]!.length;
	const queue: Array<[number, number, number]> = [];
	let fresh = 0;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (grid[row]![col] === 1) fresh++;
			if (grid[row]![col] === 2) queue.push([row, col, 0]);
		}
	}

	const directions: Array<[number, number]> = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
	];
	let minutes = 0;
	let head = 0;

	while (head < queue.length) {
		const [row, col, elapsed] = queue[head++]!;
		minutes = Math.max(minutes, elapsed);

		for (const [rowOffset, colOffset] of directions) {
			const nextRow = row + rowOffset;
			const nextCol = col + colOffset;

			if (
				nextRow < 0 ||
				nextCol < 0 ||
				nextRow >= rows ||
				nextCol >= cols ||
				grid[nextRow]![nextCol] !== 1
			) {
				continue;
			}

			grid[nextRow]![nextCol] = 2;
			fresh--;
			queue.push([nextRow, nextCol, elapsed + 1]);
		}
	}

	return fresh === 0 ? minutes : -1;
}

/**
 * Checks whether an undirected graph is bipartite.
 *
 * Pattern: graph BFS coloring
 * Time Complexity: O(vertices + edges)
 * Space Complexity: O(vertices)
 */
export function isBipartite(graph: number[][]): boolean {
	const colors = new Array<number>(graph.length).fill(0);

	for (let start = 0; start < graph.length; start++) {
		if (colors[start] !== 0) continue;

		colors[start] = 1;
		const queue = [start];
		let head = 0;

		while (head < queue.length) {
			const node = queue[head++]!;

			for (const neighbor of graph[node]!) {
				if (colors[neighbor] === 0) {
					colors[neighbor] = -colors[node]!;
					queue.push(neighbor);
				} else if (colors[neighbor] === colors[node]) {
					return false;
				}
			}
		}
	}

	return true;
}

/**
 * Returns length of the longest strictly increasing subsequence.
 *
 * Pattern: DP + binary search
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
export function longestIncreasingSubsequence(nums: number[]): number {
	const tails: number[] = [];

	for (const num of nums) {
		const index = lowerBound(tails, num);
		tails[index] = num;
	}

	return tails.length;
}

/**
 * Minimum coins needed to make amount, or -1 if impossible.
 *
 * Pattern: 1-D dynamic programming
 * Time Complexity: O(coins * amount)
 * Space Complexity: O(amount)
 */
export function coinChange(coins: number[], amount: number): number {
	const dp = new Array<number>(amount + 1).fill(Infinity);
	dp[0] = 0;

	for (let current = 1; current <= amount; current++) {
		for (const coin of coins) {
			if (coin <= current) {
				dp[current] = Math.min(dp[current]!, dp[current - coin]! + 1);
			}
		}
	}

	return dp[amount] === Infinity ? -1 : dp[amount]!;
}

/**
 * Determines whether s can be segmented into dictionary words.
 *
 * Pattern: dynamic programming
 * Time Complexity: O(n^2)
 * Space Complexity: O(n)
 */
export function wordBreak(s: string, wordDict: string[]): boolean {
	const words = new Set(wordDict);
	const dp = new Array<boolean>(s.length + 1).fill(false);
	dp[0] = true;

	for (let end = 1; end <= s.length; end++) {
		for (let start = 0; start < end; start++) {
			if (dp[start] && words.has(s.slice(start, end))) {
				dp[end] = true;
				break;
			}
		}
	}

	return dp[s.length]!;
}

/**
 * Union-find data structure for connectivity problems.
 *
 * Pattern: disjoint set union with path compression and union by rank
 */
export class UnionFind {
	private readonly parent: number[];
	private readonly rank: number[];
	private componentCount: number;

	constructor(size: number) {
		this.parent = Array.from({ length: size }, (_, index) => index);
		this.rank = new Array<number>(size).fill(0);
		this.componentCount = size;
	}

	find(node: number): number {
		if (this.parent[node] !== node) {
			this.parent[node] = this.find(this.parent[node]!);
		}

		return this.parent[node]!;
	}

	union(first: number, second: number): boolean {
		const firstRoot = this.find(first);
		const secondRoot = this.find(second);

		if (firstRoot === secondRoot) return false;

		if (this.rank[firstRoot]! < this.rank[secondRoot]!) {
			this.parent[firstRoot] = secondRoot;
		} else if (this.rank[firstRoot]! > this.rank[secondRoot]!) {
			this.parent[secondRoot] = firstRoot;
		} else {
			this.parent[secondRoot] = firstRoot;
			this.rank[firstRoot]++;
		}

		this.componentCount--;
		return true;
	}

	connected(first: number, second: number): boolean {
		return this.find(first) === this.find(second);
	}

	count(): number {
		return this.componentCount;
	}
}

/**
 * Counts connected components in an undirected graph.
 *
 * Pattern: union-find
 * Time Complexity: nearly O(n + edges)
 * Space Complexity: O(n)
 */
export function countComponents(
	n: number,
	edges: Array<[number, number]>,
): number {
	const unionFind = new UnionFind(n);

	for (const [first, second] of edges) {
		unionFind.union(first, second);
	}

	return unionFind.count();
}
