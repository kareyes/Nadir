<script lang="ts">
import { goto } from "$app/navigation";
import GameMessage from "$lib/components/GameMessage.svelte";
import MazeGrid from "$lib/components/MazeGrid.svelte";
import { solveMaze } from "$lib/gameplay/actionRule.js";
import { handleKeydownSync } from "$lib/gameplay/listener.js";
import type {
	Coordinates,
	GameStats,
	Maze,
	PlayerStats,
} from "@nadir/global-types";
import { Button } from "@nadir/solara";
import { Icons } from "@nadir/solara";
import { onMount } from "svelte";

let { data } = $props();
let currentMaze = $state<Maze | null>(null);
let playerPosition = $state<Coordinates>({ x: 0, y: 0 });
let solutionPath = $state<Coordinates[] | null>(null);
let isGameOver = $state(false);
let playerStats = $state<PlayerStats>({ moves: 0, timeTaken: "" });
let gameStats = $state<GameStats>({
	moves: 0,
	startTime: Date.now(),
	endTime: 0,
	timeTaken: 0,
});

const handleKeydown = (event: KeyboardEvent | { key: string }) => {
	if (!currentMaze || isGameOver) return;
	try {
		const currentGameState = {
			playerPosition,
			isGameOver,
			gameStats,
			currentMaze,
		};
		const newGameState = handleKeydownSync(event, currentGameState);

		playerPosition = newGameState.playerPosition;
		isGameOver = newGameState.isGameOver;
		gameStats = newGameState.gameStats;

		if (newGameState.isGameOver) {
			const { timeTaken, moves } = gameStats;
			const minutes = Math.floor(timeTaken / 60);
			const seconds = timeTaken % 60;

			playerStats = {
				moves,
				timeTaken: minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`,
			};
		}
	} catch (error) {
		console.warn("Keyboard input failed:", error);
	}
};

const resetGame = () => {
	playerPosition = { x: 0, y: 0 };
	solutionPath = null;
	isGameOver = false;
	playerStats = { moves: 0, timeTaken: "" };
	gameStats = {
		moves: 0,
		startTime: Date.now(),
		endTime: 0,
		timeTaken: 0,
	};
};
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
		} catch (error) {
			console.error("Error loading maze:", error);
		}
	};

	if (!cancelled) loadMaze();
	window.addEventListener("keydown", handleKeydown);

	return () => {
		cancelled = true;
		window.removeEventListener("keydown", handleKeydown);
	};
});
</script>

<main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">{currentMaze?.mazeName}</h1>
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
            {solutionPath} 
        />
    {:else} 
	<!-- @todo: Loading in solara -->
        <div class="text-center">
            <p class="text-xl text-gray-600">Loading maze...</p>
        </div>
    {/if}
</main>

    <GameMessage
        {playerStats}
        {isGameOver}
		{resetGame}
    />