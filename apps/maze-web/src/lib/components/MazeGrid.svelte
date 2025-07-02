
<script lang="ts">
import type { Maze } from '@nadir/global-types';

const { maze, playerPosition } = $props<{
    maze: Maze;
    playerPosition: { x: number; y: number };
}>();

const isPlayer = (row: number, col: number) => row === playerPosition.x && col === playerPosition.y;
const isStart = (row: number, col: number) => row === 0 && col === 0;
const isEnd = (row: number, col: number) => row === maze.numRows - 1 && col === maze.numCols - 1;

const hasTopWall = (row: number, col: number) => row === 0 || (row > 0 && maze.grid[row - 1].horizontal[col] === false);
const hasLeftWall = (row: number, col: number) => col === 0 || (col > 0 && maze.grid[row].vertical[col - 1] === false);
const hasBottomWall = (row: number, col: number) => row === maze.numRows - 1 || maze.grid[row].horizontal[col] === false;
const hasRightWall = (row: number, col: number) => col === maze.numCols - 1 || maze.grid[row].vertical[col] === false;


const renderWall = (row: number, col: number, direction: 'top' | 'left' | 'bottom' | 'right') => {
    switch (direction) {
        case 'top':
            return hasTopWall(row, col) ? 'top-0 left-0 right-0 h-0.5 bg-gray-800' : '';
        case 'left':
            return hasLeftWall(row, col) ? 'top-0 bottom-0 left-0 w-0.5 bg-gray-800' : '';
        case 'bottom':
            return hasBottomWall(row, col) ? 'bottom-0 left-0 right-0 h-0.5 bg-gray-800' : '';
        case 'right':
            return hasRightWall(row, col) ? 'top-0 bottom-0 right-0 w-0.5 bg-gray-800' : '';
    }
};
</script>

<div class="aspect-1 w-full max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg">
    <div
        class="p-[1px] bg-white grid gap-0 relative border-2 border-gray-800"
        style="grid-template-columns: repeat({maze.numCols}, 1fr);"
    >
        {#each Array(maze.numRows) as _, row}
            {#each Array(maze.numCols) as _, col}
                <div class="w-full h-full relative aspect-square bg-white">
                    {#if isPlayer(row, col)}
                        <div class="absolute inset-0 flex items-center justify-center m-1 text-2xl">
                            🧑‍🦱
                        </div>
                    {:else if isStart(row, col)}
                        <div class="absolute inset-0 bg-green-200 m-1" ></div>
                    {:else if isEnd(row, col)}
                        <div class="absolute inset-0 bg-red-200 m-1" ></div>
                    {/if}

                    {#if hasTopWall(row, col)}
                        <div class="absolute top-0 left-0 right-0 h-0.5 bg-gray-800" ></div>
                    {/if}
                    {#if hasLeftWall(row, col)}
                        <div class="absolute top-0 bottom-0 left-0 w-0.5 bg-gray-800" ></div>
                    {/if}
                    {#if hasBottomWall(row, col)}
                        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800" ></div>
                    {/if}
                    {#if hasRightWall(row, col)}
                        <div class="absolute top-0 bottom-0 right-0 w-0.5 bg-gray-800" ></div>
                    {/if}
                </div>
            {/each}
        {/each}
    </div>
</div>
