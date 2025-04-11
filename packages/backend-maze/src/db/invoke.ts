import { Effect } from "effect";
// import * as Maze1 from "../seed/maze1.js";
// import * as Maze2 from "../seed/maze2.js";
// import * as Maze3 from "../seed/maze3.js";
// import { DatabaseService } from "./index.js";
import { MazeDBServices } from "../service/index.js";




export const SELECTED_MAZE  = "SELECT * FROM mazes WHERE maze_id = ?";
export const SELECT_METADATA = "SELECT maze_id, mazeName, description, created_at FROM mazes";


const prog = Effect.gen(function* () {
    const db = yield* MazeDBServices;
    const maze = yield* db.getMetadata();

    // console.log(getMaze);
    return maze;
}).pipe(
    Effect.provide(MazeDBServices.Default)
)

Effect.runPromise(prog).then(console.log)