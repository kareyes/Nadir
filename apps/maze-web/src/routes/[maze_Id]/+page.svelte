<script lang="ts">
import { goto } from "$app/navigation";
import GameButtons from "$lib/components/GameButtons.svelte";
import GameMessage from "$lib/components/GameMessage.svelte";
import MazeGrid from "$lib/components/MazeGrid.svelte";
import { solveMaze } from "$lib/gameplay/actionRule.js";
import { autoSolveMazeSync } from "$lib/gameplay/autoPlayer.js";
import { handleKeydownSync } from "$lib/gameplay/listener.js";
import type {
	Coordinates,
	GameStats,
	Maze,
	MazeGameState,
	PlayerStats,
} from "@nadir/global-types";
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

let isAutoSolving = $state(false);

const updatePlayerStats = ({ timeTaken, moves }: GameStats) => {
	const minutes = Math.floor(timeTaken / 60);
	const seconds = timeTaken % 60;
	playerStats = {
		moves,
		timeTaken: minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`,
	};
};

const updateGameState = (newState: MazeGameState) => {
	playerPosition = newState.playerPosition || playerPosition;
	isGameOver = newState.isGameOver || isGameOver;
	gameStats = newState.gameStats || gameStats;

	if (newState.isGameOver) updatePlayerStats(newState.gameStats);
};

const getCurrentGameState = () => ({
	playerPosition,
	isGameOver,
	gameStats,
	currentMaze,
});

const handleKeydown = (event: KeyboardEvent | { key: string }) => {
	if (!currentMaze || isGameOver || isAutoSolving) return;
	updateGameState(handleKeydownSync(event, getCurrentGameState()));
};

const onAutoSolve = async () => {
	if (!currentMaze || isGameOver || isAutoSolving) return;
	
	isAutoSolving = true;
	try {
		const finalState = await autoSolveMazeSync(getCurrentGameState(), updateGameState);
		updateGameState(finalState);
	} catch (error) {
		console.error("Auto-solve failed:", error);
	} finally {
		isAutoSolving = false;
	}
};


const resetGame = () => {
	playerPosition = { x: 0, y: 0 };
	solutionPath = null;
	isGameOver = false;
	isAutoSolving = false;
	playerStats = { moves: 0, timeTaken: "" };
	gameStats = {
		moves: 0,
		startTime: Date.now(),
		endTime: 0,
		timeTaken: 0,
	};
};

const onSolveMaze = () => {
	if (currentMaze) {
		solutionPath = solveMaze(currentMaze);
	}
};
const onBackToMain = () => {
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
	<GameButtons
		{resetGame}
		{onSolveMaze}
		{onBackToMain}
		{onAutoSolve}
	/>
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