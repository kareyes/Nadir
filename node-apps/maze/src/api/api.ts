import {
	GET_ALL_MAZE_METADATA,
	GET_SELECTED_MAZE,
	MazeSchema,
	MetaArraySchema,
} from "@nadir/global-types";
import { Effect } from "effect";
import { runGetRequest, runRequestWithParams } from "./helper.js";


export const MazeAPILive = {
	getDataMaze: () => runGetRequest(GET_ALL_MAZE_METADATA, MetaArraySchema),
	getMaze: (maze_id: string) =>
		runRequestWithParams(GET_SELECTED_MAZE, { maze_id }, MazeSchema),
};

export const MazeAPIService = Effect.Service<typeof MazeAPILive>()(
	"MazeAPIService",
	{
		dependencies: [],
		effect: Effect.succeed(MazeAPILive),
	},
);
