import { type MazeMetaArray, SELECT_METADATA } from "@nadir/global-types";
import { Effect, pipe } from "effect";
import { mazeModel as m1 } from "../seed/maze1.js";
import { mazeModel as m2 } from "../seed/maze2.js";
import { mazeModel as m3 } from "../seed/maze3.js";
import { playerSymbols } from "../seed/players.js";
import { MazeDBService, MazeDBServiceMock } from "../service/maze.js";
import { PlayerDBService } from "../service/player.js";

// import { cons } from "effect/List";

// const prog = MazeDBService.pipe(
// 	Effect.flatMap((service) => service.getAllMazes),
// 	// Effect.map(() => "Maze schema initialized"),
// 	Effect.provide(MazeDBService.Default),
// );

// Effect.runPromise(prog)
// 	.then((result) => console.log("Result:", result))
// 	.catch((error) => console.error("Error:", error));

const maze = MazeDBService.pipe(
	Effect.tap((service) => {
		return pipe(
			service.initMazeSchema,
			Effect.flatMap(() => service.insertMaze(m1)),
			Effect.flatMap(() => service.insertMaze(m2)),
			Effect.flatMap(() => service.insertMaze(m3)),
		);
	}),
	Effect.andThen((service) => service.getAllMazes),
	Effect.provide(MazeDBServiceMock.Default),
);

const player = PlayerDBService.pipe(
	Effect.tap((service) => {
		return pipe(
			service.initPlayereSchema,
			Effect.flatMap(() => service.insertPlayer(playerSymbols[1])),
			Effect.flatMap(() => service.insertPlayer(playerSymbols[2])),
			Effect.flatMap(() => service.insertPlayer(playerSymbols[3])),
			Effect.flatMap(() => service.insertPlayer(playerSymbols[4])),
		);
	}),
	Effect.andThen((service) => service.getAllPlayers),
	Effect.provide(PlayerDBService.Default),
);

Effect.runPromise(player)
	.then((result) => console.log("Result:", result))
	.catch((error) => console.error("Error:", error));
