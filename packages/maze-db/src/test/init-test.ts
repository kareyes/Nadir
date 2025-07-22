#!/usr/bin/env node
import { Effect, pipe } from "effect";
import { mazeModel as testMaze } from "../seed/maze1.js";
import { playerSymbols } from "../seed/players.js";
import { MazeDBService } from "../service/maze.js";
import { PlayerDBService } from "../service/player.js";

console.log("🧪 Starting Maze DB Initialization Test...\n");

// Test Maze Service Initialization
const testMazeService = async () => {
	console.log("🏗️  Testing Maze Service...");

	try {
		const program = MazeDBService.pipe(
			Effect.tap((service) => {
				console.log("  • Initializing maze schema...");
				return service.initMazeSchema;
			}),
			Effect.tap((service) => {
				console.log("  • Inserting test maze...");
				return service.insertMaze(testMaze);
			}),
			Effect.tap((service) => {
				console.log("  • Retrieving maze by ID...");
				return service.getMazeById(testMaze.maze_id);
			}),
			Effect.flatMap((service) => {
				console.log("  • Getting all mazes...");
				return service.getAllMazes;
			}),
			Effect.provide(MazeDBService.Default),
		);

		const result = await Effect.runPromise(program);
		console.log(
			`  ✅ Maze service test passed! Found ${result.length} maze(s)\n`,
		);
		return true;
	} catch (error) {
		console.error("  ❌ Maze service test failed:", error);
		return false;
	}
};

// Test Player Service Initialization
const testPlayerService = async () => {
	console.log("👤 Testing Player Service...");

	try {
		const testPlayer = playerSymbols[0];

		const program = PlayerDBService.pipe(
			Effect.tap((service) => {
				console.log("  • Initializing player schema...");
				return service.initPlayereSchema;
			}),
			Effect.tap((service) => {
				console.log("  • Inserting test player...");
				return service.insertPlayer(testPlayer);
			}),
			Effect.tap((service) => {
				console.log("  • Retrieving player by ID...");
				return service.getPlayerById(testPlayer.playerID);
			}),
			Effect.flatMap((service) => {
				console.log("  • Getting all players...");
				return service.getAllPlayers;
			}),
			Effect.provide(PlayerDBService.Default),
		);

		const result = await Effect.runPromise(program);
		console.log(
			`  ✅ Player service test passed! Found ${result.length} player(s)\n`,
		);
		return true;
	} catch (error) {
		console.error("  ❌ Player service test failed:", error);
		return false;
	}
};

// Test Full Initialization
const testFullInitialization = async () => {
	console.log("🎯 Testing Full Database Initialization...");

	try {
		const mazeProgram = MazeDBService.pipe(
			Effect.tap((service) => service.initMazeSchema),
			Effect.tap((service) => service.insertMaze(testMaze)),
			Effect.flatMap((service) => service.getMetadata),
			Effect.provide(MazeDBService.Default),
		);

		const playerProgram = PlayerDBService.pipe(
			Effect.tap((service) => service.initPlayereSchema),
			Effect.tap((service) => service.insertPlayer(playerSymbols[0])),
			Effect.flatMap((service) => service.getAllPlayers),
			Effect.provide(PlayerDBService.Default),
		);

		const [mazeMetadata, players] = await Promise.all([
			Effect.runPromise(mazeProgram),
			Effect.runPromise(playerProgram),
		]);

		console.log("  ✅ Full initialization test passed!");
		console.log(`     • Maze metadata count: ${mazeMetadata.length}`);
		console.log(`     • Player count: ${players.length}\n`);
		return true;
	} catch (error) {
		console.error("  ❌ Full initialization test failed:", error);
		return false;
	}
};

// Run all tests
const runTests = async () => {
	const results = await Promise.all([
		testMazeService(),
		testPlayerService(),
		testFullInitialization(),
	]);

	const passedTests = results.filter((result) => result).length;
	const totalTests = results.length;

	console.log("📊 Test Results:");
	console.log(`   Passed: ${passedTests}/${totalTests}`);

	if (passedTests === totalTests) {
		console.log("🎉 All tests passed! Maze DB is properly initialized.");
		process.exit(0);
	} else {
		console.log("💥 Some tests failed. Check the output above for details.");
		process.exit(1);
	}
};

runTests().catch((error) => {
	console.error("❌ Test runner failed:", error);
	process.exit(1);
});
