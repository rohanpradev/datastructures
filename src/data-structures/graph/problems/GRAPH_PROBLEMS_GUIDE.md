# Graph Problems - Practice Guide

## Overview

This guide covers common graph problems demonstrating BFS, DFS, and graph traversal algorithms.

---

## Problem 1: Number of Islands (LeetCode 200)

### Problem Statement
Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.

### Example
```
Input:
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1

Output: 3
```

### Visual Explanation
```
Grid with islands marked:

Island 1:     Island 2:     Island 3:
[1][1] 0 0 0   1 1 0 0 0    1 1 0 0 0
[1][1] 0 0 0   1 1 0 0 0    1 1 0 0 0
 0  0  0 0 0   0 0 [1] 0 0  0 0 1 0 0
 0  0  0 0 0   0 0 0 0 0    0 0 0 [1][1]

DFS from each unvisited '1':
1. Start at (0,0) → mark entire island 1
2. Start at (2,2) → mark entire island 2
3. Start at (3,3) → mark entire island 3

Total: 3 islands
```

### Algorithm (DFS)
```
function numIslands(grid):
	count = 0
	
	for each cell (i, j) in grid:
		if cell is '1':
			count++
			dfs(i, j)  // mark entire island
	
	return count

function dfs(i, j):
	if out of bounds or cell is '0':
		return
	
	mark cell as '0' (visited)
	
	// Visit all 4 neighbors
	dfs(i+1, j)  // down
	dfs(i-1, j)  // up
	dfs(i, j+1)  // right
	dfs(i, j-1)  // left
```

### Step-by-Step Example
```
Grid:
1 1 0
1 0 0
0 0 1

Step 1: Visit (0,0) = '1'
  count = 1
  DFS from (0,0):
    Mark (0,0) → '0'
    Visit (0,1) → '1', mark → '0'
    Visit (1,0) → '1', mark → '0'
  
Grid after:
0 0 0
0 0 0
0 0 1

Step 2: Continue scanning...
Step 3: Visit (2,2) = '1'
  count = 2
  DFS from (2,2):
    Mark (2,2) → '0'

Final count: 2
```

### Implementation Steps
```typescript
export function numIslands(grid: string[][]): number {
	// TODO: Initialize count
	
	// TODO: Helper function for DFS
	function dfs(i: number, j: number) {
		// TODO: Base cases (bounds, water)
		// TODO: Mark as visited
		// TODO: Visit 4 neighbors
	}
	
	// TODO: Iterate through grid
	// TODO: If land found, increment count and DFS
	
	// TODO: Return count
}
```

### Complexity
- **Time:** O(m × n) - visit each cell once
- **Space:** O(m × n) - recursion stack in worst case

---

## Problem 2: Course Schedule (LeetCode 207)

### Problem Statement
Determine if you can finish all courses given prerequisites. Return true if possible.

**Prerequisites:** [course, prerequisite] means you must take prerequisite before course.

### Example
```
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: Take course 0, then course 1

Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: Circular dependency! Can't complete both
```

### Visual Explanation
```
Case 1: Valid (No cycle)
0 → 1 → 2
Can complete: 0, then 1, then 2 ✓

Case 2: Invalid (Cycle)
0 → 1
↑   ↓
└───2

Can't complete! Cycle detected ✗

Detect cycle using DFS:
- White: unvisited
- Gray: visiting (in current path)
- Black: visited (completed)

If we encounter gray node → Cycle!
```

### Algorithm (Cycle Detection)
```
function canFinish(numCourses, prerequisites):
	// Build adjacency list
	graph = empty map
	for [course, prereq] in prerequisites:
		graph[prereq].add(course)
	
	// Track states: 0=white, 1=gray, 2=black
	state = array of 0s
	
	function hasCycle(course):
		if state[course] == 1:  // gray
			return true  // cycle found!
		
		if state[course] == 2:  // black
			return false  // already checked
		
		state[course] = 1  // mark gray
		
		for neighbor in graph[course]:
			if hasCycle(neighbor):
				return true
		
		state[course] = 2  // mark black
		return false
	
	for course in 0 to numCourses-1:
		if hasCycle(course):
			return false
	
	return true
```

### Implementation Steps
```typescript
export function canFinish(
	numCourses: number,
	prerequisites: number[][]
): boolean {
	// TODO: Build adjacency list
	
	// TODO: Create state array (0=unvisited, 1=visiting, 2=visited)
	
	// TODO: DFS helper to detect cycle
	function hasCycle(course: number): boolean {
		// TODO: Check if visiting (cycle!)
		// TODO: Check if already visited
		// TODO: Mark as visiting
		// TODO: Check neighbors
		// TODO: Mark as visited
		return false;
	}
	
	// TODO: Check each course for cycles
	
	// TODO: Return true if no cycles
}
```

### Complexity
- **Time:** O(V + E) - visit vertices and edges
- **Space:** O(V + E) - graph storage and recursion

---

## Problem 3: Clone Graph (LeetCode 133)

### Problem Statement
Deep clone an undirected graph. Each node contains a value and a list of neighbors.

### Example
```
Input:
1 --- 2
|     |
4 --- 3

Output: (deep copy of graph)
```

### Visual Explanation
```
Original:          Clone:
  1 --- 2            1' --- 2'
  |     |            |      |
  4 --- 3            4' --- 3'

Can't just copy references!
Must create NEW nodes with SAME structure.

Use DFS + HashMap:
map: original → clone

Process node 1:
  Create clone 1'
  map[1] = 1'
  For each neighbor of 1:
    If not in map, recursively clone
    Add clone to 1'.neighbors
```

### Algorithm
```
function cloneGraph(node):
	if node is null:
		return null
	
	map = empty map  // original → clone
	
	function dfs(node):
		if node in map:
			return map[node]
		
		// Create clone
		clone = new Node(node.val)
		map[node] = clone
		
		// Clone neighbors
		for neighbor in node.neighbors:
			clone.neighbors.add(dfs(neighbor))
		
		return clone
	
	return dfs(node)
```

### Implementation Steps
```typescript
export function cloneGraph(node: Node | null): Node | null {
	// TODO: Handle null case
	
	// TODO: Create map for original → clone
	
	// TODO: DFS helper function
	function dfs(node: Node): Node {
		// TODO: If already cloned, return clone
		// TODO: Create new node
		// TODO: Add to map
		// TODO: Clone all neighbors recursively
		// TODO: Return clone
	}
	
	// TODO: Return cloned graph
}
```

### Complexity
- **Time:** O(V + E) - visit all vertices and edges
- **Space:** O(V) - map and recursion stack

---

## Problem 4: Shortest Path in Binary Matrix (LeetCode 1091)

### Problem Statement
Find shortest path from top-left to bottom-right in binary matrix (0 = clear, 1 = blocked). Can move in 8 directions.

### Example
```
Input:
0 0 0
1 1 0
1 1 0

Output: 4
Path: (0,0) → (0,1) → (0,2) → (1,2) → (2,2)
```

### Visual Explanation
```
BFS level-by-level:

Start: (0,0)
[S][·][·]
[1][1][·]
[1][1][·]

Level 1: (0,1), (1,0) - blocked
[S][1][·]
[X][1][·]
[1][1][·]

Level 2: (0,2)
[S][1][2]
[X][1][·]
[1][1][·]

Level 3: (1,2)
[S][1][2]
[X][1][3]
[1][1][·]

Level 4: (2,2) - FOUND!
[S][1][2]
[X][1][3]
[1][1][4]

Shortest path length: 4
```

### Algorithm (BFS)
```
function shortestPath(grid):
	if grid[0][0] == 1:
		return -1
	
	n = grid.length
	queue = [(0, 0, 1)]  // (row, col, distance)
	visited = set()
	
	while queue not empty:
		row, col, dist = queue.dequeue()
		
		if (row, col) == (n-1, n-1):
			return dist
		
		for each of 8 directions:
			newRow = row + dx
			newCol = col + dy
			
			if valid and not visited:
				queue.enqueue((newRow, newCol, dist+1))
				mark visited
	
	return -1  // no path
```

### Implementation Steps
```typescript
export function shortestPathBinaryMatrix(grid: number[][]): number {
	// TODO: Check if start or end blocked
	
	// TODO: Initialize queue with start position
	
	// TODO: Create visited set
	
	// TODO: 8 directions: up, down, left, right, 4 diagonals
	
	// TODO: BFS loop
	
	// TODO: Check if reached destination
	
	// TODO: Explore 8 neighbors
	
	// TODO: Return -1 if no path
}
```

### Complexity
- **Time:** O(n²) - visit each cell once
- **Space:** O(n²) - queue and visited set

---

## Problem 5: Pacific Atlantic Water Flow (LeetCode 417)

### Problem Statement
Find all cells where water can flow to both Pacific and Atlantic oceans.

**Rule:** Water flows from higher or equal height to lower or equal height.

### Example
```
Input:
1 2 2 3 5
3 2 3 4 4
2 4 5 3 1
6 7 1 4 5
5 1 1 2 4

Pacific:     Atlantic:
← ← ← ← ←   → → → → →
↑ · · · ·   · · · · ↓
↑ · · · ·   · · · · ↓
↑ · · · ·   · · · · ↓
↑ · · · ·   · · · · ↓

Output: [[0,4], [1,3], [1,4], [2,2], [3,0], [3,1], [4,0]]
```

### Visual Explanation
```
Strategy: Start from oceans and flow UPWARD!

Pacific Ocean cells: top row + left column
Atlantic Ocean cells: bottom row + right column

DFS from Pacific:
Mark all cells reachable from Pacific

DFS from Atlantic:
Mark all cells reachable from Atlantic

Answer: Cells reachable from BOTH
```

### Algorithm
```
function pacificAtlantic(heights):
	rows = heights.length
	cols = heights[0].length
	
	pacific = set()
	atlantic = set()
	
	function dfs(row, col, visited):
		if (row, col) in visited:
			return
		visited.add((row, col))
		
		for each neighbor:
			if neighbor height >= current height:
				dfs(neighbor, visited)
	
	// DFS from Pacific borders
	for col in 0 to cols-1:
		dfs(0, col, pacific)
	for row in 0 to rows-1:
		dfs(row, 0, pacific)
	
	// DFS from Atlantic borders
	for col in 0 to cols-1:
		dfs(rows-1, col, atlantic)
	for row in 0 to rows-1:
		dfs(row, cols-1, atlantic)
	
	// Find intersection
	return pacific ∩ atlantic
```

### Implementation Steps
```typescript
export function pacificAtlantic(heights: number[][]): number[][] {
	// TODO: Initialize sets for pacific and atlantic
	
	// TODO: DFS helper function
	function dfs(row: number, col: number, visited: Set<string>) {
		// TODO: Base cases
		// TODO: Mark visited
		// TODO: Visit neighbors with >= height
	}
	
	// TODO: DFS from Pacific borders
	
	// TODO: DFS from Atlantic borders
	
	// TODO: Find and return intersection
}
```

### Complexity
- **Time:** O(m × n) - visit each cell at most twice
- **Space:** O(m × n) - visited sets

---

## Graph Traversal Patterns

### BFS (Breadth-First Search)
```
Uses: Shortest path, level-order

queue = [start]
visited = {start}

while queue not empty:
	node = queue.dequeue()
	process(node)
	
	for neighbor in node.neighbors:
		if neighbor not visited:
			queue.enqueue(neighbor)
			mark visited
```

### DFS (Depth-First Search)
```
Uses: Cycle detection, pathfinding

Recursive:
function dfs(node, visited):
	if node in visited:
		return
	visited.add(node)
	process(node)
	
	for neighbor in node.neighbors:
		dfs(neighbor, visited)

Iterative:
stack = [start]
visited = {start}

while stack not empty:
	node = stack.pop()
	process(node)
	
	for neighbor in node.neighbors:
		if neighbor not visited:
			stack.push(neighbor)
			mark visited
```

---

## Graph Representations

### Adjacency List
```
Graph: 0 → 1, 0 → 2, 1 → 2

Map representation:
{
  0: [1, 2],
  1: [2],
  2: []
}

Array representation:
[[1, 2], [2], []]
```

### Adjacency Matrix
```
Same graph:
  0 1 2
0[0 1 1]
1[0 0 1]
2[0 0 0]

matrix[i][j] = 1 if edge exists
```

---

## Practice Tips

### Order to Practice
1. **Start with:** numIslands (basic DFS)
2. **Then:** canFinish, cloneGraph (graph algorithms)
3. **Finally:** shortestPath, pacificAtlantic (BFS/advanced DFS)

### Common Mistakes
1. ❌ Not marking cells as visited
2. ❌ Forgetting boundary checks
3. ❌ Using wrong data structure (BFS needs queue, not stack)
4. ❌ Not handling disconnected components
5. ❌ Mutating graph during traversal

### Testing Strategy
```typescript
✓ Empty graph
✓ Single node
✓ Disconnected components
✓ Cycle detection
✓ All nodes connected
✓ No valid path
✓ Multiple paths
```

---

## Complexity Cheat Sheet

| Problem | Time | Space | Key Technique |
|---------|------|-------|---------------|
| Num Islands | O(m×n) | O(m×n) | DFS marking |
| Course Schedule | O(V+E) | O(V+E) | Cycle detection |
| Clone Graph | O(V+E) | O(V) | DFS + HashMap |
| Shortest Path | O(m×n) | O(m×n) | BFS |
| Pacific Atlantic | O(m×n) | O(m×n) | Multi-source DFS |

Happy Coding! 🚀
