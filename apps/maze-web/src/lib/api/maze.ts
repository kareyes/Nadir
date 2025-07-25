import {
	GET_ALL_MAZE,
	GET_ALL_MAZE_METADATA,
	GET_ALL_PLAYERS,
	GET_SELECTED_MAZE,
	MazeArraySchema,
	MazeSchema,
	MetaArraySchema,
	POST_MAZE,
	PlayerDataArraySchema,
} from "@nadir/global-types";
import { Effect } from "effect";
import {
	runGetRequest,
	runPostRequest,
	runRequestWithParams,
} from "../helper/run.js";

export const MazeAPILive = {
	getDataMaze: () => runGetRequest(GET_ALL_MAZE_METADATA, MetaArraySchema),
	getMaze: (maze_id: string) =>
		runRequestWithParams(GET_SELECTED_MAZE, { maze_id }, MazeSchema),
	getAllMazes: () => runGetRequest(GET_ALL_MAZE, MazeArraySchema),
	getAllPlayers: () => runGetRequest(GET_ALL_PLAYERS, PlayerDataArraySchema),
	createMaze: (mazeData: unknown) => runPostRequest(POST_MAZE, mazeData),
};

export const MazeAPIService = Effect.Service<typeof MazeAPILive>()(
	"MazeAPIService",
	{
		dependencies: [],
		effect: Effect.succeed(MazeAPILive),
	},
);
