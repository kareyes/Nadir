// import { Effect, pipe } from "effect";
// import { beforeEach, describe, expect, it } from "vitest";
// import { mazeModel as m1 } from "../seed/maze1.js";
// import { mazeModel as m2 } from "../seed/maze2.js";
// import { mazeModel as m3 } from "../seed/maze3.js";
// import { MazeDBServiceMock } from "../service/maze.js";

// beforeEach(() => {
//     // Initialize the MazeDBService before each test
//     MazeDBServiceMock.pipe(
//         Effect.tap((service) => {
//             service.initMazeSchema
//             service.insertMaze(m1);
//             service.insertMaze(m2);
//             service.insertMaze(m3);
//         }),
//         Effect.provide(MazeDBServiceMock.Default),
//         Effect.runPromise,
//     );

//     MazeDBServiceMock.pipe(
//         Effect.tap((service) => {
//             return pipe(
//                 service.initMazeSchema,
//                 Effect.flatMap(() => service.insertMaze(m1)),
//                 Effect.flatMap(() => service.insertMaze(m2)),
//                 Effect.flatMap(() => service.insertMaze(m3)),
//             );
//         }),
//         Effect.andThen((service) => service.getAllMazes),
//         Effect.provide(MazeDBServiceMock.Default),
//         Effect.runPromise,

//     );
// });

// describe("MazeDBService", () => {
// 	it("should retrieve a maze by id", async () => {
// 		const test = MazeDBServiceMock.pipe(
// 			Effect.tap((service) => {
// 				return pipe(
// 					service.initMazeSchema,
// 					Effect.flatMap(() => service.insertMaze(m1)),
// 					Effect.flatMap(() => service.insertMaze(m2)),
// 					Effect.flatMap(() => service.insertMaze(m3)),
// 				);
// 			}),
// 			Effect.andThen((service) => service.getMazeById("002")),
// 			Effect.provide(MazeDBServiceMock.Default),
// 			// Effect.runPromise,
// 		);
// 		// const prog = MazeDBService.pipe(
// 		//     Effect.flatMap((service) => service.getMazeById("002")),
// 		//     Effect.provide(MazeDBService.Default),
// 		// );
// 		Effect.runPromise(test).then((result) => {
// 			expect(result).toBeDefined();
// 			expect(result?.maze_id).toBe("002");
// 		});
// 	});

// it("should return undefined for non-existent maze id", async () => {
//     const prog = MazeDBServiceMock.pipe(
//         Effect.flatMap((service) => service.getMazeById("non-existent-id")),
//         Effect.provide(MazeDBServiceMock.Default),
//     );
//     const result = await Effect.runPromise(prog);
//     expect(result).toBeUndefined();
// });

// // it("should retrieve all mazes", async () => {
// //     const prog = MazeDBService.pipe(
// //         Effect.flatMap((service) => service.getAllMazes),
// //         Effect.provide(MazeDBService.Default),
// //     );
// //     const result = await Effect.runPromise(prog);
// //     expect(Array.isArray(result)).toBe(true);
// //     expect(result.length).toBeGreaterThanOrEqual(0);
// // });

// // it("should handle errors gracefully", async () => {
// //     // Simulate error by passing invalid SQL or parameters if possible
// //     const prog = MazeDBService.pipe(
// //         Effect.flatMap((service) => service.getMazeById(undefined as never)),
// //         Effect.provide(MazeDBService.Default),
// //     );
// //     await expect(Effect.runPromise(prog)).rejects.toBeDefined();
// // });
// });
