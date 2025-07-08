<script lang="ts">
	import type { Maze } from "@nadir/global-types";
	import MazeGrid from "./MazeGrid.svelte";

// import { $dispatch } from 'svelte';

const { initialRows = 5, initialCols = 5 } = $props<{
    initialRows?: number;
    initialCols?: number;
}>();

let rows = initialRows;
let cols = initialCols;
let currentMaze = $state<Maze | null>(null);
let playerPosition = $state({ x: 0, y: 0 });
// const dispatch = $dispatch();

// Simple DFS maze generator
function generateMaze(rows: number, cols: number) {
    // Each cell has: { visited, horizontal: boolean[], vertical: boolean[] }
    const grid = Array.from({ length: rows }, () => ({
        horizontal: Array(cols).fill(true),
        vertical: Array(cols).fill(true)
    }));
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const stack = [{ x: 0, y: 0 }];
    visited[0][0] = true;

    const directions = [
        { dx: 0, dy: 1 }, // right
        { dx: 1, dy: 0 }, // down
        { dx: 0, dy: -1 }, // left
        { dx: -1, dy: 0 } // up
    ];

    while (stack.length) {
        const { x, y } = stack[stack.length - 1];
        const neighbors = directions
            .map(({ dx, dy }) => ({ nx: x + dx, ny: y + dy, dx, dy }))
            .filter(({ nx, ny }) => nx >= 0 && ny >= 0 && nx < rows && ny < cols && !visited[nx][ny]);
        if (neighbors.length === 0) {
            stack.pop();
            continue;
        }
        const { nx, ny, dx, dy } = neighbors[Math.floor(Math.random() * neighbors.length)];
        // Remove wall between (x, y) and (nx, ny)
        if (dx === 1) grid[x].horizontal[y] = true, grid[nx - 1].horizontal[y] = true;
        if (dx === -1) grid[nx].horizontal[ny] = true, grid[x - 1].horizontal[ny] = true;
        if (dy === 1) grid[x].vertical[y] = true, grid[x].vertical[y - 1] = true;
        if (dy === -1) grid[nx].vertical[ny] = true, grid[nx].vertical[ny - 1] = true;
        visited[nx][ny] = true;
        stack.push({ x: nx, y: ny });
    }
    return {
        numRows: rows,
        numCols: cols,
        grid
    };
}

export const handleGenerate = () => {
    const maze = generateMaze(rows, cols);
    // dispatch('generate', maze);
    const metada = {
        maze_id: crypto.randomUUID(),
        mazeName: `Maze ${crypto.randomUUID().slice(0, 8)}`,
        description: "Generated Maze",
        created_at: new Date().toISOString(),
    };

    
    
    currentMaze = {...maze, ...metada};
    console.log('Metadata:', currentMaze);

    

};
</script>

<div class="flex flex-col gap-4 items-center p-4">
    <div class="flex gap-2 items-center">
        <label>Rows: <input type="number" min="2" bind:value={rows} class="border rounded px-2 py-1 w-16" /></label>
        <label>Cols: <input type="number" min="2" bind:value={cols} class="border rounded px-2 py-1 w-16" /></label>
    </div>
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onclick={handleGenerate}>
        Generate Maze
    </button>
</div>
    {#if currentMaze}
    <MazeGrid
            maze={currentMaze}
            {playerPosition}
        />
        {/if}
