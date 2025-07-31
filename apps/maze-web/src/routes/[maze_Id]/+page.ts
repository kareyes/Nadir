import { MazeAPIService } from "$lib/api/maze";
import { Effect } from "effect";

export const load = ({ params }) => {
	const { maze_Id } = params;
	return {
		maze: _getCurrentMaze(maze_Id),
	};
};

export const _getCurrentMaze = (maze_Id: string) => async () => {
	const api = MazeAPIService.pipe(
		Effect.map((mazeAPI) => mazeAPI.getMaze(maze_Id)),
		Effect.flatMap((mazes) => mazes),
		Effect.provide(MazeAPIService.Default),
		Effect.runPromise,
	);
	return api;
};
