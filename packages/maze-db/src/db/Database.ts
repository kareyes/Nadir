import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { Context, Effect, Layer } from "effect";
import type { DatabaseError } from '@nadir/global-types';

export interface MazeDB {
  run: (
    sql: string,
    params?: SQLInputValue[],
  ) => Effect.Effect<unknown, DatabaseError, never>;
  get: <T>(
    sql: string,
    params: SQLInputValue[],
  ) => Effect.Effect<T, DatabaseError, never>;
  all: <T>(
    sql: string,
  ) => Effect.Effect<T[], DatabaseError, never>;
}


export const makeDB = (): MazeDB => {
  const db = new DatabaseSync("data.sqlite");
  return {
    get: <T>(sql: string, params: SQLInputValue[]) => Effect.tryPromise({
      try: () => Promise.resolve(db.prepare(sql).get(...params) as T),
      catch: (e) => e as DatabaseError
    }),
    all: <T>(sql: string) => Effect.tryPromise({
      try: () => Promise.resolve(db.prepare(sql).all() as T[]),
      catch: (e) => e as DatabaseError
    }),
    run: (sql, params) => Effect.tryPromise({
      try: () => Promise.resolve(db.prepare(sql).run(...(params ?? []))),
      catch: (e) => e as DatabaseError
    }),
  };
};

export const MazeDB = Context.Tag("MazeDB")<MazeDB, MazeDB>();
// Layer version
export const MazeDBLive = Layer.succeed(MazeDB, makeDB());


// const prog = Effect.gen(function* () {
//   const db = yield* MazeDB;
//   const mazes = yield* db.all<{ id: number; name: string }>("SELECT * FROM mazes");
//   console.log("Mazes:", mazes);
// }
// ).pipe(
//   Effect.provide(MazeDBLive),
//   Effect.catchTag("DatabaseError", (error) => {
//     console.error("Database Error:", error);
//     return Effect.fail(error);
//   })
// );

// Effect.runPromise(prog)
//   .then((result) => console.log("Result:", result))
//   .catch((error: DatabaseError) => console.error("Error:", error));
