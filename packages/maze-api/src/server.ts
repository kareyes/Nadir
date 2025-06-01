import cors from "@fastify/cors";
import { Effect, Layer } from "effect";
import {
	type FastifyInstance,
	type FastifyReply,
	type FastifyRequest,
	fastify,
} from "fastify";

export interface HTTPServer {
	start: () => Effect.Effect<never, unknown, never>;
	get: (
		path: string,
		handler: (req: FastifyRequest, res: FastifyReply) => void,
	) => void;
}

const HTTPServerLive = (): HTTPServer => {
	const server = fastify();
	server.register(cors, { origin: "*" });

	return {
		start: () =>
			Effect.async<never, unknown, never>((_resume) => {
				const port = Number(process.env.PORT || "8080");
				server.listen({ port, host: "0.0.0.0" }, (err, address) => {
					if (err) {
						console.error("Server error:", err);
						process.exit(1);
					}
					console.log(`Server listening on ${address}`);
					// Do not call resume, as the effect never completes
				});
			}),
		get: (path, handler) => {
			server.get(path, handler);
		},
	};
};

export const HTTPServer = Effect.Service<HTTPServer>()("HTTPServer", {
	effect: Effect.succeed(HTTPServerLive()),
});
