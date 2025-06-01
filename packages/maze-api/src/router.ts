import {
	ERROR_CODE,
	GET_ALL_MAZE_METADATA,
	GET_SELECTED_MAZE,
} from "@nadir/global-types";
import { MazeDBService } from "@nadir/maze-db";
import { Effect, pipe } from "effect";
import { type FastifyInstance, fastify } from "fastify";
import { HTTPServer } from "./server.js";

export const registerUserRoutes = (fastify: FastifyInstance) =>
	pipe(
		Effect.sync(() => {
			fastify.get("/", async (_, reply) => {
				reply.send([{ username: "demo", age: 99 }]);
			});
			fastify.get(GET_SELECTED_MAZE, async (request, reply) => {
				const { maze_id } = request.params as { maze_id: string };

				return RouterApp()
					.getMaze(maze_id)
					.then((maze) => {
						reply.send(maze);
					})
					.catch((error) => {
						console.error("Error fetching maze:", error);
						reply.status(500).send({ error: "Failed to fetch maze" });
					});
			});

			fastify.get(GET_ALL_MAZE_METADATA, async (_, reply) => {
				return RouterApp()
					.getAllMazes()
					.then((mazes) => {
						reply.send(mazes);
					})
					.catch(() => {
						reply
							.status(ERROR_CODE.INTERNAL_SERVER_ERROR)
							.send({ status: "error", error: "Failed to fetch all mazes" });
					});
			});
		}),
		Effect.map(() => fastify),
	);

const RouterApp = () => {
	return {
		getMaze: (mazeId: string) =>
			pipe(
				MazeDBService,
				Effect.flatMap((service) => service.getMazeById(mazeId)),
				Effect.provide(MazeDBService.Default),
				Effect.runPromise,
			),
		getAllMazes: () =>
			pipe(
				MazeDBService,
				Effect.flatMap((service) => service.getAllMazes),
				Effect.provide(MazeDBService.Default),
				Effect.runPromise,
			),
	};
};
