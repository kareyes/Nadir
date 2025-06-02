import {
	ERROR_CODE,
	GET_ALL_MAZE_METADATA,
	GET_SELECTED_MAZE,
} from "@nadir/global-types";
import { MazeDBService } from "@nadir/maze-db";
import { Effect, pipe } from "effect";
import type { FastifyInstance } from "fastify";

export const MazeRoutes = (server: FastifyInstance) =>
	pipe(
		Effect.sync(() => {
			server.get("/", async (_, reply) => {
				reply.send([{ Hell: "Maze", age: 99 }]);
			});
			server.get(GET_SELECTED_MAZE, async (request, reply) => {
				const { maze_id } = request.params as { maze_id: string };

				return Router.getMaze(maze_id)
					.then((maze) => {
						reply.send(maze);
					})
					.catch((error) => {
						console.error("Error fetching maze:", error);
						reply.status(500).send({ error: "Failed to fetch maze" });
					});
			});

			server.get(GET_ALL_MAZE_METADATA, async (_, reply) => {
				return Router.getAllMazes()
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
		Effect.map(() => server),
	);

const Router = {
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
