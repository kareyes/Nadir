import {
	type Automove,
	type CurrentPosition,
	type GamePlay,
	GamePlayError,
	type GameState,
	type Maze,
	type MazePath,
	type PlayMovement,
	PlayMovementSchema,
} from "@nadir/global-types";
import { Effect, Ref, Schedule, Schema, pipe } from "effect";
import { Directions, directions } from "../constant.js";
import { move } from "./maze.js";

const OutofBounds = (m: PlayMovement) =>
	pipe(
		Effect.succeed(m),
		Effect.bind("newX", (m) => Effect.succeed(m.dx + m.currentX)),
		Effect.bind("newY", (m) => Effect.succeed(m.dy + m.currentY)),
		Effect.bind("condition", ({ newX, newY }) =>
			Effect.succeed(
				newX < 0 ||
					newY < 0 ||
					newX >= m.maze.numRows ||
					newY >= m.maze.numCols,
			),
		),
		Effect.flatMap(({ condition }) =>
			condition
				? Effect.fail(new GamePlayError("Out of bounds"))
				: Effect.succeed(false),
		),
	);

const WallRight = (m: PlayMovement) =>
	pipe(
		Effect.succeed(m),
		Effect.bind("condition", (m) =>
			Effect.succeed(
				m.dx === 0 &&
					m.dy === 1 &&
					m.currentY < m.maze.numCols - 1 &&
					!m.maze.grid[m.currentX].vertical[m.currentY],
			),
		),
		Effect.flatMap(({ condition }) =>
			condition
				? Effect.fail(new GamePlayError("Wall to the right"))
				: Effect.succeed(false),
		),
	);

const WallBelow = (m: PlayMovement) =>
	pipe(
		Effect.succeed(m),
		Effect.bind("condition", (m) =>
			Effect.succeed(
				m.dx === 1 &&
					m.dy === 0 &&
					m.currentX < m.maze.numRows - 1 &&
					!m.maze.grid[m.currentX].horizontal[m.currentY],
			),
		),
		Effect.flatMap(({ condition }) =>
			condition
				? Effect.fail(new GamePlayError("Wall below"))
				: Effect.succeed(false),
		),
	);

const WallLeft = (m: PlayMovement) =>
	pipe(
		Effect.succeed(m),
		Effect.bind("condition", (m) =>
			Effect.succeed(
				m.dx === 0 &&
					m.dy === -1 &&
					m.currentY > 0 &&
					!m.maze.grid[m.currentX].vertical[m.currentY - 1],
			),
		),
		Effect.flatMap(({ condition }) =>
			condition
				? Effect.fail(new GamePlayError("Wall to the left"))
				: Effect.succeed(false),
		),
	);

const WallAbove = (m: PlayMovement) =>
	pipe(
		Effect.succeed(m),
		Effect.bind("condition", (m) =>
			Effect.succeed(
				m.dx === -1 &&
					m.dy === 0 &&
					m.currentX > 0 &&
					!m.maze.grid[m.currentX - 1].horizontal[m.currentY],
			),
		),
		Effect.flatMap(({ condition }) =>
			condition
				? Effect.fail(new GamePlayError("Wall above"))
				: Effect.succeed(false),
		),
	);

const destruct = (play: GamePlay) => {
	return pipe(
		Effect.succeed(play),
		Effect.map((play) => ({
			dx: play.playerMoves.x,
			dy: play.playerMoves.y,
			currentX: play.currentPosition.x,
			currentY: play.currentPosition.y,
			maze: play.maze,
		})),
		Effect.map((movement) =>
			Schema.decodeUnknownSync(PlayMovementSchema)(movement),
		),
	);
};

export const validateMovement = (m: GamePlay) =>
	pipe(
		destruct(m),
		Effect.flatMap((movement) =>
			OutofBounds(movement).pipe(
				Effect.andThen(() => WallAbove(movement)),
				Effect.andThen(() => WallBelow(movement)),
				Effect.andThen(() => WallLeft(movement)),
				Effect.andThen(() => WallRight(movement)),
			),
		),
		Effect.flatMap(() =>
			Effect.succeed({
				x: m.currentPosition.x + m.playerMoves.x,
				y: m.currentPosition.y + m.playerMoves.y,
			}),
		),
		Effect.catchTag("GamePlayError", (err) => Effect.fail(err)),
	);

const autoMove = (m: GameState) =>
	Effect.sync(() =>
		pipe(
			Effect.succeed(m),
			Effect.bindTo("gameState"),
			Effect.bind("randomDirection", () =>
				Effect.succeed(
					directions[Math.floor(Math.random() * directions.length)],
				),
			),
			Effect.bind("state", ({ randomDirection, gameState }) =>
				Effect.succeed({ playerMoves: randomDirection, ...gameState }),
			),
			Effect.tap(({ state }) => move(state)),
			Effect.flatMap(({ state }) => checkFinalPosition(state)),
		),
	);

export const runAutoMove = (state: GameState) =>
	Effect.repeat(autoMove(state), {
		until: (action) =>
			action.pipe(Effect.map((status) => status === "Game Over")),
		schedule: Schedule.addDelay(Schedule.forever, () => "50 millis"),
	});

const checkFinalPosition = (state: GameState) =>
	pipe(
		Effect.succeed(state),
		Effect.bind("position", () => Ref.get(state.currentPosition)),
		Effect.bind("mazeState", () => Ref.get(state.maze)),
		Effect.map(({ position, mazeState: { maze } }) => {
			if (position.x === maze.numRows - 1 && position.y === maze.numCols - 1) {
				return Effect.succeed("Game Over");
			}
			return Effect.fail(new GamePlayError("Game not over"));
		}),
		// Effect.flatMap((status) => status),
		Effect.flatMap((status) => status),
		Effect.catchTag("GamePlayError", (err) => Effect.succeed(err)),
	);

const movePlayer = (m: GameState, position: CurrentPosition) =>
	pipe(
		Effect.succeed(m),
		Effect.bindTo("gameState"),
		Effect.bind("state", ({ gameState }) => {
			return Effect.succeed({ playerMoves: position, ...gameState });
		}),
		Effect.tap(({ state }) => move(state)),
		Effect.flatMap(({ state }) => checkFinalPosition(state)),
	);



export const pathFinding = (state: GameState) =>
	pipe(
		Ref.get(state.maze),
		Effect.flatMap(({ maze }) =>
			solveMaze(maze).pipe(
				Effect.flatMap((path) =>
					Effect.forEach(path, (position) =>
						movePlayer(state, position).pipe(Effect.delay("100 millis"))
					)
				)
			)
		)
	);

const solveMaze = (maze: Maze) =>
	loop(maze).pipe(
		Effect.flatMap((result) => {
			const path = result.filter((solution) => solution !== undefined) as CurrentPosition[];  
			return Effect.succeed(path);
		}
	))



const ChceckWallRight = (
	{ x, y, maze: { numCols, grid } }: Automove,
	visited: Set<string>,
) =>
	pipe(
		Effect.succeed(
			y < numCols - 1 && grid[x].vertical[y] && !visited.has(`${x},${y + 1}`),
		),
		Effect.flatMap((hasWall) =>
			hasWall
				? Effect.succeed({ x, y: y + 1, path: [Directions.right] } as MazePath)
				: Effect.succeed(undefined),
		),
	);

const ChceckWallDown = (
	{ x, y, maze: { numRows, grid } }: Automove,
	visited: Set<string>,
) =>
	pipe(
		Effect.succeed(
			x < numRows - 1 && grid[x].horizontal[y] && !visited.has(`${x + 1},${y}`),
		),
		Effect.flatMap((hasWall) =>
			hasWall
				? Effect.succeed({ x: x + 1, y, path: [Directions.down] } as MazePath)
				: Effect.succeed(undefined),
		),
	);

const ChceckWallLeft = (
	{ x, y, maze: { grid } }: Automove,
	visited: Set<string>,
) =>
	pipe(
		Effect.succeed(
			y > 0 && grid[x].vertical[y - 1] && !visited.has(`${x},${y - 1}`),
		),
		Effect.flatMap((hasWall) =>
			hasWall
				? Effect.succeed({ x, y: y - 1, path: [Directions.left] } as MazePath)
				: Effect.succeed(undefined),
		),
	);

const ChceckWallUp = (
	{ x, y, maze: { grid } }: Automove,
	visited: Set<string>,
) =>
	pipe(
		Effect.succeed(
			x > 0 && grid[x - 1].horizontal[y] && !visited.has(`${x - 1},${y}`),
		),
		Effect.flatMap((hasWall) =>
			hasWall
				? Effect.succeed({ x: x - 1, y, path: [Directions.up] } as MazePath)
				: Effect.succeed(undefined),
		),
	);

const validateWall = (m: Automove, visited: Set<string>) =>
	pipe(
		Effect.all([
			ChceckWallRight(m, visited),
			ChceckWallDown(m, visited),
			ChceckWallLeft(m, visited),
			ChceckWallUp(m, visited),
		]),
		Effect.flatMap((results) => {
			const validMoves = results.filter((move) => move !== undefined);
			if (results.length > 0) {
				return Effect.succeed(validMoves);
			}
			return Effect.fail(new GamePlayError("No valid moves available"));
		}),
	);

const action = (visited: Set<string>, maze: Maze, stack: MazePath[]) =>
	pipe(
		Effect.succeed(stack.pop()),
		Effect.flatMap((current) => {
			if (!current) return Effect.succeed(undefined);
			const { x, y, path } = current;
			if (x === maze.numRows - 1 && y === maze.numCols - 1) {
				return Effect.succeed(path);
			}
			const key = `${x},${y}`;
			if (visited.has(key)) {
				return Effect.succeed(undefined);
			}
			visited.add(key);
			return pipe(
				validateWall({ x, y, maze }, visited),
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
			while: ({ stack }) => {
				return stack.length > 0;
			},
			step: (state) => state,
			body: (state) => action(state.visited, state.maze, state.stack),
		},
	);













	


// export const ChceckWallUp = (m: AutoMove, visited: Set<string>) =>
// 	pipe(
// 		Effect.succeed( WallAbove({...m, ...Directions.up}) && !visited.has(`${m.currentX - 1},${m.currentY}`)
// 	), Effect.flatMap((hasWall) =>
// 		hasWall
// 			? Effect.succeed({ x: m.currentX - 1, y: m.currentY, path: [directions[3]] } as MazePath)
// 			: Effect.succeed(undefined),
// 		),
// 	);

// export const ChceckWallDown = (m: AutoMove, visited: Set<string>) =>
// 	pipe(
// 		Effect.succeed(WallBelow({...m, ...Directions.down}) && !visited.has(`${m.currentX + 1},${m.currentY}`)),
// 	Effect.flatMap((hasWall) =>
// 		hasWall
// 			? Effect.succeed({ x: m.currentX + 1, y: m.currentY, path: [directions[1]] } as MazePath)
// 			: Effect.succeed(undefined),
// 	));	

// export const ChceckWallLeft = (m: AutoMove, visited: Set<string>) =>
// 	pipe(
// 		Effect.succeed(WallLeft({...m, ...Directions.left}) && !visited.has(`${m.currentX},${m.currentY - 1}`)),		
// 	Effect.flatMap((hasWall) =>
// 		hasWall
// 			? Effect.succeed({ x: m.currentX, y: m.currentY - 1, path: [directions[2]] } as MazePath)
// 			: Effect.succeed(undefined),
// 	)); 

// export const ChceckWallRight = (m: AutoMove, visited: Set<string>) =>
// 	pipe(
// 		Effect.succeed(WallRight({...m, ...Directions.right}) && !visited.has(`${m.currentX},${m.currentY + 1}`)),
// 	Effect.flatMap((hasWall) =>
// 		hasWall
// 			? Effect.succeed({ x: m.currentX, y: m.currentY + 1, path: [directions[0]] } as MazePath)
// 			: Effect.succeed(undefined),
// 	));

// export const validateWall = (m: AutoMove, visited: Set<string>) =>
// 	pipe(
// 		// Effect.succeed(m),
// 		Effect.all([
// 			ChceckWallUp(m, visited),
// 			ChceckWallDown(m, visited),
// 			ChceckWallLeft(m, visited),
// 			ChceckWallRight(m, visited),
// 		]),
// 		Effect.flatMap((results) => {
// 			const validMoves = results.filter((move) => move !== undefined);
// 			if (results.length > 0) {
// 				return Effect.succeed(validMoves);
// 			}
// 			return Effect.fail(new GamePlayError("No valid moves available"));
// 		}),
			
// 	)

// 	export const runAutoMove1 = (state: GameState) =>
// 	pipe(
// 		Ref.get(state.maze),
// 		Effect.flatMap((maze) => {
// 			const path = solveMaze1(maze.maze);
// 			return Effect.forEach(path, (position) =>
// 				autoMove1(state, position).pipe(
// 					Effect.delay("500 millis"),
// 				)
// 			);
// 		}),
// 	);

// const solveMaze1 = (maze: Maze) => {
// 	const { numRows, numCols, grid } = maze;
// 	const stack = [{ x: 0, y: 0, path: [{ x: 0, y: 0 }] }];
// 	const visited = new Set<string>();

// 	while (stack.length) {
// 		const { x, y, path } = stack.pop()!;
// 		if (x === numRows - 1 && y === numCols - 1) return path;
// 		const key = `${x},${y}`;
// 		if (visited.has(key)) continue;
// 			visited.add(key);

// 		// const movement = 
		 

// 		// Up
// 		if (x > 0 && grid[x - 1].horizontal[y] && !visited.has(`${x-1},${y}`)) {
// 			stack.push({ x: x - 1, y, path: [...path, directions[3]] });
// 		}
// 		// Down
// 		if (x < numRows - 1 && grid[x].horizontal[y] && !visited.has(`${x+1},${y}`)) {
// 			stack.push({ x: x + 1, y, path: [...path, directions[1]] });
// 		}
// 		// Left
// 		if (y > 0 && grid[x].vertical[y - 1] && !visited.has(`${x},${y-1}`)) {
// 			stack.push({ x, y: y - 1, path: [...path, directions[2]] });
// 		}
// 		// Right
// 		if (y < numCols - 1 && grid[x].vertical[y] && !visited.has(`${x},${y+1}`)) {
// 			stack.push({ x, y: y + 1, path: [...path, directions[0]] });
// 		}
// 	}
// 	return [];
// }

// const solveMaze = (maze: Maze) => {
// 	const { numRows, numCols, grid } = maze;
// 	// const visited = Array.from({ length: numRows }, () => Array<boolean>(numCols).fill(false));
// 	const stack = [{ x: 0, y: 0, path: [{ x: 0, y: 0 }] }];
// 	const visited = new Set<string>();

// 	while (stack.length) {
// 		const { x, y, path } = stack.pop()!;
// 		if (x === numRows - 1 && y === numCols - 1) return path;
// 		const key = `${x},${y}`;
// 		if (visited.has(key)) continue;
// 		visited.add(key);

// 		// Up

// 		if (x > 0 && grid[x - 1].horizontal[y] && !visited.has(`${x - 1},${y}`)) {
// 			stack.push({ x: x - 1, y, path: [...path, { x: x - 1, y }] });
// 		}
// 		// Down
// 		if (
// 			x < numRows - 1 &&
// 			grid[x].horizontal[y] &&
// 			!visited.has(`${x + 1},${y}`)
// 		) {
// 			stack.push({ x: x + 1, y, path: [...path, { x: x + 1, y }] });
// 		}
// 		// Left
// 		if (y > 0 && grid[x].vertical[y - 1] && !visited.has(`${x},${y - 1}`)) {
// 			stack.push({ x, y: y - 1, path: [...path, { x, y: y - 1 }] });
// 		}
// 		// Right
// 		if (
// 			y < numCols - 1 &&
// 			grid[x].vertical[y] &&
// 			!visited.has(`${x},${y + 1}`)
// 		) {
// 			stack.push({ x, y: y + 1, path: [...path, { x, y: y + 1 }] });
// 		}
// 	}
// 	return [];
// };

// export const solveMazeEffect = (initialState: GameState) =>
// 	Effect.gen(function* (_) {
// 		const visited = new Set<string>();
// 		const stack: { state: GameState; path: { x: number; y: number }[] }[] = [
// 			{ state: initialState, path: [yield* _(Ref.get(initialState.currentPosition))] },
// 		];

// 		while (stack.length > 0) {
// 			const { state, path } = stack.pop()!;
// 			const pos = yield* _(Ref.get(state.currentPosition));
// 			const mazeState = yield* _(Ref.get(state.maze));
// 			const key = `${pos.x},${pos.y}`;

// 			if (visited.has(key)) continue;
// 			visited.add(key);

// 			if (pos.x === mazeState.maze.numRows - 1 && pos.y === mazeState.maze.numCols - 1) {
// 				return path;
// 			}

// 			for (const dir of directions) {
// 				const nextMove = { ...state, playerMoves: dir };
// 				const validation = yield* _(validateMovement(nextMove).pipe(Effect.either));
// 				if (validation._tag === "Right") {
// 					const nextPos = validation.right;
// 					const nextKey = `${nextPos.x},${nextPos.y}`;
// 					if (!visited.has(nextKey)) {
// 						const nextState = {
// 							...state,
// 							currentPosition: Ref.set({ x: nextPos.x, y: nextPos.y }),
// 						};
// 						stack.push({
// 							state: nextState,
// 							path: [...path, { x: nextPos.x, y: nextPos.y }],
// 						});
// 					}
// 				}
// 			}
// 		}
// 		return [];
// 	});
// export const solveMaze = (initialState: GameState) => {
// 	return Effect.gen(function* (_) {
// 		const visited = new Set<string>();
// 		const path: { x: number; y: number }[] = [];
// 		const stack: GameState[] = [initialState];

// 		while (stack.length > 0) {
// 			const state = stack.pop()!;
// 			const { currentPosition, maze } = state;
// 			const pos =  yield* currentPosition;
// 			const mazeState = yield* maze;
// 			const key = `${pos.x},${pos.y}`;

// 			if (visited.has(key)) continue;
// 			visited.add(key);
// 			path.push({ ...pos });

// 			if (
// 				pos.x === mazeState.maze.numRows - 1 &&
// 				pos.y === mazeState.maze.numCols - 1
// 			) {
// 				return path;
// 			}

// 			for (const dir of directions) {
// 				const nextMove = {
// 					...state,
// 					playerMoves: dir,
// 				};
// 				const validation = yield* _(validateMovement(nextMove));
// 				if (validation) {
// 					const nextState = {
// 						...state,
// 						currentPosition: { x: validation.x, y: validation.y },
// 					};
// 					const nextKey = `${validation.x},${validation.y}`;
// 					if (!visited.has(nextKey)) {
// 						stack.push(nextState);
// 					}
// 				}
// 			}
// 			path.pop();
// 		}
// 		return [];
// 	});
// };
