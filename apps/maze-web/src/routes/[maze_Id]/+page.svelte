

<script lang="ts">
import { goto } from "$app/navigation";
import GameMessage from "$lib/components/GameMessage.svelte";
import MazeGrid from "$lib/components/MazeGrid.svelte";
import type { Coordinates, Maze, PlayerStats } from "@nadir/global-types";
import { Button } from "@nadir/solara";
import { Icons } from "@nadir/solara";
import { onMount } from "svelte";

let { data } = $props();
let currentMaze = $state<Maze | null>(null);
let playerPosition = $state<Coordinates>({ x: 0, y: 0 });
let isGameOver = $state(false);
let playerStats = $state<PlayerStats>({ moves: 0, timeTaken: "" });
let gameStats = $state({
	moves: 0,
	startTime: Date.now(),
	endTime: 0,
	timeTaken: 0,
});

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
	gameStats.moves++;
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
		gameStats.endTime = Date.now();
		gameStats.timeTaken = Math.round(
			(gameStats.endTime - gameStats.startTime) / 1000,
		);

		const minutes = Math.floor(gameStats.timeTaken / 60);
		const seconds = gameStats.timeTaken % 60;
		const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

		playerStats = {
			moves: gameStats.moves,
			timeTaken: timeString,
		};
		// message = `\n\n📊 Your Stats:\n🚀 Moves: ${gameStats.moves}\n⏱️ Time: ${timeString}`;
	}
};

const resetGame = () => {
	playerPosition = { x: 0, y: 0 };
	isGameOver = false;
	playerStats = {
		moves: 0,
		timeTaken: "",
	};
	gameStats = {
		moves: 0,
		startTime: Date.now(),
		endTime: 0,
		timeTaken: 0,
	};
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

let solutionPath = $state<Coordinates[] | null>(null);

const handleSolve = () => {
	if (currentMaze) {
		solutionPath = solveMaze(currentMaze);
	}
};

const handleBackToMain = () => {
	goto("/");
};

onMount(() => {
	let cancelled = false;

	const loadMaze = async () => {
		try {
			currentMaze = await data.maze();
			if (cancelled) return;
			// console.log("Mazes loaded:", mazes.length);
		} catch (error) {
			console.error("Error loading maze:", error);
			//@todo make it alert dialog
			// message = "Error loading maze. Please try again.";
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

<main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">{currentMaze?.mazeName}</h1>

    <GameMessage
        {playerStats}
        {isGameOver}
		{resetGame}
    />

    {#if currentMaze}
        <div class="flex flex-wrap gap-4 justify-center mb-8">
            <Button variant="neon-pink" color="green" size="lg" onclick={resetGame}>
				<Icons.RotateCcwIcon />
                Reset Game
            </Button>
            <Button variant="neon-orange" size="lg" onclick={handleSolve}>
				<Icons.LightbulbIcon />
                Tips
            </Button>
            <Button variant="neon" size="lg" onclick={handleBackToMain}>
				<Icons.MenuIcon />
                Back to Main
            </Button>
        </div>

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