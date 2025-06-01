import {
	CREATE_MAZE_TABLE,
	DELETE_MAZE,
	type DatabaseError,
	INSERT_MAZE,
	type Maze,
	type MazeArray,
	type MazeMetaArray,
	MetaArraySchema,
	ParseMazeSchemArray,
	ParseMazeSchema,
	type ResponseMaze,
	SELECTED_MAZE,
	SELECT_ALL_MAZE,
	SELECT_METADATA,
} from "@nadir/global-types";
import { Context, Effect, Layer, Schema, pipe } from "effect";
import { MazeDB, MazeDBLive, makeDB } from "../db/Database.js";

// Define the MazeService interface
export interface MazeDBService {
	initMazeSchema: Effect.Effect<unknown, DatabaseError, void>;
	insertMaze: (
		maze: ResponseMaze,
	) => Effect.Effect<unknown, DatabaseError, never>;
	getMazeById: (maze_id: string) => Effect.Effect<Maze, DatabaseError, never>;
	getMetadata: Effect.Effect<MazeMetaArray, DatabaseError, never>;
	getAllMazes: Effect.Effect<MazeArray, DatabaseError, never>;
	deleteMaze: (maze_id: string) => Effect.Effect<unknown, DatabaseError, never>;
}

// Helper
export function parseValue<T = unknown>(obj: Record<string, T>): T[] {
	return Object.values(obj);
}

// Implementation
const MazeServiceImpl = (db: MazeDB): MazeDBService => ({
	initMazeSchema: db.run(CREATE_MAZE_TABLE),
	insertMaze: (maze) =>
		pipe(
			db.run(INSERT_MAZE, parseValue(maze)),
			Effect.catchTag("DatabaseError", (error) => Effect.fail(error)),
		),
	getMazeById: (maze_id) =>
		pipe(
			db.get<ResponseMaze>(SELECTED_MAZE, [maze_id]),
			Effect.map((res) => Schema.decodeUnknownSync(ParseMazeSchema)(res)),
			Effect.catchTag("DatabaseError", (error) => Effect.fail(error)),
		),
	getMetadata: pipe(
		db.all<MazeMetaArray>(SELECT_METADATA),
		Effect.map(
			(res) => Schema.decodeUnknownSync(MetaArraySchema)(res) as MazeMetaArray,
		),
		Effect.catchTag("DatabaseError", (error) => Effect.fail(error)),
	),
	getAllMazes: pipe(
		db.all<ResponseMaze>(SELECT_ALL_MAZE),
		Effect.map(
			(res) => Schema.decodeUnknownSync(ParseMazeSchemArray)(res) as MazeArray,
		),
		Effect.catchTag("DatabaseError", (error) => Effect.fail(error)),
	),
	deleteMaze: (maze_id) =>
		pipe(
			db.run(DELETE_MAZE, [maze_id]),
			Effect.catchTag("DatabaseError", (error) => Effect.fail(error)),
		),
});

// Tag for DI
export const MazeDBService = Context.Tag("MazeDBService")<
	MazeDBService,
	MazeDBService
>();

// Layer
export const MazeServiceLayer = Layer.effect(
	MazeDBService,
	pipe(MazeDB, Effect.map(MazeServiceImpl)),
);

export const LayerMazeDB = Layer.merge(MazeDBLive, MazeServiceLayer);

// Usage example:
const prog = Effect.flatMap(MazeDBService, (svc) => svc.getAllMazes).pipe(
	Effect.provide(MazeServiceLayer),
	// Effect.provideService(MazeDB, makeDB()),
);
