import type { Ref } from 'effect';
import type {
	CellSchema,
	CurrentPositionSchema,
	GamePlaySchema,
	GridSchema,
	MazeGameDataSchema,
	MazeMetaSchema,
	MetaArraySchema,
	ParseMazeSchema,
	PlayMovementSchema,
	ResponseMazeSchema,
	RowSchema,
	ParseMazeSchemArray,
} from '../schema/maze.js';

export type Cell = typeof CellSchema.Type;
export type Row = typeof RowSchema.Type;
export type Grid = typeof GridSchema.Type;
export type MazeMetaArray = typeof MetaArraySchema.Type;
export type MazeMeta = typeof MazeMetaSchema.Type;
export type ResponseMaze = typeof ResponseMazeSchema.Type;
export type Maze = typeof ParseMazeSchema.Type;
export type MazeArray = typeof ParseMazeSchemArray.Type;

export type GameState = {
	maze: Ref.Ref<MazeGameData>;
	currentPosition: Ref.Ref<CurrentPosition>;
};

export type GamePlayState = GameState & {
	playerMoves: CurrentPosition;
};

export type PlayMovement = typeof PlayMovementSchema.Type;

export type GamePlay = typeof GamePlaySchema.Type;

export type CurrentPosition = typeof CurrentPositionSchema.Type;

export type MazeGameData = typeof MazeGameDataSchema.Type;
