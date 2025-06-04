import {
	GET_ALL_MAZE_METADATA,
	GET_SELECTED_MAZE,
	MazeSchema,
	MetaArraySchema,
    type Maze,
    type MazeMetaArray,
} from "@nadir/global-types";
import { runGetRequest, runRequestWithParams } from "./helper.js";
import { Effect } from "effect";
import type { HttpClientError } from "@effect/platform/HttpClientError";
// import { getMaze } from "../components/menu.js";


// export interface APIService {
//     // getDataMaze: () => Effect.Effect<MazeMetaArray, HttpClientError, never>;
//     getMaze: (maze_id: string) => Effect.Effect<Maze, HttpClientError, never>;
// }

export const MazeAPILive = {
	getDataMaze: () => runGetRequest(GET_ALL_MAZE_METADATA, MetaArraySchema),
	getMaze: (maze_id: string) =>
		runRequestWithParams(GET_SELECTED_MAZE, { maze_id }, MazeSchema),
};


export const MazeAPIService = Effect.Service<typeof MazeAPILive>()("MazeAPIService", {
    dependencies: [],   
    effect: Effect.succeed(MazeAPILive),
});

