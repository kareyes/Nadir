import { Config } from 'effect';

export const PORT = Config.integer('PORT').pipe(Config.withDefault(8081));
export const HOST = Config.string('HOST').pipe(Config.withDefault('localhost'));
