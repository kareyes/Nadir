import { MazeAPIService } from "$lib/api/maze.js";
import { Effect } from "effect";

export const load = ({ params }) => {
	return {
		maze: _loadMaze,
	};
};

export const _loadMaze = async () => {
	const api = MazeAPIService.pipe(
		Effect.map((mazeAPI) => mazeAPI.getAllMazes()),
		Effect.flatMap((mazes) => mazes),
		Effect.provide(MazeAPIService.Default),
		Effect.runPromise,
	);
	return api;
};

export const _loadPlayers = async () => {
	const api = MazeAPIService.pipe(
		Effect.map((mazeAPI) => mazeAPI.getAllPlayers()),
		Effect.flatMap((players) => players),
		Effect.provide(MazeAPIService.Default),
		Effect.runPromise,
	);
	return api;
};
