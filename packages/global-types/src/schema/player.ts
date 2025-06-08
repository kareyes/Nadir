import { Schema } from "effect";

export const PlayerDataSchema = Schema.Struct({
    playerID: Schema.String,
    name: Schema.String,
    value: Schema.String,
    description: Schema.String,
});

export const PlayerDataArraySchema = Schema.Array(PlayerDataSchema);
