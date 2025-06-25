import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { DatabaseError } from "@nadir/global-types";
import { Effect, pipe } from "effect";
// import

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';
// const dirName = path.dirname(location);

// console.log('dirname', fs.existsSync(__dirname));
// export interface DatabaseService {
//   getDB: Effect.Effect<unknown, never, DatabaseSync>;
//   closeAll: Effect.Effect<unknown, never, void>;
//   run: (
//     sql: string,
//     params: SupportedValueType[],
//   ) => Effect.Effect<unknown, never, void>;
//   get: <T>(
//     sql: string,
//     params: SupportedValueType[],
//   ) => Effect.Effect<unknown, never, T>;
//   all: <T>(
//     sql: string,
//     params: SupportedValueType[],
//   ) => Effect.Effect<unknown, never, T[]>;
// }

const DBMaze = `${__dirname}/data.sqlite`;
const DBMazeClient = Effect.succeed(() => {
	const client = new DatabaseSync(DBMaze);
	return client;
});

// const builder = {

// 	buildVerticalRow: (vertical: string ) =>
// 		pipe(
// 			Effect.succeed(vertical)

// 		),}

// export const BuilderMaze = Context.Tag('BuilderMaze')<
// 	BuilderMaze,
// 	typeof builder
// >();

// export const BuilderMazeLive = Layer.succeed(
// 	BuilderMaze,
// 	builder,
// );

export class DatabaseService extends Effect.Service<DatabaseService>()(
	"DatabaseService",
	{
		effect: Effect.gen(function* () {
			return {
				run: (sql: string, params: SQLInputValue[]) =>
					pipe(
						DBMazeClient,
						Effect.map((db) => {
							const stmt = db().prepare(sql);
							stmt.run(...params);
						}),
						Effect.catchAll((e) => Effect.fail(new DatabaseError(e))),
					),
				get: <T>(sql: string, params: SQLInputValue[]) =>
					pipe(
						DBMazeClient,
						Effect.map((db) => {
							const stmt = db().prepare(sql);
							return stmt.get(...params) as T;
						}),
						Effect.catchAll((e) => Effect.fail(new DatabaseError(e))),
					),
				all: <T>(sql: string, params: SQLInputValue[]) =>
					pipe(
						DBMazeClient,
						Effect.map((db) => {
							const stmt = db().prepare(sql);
							return stmt.all(...params) as T[];
						}),
						Effect.catchAll((e) => Effect.fail(new DatabaseError(e))),
					),
			};
		}),
	},
) {}
