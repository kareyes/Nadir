<script lang="ts">
import ControlButtons from "$lib/components/ControlButtons.svelte";
import GameMessage from "$lib/components/GameMessage.svelte";
import LevelSelector from "$lib/components/LevelSelector.svelte";
	import MazeGenerator from "$lib/components/MazeGenerator.svelte";
import MazeGrid from "$lib/components/MazeGrid.svelte";
import type { Maze } from "@nadir/global-types";
import { Button } from "@nadir/starlight";
import { onMount } from "svelte";

let { data } = $props();
let mazes = $state<Maze[]>([]);
let currentMaze = $state<Maze | null>(null);
let currentLevel = $state(2);
let playerPosition = $state({ x: 0, y: 0 });
let isGameOver = $state(false);
let message = $state("");

// Handle keyboard controls
const handleKeydown = (event: KeyboardEvent | { key: string }) => {
	if (isGameOver) return;

	const { key } = event;
	const newPosition = { ...playerPosition };

	switch (key) {
		case "ArrowUp":
			if (canMove(newPosition.x - 1, newPosition.y)) {
				newPosition.x--;
			}
			break;
		case "ArrowDown":
			if (canMove(newPosition.x + 1, newPosition.y)) {
				newPosition.x++;
			}
			break;
		case "ArrowLeft":
			if (canMove(newPosition.x, newPosition.y - 1)) {
				newPosition.y--;
			}
			break;
		case "ArrowRight":
			if (canMove(newPosition.x, newPosition.y + 1)) {
				newPosition.y++;
			}
			break;
	}

	playerPosition = newPosition;
	checkWin();
};

const canMove = (x: number, y: number): boolean => {
	if (!currentMaze) return false;

	// Check bounds
	if (x < 0 || x >= currentMaze.numRows || y < 0 || y >= currentMaze.numCols) {
		return false;
	}

	// Check walls based on direction
	const currentX = playerPosition.x;
	const currentY = playerPosition.y;

	if (x < currentX) {
		// Moving up
		return currentMaze.grid[x].horizontal[y];
	}
	if (x > currentX) {
		// Moving down
		return currentMaze.grid[currentX].horizontal[currentY];
	}
	if (y < currentY) {
		// Moving left
		return currentMaze.grid[x].vertical[y];
	}
	if (y > currentY) {
		// Moving right
		return currentMaze.grid[x].vertical[currentY];
	}

	return false;
};

const checkWin = () => {
	if (!currentMaze) return;

	if (
		playerPosition.x === currentMaze.numRows - 1 &&
		playerPosition.y === currentMaze.numCols - 1
	) {
		isGameOver = true;
		message = "Congratulations! You solved the maze! 🎉";
	}
};

const resetGame = () => {
	playerPosition = { x: 0, y: 0 };
	isGameOver = false;
	message = "";
};

const selectLevel = (level: number) => {
	console.log("Selected level:", level);
	if (level >= 0 && level < mazes.length) {
		currentLevel = level;
		currentMaze = mazes[level];
		resetGame();
	}
};

// Maze solver (DFS)
const solveMaze = (maze: Maze) => {
	const { numRows, numCols, grid } = maze;
	const stack = [{ x: 0, y: 0, path: [{ x: 0, y: 0 }] }];
	const visited = new Set<string>();

	while (stack.length) {
		const { x, y, path } = stack.pop()!;
		if (x === numRows - 1 && y === numCols - 1) return path;
		const key = `${x},${y}`;
		if (visited.has(key)) continue;
		visited.add(key);

		// Up
		if (x > 0 && grid[x - 1].horizontal[y] && !visited.has(`${x - 1},${y}`)) {
			stack.push({ x: x - 1, y, path: [...path, { x: x - 1, y }] });
		}
		// Down
		if (
			x < numRows - 1 &&
			grid[x].horizontal[y] &&
			!visited.has(`${x + 1},${y}`)
		) {
			stack.push({ x: x + 1, y, path: [...path, { x: x + 1, y }] });
		}
		// Left
		if (y > 0 && grid[x].vertical[y - 1] && !visited.has(`${x},${y - 1}`)) {
			stack.push({ x, y: y - 1, path: [...path, { x, y: y - 1 }] });
		}
		// Right
		if (
			y < numCols - 1 &&
			grid[x].vertical[y] &&
			!visited.has(`${x},${y + 1}`)
		) {
			stack.push({ x, y: y + 1, path: [...path, { x, y: y + 1 }] });
		}
	}
	return [];
};

let solutionPath = $state<{ x: number; y: number }[] | null>(null);

const handleSolve = () => {
	if (currentMaze) {
		solutionPath = solveMaze(currentMaze);
	}
};

onMount(() => {
	let cancelled = false;

	const loadMaze = async () => {
		try {
			const mazeData = await data.maze();
			if (cancelled) return;
			mazes = Array.isArray(mazeData) ? mazeData : [mazeData];
			currentMaze = mazes[currentLevel];
			console.log("Mazes loaded:", mazes.length);
		} catch (error) {
			console.error("Error loading maze:", error);
			message = "Error loading maze. Please try again.";
		}
	};

	loadMaze();

	// Add keyboard listener
	window.addEventListener("keydown", handleKeydown);

	return () => {
		cancelled = true;
		window.removeEventListener("keydown", handleKeydown);
	};
});
</script>

<svelte:head>
    <title>Maze Game</title>
</svelte:head>

<main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center">Maze Game</h1>
    
    <!-- <Button variant="destructive" class="mb-4">
        Reset Game
    </Button> -->
    <!-- <MazeGenerator 
        initialRows={5} 
        initialCols={5} 
    /> -->
    <LevelSelector 
        levels={mazes.length}
        currentLevel={currentLevel}
        selectLevel={selectLevel}
    />
    
    <GameMessage
        {message}
        {isGameOver}
        on:reset={resetGame}
    />

    {#if currentMaze}
        <Button variant="destructive" onclick={handleSolve}>
            Solve Maze
        </Button>
        <MazeGrid
            maze={currentMaze}
            {playerPosition}
            solutionPath={solutionPath}
        />
    {:else}
        <div class="text-center">
            <p class="text-xl text-gray-600">Loading maze...</p>
        </div>
    {/if}
</main>