
import { Effect } from "effect";
import { MazeRoutes } from "./router.js";
import { HTTPServer } from "./server.js";


HTTPServer.pipe(
	Effect.tap((server) => server.register(MazeRoutes)),
	Effect.tap((server) => server.process()),
	Effect.tap((server) => server.start()),
	Effect.provide(HTTPServer.Default),
	Effect.runPromise,
);
