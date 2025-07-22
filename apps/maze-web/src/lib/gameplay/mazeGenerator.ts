import {
	type Coordinates,
	GamePlayError,
	type Maze,
} from "@nadir/global-types";
import { Effect, pipe } from "effect";

// Types for maze generation
export type MazeGenerationOptions = {
	numRows: number;
	numCols: number;
	algorithm?: "dfs" | "prims";
};

export type MazeMetadata = {
	maze_id?: string;
	mazeName?: string;
	level?: 1 | 2 | 3;
	description?: string;
	created_at?: string;
};

type Direction = {
	dx: number;
	dy: number;
	name: string;
};

// Constants
const DIRECTIONS: Direction[] = [
	{ dx: 0, dy: 1, name: "right" },
	{ dx: 1, dy: 0, name: "down" },
	{ dx: 0, dy: -1, name: "left" },
	{ dx: -1, dy: 0, name: "up" },
];

// Validation functions
const validateDimensions = (options: MazeGenerationOptions) =>
	pipe(
		Effect.succeed(options),
		Effect.flatMap(({ numRows, numCols }) => {
			if (numRows < 2 || numCols < 2) {
				return Effect.fail(
					new GamePlayError("Maze dimensions must be at least 2x2"),
				);
			}
			if (numRows > 100 || numCols > 100) {
				return Effect.fail(
					new GamePlayError("Maze dimensions cannot exceed 100x100"),
				);
			}
			return Effect.succeed({ numRows, numCols });
		}),
		Effect.tap(({ numRows, numCols }) =>
			Effect.logDebug(`Validated maze dimensions: ${numRows}x${numCols}`),
		),
	);

// Simple DFS maze generation using imperative style for simplicity
const generateMazeDFS = (numRows: number, numCols: number) =>
	pipe(
		Effect.succeed(() => {
			// Initialize grid with all walls
			const grid = Array.from({ length: numRows }, () => ({
				horizontal: Array(numCols).fill(false),
				vertical: Array(numCols).fill(false),
			}));

			const visited = Array.from({ length: numRows }, () =>
				Array(numCols).fill(false),
			);
			const stack: Coordinates[] = [{ x: 0, y: 0 }];
			visited[0][0] = true;

			while (stack.length > 0) {
				const current = stack[stack.length - 1];
				const neighbors = DIRECTIONS.map(({ dx, dy }) => ({
					x: current.x + dx,
					y: current.y + dy,
					dx,
					dy,
				})).filter(
					({ x, y }) =>
						x >= 0 && y >= 0 && x < numRows && y < numCols && !visited[x][y],
				);

				if (neighbors.length === 0) {
					stack.pop();
					continue;
				}

				const { x, y, dx, dy } =
					neighbors[Math.floor(Math.random() * neighbors.length)];
				visited[x][y] = true;

				// Remove wall between current and next
				if (dx === 1) {
					grid[current.x].horizontal[current.y] = true;
				} else if (dx === -1) {
					grid[x].horizontal[y] = true;
				} else if (dy === 1) {
					grid[current.x].vertical[current.y] = true;
				} else if (dy === -1) {
					grid[x].vertical[y] = true;
				}

				stack.push({ x, y });
			}

			return grid;
		}),
		Effect.flatMap((generator) => Effect.sync(generator)),
		Effect.tap(() =>
			Effect.logInfo("Successfully generated maze using DFS algorithm"),
		),
	);

// Main generation function
const generateMazeGrid = (options: MazeGenerationOptions) =>
	pipe(
		validateDimensions(options),
		Effect.flatMap(({ numRows, numCols }) => {
			// For now, only support DFS
			return generateMazeDFS(numRows, numCols);
		}),
	);

// Create complete maze with metadata
const createMazeMetadata = (
	numRows: number,
	numCols: number,
	metadata: MazeMetadata = {},
) =>
	pipe(
		Effect.succeed({
			maze_id: metadata.maze_id || crypto.randomUUID(),
			mazeName: metadata.mazeName || `Generated Maze ${Date.now()}`,
			level: metadata.level || 1,
			description:
				metadata.description || `A ${numRows}x${numCols} generated maze`,
			created_at: metadata.created_at || new Date().toISOString(),
		}),
		Effect.tap((meta) =>
			Effect.logDebug(`Created maze metadata: ${meta.mazeName}`),
		),
	);

// Maze validation
const validateGeneratedMaze = (maze: Maze) =>
	pipe(
		Effect.succeed(maze),
		Effect.flatMap((maze) => {
			const hasValidDimensions = maze.numRows > 0 && maze.numCols > 0;
			const hasValidGrid = maze.grid && maze.grid.length === maze.numRows;

			if (!hasValidDimensions || !hasValidGrid) {
				return Effect.fail(new GamePlayError("Generated maze is invalid"));
			}

			return Effect.succeed(maze);
		}),
		Effect.tap(() => Effect.logInfo("Maze validation passed")),
	);

// Public API functions
export const generateMaze = (
	options: MazeGenerationOptions,
	metadata: MazeMetadata = {},
) =>
	pipe(
		Effect.all({
			grid: generateMazeGrid(options),
			metadata: createMazeMetadata(options.numRows, options.numCols, metadata),
		}),
		Effect.map(({ grid, metadata }) => ({
			...metadata,
			level: metadata.level || 1,
			numRows: options.numRows,
			numCols: options.numCols,
			grid,
		})),
		Effect.flatMap(validateGeneratedMaze),
		Effect.tap((maze) =>
			Effect.logInfo(
				`Generated ${maze.numRows}x${maze.numCols} maze: "${maze.mazeName}"`,
			),
		),
		Effect.catchAll((error) => {
			if (error instanceof GamePlayError) {
				return Effect.logError(`Maze generation failed: ${error.message}`).pipe(
					Effect.flatMap(() => Effect.fail(error)),
				);
			}
			return Effect.fail(error);
		}),
	);

// Synchronous wrapper
export const generateMazeSync = (
	options: MazeGenerationOptions,
	metadata: MazeMetadata = {},
): Maze => {
	return Effect.runSync(generateMaze(options, metadata));
};

// Async wrapper
export const generateMazeAsync = (
	options: MazeGenerationOptions,
	metadata: MazeMetadata = {},
): Promise<Maze> => {
	return Effect.runPromise(generateMaze(options, metadata));
};

// Utility functions for quick generation
export const generateSmallMaze = (metadata: MazeMetadata = {}) =>
	generateMaze({ numRows: 5, numCols: 5, algorithm: "dfs" }, metadata);

export const generateMediumMaze = (metadata: MazeMetadata = {}) =>
	generateMaze({ numRows: 10, numCols: 10, algorithm: "dfs" }, metadata);

export const generateLargeMaze = (metadata: MazeMetadata = {}) =>
	generateMaze({ numRows: 20, numCols: 20, algorithm: "dfs" }, metadata);

/*
Usage Examples:

1. Basic maze generation:
```typescript
const maze = generateMazeSync({ numRows: 10, numCols: 10 });
```

2. With custom metadata:
```typescript
const maze = generateMazeSync(
  { numRows: 15, numCols: 15, algorithm: "dfs" },
  { mazeName: "My Custom Maze", description: "A challenging maze" }
);
```

3. Async generation:
```typescript
const maze = await generateMazeAsync({ numRows: 20, numCols: 20 });
```

4. Effect composition:
```typescript
const mazeEffect = pipe(
  generateMaze({ numRows: 8, numCols: 8 }),
  Effect.tap(maze => Effect.logInfo(`Generated maze with ${maze.grid.length} rows`)),
  Effect.catchAll(error => Effect.logError(`Failed: ${error.message}`))
);
```

5. Quick generation helpers:
```typescript
const smallMaze = Effect.runSync(generateSmallMaze({ mazeName: "Tutorial Maze" }));
const mediumMaze = await Effect.runPromise(generateMediumMaze());
```
*/
