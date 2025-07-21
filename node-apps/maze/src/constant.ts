import type { CurrentPosition, MazeGameData } from "@nadir/global-types";
import { Context, type Ref } from "effect";

export class CurrentPositionState extends Context.Tag("CurrentPositionState")<
	CurrentPositionState,
	Ref.Ref<CurrentPosition>
>() {}

export class MazeDataState extends Context.Tag("MazeDataState")<
	MazeDataState,
	Ref.Ref<MazeGameData>
>() {}

export const APIURL = `http://${process.env.API_HOST}:${Number(process.env.API_PORT || "8080")}`;

export const GameMode = {
	auto: "Assist Mode",
	manual: "Manual Mode",
};

export const directions: CurrentPosition[] = [
	{ x: 0, y: 1 }, // right
	{ x: 1, y: 0 }, // down
	{ x: 0, y: -1 }, // left
	{ x: -1, y: 0 }, // up
];

export const Directions = {
	right: { x: 0, y: 1 },
	down: { x: 1, y: 0 },
	left: { x: 0, y: -1 },
	up: { x: -1, y: 0 },
};
export const RawData: MazeGameData = {
	player: "",
	maze: {
		maze_id: "",
		mazeName: "",
		description: "",
		created_at: "0",
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
