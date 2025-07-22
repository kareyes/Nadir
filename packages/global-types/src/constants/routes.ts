//  SQL queries
export const SELECTED_MAZE = "SELECT * FROM mazes WHERE maze_id = ?";
export const SELECT_ALL_MAZE = "SELECT * FROM mazes";
export const SELECT_METADATA =
	"SELECT maze_id, mazeName, description, created_at FROM mazes";
export const UPDATE_MAZE = "UPDATE mazes SET grid = ? WHERE maze_id = ?";
export const INSERT_MAZE =
	"INSERT INTO mazes (maze_id, mazeName, level, description, created_at ,numCols, numRows, grid) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING maze_id, created_at";
export const DELETE_MAZE = "DELETE FROM mazes WHERE maze_id = ?";
export const CREATE_MAZE_TABLE = `
CREATE TABLE IF NOT EXISTS mazes (
	maze_id TEXT PRIMARY KEY,
	mazeName TEXT NOT NULL,
	level INTEGER NOT NULL CHECK (level IN (1, 2, 3)),
	description TEXT NOT NULL,
	numCols INTEGER NOT NULL,
	numRows INTEGER NOT NULL,
	grid ARRAY NOT NULL,
	created_at TEXT NOT NULL
);`;

export const CREATE_PLAYER_TABLE = `
CREATE TABLE IF NOT EXISTS players (
	playerID TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	value TEXT NOT NULL,
	description TEXT NOT NULL
);`;

export const INSERT_PLAYER =
	"INSERT INTO players (playerID, name, value, description ) VALUES (?, ?, ?, ?) RETURNING playerID, name, value, description";

export const SELECT_PLAYER = "SELECT * FROM players WHERE playerID = ?";
export const SELECT_ALL_PLAYERS = "SELECT * FROM players";
export const DELETE_PLAYER = "DELETE FROM players WHERE playerID = ?";

// API Routes
export const GET_PLAYER_SYMBOLS = "/player/symbols";
export const GET_PLAYER = "/player/:playerID";
export const GET_ALL_PLAYERS = "/player";

export const GET_SELECTED_MAZE = "/maze/:maze_id";
export const GET_ALL_MAZE = "/maze";
export const GET_ALL_MAZE_METADATA = "/maze/metadata";
export const POST_MAZE = "/maze/create";
export const UPDATE_SELECTED_MAZE = "/maze/update/:maze_id";
