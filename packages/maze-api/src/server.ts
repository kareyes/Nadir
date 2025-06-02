import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { Effect, pipe } from "effect";

export interface HTTPServer {
	start: () => Effect.Effect<never, unknown, never>;
	register: (
		routes: (fastify: FastifyInstance) => Effect.Effect<void, never, never>,
	) => Effect.Effect<void, never, never>;
	server: () => FastifyInstance;
	process: () => void;
}

export const createServer = (): HTTPServer => {
	const server = fastify();
	server.register(cors, { origin: "*" });

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
			
		process: () => {
			Effect.sync(() => {
				process.on("SIGINT", () => {
					console.log("SIGINT signal received: closing HTTP server");
					server.close(() => {
						console.log("HTTP server closed");
						process.exit(0);
					});
				});
				process.on("SIGTERM", () => {
					console.log("SIGTERM signal received: closing HTTP server");
					server.close(() => {
						console.log("HTTP server closed");
						process.exit(0);
					});
				});
			});
		},
		server: () => server,
	};
};

export const HTTPServer = Effect.Service<HTTPServer>()("HTTPServer", {
	effect: Effect.succeed(createServer()),
});
