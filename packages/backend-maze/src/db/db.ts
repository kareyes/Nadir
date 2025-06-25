// import { DatabaseService } from "./index.js";
// import { DatabaseError } from "@nadir/global-types";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import {
	type DatabaseError,
	GET_ALL_MAZE_METADATA,
	type MazeMetaArray,
	SELECT_METADATA,
} from "@nadir/global-types";
// import { describe, it, expect } from "vitest";
import { Data, Effect, pipe } from "effect";

// // Mocking the DatabaseService for testing
// // Note: In a real-world scenario, you might want to use a mocking library or framework
// // to create a more sophisticated mock of the DatabaseService.
// // This is a simple mock for demonstration purposes.
// // Mocking the runPromise function to simulate database operations

// const runPromise = <T>(effect: Effect.Effect<T, DatabaseError, never>) => {
//   return Effect.runPromise(effect).catch((error) => {
//     throw new DatabaseError(error.message);
//   });
// };

// // Mocking the DatabaseService for testing
// export class DatabaseService {
//   async run(sql: string, params: SQLInputValue[] = []): Promise<void> {
//     return runPromise(
//       Effect.tryPromise({
//         try: () => {
//           const db = new DatabaseSync("test.db");
//           db.prepare(sql).run(...params);
//         },
//         catch: (e) => new DatabaseError(e.message),
//       })
//     );
//   }
//   async get<T>(sql: string, params: SQLInputValue[] = []): Promise<T | undefined> {
//     return runPromise(
//       Effect.tryPromise({
//         try: () => {
//           const db = new DatabaseSync("test.db");
//           return db.prepare(sql).get(...params) as T | undefined;
//         },
//         catch: (e) => new DatabaseError(e.message),
//       })
//     );
//   }
//   async all<T>(sql: string, params: SQLInputValue[] = []): Promise<T[]> {
//     return runPromise(
//       Effect.tryPromise({
//         try: () => {
//           const db = new DatabaseSync("test.db");
//           return db.prepare(sql).all(...params) as T[];
//         },
//         catch: (e) => new DatabaseError(e.message),
//       })
//     );
//   }
//   }

// describe("DatabaseService", () => {
//   const dbService = new DatabaseService();

//   it("should insert and retrieve a row", async () => {
//     const createTableSQL = `CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, name TEXT)`;
//     const insertSQL = `INSERT INTO test_table (name) VALUES (?)`;
//     const selectSQL = `SELECT * FROM test_table WHERE name = ?`;

//     // Create table
//     await runPromise(
//       dbService.run(createTableSQL, [])
//     );

//     // Insert row
//     await runPromise(
//       dbService.run(insertSQL, ["Alice"])
//     );

//     // Retrieve row
//     const result = await runPromise(
//       dbService.get<{ id: number; name: string }>(selectSQL, ["Alice"])
//     );

//     expect(result).toBeDefined();
//     expect(result?.name).toBe("Alice");
//   });

//   it("should return all rows", async () => {
//     const selectAllSQL = `SELECT * FROM test_table`;

//     const rows = await runPromise(
//       dbService.all<{ id: number; name: string }>(selectAllSQL, [])
//     );

//     expect(Array.isArray(rows)).toBe(true);
//     expect(rows.length).toBeGreaterThan(0);
//   });

//   it("should handle SQL errors gracefully", async () => {
//     const badSQL = `SELECT * FROM non_existing_table`;

//     await expect(
//       runPromise(dbService.get(badSQL, []))
//     ).rejects.toBeInstanceOf(DatabaseError);
//   });
// });

export interface DatabaseService {
	run: (
		sql: string,
		params?: SQLInputValue[],
	) => Effect.Effect<unknown, DatabaseError, never>;
	get: <T>(
		sql: string,
		params: SQLInputValue[],
	) => Effect.Effect<T, DatabaseError, never>;
	all: <T>(sql: string) => Effect.Effect<T, DatabaseError, never>;
}

export const DatabaseServiceImp = (): DatabaseService => {
	const db = new DatabaseSync("data.sqlite");
	return {
		get: <T>(sql: string, params: SQLInputValue[]) =>
			Effect.tryPromise({
				try: () => Promise.resolve(db.prepare(sql).get(...params) as T),
				catch: (e) => e as DatabaseError,
			}),
		all: <T>(sql: string) =>
			Effect.tryPromise({
				try: () => Promise.resolve(db.prepare(sql).all() as T),
				catch: (e) => e as DatabaseError,
			}),
		run: (sql, params) =>
			Effect.tryPromise({
				try: () => Promise.resolve(db.prepare(sql).run(...(params ?? []))),
				catch: (e) => e as DatabaseError,
			}),
	};
};

const DBServiceLive = Effect.succeed(DatabaseServiceImp());

export const DBService = Effect.Service<DatabaseService>()("DatabaseService", {
	effect: Effect.succeed(DatabaseServiceImp()),
});

// Example usage of the DatabaseService
// const SELECT_METADATA = GET_ALL_MAZE_METADATA;
// const SELECTED_MAZE = "SELECT * FROM mazes WHERE id = ?";
// const DatabaseService = Effect.provide(DBService, DBServiceLive);

// const runTest = pipe(
//     DBService,
//     Effect.map((dbService:DatabaseService) => {
//         return dbService.all<MazeMetaArray>(SELECT_METADATA).pipe(
//             Effect.map((result) => {
//                 console.log("Retrieved metadata:", result);
//                 return result;
//             }),
//         )
//         // dbService.run("CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, name TEXT)", [])
//     }),
//     // Effect.flatMap((result) => {
//     //     console.log("Result:", result);
//     //     return Effect.succeed(result);
//     // }),
//     Effect.provide(DBService.Default),
// )

const runtest = Effect.gen(function* () {
	const dbService = yield* DBService;
	const result = yield* dbService.all<MazeMetaArray>(SELECT_METADATA);
	console.log("Retrieved metadata:", result);
	return result;
}).pipe(Effect.provide(DBService.Default));

Effect.runPromise(runtest).then((test) => console.log(test));
// .catch((error: DatabaseError) => console.error("Error creating test table:", error));
