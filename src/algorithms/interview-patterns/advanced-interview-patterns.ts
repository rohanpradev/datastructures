/**
 * Shortest nonempty contiguous subarray with sum >= target, allowing negatives.
 * Pattern: prefix sums + monotonic deque (ordinary sliding windows fail).
 * Invariant: deque indices and their prefix sums are strictly increasing.
 * A later, smaller prefix dominates an earlier, larger one for every future end.
 * Trace: [2,-1,2], target 3 => prefixes [0,2,1,3] => answer 3.
 * Each index enters/leaves once: O(n) time and O(n) auxiliary space.
 * Returns -1 when impossible; assumes finite numbers with representable sums.
 */
export function shortestSubarrayAtLeastK(
	nums: readonly number[],
	target: number,
): number {
	const prefix = [0];
	for (const value of nums) prefix.push(prefix[prefix.length - 1] + value);
	const deque: number[] = [];
	let head = 0;
	let best = nums.length + 1;
	for (let end = 0; end < prefix.length; end++) {
		while (head < deque.length && prefix[end] - prefix[deque[head]] >= target) {
			best = Math.min(best, end - deque[head++]);
		}
		while (
			head < deque.length &&
			prefix[deque[deque.length - 1]] >= prefix[end]
		) {
			deque.pop();
		}
		deque.push(end);
	}
	return best <= nums.length ? best : -1;
}

export interface ScheduledJob {
	start: number;
	end: number;
	profit: number;
}

/**
 * Maximum profit from nonoverlapping [start,end) jobs; touching jobs may coexist.
 * Pattern: weighted scheduling, dynamic programming + upper-bound binary search.
 * Invariant: dp[i] is optimal among the first i jobs sorted by end time.
 * Transition: skip current, or take it plus the compatible prefix optimum.
 * Trace: (1,3,5),(2,4,6),(3,5,5) => dp [0,5,6,10]; earliest-end greedy fails.
 * O(n log n) time, O(n) space. Copies input; rejects invalid times/profits.
 * Negative profits are allowed: choosing no jobs always yields at least zero.
 */
export function maxScheduledProfit(jobs: readonly ScheduledJob[]): number {
	for (const job of jobs) {
		if (
			!Number.isFinite(job.start) ||
			!Number.isFinite(job.end) ||
			!Number.isFinite(job.profit) ||
			job.start >= job.end
		) {
			throw new RangeError("jobs need finite values and start < end");
		}
	}
	const sorted = [...jobs].sort((a, b) => a.end - b.end);
	const dp = [0];
	for (let i = 0; i < sorted.length; i++) {
		let low = 0;
		let high = i;
		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);
			if (sorted[middle].end <= sorted[i].start) low = middle + 1;
			else high = middle;
		}
		dp.push(Math.max(dp[i], dp[low] + sorted[i].profit));
	}
	return dp[sorted.length];
}
