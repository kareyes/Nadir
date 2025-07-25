import type { Coordinates, MazeGameState } from "@nadir/global-types";
import { Effect, Schedule, pipe } from "effect";
import { solveMaze } from "./actionRule.js";

const movePlayerToPosition = (
	gameState: MazeGameState,
	targetPosition: Coordinates,
) =>
	pipe(
		Effect.succeed({
			...gameState,
			playerPosition: targetPosition,
			gameStats: {
				...gameState.gameStats,
				moves: gameState.gameStats.moves + 1,
			},
		}),
		Effect.tap((updatedState) =>
			Effect.logDebug(
				`Auto-moved player to: (${updatedState.playerPosition.x}, ${updatedState.playerPosition.y})`,
			),
		),
	);

const checkAutoWinCondition = (gameState: MazeGameState) =>
	pipe(
		Effect.succeed(gameState.currentMaze),
		Effect.flatMap((maze) => {
			if (!maze) return Effect.succeed(gameState);

			const isWin =
				gameState.playerPosition.x === maze.numRows - 1 &&
				gameState.playerPosition.y === maze.numCols - 1;

			if (isWin) {
				const endTime = Date.now();
				const timeTaken = Math.round(
					(endTime - gameState.gameStats.startTime) / 1000,
				);

				return Effect.succeed({
					...gameState,
					isGameOver: true,
					gameStats: {
						...gameState.gameStats,
						endTime,
						timeTaken,
					},
				});
			}

			return Effect.succeed(gameState);
		}),
	);

const moveAlongPath = (
	initialGameState: MazeGameState,
	solutionPath: Coordinates[],
	stepCallback?: (state: MazeGameState) => void,
) =>
	pipe(
		Effect.reduce(
			solutionPath.slice(1),
			initialGameState,
			(currentState, position, index) =>
				pipe(
					movePlayerToPosition(currentState, position),
					Effect.flatMap((updatedState) => {
						if (stepCallback) {
							stepCallback(updatedState);
						}
						return checkAutoWinCondition(updatedState);
					}),
					Effect.delay("200 millis"),
				),
		),
	);

export const autoSolveMaze = (
	gameState: MazeGameState,
	stepCallback?: (state: MazeGameState) => void,
) =>
	pipe(
		Effect.succeed(gameState.currentMaze),
		Effect.flatMap((maze) =>
			maze
				? Effect.succeed(maze)
				: Effect.fail(new Error("No maze available for auto-solve")),
		),
		Effect.flatMap((maze) => {
			const solutionPath = solveMaze(maze);
			return solutionPath.length > 0
				? Effect.succeed(solutionPath)
				: Effect.fail(new Error("No solution path found"));
		}),
		Effect.flatMap((solutionPath) =>
			moveAlongPath(gameState, solutionPath, stepCallback),
		),
		Effect.catchAll((error) =>
			pipe(
				Effect.logError(`Auto-solve failed: ${error}`),
				Effect.map(() => gameState),
			),
		),
	);

export const autoSolveMazeSync = (
	gameState: MazeGameState,
	stepCallback?: (state: MazeGameState) => void,
): Promise<MazeGameState> => {
	return Effect.runPromise(autoSolveMaze(gameState, stepCallback));
};

export const getSolutionPath = (gameState: MazeGameState) =>
	pipe(
		Effect.succeed(gameState.currentMaze),
		Effect.flatMap((maze) =>
			maze
				? Effect.succeed(solveMaze(maze))
				: Effect.fail(new Error("No maze available")),
		),
		Effect.runSync,
	);
