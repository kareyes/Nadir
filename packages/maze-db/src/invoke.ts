// import { Layer, Effect,pipe } from "effect"
// import { MazeDB, makeDB } from "./db/Database.js"
// import { initSchema, insertMaze, getAllMaze } from "./service/index.js"
// import type { DatabaseError, Maze } from '@nadir/global-types'
// import {mazeModel} from "./seed/maze1.js"

import { type MazeMetaArray, SELECT_METADATA } from "@nadir/global-types";
import { Effect, pipe } from "effect";
import { DatabaseService } from "./db/DB.js";
import { MazeDB } from "./db/Database.js";
import { MazeDBService, MazeDBServiceMock } from "./service/service.js";

// const main = Effect.gen(function* () {

//   yield* initSchema
//   yield* insertMaze(mazeModel)
//   const users = yield* getAllMaze
//   console.log("Users:", users)

// })

// const prog = pipe(
//     initSchema,
//     Effect.flatMap(() => getAllMaze),
//     Effect.provideService(MazeDB, makeDB()),

// )

// // Provide the DB service to the Effect runtime
// // const DBLayer = Layer.succeed(MazeDB, makeDB())

// // Effect.runPromise(main.pipe(Effect.provide(DBLayer)))
// //   .catch((err) => console.error("Error:", err))

// // const runnable = pipe(
// //     main,
// //     Effect.provideService(MazeDB, makeDB()),
// // )

// Effect.runPromise(prog)
//   .then((result) => console.log("Result:", result))
//   .catch((error: DatabaseError) => console.error("Error:", error));

// import { Effect, Layer, pipe } from "effect";
// import { LayerMazeDB, MazeDBService, parseValue } from "./service/index.js";
// import { makeDB, MazeDB } from "./db/Database.js";
// import {mazeModel} from "./seed/maze3.js";

// const main = pipe(
//   MazeDBService,
//   Effect.flatMap((service) =>
//     // service.insertMaze(mazeModel)
//     service.getMazeById("002")
//   ),
//   // Effect.tap((mazes) =>
//   //   console.log("Mazes:", ([...parseValue(mazeModel)]))
//   // ),
//   Effect.provide(LayerMazeDB),
//   Effect.provideService(MazeDB, makeDB())
// )

// Effect.runPromise(main).then((result) => console.log("Result:", result))

// const runtest = pipe(
//   DatabaseService,
//   Effect.flatMap((dbService) => dbService.all<MazeMetaArray>(SELECT_METADATA)),
//   Effect.provide(DatabaseService.Default)
// );

// Effect.runPromise(runtest)
//     .then((test) => console.log(test))

//     const test = pipe(
//       DatabaseService,
//       Effect.map((dbService) => ({
//         get: () =>
//           pipe(
//             dbService.all<MazeMetaArray>(SELECT_METADATA),
//             Effect.map((response) => response),
//             Effect.catchTag("DatabaseError", (error) => {
//               console.log("err", error);
//               return Effect.fail(error);
//             })
//           )
//       }))
//     );

//     pipe(
//       test,
//       Effect.flatMap((dbService) => dbService.get()),
//       Effect.provide(DatabaseService.Default)
//     )

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
