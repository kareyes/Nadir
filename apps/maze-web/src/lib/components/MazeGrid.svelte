
<script lang="ts">
import { getGridThemeColors } from "$lib/helper/util";
import type { Coordinates, Maze } from "@nadir/global-types";
import MazeCell from "./MazeCell.svelte";

const {
	maze,
	playerPosition,
	solutionPath = null,
} = $props<{
	maze: Maze;
	playerPosition: Coordinates;
	solutionPath?: Coordinates[] | null;
}>();

const getMazeCellProps = (row: number, col: number) => ({
	isPlayer: row === playerPosition.x && col === playerPosition.y,
	isStart: row === 0 && col === 0,
	isEnd: row === maze.numRows - 1 && col === maze.numCols - 1,
	hasTopWall:
		row === 0 || (row > 0 && maze.grid[row - 1].horizontal[col] === false),
	hasLeftWall:
		col === 0 || (col > 0 && maze.grid[row].vertical[col - 1] === false),
	hasBottomWall:
		row === maze.numRows - 1 || maze.grid[row].horizontal[col] === false,
	hasRightWall:
		col === maze.numCols - 1 || maze.grid[row].vertical[col] === false,
	isInSolution:
		Array.isArray(solutionPath) &&
		solutionPath.some((pos) => pos.x === row && pos.y === col),
});

const themeColors = getGridThemeColors(maze.level);
</script>

<div class="aspect-1 w-full max-w-2xl mx-auto p-4 bg-gray-900/80 rounded-lg {themeColors.borderOpacity} {themeColors.shadow}" class:border={true}>
    <div
        class="p-[1px] bg-gray-900 grid gap-0 relative border-2 {themeColors.border} {themeColors.innerShadow}"
        style="grid-template-columns: repeat({maze.numCols}, 1fr);"
    >
        {#each Array(maze.numRows) as _, row}
            {#each Array(maze.numCols) as _, col}
                <MazeCell {...getMazeCellProps(row, col)} level={maze.level} />
            {/each}
        {/each}
    </div>
</div>
