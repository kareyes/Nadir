import {
	type CurrentPosition,
	HOST,
	type MazeGameData,
	PORT,
} from "@nadir/global-types";
import { Context, Effect, type Ref } from "effect";

export class CurrentPositionState extends Context.Tag("CurrentPositionState")<
	CurrentPositionState,
	Ref.Ref<CurrentPosition>
>() {}

export class MazeDataState extends Context.Tag("MazeDataState")<
	MazeDataState,
	Ref.Ref<MazeGameData>
>() {}

export const API_URL = Effect.gen(function* (_) {
	const host = yield* _(HOST);
	const port = yield* _(PORT);
	return `http://${host}:${port}`;
});

export const directions: CurrentPosition[] = [
	{ x: 0, y: 1 }, // right
	{ x: 1, y: 0 }, // down
	{ x: 0, y: -1 }, // left
	{ x: -1, y: 0 }, // up
];

export const RawData: MazeGameData = {
	player: "",
	maze: {
		maze_id: "",
		mazeName: "",
		description: "",
		created_at: 0,
		numCols: 0,
		numRows: 0,
		grid: [
			{
				vertical: [false, false, false, false, false],
				horizontal: [false, false, false, false, false],
			},
		],
	},
	gameMode: "",
};

export const playerSymbols = [
	{
		name: "🐶 - Brian Griffin",
		value: "\u{1F436}",
		description:
			"Has average agility, often displaying quick reflexes in comedic situations but not particularly athletic.",
	},
	{
		name: "🐱 - Pusheen",
		value: "\u{1F431}",
		description:
			"A cute, chubby cat with limited agility, often depicted as more playful and relaxed than physically nimble.",
	},
	{
		name: "🐭 - Jerry",
		value: "\u{1F42D}",
		description:
			"Jerry is highly agile, swiftly outmaneuvering Tom with quick reflexes and clever tricks.",
	},
	{
		name: "🐼 - Pan-Pan",
		value: "\u{1F43C}",
		description:
			"Playful and energetic character with surprising agility, often darting around with quick movements.",
	},
	{
		name: "🐰 - Snowball",
		value: "\u{1F430}",
		description:
			"Snowball is incredibly agile, darting swiftly and gracefully to evade attacks and outmaneuver opponents.",
	},
];
