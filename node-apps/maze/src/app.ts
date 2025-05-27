import { live } from "@nadir/backend-maze";
import { Effect, Ref, pipe } from "effect";
import { gameStart } from "./components/maze.js";
import { MazeMenu } from "./components/menu.js";
import { MazeDataState, RawData } from "./constant.js";

const maze = pipe(
	MazeMenu,
	Effect.flatMap(() => gameStart),
	Effect.provide(MazeMenu.Default),
	Effect.provideServiceEffect(MazeDataState, Ref.make(RawData)),
);

live.runPromise(maze);
