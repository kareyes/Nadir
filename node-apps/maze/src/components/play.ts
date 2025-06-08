import { Effect } from "effect";
import { MazeAPIService } from "../api/index.js";
import { solveMaze } from "./gameplay.js";


MazeAPIService.pipe(
    Effect.flatMap((mazeAPI) => {
        return mazeAPI.getMaze("001").pipe(
            Effect.map((maze) => {
                console.log("Maze Data:", maze);
                const sol = solveMaze(maze)
                console.log("Solved Maze:", sol);
            })
        );
    }
    ),
    Effect.provide(MazeAPIService.Default),
    Effect.runPromise,
)