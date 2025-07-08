
<script lang="ts">
import type { Maze } from "@nadir/global-types";
import MazeCell from "./MazeCell.svelte";

const {
	maze,
	playerPosition,
	solutionPath = null,
} = $props<{
	maze: Maze;
	playerPosition: { x: number; y: number };
	solutionPath?: { x: number; y: number }[] | null;
}>();

const isInSolution = (row: number, col: number) =>
	Array.isArray(solutionPath) &&
	solutionPath.some((pos) => pos.x === row && pos.y === col);

const isPlayer = (row: number, col: number) =>
	row === playerPosition.x && col === playerPosition.y;
const isStart = (row: number, col: number) => row === 0 && col === 0;
const isEnd = (row: number, col: number) =>
	row === maze.numRows - 1 && col === maze.numCols - 1;

const hasTopWall = (row: number, col: number) =>
	row === 0 || (row > 0 && maze.grid[row - 1].horizontal[col] === false);
const hasLeftWall = (row: number, col: number) =>
	col === 0 || (col > 0 && maze.grid[row].vertical[col - 1] === false);
const hasBottomWall = (row: number, col: number) =>
	row === maze.numRows - 1 || maze.grid[row].horizontal[col] === false;
const hasRightWall = (row: number, col: number) =>
	col === maze.numCols - 1 || maze.grid[row].vertical[col] === false;
</script>

<div class="aspect-1 w-full max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg">
    <div
        class="p-[1px] bg-white grid gap-0 relative border-2 border-gray-800"
        style="grid-template-columns: repeat({maze.numCols}, 1fr);"
    >
        {#each Array(maze.numRows) as _, row}
            {#each Array(maze.numCols) as _, col}
                <MazeCell
                    row={row}
                    col={col}
                    isPlayer={isPlayer(row, col)}
                    isStart={isStart(row, col)}
                    isEnd={isEnd(row, col)}
                    isInSolution={isInSolution(row, col)}
                    hasTopWall={hasTopWall(row, col)}
                    hasLeftWall={hasLeftWall(row, col)}
                    hasBottomWall={hasBottomWall(row, col)}
                    hasRightWall={hasRightWall(row, col)}
                />
            {/each}
        {/each}
    </div>
</div>
