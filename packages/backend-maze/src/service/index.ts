import { Effect, Schema } from 'effect';
import { DatabaseService } from '../db/index.js';
import {
	SELECT_METADATA,
	SELECTED_MAZE,
	type MazeMetaArray,
	MetaArraySchema,
	ParseMazeSchema,
	type ResponseMaze,
} from '@nadir/global-types';

export class MazeDBServices extends Effect.Service<MazeDBServices>()(
	'MazeDBApi',
	{
		dependencies: [DatabaseService.Default],
		effect: Effect.gen(function* () {
			const databaseService = yield* DatabaseService;
			return {
				getbyId: (maze_id: string) =>
					Effect.gen(function* () {
						return yield* databaseService
							.get<ResponseMaze>(SELECTED_MAZE, [maze_id])
							.pipe(
								Effect.map((response) => {
									return Schema.decodeUnknownSync(ParseMazeSchema)(response);
								}),
								Effect.catchTag('DatabaseError', (error) => {
									console.log('err', error);
									return Effect.fail(error);
								}),
							);
				}),
				getMetadata: () =>
					Effect.gen(function* () {
						return yield* databaseService
							.all<MazeMetaArray>(SELECT_METADATA, [])
							.pipe(
								Effect.map((response) => {
									return Schema.decodeUnknownSync(MetaArraySchema)(response);
								}),
								Effect.catchTag('DatabaseError', (error) => {
									console.log('err', error);
									return Effect.fail(error);
								}),
							);
					}),
			};
		}),
	},
) {}
