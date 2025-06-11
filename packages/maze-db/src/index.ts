// import { Effect, pipe } from "effect";
// // // import { DatabaseService } from "./db/DB.js";
// // // import { SELECT_METADATA, type MazeMetaArray } from "@nadir/global-types";
// // // import { MazeDB } from "./db/Database.js";
// import { PlayerDBService } from "./service/player.js";

// // import { MazeDB } from "./db/Database.js";

// const prog = PlayerDBService.pipe(
// 	Effect.flatMap((service) => service.getAllPlayers),
// 	// Effect.map(() => "Maze schema initialized"),
// 	Effect.provide(PlayerDBService.Default),
// );

// Effect.runPromise(prog)
// 	.then((result) => console.log("Result:", result))
// 	.catch((error) => console.error("Error:", error));



export * from "./service/maze.js";
export * from "./service/player.js";
export * from "./db/index.js";
