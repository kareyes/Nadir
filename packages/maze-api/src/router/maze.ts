import {
	ERROR_CODE,
	GET_ALL_MAZE,
	GET_ALL_MAZE_METADATA,
	GET_SELECTED_MAZE,
	POST_MAZE,
	type ResponseMaze,
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

			server.post(POST_MAZE, async (request, reply) => {
				const mazeData = request.body as ResponseMaze;

				return Router.createMaze(mazeData)
					.then((result: unknown) => {
						reply.status(201).send({
							status: "success",
							message: "Maze created successfully",
							data: result,
						});
					})
					.catch((error: unknown) => {
						console.error("Error creating maze:", error);
						reply
							.status(ERROR_CODE.INTERNAL_SERVER_ERROR)
							.send({ status: "error", error: "Failed to create maze" });
					});
			});

			server.get(GET_ALL_MAZE_METADATA, async (_, reply) => {
				return Router.getAllMetaData()
					.then((mazes) => {
						reply.send(mazes);
					})
					.catch(() => {
						reply
							.status(ERROR_CODE.INTERNAL_SERVER_ERROR)
							.send({ status: "error", error: "Failed to fetch maze metada" });
					});
			});

			server.get(GET_ALL_MAZE, async (_, reply) => {
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
	createMaze: (mazeData: ResponseMaze) =>
		pipe(
			MazeDBService,
			Effect.flatMap((service) => service.insertMaze(mazeData)),
			Effect.provide(MazeDBService.Default),
			Effect.runPromise,
		),
	getAllMetaData: () =>
		pipe(
			MazeDBService,
			Effect.flatMap((service) => service.getMetadata),
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

// const MockRouter = {
// 	getMaze: (mazeId: string) =>
// 		Promise.resolve({
// 			id: mazeId,
// 			name: "Mock Maze",
// 			description: "This is a mock maze for testing purposes.",
// 			createdAt: new Date().toISOString(),
// 			updatedAt: new Date().toISOString(),
// 			// Add other necessary fields as per your schema
// 		}),
// 	getAllMetaData: () =>
// 		Promise.resolve([
// 			{
// 				id: "mock-maze-1",
// 				name: "Mock Maze 1",
// 				description: "This is the first mock maze.",
// 				createdAt: new Date().toISOString(),
// 				updatedAt: new Date().toISOString(),
// 				// Add other necessary fields as per your schema
// 			},
// 			{
// 				id: "mock-maze-2",
// 				name: "Mock Maze 2",
// 				description: "This is the second mock maze.",
// 				createdAt: new Date().toISOString(),
// 				updatedAt: new Date().toISOString(),
// 				// Add other necessary fields as per your schema
// 			},
// 			// Add more mock mazes as needed
// 		]),
// };
