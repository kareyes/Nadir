import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { HTTPServer, createServer } from "../service/server.js";

import { Effect } from "effect";
import fastify, { type FastifyInstance } from "fastify";
import { MazeRoutes } from "../router/maze.js";

function buildFastify() {}

describe("Maze API Router Tests", () => {
	let server: FastifyInstance;

	beforeAll(async () => {
		server = fastify();

		server.get("/", (request, reply) => {
			reply.send([{ Hell: "Mazes", age: 99 }]);
		});

		return server;
		// server = createServer().server();
		// await server.register(MazeRoutes);
		// await server.listen({ port: 8080 }); // Use a random available port
	});

	afterAll(async () => {
		await server.close();
	});

	it("should respond to GET /", async () => {
		const response = await server.inject({
			method: "GET",
			url: "/",
		});
		expect(response.statusCode).toBe(200);
		console.log(response.json());
		expect(response.json()).toEqual([{ Hell: "Maze", age: 99 }]);
	});

	// it("should fetch all maze metadata", async () => {
	//     const response = await server.inject({
	//         method: "GET",
	//         url: "/get-all-maze-metadata",
	//     });
	//     expect(response.statusCode).toBe(200);
	//     expect(Array.isArray(response.json())).toBe(true);
	// });

	// it("should fetch a specific maze by ID", async () => {
	//     const mazeId = "test-maze-id"; // Replace with a valid maze ID
	//     const response = await server.inject({
	//         method: "GET",
	//         url: `/get-selected-maze/${mazeId}`,
	//     });
	//     expect(response.statusCode).toBe(200);
	//     expect(response.json()).toHaveProperty("id", mazeId);
	// });

	// it("should handle errors when fetching a non-existent maze", async () => {
	//     const response = await server.inject({
	//         method: "GET",
	//         url: "/get-selected-maze/non-existent-id",
	//     });
	//     expect(response.statusCode).toBe(500);
	//     expect(response.json()).toHaveProperty("error", "Failed to fetch maze");
	// });
});
