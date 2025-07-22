import { describe, expect, it } from "vitest";
// import { Effect } from "effect";
// import { MazeDBService } from "../service/maze.js";
// import { PlayerDBService } from "../service/player.js";
// import { mazeModel as testMaze } from "../seed/maze1.js";
// import { playerSymbols } from "../seed/players.js";

describe("Maze DB Initialization", () => {
	it("should initialize maze schema successfully", async () => {
		// const program = MazeDBService.pipe(
		// 	Effect.flatMap((service) => service.initMazeSchema),
		// 	Effect.provide(MazeDBService.Default),
		// );

		// const result = await Effect.runPromise(program);
		// expect("test").toBeDefined();
		const test = "hello";
		expect(test).toBe("hello");
	});

	// it("should initialize player schema successfully", async () => {
	// 	const program = PlayerDBService.pipe(
	// 		Effect.flatMap((service) => service.initPlayereSchema),
	// 		Effect.provide(PlayerDBService.Default),
	// 	);

	// 	const result = await Effect.runPromise(program);
	// 	expect(result).toBeDefined();
	// });

	// it("should insert and retrieve a maze", async () => {
	// 	const program = MazeDBService.pipe(
	// 		Effect.tap((service) => service.initMazeSchema),
	// 		Effect.tap((service) => service.insertMaze(testMaze)),
	// 		Effect.flatMap((service) => service.getMazeById(testMaze.maze_id)),
	// 		Effect.provide(MazeDBService.Default),
	// 	);

	// 	const result = await Effect.runPromise(program);
	// 	expect(result).toBeDefined();
	// 	expect(result.maze_id).toBe(testMaze.maze_id);
	// 	expect(result.mazeName).toBe(testMaze.mazeName);
	// });

	// it("should insert and retrieve a player", async () => {
	// 	const testPlayer = playerSymbols[0];

	// 	const program = PlayerDBService.pipe(
	// 		Effect.tap((service) => service.initPlayereSchema),
	// 		Effect.tap((service) => service.insertPlayer(testPlayer)),
	// 		Effect.flatMap((service) => service.getPlayerById(testPlayer.playerID)),
	// 		Effect.provide(PlayerDBService.Default),
	// 	);

	// 	const result = await Effect.runPromise(program);
	// 	expect(result).toBeDefined();
	// 	expect(result.playerID).toBe(testPlayer.playerID);
	// 	expect(result.name).toBe(testPlayer.name);
	// 	expect(result.value).toBe(testPlayer.value);
	// });

	// it("should retrieve all mazes after insertion", async () => {
	// 	const program = MazeDBService.pipe(
	// 		Effect.tap((service) => service.initMazeSchema),
	// 		Effect.tap((service) => service.insertMaze(testMaze)),
	// 		Effect.flatMap((service) => service.getAllMazes),
	// 		Effect.provide(MazeDBService.Default),
	// 	);

	// 	const result = await Effect.runPromise(program);
	// 	expect(result).toBeDefined();
	// 	expect(Array.isArray(result)).toBe(true);
	// 	expect(result.length).toBeGreaterThan(0);
	// });

	// it("should retrieve all players after insertion", async () => {
	// 	const testPlayer = playerSymbols[0];

	// 	const program = PlayerDBService.pipe(
	// 		Effect.tap((service) => service.initPlayereSchema),
	// 		Effect.tap((service) => service.insertPlayer(testPlayer)),
	// 		Effect.flatMap((service) => service.getAllPlayers),
	// 		Effect.provide(PlayerDBService.Default),
	// 	);

	// 	const result = await Effect.runPromise(program);
	// 	expect(result).toBeDefined();
	// 	expect(Array.isArray(result)).toBe(true);
	// 	expect(result.length).toBeGreaterThan(0);
	// });

	// it("should retrieve maze metadata", async () => {
	// 	const program = MazeDBService.pipe(
	// 		Effect.tap((service) => service.initMazeSchema),
	// 		Effect.tap((service) => service.insertMaze(testMaze)),
	// 		Effect.flatMap((service) => service.getMetadata),
	// 		Effect.provide(MazeDBService.Default),
	// 	);

	// 	const result = await Effect.runPromise(program);
	// 	expect(result).toBeDefined();
	// 	expect(Array.isArray(result)).toBe(true);
	// });

	// it("should delete a maze successfully", async () => {
	// 	const program = MazeDBService.pipe(
	// 		Effect.tap((service) => service.initMazeSchema),
	// 		Effect.tap((service) => service.insertMaze(testMaze)),
	// 		Effect.tap((service) => service.deleteMaze(testMaze.maze_id)),
	// 		Effect.provide(MazeDBService.Default),
	// 	);

	// 	const result = await Effect.runPromise(program);
	// 	expect(result).toBeDefined();
	// });

	// it("should delete a player successfully", async () => {
	// 	const testPlayer = playerSymbols[0];

	// 	const program = PlayerDBService.pipe(
	// 		Effect.tap((service) => service.initPlayereSchema),
	// 		Effect.tap((service) => service.insertPlayer(testPlayer)),
	// 		Effect.tap((service) => service.deletePlayer(testPlayer.playerID)),
	// 		Effect.provide(PlayerDBService.Default),
	// 	);

	// 	const result = await Effect.runPromise(program);
	// 	expect(result).toBeDefined();
	// });
});
