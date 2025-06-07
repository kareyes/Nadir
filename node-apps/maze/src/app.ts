import { Effect, Ref, pipe } from "effect";
import { initializeGameState } from "./components/maze.js";
import { Maze, MazeProvider } from "./components/menu.js";
import { MazeDataState, RawData } from "./constant.js";

pipe(
	Maze,
	Effect.flatMap(() => initializeGameState),
	Effect.provide(Maze.Default),
	Effect.provideServiceEffect(MazeDataState, Ref.make(RawData)),
	Effect.runPromise,
);

// const prog = pipe(
// 	Maze,
// 	Effect.flatMap(() => initializeGameState),
// 	Effect.provide(MazeProvider),
	
// )
