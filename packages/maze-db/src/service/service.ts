import { CREATE_MAZE_TABLE, DELETE_MAZE, INSERT_MAZE, MetaArraySchema, ParseMazeSchema, ParseMazeSchemArray, SELECT_ALL_MAZE, SELECT_METADATA, SELECTED_MAZE, type DatabaseError, type Maze, type MazeArray, type MazeMetaArray, type ResponseMaze } from "@nadir/global-types";
import { Effect,  Layer,  pipe, Schema } from "effect";
import { DatabaseService, DatabaseServiceImp, DatabaseServiceMock } from "../db/DB.js";


export interface MazeDBService {
  initMazeSchema: Effect.Effect<unknown, DatabaseError, never>;
  insertMaze: (maze: ResponseMaze) => Effect.Effect<unknown, DatabaseError, never>;
  getMazeById: (maze_id: string) => Effect.Effect<Maze, DatabaseError, never>;
  getMetadata: Effect.Effect<MazeMetaArray, DatabaseError, never>;
  getAllMazes: Effect.Effect<MazeArray, DatabaseError, never>;
  deleteMaze: (maze_id: string) => Effect.Effect<unknown, DatabaseError, never>;
}


// Implementation
const MazeServiceImpl = (db: DatabaseService):MazeDBService => ({
  initMazeSchema: db.run(CREATE_MAZE_TABLE),
  insertMaze: (maze) =>
    pipe(
      db.run(INSERT_MAZE, Object.values(maze)),
      Effect.catchTag("DatabaseError", (error) => Effect.fail(error))
    ),
  getMazeById: (maze_id) =>
    pipe(
      db.get<ResponseMaze>(SELECTED_MAZE, [maze_id]),
      Effect.map((res) => Schema.decodeUnknownSync(ParseMazeSchema)(res)),
      Effect.catchTag("DatabaseError", (error) => Effect.fail(error))
    ),
  getMetadata: pipe(
    db.all<MazeMetaArray>(SELECT_METADATA),
    Effect.map((res) => Schema.decodeUnknownSync(MetaArraySchema)(res) as MazeMetaArray),
    Effect.catchTag("DatabaseError", (error) => Effect.fail(error))
  ),
  getAllMazes: pipe(
    db.all<ResponseMaze>(SELECT_ALL_MAZE),
    Effect.map((res) => Schema.decodeUnknownSync(ParseMazeSchemArray)(res) as MazeArray),
    Effect.catchTag("DatabaseError", (error) => Effect.fail(error))
  ),
  deleteMaze: (maze_id) =>
    pipe(
      db.run(DELETE_MAZE, [maze_id]),
      Effect.catchTag("DatabaseError", (error) => Effect.fail(error))
    )
});




export const MazeDBService = Effect.Service<MazeDBService>()(
    'MazeDBService',
    {
        dependencies: [DatabaseService.Default],
        effect: DatabaseService.pipe(Effect.map(MazeServiceImpl)),
    },
)


export const MazeDBServiceMock  = Effect.Service<MazeDBService>()(
    'MazeDBService',
    {
        dependencies: [DatabaseServiceMock],
        effect: DatabaseService.pipe(Effect.map(MazeServiceImpl)),
    },
)
