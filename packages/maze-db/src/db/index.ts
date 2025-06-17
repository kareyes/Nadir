import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import type { DatabaseError } from "@nadir/global-types";
import { Effect, Layer } from "effect";
// import { findMoonrepoRoot } from "../util/index.js";

// const root = findMoonrepoRoot();

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

export const DatabaseServiceImp = (loc: string): DatabaseService => {
	const db = new DatabaseSync(loc);
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

export const DatabaseService = Effect.Service<DatabaseService>()(
	"DatabaseService",
	{
		effect: Effect.succeed(DatabaseServiceImp("data.sqlite")),
	},
);

export const DatabaseServiceMock = Layer.succeed(
	DatabaseService,
	DatabaseServiceImp(":memory:"),
);
