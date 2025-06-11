import { Effect, Ref } from "effect";
import { initializeGameState } from "./components/maze.js";
import { Maze } from "./components/menu.js";
import { MazeDataState, RawData } from "./constant.js";

export const mazeApp = Maze.pipe(
	Effect.flatMap(() => initializeGameState),
	Effect.provide(Maze.Default),
	Effect.provideServiceEffect(MazeDataState, Ref.make(RawData)),
);

Effect.runPromise(mazeApp);
