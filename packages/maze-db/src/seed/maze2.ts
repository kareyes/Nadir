const grid = [
	{
		horizontal: [
			false,
			true,
			true,
			false,
			true,
			true,
			false,
			true,
			true,
			false,
		],
		vertical: [true, true, false, false, true, false, true, true, false, false],
	},
	{
		horizontal: [
			false,
			false,
			true,
			true,
			false,
			true,
			false,
			false,
			false,
			false,
		],
		vertical: [true, true, true, true, false, true, false, true, true, false],
	},
	{
		horizontal: [
			false,
			false,
			false,
			false,
			false,
			true,
			false,
			true,
			false,
			false,
		],
		vertical: [true, true, false, true, true, false, true, true, false, false],
	},
	{
		horizontal: [
			false,
			false,
			true,
			false,
			true,
			true,
			false,
			false,
			true,
			false,
		],
		vertical: [true, true, true, false, true, false, false, false, true, false],
	},
	{
		horizontal: [
			false,
			false,
			false,
			true,
			false,
			true,
			true,
			true,
			false,
			false,
		],
		vertical: [true, true, true, false, true, false, true, false, false, false],
	},
	{
		horizontal: [
			false,
			false,
			true,
			false,
			false,
			true,
			false,
			true,
			true,
			false,
		],
		vertical: [true, true, true, true, true, true, false, true, false, false],
	},
	{
		horizontal: [
			true,
			false,
			false,
			false,
			false,
			false,
			true,
			false,
			true,
			false,
		],
		vertical: [true, false, true, true, true, true, true, false, false, false],
	},
	{
		horizontal: [
			false,
			true,
			false,
			false,
			true,
			false,
			false,
			true,
			true,
			false,
		],
		vertical: [
			true,
			false,
			false,
			true,
			false,
			false,
			true,
			true,
			false,
			false,
		],
	},
	{
		horizontal: [
			true,
			true,
			false,
			true,
			false,
			false,
			true,
			false,
			false,
			true,
		],
		vertical: [
			false,
			false,
			true,
			false,
			true,
			true,
			false,
			false,
			true,
			false,
		],
	},
	{
		horizontal: [
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			true,
		],
		vertical: [
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
		],
	},
];

export const mazeModel = {
	maze_id: "002",
	mazeName: "Level 2: The Maze of Shadows",
	level: 1 as 1 | 2 | 3,
	description: "This is a 10x10 maze",
	created_at: new Date().toISOString(),
	numCols: 10,
	numRows: 10,
	grid: JSON.stringify(grid),
};
