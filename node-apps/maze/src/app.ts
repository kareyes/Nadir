import { Effect, pipe, Ref } from 'effect';
import { MazeMenu } from './components/menu.js';
import { MazeDataState, RawData } from './constant.js';
import { gameStart } from './components/maze.js';
import { live } from '@nadir/backend-maze';

const maze = pipe(
	MazeMenu,
	Effect.flatMap(() => gameStart),
	Effect.provide(MazeMenu.Default),
	Effect.provideServiceEffect(MazeDataState, Ref.make(RawData)),
);

live.runPromise(maze);
