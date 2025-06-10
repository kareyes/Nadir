import type{  Schema , Ref } from 'effect';
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
export interface Row extends Schema.Schema.Type<typeof RowSchema> {}
export interface Grid extends Schema.Schema.Type<typeof GridSchema> {}
export interface MazeMetaArray extends Schema.Schema.Type<typeof MetaArraySchema> {}
export interface MazeMeta extends Schema.Schema.Type<typeof MazeMetaSchema> {}
export interface ResponseMaze extends Schema.Schema.Type<typeof ResponseMazeSchema> {}
export interface Maze extends Schema.Schema.Type<typeof ParseMazeSchema> {}
export interface MazeArray extends Schema.Schema.Type<typeof ParseMazeSchemArray> {}

export type GameState = {
	maze: Ref.Ref<MazeGameData>;
	currentPosition: Ref.Ref<CurrentPosition>;
};

export type GamePlayState = GameState & {
	playerMoves: CurrentPosition;
};

export interface PlayMovement extends Schema.Schema.Type<typeof PlayMovementSchema> {}
export interface GamePlay extends Schema.Schema.Type<typeof GamePlaySchema> {};
export interface CurrentPosition extends Schema.Schema.Type<typeof CurrentPositionSchema> {}
export interface MazeGameData extends Schema.Schema.Type<typeof MazeGameDataSchema> {}

export type MazePath = CurrentPosition & {
	path: Array<CurrentPosition>;
};


export type Automove = {
	x : number;
	y : number;
	maze: Maze;
}



	