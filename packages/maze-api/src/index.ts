import { MazeDBService } from "@nadir/maze-db";
import { Effect, pipe } from "effect";
import { registerUserRoutes } from "./router.js";
// import { Router } from "./router.js";
import { HTTPServer } from "./server1.js";
// import { HttpServer } from "@effect/platform";
// import { createServer } from "./server1.js";
// import { registerUserRoutes } from "./router.js";
// import { create } from "domain";

// const prog = MazeDBService.pipe(
// 	Effect.flatMap((service) => service.getAllMazes),
// 	// Effect.map(() => "Maze schema initialized"),
// 	Effect.provide(MazeDBService.Default),
// );

// Effect.runPromise(prog)
// 	.then((result) => console.log("Result:", result))
// 	.catch((error) => console.error("Error:", error));

//  Router.pipe(
//     Effect.flatMap(server => server.start()),
//     Effect.tap(() => Effect.log("Maze API server started successfully")),
//     Effect.provide(HTTPServer.Default),
//     Effect.runPromise
// )

// export const startServer = () => {
//   return createServer()
//   .register(registerUserRoutes)

//   .start().pipe(
// 	Effect.tap(() => Effect.log("Maze API server started successfully")),
// 	Effect.provide(HTTPServer.Default),
// 	Effect.runPromise
//   );
// };

// createServer()
// 	.register(registerUserRoutes)
// 	.start()
// 	.pipe(
// 	  Effect.tap(() => Effect.log("Maze API server started successfully")),
// 	  Effect.provide(HTTPServer.Default),
// 	  Effect.runPromise
// 	);

// pipe(
// 	createServer(),
// 	registerUserRoutes,
// )

HTTPServer.pipe(
	Effect.tap((server) => server.register(registerUserRoutes)),
	Effect.tap((server) => server.start()),
	Effect.tap(() => Effect.log("Maze API server started successfully")),
	Effect.provide(HTTPServer.Default),
	Effect.runPromise,
);
