import fastify, { type FastifyInstance } from "fastify";

import cors from "@fastify/cors";
import { Effect, pipe } from "effect";

export interface HTTPServer {
	start: () => Effect.Effect<never, unknown, never>;
	register: (
		routes: (fastify: FastifyInstance) => Effect.Effect<void, never, never>,
	) => Effect.Effect<void, never, never>;
	server: () => FastifyInstance;
}

export const createServer = (): HTTPServer => {
	// Create a Fastify instance
	const server = fastify();

	// Register CORS plugin
	server.register(cors, { origin: "*" });

	//   registerUserRoutes(server);
	return {
		start: () =>
			Effect.async<never, unknown, never>((_resume) => {
				const port = Number(process.env.PORT || "8080");

				server.listen({ port }, (err, address) => {
					if (err) {
						console.error("Server error:", err);
						process.exit(1);
					}
					console.log(`Server listening on ${address}`);
					// Do not call resume, as the effect never completes
				});
			}),
		register: (routes) =>
			pipe(
				server,
				routes,
				Effect.tap(() => Effect.log("Routes registered successfully")),
			),
		server: () => server,
	};
};

export const HTTPServer = Effect.Service<HTTPServer>()("HTTPServer", {
	effect: Effect.succeed(createServer()),
});
