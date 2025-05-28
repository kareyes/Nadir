import { Schema } from 'effect';

export const CellSchema = Schema.Boolean;
// export type Cell = typeof CellSchema.Type;

export const RowSchema = Schema.Array(CellSchema);
// export type Row = typeof RowSchema.Type;

export const GridSchema = Schema.Struct({
	vertical: RowSchema,
	horizontal: RowSchema,
});
// export type Grid = typeof GridSchema.Type;

export const MazeMetaSchema = Schema.Struct({
	maze_id: Schema.String,
	mazeName: Schema.String,
	description: Schema.String,
	created_at: Schema.String,
});

export const MetaArraySchema = Schema.Array(MazeMetaSchema);

export const MazeSchema = Schema.Struct({
	...MazeMetaSchema.fields,
	numCols: Schema.Number,
	numRows: Schema.Number,
	grid: Schema.Array(GridSchema),
});

export const ResponseMazeSchema = MazeSchema.omit('grid').pipe(
	Schema.extend(Schema.Struct({ grid: Schema.String })),
);

export const ParseMazeSchema = Schema.transform(
	ResponseMazeSchema,
	MazeSchema,
	{
		encode: (maze) => ({
			...maze,
			grid: JSON.stringify(maze.grid),
		}),
		decode: (rawMaze) => ({
			...rawMaze,
			grid: JSON.parse(rawMaze.grid),
		}),
	},
);

export const ParseMazeSchemArray = Schema.Array(ParseMazeSchema);

// export type Maze = typeof ParseMazeSchema.Type;

export const CurrentPositionSchema = Schema.Struct({
	x: Schema.Number,
	y: Schema.Number,
});

export const GamePlaySchema = Schema.Struct({
	maze: MazeSchema,
	currentPosition: CurrentPositionSchema,
	playerMoves: CurrentPositionSchema,
});

export const PlayMovementSchema = Schema.Struct({
	dx: Schema.Number,
	dy: Schema.Number,
	currentX: Schema.Number,
	currentY: Schema.Number,
	maze: MazeSchema,
});

export const MazeGameDataSchema = Schema.Struct({
	maze: MazeSchema,
	player: Schema.String,
	gameMode: Schema.String,
});
// export type MazeGameData = typeof MazeGameDataSchema.Type;
