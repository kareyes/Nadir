
import { type MazeMetaArray, SELECT_METADATA } from "@nadir/global-types";
import { Effect } from "effect";
import { MazeDBService, MazeDBServiceMock } from "../service/index.js";



const prog = MazeDBService.pipe(
	Effect.flatMap((service) => service.getAllMazes),
	// Effect.map(() => "Maze schema initialized"),
	Effect.provide(MazeDBService.Default),
);

Effect.runPromise(prog)
	.then((result) => console.log("Result:", result))
	.catch((error) => console.error("Error:", error));

// import { mazeModel as m1 } from "./seed/maze1.js";
// import { mazeModel as m2 } from "./seed/maze2.js";
// import { mazeModel as m3 } from "./seed/maze3.js";

//    const prog=  MazeDBServiceMock.pipe(
//         Effect.tap((service) => {
//             return pipe(
//                 service.initMazeSchema,
//                 Effect.flatMap(() => service.insertMaze(m1)),
//                 // Effect.flatMap(() => service.insertMaze(m2)),
//                 Effect.flatMap(() => service.insertMaze(m3)),
//             );
//         }),
//         Effect.andThen((service) => service.getAllMazes),
//         Effect.provide(MazeDBServiceMock.Default),

//     );

// Effect.runPromise(prog)
//   .then((result) => console.log("Result:", result))
//   .catch((error) => console.error("Error:", error));
