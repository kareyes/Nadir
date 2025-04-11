import { Effect, pipe, Ref } from 'effect';
import { MazeMenu } from './components/menu.js';
import { MazeDataState, RawData } from './constant.js';
import { gameStart } from './components/maze.js';

const main = pipe(MazeMenu, Effect.zipRight(gameStart));

main.pipe(
  Effect.provide(MazeMenu.Default),
  Effect.provideServiceEffect(MazeDataState, Ref.make(RawData)),
  Effect.runPromise,
);
