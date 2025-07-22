import {
	type Coordinates,
	GamePlayError,
	type MazeGameState,
} from "@nadir/global-types";
import { Effect, pipe } from "effect";
import { canMove } from "./actionRule.js";

type KeyEvent = KeyboardEvent | { key: string };

const validateGameNotOver = (gameState: MazeGameState) =>
	pipe(
		Effect.succeed(gameState.isGameOver),
		Effect.flatMap((isOver) =>
			isOver
				? Effect.fail(new GamePlayError("Game is already over"))
				: Effect.succeed(gameState),
		),
	);

const parseKeyInput = (event: KeyEvent) =>
	pipe(
		Effect.succeed(event.key),
		Effect.flatMap((key) => {
			switch (key) {
				case "ArrowUp":
					return Effect.succeed({ direction: "up", deltaX: -1, deltaY: 0 });
				case "ArrowDown":
					return Effect.succeed({ direction: "down", deltaX: 1, deltaY: 0 });
				case "ArrowLeft":
					return Effect.succeed({ direction: "left", deltaX: 0, deltaY: -1 });
				case "ArrowRight":
					return Effect.succeed({ direction: "right", deltaX: 0, deltaY: 1 });
				default:
					return Effect.fail(new GamePlayError(`Invalid key: ${key}`));
			}
		}),
	);

const calculateNewPosition = (
	gameState: MazeGameState,
	deltaX: number,
	deltaY: number,
) =>
	pipe(
		Effect.succeed({
			x: gameState.playerPosition.x + deltaX,
			y: gameState.playerPosition.y + deltaY,
		}),
		Effect.tap((newPos) =>
			Effect.logDebug(
				`Attempting to move to position: (${newPos.x}, ${newPos.y})`,
			),
		),
	);

const validateMovement = (newPosition: Coordinates, gameState: MazeGameState) =>
	pipe(
		Effect.succeed(gameState.currentMaze),
		Effect.flatMap((maze) =>
			maze
				? Effect.succeed(maze)
				: Effect.fail(new GamePlayError("No maze available")),
		),
		Effect.flatMap((maze) => {
			const canMoveResult = canMove(
				newPosition,
				maze,
				gameState.playerPosition,
			);
			return canMoveResult
				? Effect.succeed(newPosition)
				: Effect.fail(new GamePlayError("Movement blocked by wall"));
		}),
	);

const updateGameState = (gameState: MazeGameState, newPosition: Coordinates) =>
	pipe(
		Effect.succeed({
			...gameState,
			playerPosition: newPosition,
			gameStats: {
				...gameState.gameStats,
				moves: gameState.gameStats.moves + 1,
			},
		}),
		Effect.tap((updatedState) =>
			Effect.logDebug(
				`Updated position to: (${updatedState.playerPosition.x}, ${updatedState.playerPosition.y}), Moves: ${updatedState.gameStats.moves}`,
			),
		),
	);

const checkWinCondition = (gameState: MazeGameState) =>
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
		// Effect.tap((finalState) => {
		// 	if (finalState.isGameOver) {
		// 		return Effect.logInfo("🎉 Congratulations! You've reached the end of the maze!");
		// 	}
		// 	return Effect.void;
		// })
	);

export const handleKeydown = (event: KeyEvent, gameState: MazeGameState) =>
	pipe(
		validateGameNotOver(gameState),
		Effect.flatMap(() => parseKeyInput(event)),
		Effect.flatMap(({ deltaX, deltaY }) =>
			calculateNewPosition(gameState, deltaX, deltaY),
		),
		Effect.flatMap((newPosition) => validateMovement(newPosition, gameState)),
		Effect.flatMap((validPosition) =>
			updateGameState(gameState, validPosition),
		),
		Effect.flatMap((updatedState) => checkWinCondition(updatedState)),
		Effect.catchAll((error) => {
			if (error instanceof GamePlayError) {
				return Effect.logWarning(`Game action failed: ${error.message}`).pipe(
					Effect.map(() => gameState),
				);
			}
			return Effect.fail(error);
		}),
	);

export const handleKeydownSync = (
	event: KeyEvent,
	gameState: MazeGameState,
): MazeGameState => {
	return Effect.runSync(handleKeydown(event, gameState));
};

export const handleKeydownAsync = (
	event: KeyEvent,
	gameState: MazeGameState,
): Promise<MazeGameState> => {
	return Effect.runPromise(handleKeydown(event, gameState));
};
