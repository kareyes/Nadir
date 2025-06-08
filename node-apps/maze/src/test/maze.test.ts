// import { describe, it, expect, vi, beforeEach } from "vitest";
// import * as menu from "./components/menu.js";
// import * as maze from "./components/maze.js";
// import * as constant from "./constant.js";
// import { Effect, Ref, pipe } from "effect";

// // node-apps/maze/src/app.test.ts

// // Mock dependencies
// vi.mock("./components/menu.js", async () => {
// 	return {
// 		Maze: Effect.succeed("MazeInstance"),
// 		MazeProvider: {},
// 		Maze: { Default: "MazeDefault" }
// 	};
// });
// vi.mock("./components/maze.js", async () => {
// 	return {
// 		initializeGameState: Effect.succeed("GameStateInitialized")
// 	};
// });
// vi.mock("./constant.js", async () => {
// 	// Provide a dummy Ref and RawData
// 	return {
// 		MazeDataState: "MazeDataState",
// 		RawData: { dummy: true }
// 	};
// });

// describe("app.ts main pipeline", () => {
// 	let spyInitializeGameState: any;

// 	beforeEach(() => {
// 		// Reset modules and spies before each test
// 		vi.resetModules();
// 		spyInitializeGameState = vi.spyOn(maze, "initializeGameState");
// 	});

// 	it("runs the main pipe without throwing", async () => {
// 		const { Maze } = await import("./components/menu.js");
// 		const { initializeGameState } = await import("./components/maze.js");
// 		const { MazeDataState, RawData } = await import("./constant.js");

// 		let error: unknown = undefined;
// 		try {
// 			await pipe(
// 				Maze,
// 				Effect.flatMap(() => initializeGameState),
// 				Effect.provide(Maze.Default),
// 				Effect.provideServiceEffect(MazeDataState, Ref.make(RawData)),
// 				Effect.runPromise,
// 			);
// 		} catch (e) {
// 			error = e;
// 		}
// 		expect(error).toBeUndefined();
// 	});

// 	it("calls initializeGameState", async () => {
// 		const { Maze } = await import("./components/menu.js");
// 		const { initializeGameState } = await import("./components/maze.js");
// 		const { MazeDataState, RawData } = await import("./constant.js");

// 		await pipe(
// 			Maze,
// 			Effect.flatMap(() => initializeGameState),
// 			Effect.provide(Maze.Default),
// 			Effect.provideServiceEffect(MazeDataState, Ref.make(RawData)),
// 			Effect.runPromise,
// 		);

// 		expect(spyInitializeGameState).toHaveBeenCalledTimes(1);
// 	});
// });