import type { Coordinates, FindPathArgs, Maze } from "@nadir/global-types";
import { Effect, pipe } from "effect";
import {
	validateBounds,
	validateMaze,
	validateVisitedPath,
	validateWallPassage,
} from "./validation";

const action = ({ visited, maze, stack }: FindPathArgs) =>
	pipe(
		Effect.succeed(stack.pop()),
		Effect.flatMap((current) => {
			if (!current) return Effect.succeed([]);
			const { x, y, path } = current;
			if (x === maze.numRows - 1 && y === maze.numCols - 1) {
				return Effect.succeed(path);
			}
			const key = `${x},${y}`;
			if (visited.has(key)) {
				return Effect.succeed([]);
			}
			visited.add(key);
			return pipe(
				validateVisitedPath({ x, y, maze }, visited),
				Effect.map((validMoves) => {
					validMoves.forEach((move) => {
						stack.push({ x: move.x, y: move.y, path: [...path, ...move.path] });
					});
				}),
			);
		}),
	);

const loop = (maze: Maze) =>
	Effect.loop(
		{
			stack: [{ x: 0, y: 0, path: [{ x: 0, y: 0 }] }],
			visited: new Set<string>(),
			maze,
		},
		{
			while: ({ stack }) => stack.length > 0,
			step: (state) => state,
			body: (state) => action(state),
		},
	);

export const solveMaze = (maze: Maze) =>
	loop(maze).pipe(
		Effect.flatMap((result) => {
			const path = result.find((s) => s !== undefined) || ([] as Coordinates[]);
			return Effect.succeed(path);
		}),
		Effect.runSync,
	);

export const canMove = (
	coordinates: Coordinates,
	maze: Maze,
	playerPosition: Coordinates,
) =>
	pipe(
		validateMaze(maze),
		Effect.flatMap(() => validateBounds(coordinates, maze)),
		Effect.flatMap((validCoords) =>
			validateWallPassage(validCoords, maze, playerPosition),
		),
		Effect.catchAll(() => Effect.succeed(false)),
		Effect.runSync,
	);
