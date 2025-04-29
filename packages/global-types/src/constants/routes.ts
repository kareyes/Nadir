export const SELECTED_MAZE = 'SELECT * FROM mazes WHERE maze_id = ?';
export const SELECT_METADATA =
	'SELECT maze_id, mazeName, description, created_at FROM mazes';
export const UPDATE_MAZE = 'UPDATE mazes SET grid = ? WHERE maze_id = ?';

export const GET_SELECTED_MAZE = '/maze/:maze_id';
export const GET_ALL_MAZE = '/maze';
export const GET_ALL_MAZE_METADATA = '/maze/metadata';
export const UPDATE_SELECTED_MAZE = '/maze/update/:maze_id';
