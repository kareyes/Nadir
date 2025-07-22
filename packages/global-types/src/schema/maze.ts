import { Schema } from "effect";

export const CellSchema = Schema.Boolean;

export const RowSchema = Schema.Array(CellSchema);

export const GridSchema = Schema.Struct({
	vertical: RowSchema,
	horizontal: RowSchema,
});

export const MazeMetaSchema = Schema.Struct({
	maze_id: Schema.String,
	mazeName: Schema.String,
	level: Schema.Union(Schema.Literal(1), Schema.Literal(2), Schema.Literal(3)),
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

export const MazeArraySchema = Schema.Array(MazeSchema);

export const ResponseMazeSchema = MazeSchema.omit("grid").pipe(
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

export const CoordinateSchema = Schema.Struct({
	x: Schema.Number,
	y: Schema.Number,
});

export const ParseMazeSchemArray = Schema.Array(ParseMazeSchema);

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
