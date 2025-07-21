import {
	type Automove,
	type Coordinates,
	GamePlayError,
	type Maze,
	type MazePath,
} from "@nadir/global-types";
import { Effect, pipe } from "effect";

// Function to validate the maze structure
export const validateMaze = (maze: Maze) =>
	pipe(
		Effect.succeed(!!maze),
		Effect.flatMap((isValid) =>
			isValid
				? Effect.succeed(maze)
				: Effect.fail(new GamePlayError("Maze is not available")),
		),
	);

export const validateBounds = (coordinates: Coordinates, maze: Maze) =>
	pipe(
		Effect.succeed({
			x: coordinates.x,
			y: coordinates.y,
			numRows: maze.numRows,
			numCols: maze.numCols,
		}),
		Effect.flatMap(({ x, y, numRows, numCols }) =>
			x >= 0 && x < numRows && y >= 0 && y < numCols
				? Effect.succeed({ x, y })
				: Effect.fail(new GamePlayError("Move is out of bounds")),
		),
	);

const checkWallUp = (
	targetX: number,
	targetY: number,
	maze: Maze,
	playerPosition: Coordinates,
) =>
	pipe(
		Effect.succeed(targetX < playerPosition.x),
		Effect.flatMap((isMovingUp) =>
			isMovingUp
				? Effect.succeed(maze.grid[targetX].horizontal[targetY])
				: Effect.succeed(false),
		),
	);

const checkWallDown = (
	targetX: number,
	targetY: number,
	maze: Maze,
	playerPosition: Coordinates,
) =>
	pipe(
		Effect.succeed(targetX > playerPosition.x),
		Effect.flatMap((isMovingDown) =>
			isMovingDown
				? Effect.succeed(
						maze.grid[playerPosition.x].horizontal[playerPosition.y],
					)
				: Effect.succeed(false),
		),
	);

const checkWallLeft = (
	targetX: number,
	targetY: number,
	maze: Maze,
	playerPosition: Coordinates,
) =>
	pipe(
		Effect.succeed(targetY < playerPosition.y),
		Effect.flatMap((isMovingLeft) =>
			isMovingLeft
				? Effect.succeed(maze.grid[targetX].vertical[targetY])
				: Effect.succeed(false),
		),
	);

const checkWallRight = (
	targetX: number,
	targetY: number,
	maze: Maze,
	playerPosition: Coordinates,
) =>
	pipe(
		Effect.succeed(targetY > playerPosition.y),
		Effect.flatMap((isMovingRight) =>
			isMovingRight
				? Effect.succeed(maze.grid[targetX].vertical[playerPosition.y])
				: Effect.succeed(false),
		),
	);

export const validateWallPassage = (
	coordinates: Coordinates,
	maze: Maze,
	playerPosition: Coordinates,
) =>
	pipe(
		Effect.all([
			checkWallUp(coordinates.x, coordinates.y, maze, playerPosition),
			checkWallDown(coordinates.x, coordinates.y, maze, playerPosition),
			checkWallLeft(coordinates.x, coordinates.y, maze, playerPosition),
			checkWallRight(coordinates.x, coordinates.y, maze, playerPosition),
		]),
		Effect.flatMap((walls) => {
			const canPass = walls.some((wall) => wall === true);
			return canPass
				? Effect.succeed(true)
				: Effect.fail(new GamePlayError("Wall blocks movement"));
		}),
	);

// Solver functions
const CheckVisitedWallRight = (
	{ x, y, maze: { numCols, grid } }: Automove,
	visited: Set<string>,
) =>
	pipe(
		Effect.succeed(
			y < numCols - 1 && grid[x].vertical[y] && !visited.has(`${x},${y + 1}`),
		),
		Effect.flatMap((hasWall) =>
			hasWall
				? Effect.succeed({ x, y: y + 1, path: [{ x, y: y + 1 }] } as MazePath)
				: Effect.succeed(undefined),
		),
	);

const CheckVisitedWallDown = (
	{ x, y, maze: { numRows, grid } }: Automove,
	visited: Set<string>,
) =>
	pipe(
		Effect.succeed(
			x < numRows - 1 && grid[x].horizontal[y] && !visited.has(`${x + 1},${y}`),
		),
		Effect.flatMap((hasWall) =>
			hasWall
				? Effect.succeed({ x: x + 1, y, path: [{ x: x + 1, y }] } as MazePath)
				: Effect.succeed(undefined),
		),
	);

const CheckVisitedWallLeft = (
	{ x, y, maze: { grid } }: Automove,
	visited: Set<string>,
) =>
	pipe(
		Effect.succeed(
			y > 0 && grid[x].vertical[y - 1] && !visited.has(`${x},${y - 1}`),
		),
		Effect.flatMap((hasWall) =>
			hasWall
				? Effect.succeed({ x, y: y - 1, path: [{ x, y: y - 1 }] } as MazePath)
				: Effect.succeed(undefined),
		),
	);

const CheckVisitedWallUp = (
	{ x, y, maze: { grid } }: Automove,
	visited: Set<string>,
) =>
	pipe(
		Effect.succeed(
			x > 0 && grid[x - 1].horizontal[y] && !visited.has(`${x - 1},${y}`),
		),
		Effect.flatMap((hasWall) =>
			hasWall
				? Effect.succeed({ x: x - 1, y, path: [{ x: x - 1, y }] } as MazePath)
				: Effect.succeed(undefined),
		),
	);

export const validateVisitedPath = (m: Automove, visited: Set<string>) =>
	pipe(
		Effect.all([
			CheckVisitedWallRight(m, visited),
			CheckVisitedWallDown(m, visited),
			CheckVisitedWallLeft(m, visited),
			CheckVisitedWallUp(m, visited),
		]),
		Effect.flatMap((results) => {
			const validMoves = results.filter((move) => move !== undefined);
			if (results.length > 0) {
				return Effect.succeed(validMoves);
			}
			return Effect.fail(new GamePlayError("No valid moves available"));
		}),
	);
