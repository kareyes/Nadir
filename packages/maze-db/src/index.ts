// import { Effect, pipe } from "effect";
// // import { DatabaseService } from "./db/DB.js";
// // import { SELECT_METADATA, type MazeMetaArray } from "@nadir/global-types";
// // import { MazeDB } from "./db/Database.js";
// import { MazeDBService } from "./service/service.js";

// import { MazeDB } from "./db/Database.js";

// const prog = MazeDBService.pipe(
// 	Effect.flatMap((service) => service.getAllMazes),
// 	// Effect.map(() => "Maze schema initialized"),
// 	Effect.provide(MazeDBService.Default),
// );

// Effect.runPromise(prog)
// 	.then((result) => console.log("Result:", result))
// 	.catch((error) => console.error("Error:", error));

export * from "./service/index.js";
export * from "./db/index.js";
