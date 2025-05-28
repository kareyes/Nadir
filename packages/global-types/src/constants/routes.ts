export const SELECTED_MAZE = 'SELECT * FROM mazes WHERE maze_id = ?';
export const SELECT_ALL_MAZE = 'SELECT * FROM mazes';
export const SELECT_METADATA =
	'SELECT maze_id, mazeName, description, created_at FROM mazes';
export const UPDATE_MAZE = 'UPDATE mazes SET grid = ? WHERE maze_id = ?';
export const INSERT_MAZE =
	'INSERT INTO mazes (maze_id, mazeName, description, numCols, numRows, grid, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING maze_id, created_at';
export const DELETE_MAZE = 'DELETE FROM mazes WHERE maze_id = ?';
export const CREATE_MAZE_TABLE = `
CREATE TABLE IF NOT EXISTS mazes (
	maze_id TEXT PRIMARY KEY,
	mazeName TEXT NOT NULL,
	description TEXT NOT NULL,
	numCols INTEGER NOT NULL,
	numRows INTEGER NOT NULL,
	grid ARRAY NOT NULL,
	created_at TEXT NOT NULL
);`



export const GET_SELECTED_MAZE = '/maze/:maze_id';
export const GET_ALL_MAZE = '/maze';
export const GET_ALL_MAZE_METADATA = '/maze/metadata';
export const UPDATE_SELECTED_MAZE = '/maze/update/:maze_id';
