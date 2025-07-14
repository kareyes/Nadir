
<script lang="ts">
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
</script>

<div class="aspect-1 w-full max-w-2xl mx-auto p-4 bg-gray-900/80 rounded-lg border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
    <div
        class="p-[1px] bg-gray-900 grid gap-0 relative border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4),inset_0_0_15px_rgba(6,182,212,0.1)]"
        style="grid-template-columns: repeat({maze.numCols}, 1fr);"
    >
        {#each Array(maze.numRows) as _, row}
            {#each Array(maze.numCols) as _, col}
                <MazeCell {...getMazeCellProps(row, col)} />
            {/each}
        {/each}
    </div>
</div>
