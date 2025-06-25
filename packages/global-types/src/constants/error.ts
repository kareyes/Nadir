export class JSONError {
	readonly _tag = "JSONError";
}

export class FetchError {
	readonly _tag = "FetchError";
	constructor(readonly message: string) {}
}

export class DatabaseError {
	readonly _tag = "DatabaseError";
	constructor(readonly message: string) {}
}

export class GamePlayError {
	readonly _tag = "GamePlayError";
	constructor(readonly message: string) {}
}

export const ERROR_CODE = {
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
};
