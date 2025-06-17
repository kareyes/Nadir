import {
	CREATE_PLAYER_TABLE,
	DELETE_PLAYER,
	type DatabaseError,
	INSERT_PLAYER,
	type PlayerData,
	type PlayerDataArray,
	PlayerDataArraySchema,
	PlayerDataSchema,
	SELECT_ALL_PLAYERS,
	SELECT_PLAYER,
} from "@nadir/global-types";
import { Effect, Schema, pipe } from "effect";
import { DatabaseService } from "../db/index.js";

export interface PlayerDBService {
	initPlayereSchema: Effect.Effect<unknown, DatabaseError, never>;
	insertPlayer: (
		player: PlayerData,
	) => Effect.Effect<unknown, DatabaseError, never>;
	getPlayerById: (
		playerID: string,
	) => Effect.Effect<PlayerData, DatabaseError, never>;
	getAllPlayers: Effect.Effect<PlayerDataArray, DatabaseError, never>;
	deletePlayer: (
		playerID: string,
	) => Effect.Effect<unknown, DatabaseError, never>;
}

const PlayerServiceImpl = (db: DatabaseService): PlayerDBService => ({
	initPlayereSchema: pipe(
		db.run(CREATE_PLAYER_TABLE),
		Effect.map(() => db),
	),
	insertPlayer: (player) =>
		pipe(
			db.run(INSERT_PLAYER, Object.values(player)),
			Effect.catchTag("DatabaseError", (error) => Effect.fail(error)),
		),
	getPlayerById: (playerID) =>
		pipe(
			db.get<PlayerData>(SELECT_PLAYER, [playerID]),
			Effect.map((res) => Schema.decodeUnknownSync(PlayerDataSchema)(res)),
			Effect.catchTag("DatabaseError", (error) => Effect.fail(error)),
		),

	getAllPlayers: pipe(
		db.all<PlayerDataArray>(SELECT_ALL_PLAYERS),
		Effect.map(
			(res) =>
				Schema.decodeUnknownSync(PlayerDataArraySchema)(res) as PlayerDataArray,
		),
		Effect.catchTag("DatabaseError", (error) => Effect.fail(error)),
	),
	deletePlayer: (playerID) =>
		pipe(
			db.run(DELETE_PLAYER, [playerID]),
			Effect.catchTag("DatabaseError", (error) => Effect.fail(error)),
		),
});

export const PlayerDBService = Effect.Service<PlayerDBService>()(
	"PlayerDBService",
	{
		dependencies: [DatabaseService.Default],
		effect: DatabaseService.pipe(Effect.map(PlayerServiceImpl)),
	},
);

// export const MazeDBServiceMock = Effect.Service<MazeDBService>()(
//     "MazeDBService",
//     {
//         dependencies: [DatabaseServiceMock],
//         effect: DatabaseService.pipe(Effect.map(MazeServiceImpl)),
//     },
// );
