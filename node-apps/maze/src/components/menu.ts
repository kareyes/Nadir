import { select } from "@inquirer/prompts";
import { MazeGameDataSchema, type MazeMetaArray } from "@nadir/global-types";
import { Effect, Layer, Ref, Schema, pipe } from "effect";
import { MazeAPIService } from "../api/api.js";
import { MazeDataState, playerSymbols, RawData } from "../constant.js";

const promptMazeOptions = (maze: MazeMetaArray) =>
	Effect.promise(() =>
		select({
			message: "Choose your labyrinth tier:",
			choices: maze.map((m) => ({
				name: m.mazeName,
				value: m.maze_id,
				description: m.description,
			})),
		}),
	).pipe(Effect.map((selected) => selected as string));

const selectPlayerCharacter = pipe(
	Effect.promise(() =>
		select({
			message: "Select your player character:",
			choices: playerSymbols,
		}),
	),
	Effect.map((selected) => selected as string),
);

const gameModeOption = pipe(
	Effect.promise(() =>
		select({
			message: "Pick your gameplay mode:",
			choices: ["Freedom", "Guided"],
		}),
	),
	Effect.map((selected) => selected as string),
);

const getMaze = MazeAPIService.pipe(
	Effect.map((mazeAPI) => {
		return { maze: mazeAPI.getDataMaze(), mazeAPI };
	}),
	Effect.flatMap(({ maze, mazeAPI }) =>
		maze.pipe(
			Effect.flatMap((mazeData) => promptMazeOptions(mazeData)),
			Effect.flatMap((selected) => mazeAPI.getMaze(selected)),
		),
	),
);

export class Maze extends Effect.Service<Maze>()("Maze", {
	dependencies: [MazeAPIService.Default],
	effect: pipe(
		Effect.all({
			player: selectPlayerCharacter,
			maze: getMaze,
			gameMode: gameModeOption,
		}),
		Effect.map(({ player, maze, gameMode }) =>
			Schema.decodeUnknownSync(MazeGameDataSchema)({
				player,
				maze,
				gameMode,
			}),
		),
		Effect.tap((mazeData) =>
			pipe(
				MazeDataState,
				Effect.flatMap((maze) => Ref.set(maze, mazeData)),
			),
		),
	),
}) {}

// export const MazeDataState1 = Effect.Service<MazeDataState>()(
// 	"MazeDataState",
// 	{
// 		dependencies: [],
// 		effect: Effect.succeed(MazeDataState),
// 	},
// );


export const MazeProvider = Layer.mergeAll(
	Maze.Default,
	Layer.effect(MazeDataState, Ref.make(RawData)),
);
