
import { Effect } from "effect";
import { MazeAPIService } from "$lib/api/maze.js";


export const load = ({ params }) => {
    return {
        post: {
            title: `Title for ${params} goes here`,
            // content: `Content for ${params.slug} goes here`
        },
        maze: _loadMaze,
        players: _loadPlayers
    };
};

export const _loadMaze = async () =>{
    const api = MazeAPIService.pipe(
        Effect.map((mazeAPI) => mazeAPI.getAllMazes()),
        Effect.flatMap((mazes) => mazes),
        Effect.provide(MazeAPIService.Default),
        Effect.runPromise
    )
    return api;
}

export const _loadPlayers = async () => {
    const api = MazeAPIService.pipe(
        Effect.map((mazeAPI) => mazeAPI.getAllPlayers()),
        Effect.flatMap((players) => players),
        Effect.provide(MazeAPIService.Default),
        Effect.runPromise
    )
    return api;
}