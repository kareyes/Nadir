<script lang="ts">
import { goto } from "$app/navigation";
import GameButtons from "$lib/components/GameButtons.svelte";
import GameMessage from "$lib/components/GameMessage.svelte";
import MazeGrid from "$lib/components/MazeGrid.svelte";
import { solveMaze } from "$lib/gameplay/actionRule.js";
import {
	autoSolveMazeSync,
	getSolutionPath,
} from "$lib/gameplay/autoPlayer.js";
import { handleKeydownSync } from "$lib/gameplay/listener.js";
import { calculatePlayerRating } from "$lib/helper/util.js";

import type {
	Coordinates,
	GameStats,
	Maze,
	MazeGameState,
	PlayerStats,
} from "@nadir/global-types";
import { Icons, Loading } from "@nadir/solara";
import { onMount } from "svelte";

let { data } = $props();
let currentMaze = $state<Maze | null>(null);
let playerPosition = $state<Coordinates>({ x: 0, y: 0 });
let solutionPath = $state<Coordinates[] | null>(null);
let isGameOver = $state(false);
let playerStats = $state<PlayerStats>({
	moves: 0,
	timeTaken: "",
	rating: 0,
	ratingText: "",
});
let gameStats = $state<GameStats>({
	moves: 0,
	startTime: Date.now(),
	endTime: 0,
	timeTaken: 0,
});
let isAutoSolving = $state(false);
let isMobile = $state(window.matchMedia("(max-width: 768px)").matches);

const updatePlayerStats = (
	{ timeTaken, moves }: GameStats,
	solutionPath: Coordinates[],
) => {
	const minutes = Math.floor(timeTaken / 60);
	const seconds = timeTaken % 60;

	const mazeSize = currentMaze
		? currentMaze.numCols * currentMaze.numRows
		: 100;
	const { rating, ratingText } = calculatePlayerRating(
		moves,
		timeTaken,
		solutionPath,
		mazeSize,
	);

	playerStats = {
		moves,
		timeTaken: minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`,
		rating,
		ratingText,
	};
};

const updateGameState = (newState: MazeGameState) => {
	playerPosition = newState.playerPosition || playerPosition;
	isGameOver = newState.isGameOver || isGameOver;
	gameStats = newState.gameStats || gameStats;

	const solvePath = getSolutionPath(newState);
	if (newState.isGameOver) updatePlayerStats(newState.gameStats, solvePath);
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
		const finalState = await autoSolveMazeSync(
			getCurrentGameState(),
			updateGameState,
		);
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
	playerStats = {
		moves: 0,
		timeTaken: "",
		rating: 0,
		ratingText: "",
	};
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

<main class="min-h-screen w-full">
	{#if currentMaze}
		<div class="flex flex-col md:flex-row items-center justify-center min-h-screen relative p-4 md:p-0">
			<div class="md:fixed md:left-4 md:top-1/4 md:-translate-y-1/2 z-10 mb-4 md:mb-0 w-full md:w-auto flex justify-center md:block">
				<GameButtons
					{resetGame}
					{onSolveMaze}
					{onBackToMain}
					{onAutoSolve}
					vertical={true}
				/>
			</div>
			
			<div class="flex-1 flex justify-center items-center md:px-16 w-full max-h-fit">
				<div class="w-full max-w-full max-h-[calc(100vh-8rem)] md:max-h-[100vh] overflow-auto">
					<MazeGrid
						maze={currentMaze}
						{playerPosition}
						{solutionPath} 
					/>
				</div>
			</div>
		</div>
	{:else} 
		<div class="flex justify-center items-center h-screen px-4">
			<Loading.Root 
				color="neon" 
				alignment="vertical"
				text="Loading Maze..."
				size="xl"
			>
				<Icons.Loader class="size-full" />
			</Loading.Root>
		</div>
	{/if}
</main>

<GameMessage
    {playerStats}
    {isGameOver}
    {resetGame}
/>