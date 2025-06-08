import { select } from "@inquirer/prompts";
import { MazeGameDataSchema, type MazeMetaArray, type PlayerDataArray } from "@nadir/global-types";
import { Effect, Layer, Ref, Schema, pipe } from "effect";
import { MazeAPIService } from "../api/index.js";
import { MazeDataState, RawData } from "../constant.js";

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


const promptPlayerOptions = (player: PlayerDataArray) =>
	Effect.promise(() =>
		select({
			message: "Select your player character:",
			choices: player,
		}),
	).pipe(Effect.map((selected) => selected as string));


const gameModeOption = pipe(
	Effect.promise(() =>
		select({
			message: "Pick your gameplay mode:",
			choices: ["Freedom", "Guided"],
		}),
	),
	Effect.map((selected) => selected as string),
);

const getPlayers = MazeAPIService.pipe(
	Effect.map((mazeAPI) => mazeAPI.getAllPlayers()),
	Effect.flatMap((players) =>
		players.pipe(
			Effect.flatMap((playerData) => promptPlayerOptions(playerData))
		),
	),
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
 
export const playAgain = pipe(
	Effect.promise(() =>
		select({
			message: "Do you want to play again?",
			choices: ["Yes", "No"],
		}),
	),
	Effect.map((selected) => selected as string),
);



export class Maze extends Effect.Service<Maze>()("Maze", {
	dependencies: [MazeAPIService.Default],
	effect: pipe(
		Effect.all({
			clear: Effect.sync(() => console.clear()),
			player: getPlayers,
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



export const MazeProvider = Layer.mergeAll(
	Maze.Default,
	Layer.effect(MazeDataState, Ref.make(RawData)),
);
