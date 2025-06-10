// import { Effect, pipe } from "effect";
// import {
// 	GamePlayError,
// 	type Automove,
// 	type CurrentPosition,
// 	type Grid,
// 	type Maze,
// 	type MazePath,
// 	type PlayMovement,
// } from "@nadir/global-types";
// import { directions, Directions, Directions1 } from "../constant.js";
// // import { ChceckWallDown, ChceckWallLeft, ChceckWallRight, ChceckWallUp } from "./gameplay.js";
// // import { cons } from "effect/List";
// // import { input } from "@inquirer/prompts";
// // import { solveMaze } from "./gameplay.js";

// // MazeAPIService.pipe(
// //     Effect.flatMap((mazeAPI) => {
// //         return mazeAPI.getMaze("001").pipe(
// //             Effect.map((maze) => {
// //                 console.log("Maze Data:", maze);
// //                 const sol = solveMaze(maze)
// //                 console.log("Solved Maze:", sol);
// //             })
// //         );
// //     }
// //     ),
// //     Effect.provide(MazeAPIService.Default),
// //     Effect.runPromise,
// // )

// // import { Effect, Console } from "effect"

// const grid = [
// 	{
// 		vertical: [true, true, false, true, false],
// 		horizontal: [true, false, true, true, true],
// 	},
// 	{
// 		vertical: [true, false, false, false, false],
// 		horizontal: [false, false, true, true, true],
// 	},
// 	{
// 		vertical: [true, true, false, false, false],
// 		horizontal: [true, false, false, false, true],
// 	},
// 	{
// 		vertical: [false, true, true, true, false],
// 		horizontal: [true, false, true, false, true],
// 	},
// 	{
// 		vertical: [true, true, false, true, false],
// 		horizontal: [false, false, false, false, true],
// 	},
// ];

// const maze = {
// 	maze_id: "001",
// 	mazeName: "Level 1: The Labyrinths",
// 	description: "This is a 5x5 maze",
// 	created_at: new Date().toISOString(),
// 	numCols: 5,
// 	numRows: 5,
// 	grid: grid,
// };

// const validateWall = (m: AutoMove, visited: Set<string>) =>
//     pipe(
//         // Effect.succeed(m),
//         Effect.all([
//             ChceckWallUp(m, visited),
//             ChceckWallDown(m, visited),
//             ChceckWallLeft(m, visited),
//             ChceckWallRight(m, visited),
//         ]),
//         Effect.flatMap((results) => {
//             const validMoves = results.filter((move) => move !== undefined);
//             if (validMoves.length > 0) {
//                 return Effect.succeed(results);
//             }
//             return Effect.fail(new GamePlayError("No valid moves available"));
//         }),

//     )

// const WallRight = (m: PlayMovement) =>
//     pipe(
//         Effect.succeed(m),
//         Effect.bind("condition", (m) =>
//             Effect.succeed(
//                 m.dx === 0 &&
//                     m.dy === 1 &&
//                     m.currentY < m.maze.numCols - 1 &&
//                     !m.maze.grid[m.currentX].vertical[m.currentY],
//             ),
//         ),
//         Effect.flatMap(({ condition }) =>
//             condition
//                 ? Effect.fail(new GamePlayError("Wall to the right"))
//                 : Effect.succeed(false),
//         ),
//     );

// const WallBelow = (m: PlayMovement) =>
//     pipe(
//         Effect.succeed(m),
//         Effect.bind("condition", (m) =>
//             Effect.succeed(
//                 m.dx === 1 &&
//                     m.dy === 0 &&
//                     m.currentX < m.maze.numRows - 1 &&
//                     !m.maze.grid[m.currentX].horizontal[m.currentY],
//             ),
//         ),
//         Effect.flatMap(({ condition }) =>
//             condition
//                 ? Effect.fail(new GamePlayError("Wall below"))
//                 : Effect.succeed(false),
//         ),
//     );

// const WallLeft = (m: PlayMovement) =>
//     pipe(
//         Effect.succeed(m),
//         Effect.bind("condition", (m) =>
//             Effect.succeed(
//                 m.dx === 0 &&
//                     m.dy === -1 &&
//                     m.currentY > 0 &&
//                     !m.maze.grid[m.currentX].vertical[m.currentY - 1],
//             ),
//         ),
//         Effect.flatMap(({ condition }) =>
//             condition
//                 ? Effect.fail(new GamePlayError("Wall to the left"))
//                 : Effect.succeed(false),
//         ),
//     );

// const WallAbove = (m: PlayMovement) =>
//     pipe(
//         Effect.succeed(m),
//         Effect.bind("condition", (m) =>
//             Effect.succeed(
//                 m.dx === -1 &&
//                     m.dy === 0 &&
//                     m.currentX > 0 &&
//                     !m.maze.grid[m.currentX - 1].horizontal[m.currentY],
//             ),
//         ),
//         Effect.flatMap(({ condition }) =>
//             condition
//                 ? Effect.fail(new GamePlayError("Wall above"))
//                 : Effect.succeed(false),
//         ),
//     );

//  const ChceckWallUp = (m: AutoMove, visited: Set<string>) =>
//     pipe(
//         Effect.succeed( !WallAbove({...m, ...Directions.up}) && !visited.has(`${m.currentX - 1},${m.currentY}`)
//     ), Effect.flatMap((hasWall) =>
//         hasWall
//             ? Effect.succeed({ x: m.currentX - 1, y: m.currentY, path: [directions[3]] } as MazePath)
//             : Effect.succeed(undefined),
//         ),
//     );

//  const ChceckWallDown = (m: AutoMove, visited: Set<string>) =>
//     pipe(
//         Effect.succeed(!WallBelow({...m, ...Directions.down}) && !visited.has(`${m.currentX + 1},${m.currentY}`)),
//     Effect.flatMap((hasWall) =>
//         hasWall
//             ? Effect.succeed({ x: m.currentX + 1, y: m.currentY, path: [directions[1]] } as MazePath)
//             : Effect.succeed(undefined),
//     ));

//  const ChceckWallLeft = (m: AutoMove, visited: Set<string>) =>
//     pipe(
//         Effect.succeed(!WallLeft({...m, ...Directions.left}) && !visited.has(`${m.currentX},${m.currentY - 1}`)),
//     Effect.flatMap((hasWall) =>
//         hasWall
//             ? Effect.succeed({ x: m.currentX, y: m.currentY - 1, path: [directions[2]] } as MazePath)
//             : Effect.succeed(undefined),
//     ));

//  const ChceckWallRight = (m: AutoMove, visited: Set<string>) =>
//     pipe(
//         Effect.succeed(!WallRight({...m, ...Directions.right}) && !visited.has(`${m.currentX},${m.currentY + 1}`)),
//     Effect.flatMap((hasWall) =>
//         hasWall
//             ? Effect.succeed({ x: m.currentX, y: m.currentY + 1, path: [directions[0]] } as MazePath)
//             : Effect.succeed(undefined),
//     ));

// const ChceckWallRight = (
// 	{ x, y, maze: { numCols, grid } }: Automove,
// 	visited: Set<string>,
// ) =>
// 	pipe(
// 		Effect.succeed(
// 			y < numCols - 1 && grid[x].vertical[y] && !visited.has(`${x},${y + 1}`),
// 		),
// 		Effect.flatMap((hasWall) =>
// 			hasWall
// 				? Effect.succeed({ x, y: y + 1, path: [Directions1.right] } as MazePath)
// 				: Effect.succeed(undefined),
// 		),
// 	);

// const ChceckWallDown = (
// 	{ x, y, maze: { numRows, grid } }: Automove,
// 	visited: Set<string>,
// ) =>
// 	pipe(
// 		Effect.succeed(
// 			x < numRows - 1 && grid[x].horizontal[y] && !visited.has(`${x + 1},${y}`),
// 		),
// 		Effect.flatMap((hasWall) =>
// 			hasWall
// 				? Effect.succeed({ x: x + 1, y, path: [Directions1.down] } as MazePath)
// 				: Effect.succeed(undefined),
// 		),
// 	);

// const ChceckWallLeft = (
// 	{ x, y, maze: { grid } }: Automove,
// 	visited: Set<string>,
// ) =>
// 	pipe(
// 		Effect.succeed(
// 			y > 0 && grid[x].vertical[y - 1] && !visited.has(`${x},${y - 1}`),
// 		),
// 		Effect.flatMap((hasWall) =>
// 			hasWall
// 				? Effect.succeed({ x, y: y - 1, path: [Directions1.left] } as MazePath)
// 				: Effect.succeed(undefined),
// 		),
// 	);

// const ChceckWallUp = (
// 	{ x, y, maze: { grid } }: Automove,
// 	visited: Set<string>,
// ) =>
// 	pipe(
// 		Effect.succeed(
// 			x > 0 && grid[x - 1].horizontal[y] && !visited.has(`${x - 1},${y}`),
// 		),
// 		Effect.flatMap((hasWall) =>
// 			hasWall
// 				? Effect.succeed({ x: x - 1, y, path: [Directions1.up] } as MazePath)
// 				: Effect.succeed(undefined),
// 		),
// 	);

// const validateWall = (m: Automove, visited: Set<string>) =>
// 	pipe(
// 		Effect.all([
// 			ChceckWallRight(m, visited),
// 			ChceckWallDown(m, visited),
// 			ChceckWallLeft(m, visited),
// 			ChceckWallUp(m, visited),
// 		]),
// 		Effect.flatMap((results) => {
// 			const validMoves = results.filter((move) => move !== undefined);
// 			if (results.length > 0) {
// 				return Effect.succeed(validMoves);
// 			}
// 			return Effect.fail(new GamePlayError("No valid moves available"));
// 		}),
// 	);

// const action = (visited: Set<string>, maze: Maze, stack: MazePath[]) =>
// 	pipe(
// 		Effect.succeed(stack.pop()),
// 		Effect.flatMap((current) => {
// 			if (!current) return Effect.succeed([]);
// 			const { x, y, path } = current;
// 			if (x === maze.numRows - 1 && y === maze.numCols - 1) {
// 				return Effect.succeed(path);
// 			}
// 			const key = `${x},${y}`;
// 			if (visited.has(key)) {
// 				return Effect.succeed([]);
// 			}
// 			visited.add(key);
// 			return pipe(
// 				validateWall({ x, y, maze }, visited),
// 				Effect.map((validMoves) => {
// 					validMoves.forEach((move) => {
// 						stack.push({ x: move.x, y: move.y, path: [...path, ...move.path] });
// 					});
// 				}),
// 			);
// 		}),
// 	);


// const loop = (maze: Maze) =>
// 	Effect.loop(
// 		{
// 			stack: [{ x: 0, y: 0, path: [{ x: 0, y: 0 }] }],
// 			visited: new Set<string>(),
// 			maze,
// 		},
// 		{
// 			while: ({ stack }) => {
// 				return stack.length > 0;
// 			},
// 			step: (state) => state,
// 			body: (state) => action(state.visited, state.maze, state.stack),
// 		},
// 	);

// export const solveMaze3 = (maze: Maze) =>
//     loop(maze).pipe(
//         Effect.flatMap((result) => {
//             const path = result.find((s) => s !== undefined) || [] as CurrentPosition[];  
//             return Effect.succeed(path);
//         }
//     ))

// export const solveMaze2 = (maze: Maze) =>
// 	Effect.gen(function* () {
// 		const { numRows, numCols, grid } = maze;
// 		const stack: Array<{ x: number; y: number; path: Array<CurrentPosition> }> =
// 			[{ x: 0, y: 0, path: [{ x: 0, y: 0 }] }];
// 		const visited = new Set<string>();
// 		let result: Array<CurrentPosition> = [];
// 		while (stack.length) {
// 			const { x, y, path } = stack.pop()!;
// 			if (x === numRows - 1 && y === numCols - 1) {
// 				result = path;
// 				break;
// 			}

// 			// console.log(stack, "Stack Length:", stack.length);
// 			const key = `${x},${y}`;
// 			if (visited.has(key)) continue;

// 			visited.add(key);

// 			const validMoves = yield* validateWall({ x, y, maze }, visited);
// 			validMoves.forEach((move) => {
// 				stack.push({ x: move.x, y: move.y, path: [...path, ...move.path] });
// 			});
// 		}
// 		return result;
// 	});

// loop(maze).pipe(
//     Effect.flatMap((result) => {
//         console.log("Solved Maze Path:", result.pop());
//         return Effect.succeed(result);
//     }
// )),

// solveMaze3(maze).pipe(
// 	Effect.flatMap((result) => {
// 		console.log("Solved Maze Path:", result);
// 		return Effect.succeed(result);
// 	}),
// 	Effect.runPromise,
// );

// const solveMaze = (maze: Maze) => Effect.gen(() => {
//     const { numRows, numCols, grid } = maze;
//     const stack = [{ x: 0, y: 0, path: [{ x: 0, y: 0 }] }];
// 	const visited = new Set<string>()

//     while (stack.length) {
//         const { x, y, path } = stack.pop()!;
//         if (x === numRows - 1 && y === numCols - 1) return path;
//         const key = `${x},${y}`;
//         if (visited.has(key)) continue;
//         visited.add(key);

//         // Up
//         if (x > 0 && grid[x - 1].horizontal[y] && !visited.has(`${x-1},${y}`)) {
//             stack.push({ x: x - 1, y, path: [...path, { x: x - 1, y }] });
//         }
//         // Down
//         if (x < numRows - 1 && grid[x].horizontal[y] && !visited.has(`${x+1},${y}`)) {
//             stack.push({ x: x + 1, y, path: [...path, { x: x + 1, y }] });
//         }
//         // Left
//         if (y > 0 && grid[x].vertical[y - 1] && !visited.has(`${x},${y-1}`)) {
//             stack.push({ x, y: y - 1, path: [...path, { x, y: y - 1 }] });
//         }
//         // Right
//         if (y < numCols - 1 && grid[x].vertical[y] && !visited.has(`${x},${y+1}`)) {
//             stack.push({ x, y: y + 1, path: [...path, { x, y: y + 1 }] });
//         }
//     }
//     return [];

// })
