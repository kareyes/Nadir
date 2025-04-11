import { DatabaseSync, type SupportedValueType } from 'node:sqlite';
import { Effect, pipe } from 'effect';
import { DatabaseError } from '../constant.js';
// import { DatabaseError }  from '../constant';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

const DBMaze = `${__dirname}/maze.db`;
const DBMazeClient = Effect.succeed(() => {
    const client = new DatabaseSync(DBMaze);
    return client

});

export class DatabaseService extends Effect.Service<DatabaseService>()(
  'DatabaseService',
  {
    effect: Effect.gen(function* () {
      return {
        run: (sql: string, params: SupportedValueType[]) =>
          pipe(
            DBMazeClient,
            Effect.map((db) => {
              const stmt = db().prepare(sql);
              stmt.run(...params);
            }),
            Effect.catchAll((e) => Effect.fail(new DatabaseError(e))),
          ),
        get: <T>(sql: string, params: SupportedValueType[]) =>
          pipe(
            DBMazeClient,
            Effect.map((db) => {
              const stmt = db().prepare(sql);
                  return stmt.get(...params
              ) as T;;
            }),
            Effect.catchAll((e) => Effect.fail(new DatabaseError(e))),
          ),
        all: <T>(sql: string, params: SupportedValueType[]) =>
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





