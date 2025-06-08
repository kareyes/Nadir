import type { Schema } from "effect";
import type { PlayerDataArraySchema, PlayerDataSchema } from "../schema/player.js";


export interface PlayerDataArray extends Schema.Schema.Type<typeof PlayerDataArraySchema> {}
export interface PlayerData extends Schema.Schema.Type<typeof PlayerDataSchema> {}