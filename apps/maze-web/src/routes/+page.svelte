<script lang="ts">
    import { onMount } from "svelte";
    import type { Maze } from '@nadir/global-types';
    import MazeGrid from '$lib/components/MazeGrid.svelte';
    import LevelSelector from '$lib/components/LevelSelector.svelte';
    import ControlButtons from '$lib/components/ControlButtons.svelte';
    import GameMessage from '$lib/components/GameMessage.svelte';

    let { data } = $props();
    let mazes = $state<Maze[]>([]);
    let currentMaze = $state<Maze | null>(null);
    let currentLevel = $state(0);
    let playerPosition = $state({ x: 0, y: 0 });
    let isGameOver = $state(false);
    let message = $state('');

    // Handle keyboard controls
    const handleKeydown = (event: KeyboardEvent | { key: string }) => {
        if (isGameOver) return;
        
        const { key } = event;
        const newPosition = { ...playerPosition };

        switch (key) {
            case 'ArrowUp':
                if (canMove(newPosition.x - 1, newPosition.y)) {
                    newPosition.x--;
                }
                break;
            case 'ArrowDown':
                if (canMove(newPosition.x + 1, newPosition.y)) {
                    newPosition.x++;
                }
                break;
            case 'ArrowLeft':
                if (canMove(newPosition.x, newPosition.y - 1)) {
                    newPosition.y--;
                }
                break;
            case 'ArrowRight':
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

        if (x < currentX) { // Moving up
            return currentMaze.grid[x].horizontal[y];
        }
        if (x > currentX) { // Moving down
            return currentMaze.grid[currentX].horizontal[currentY];
        }
        if (y < currentY) { // Moving left
            return currentMaze.grid[x].vertical[y];
        }
        if (y > currentY) { // Moving right
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
            message = 'Congratulations! You solved the maze! 🎉';
        }
    };

    const resetGame = () => {
        playerPosition = { x: 0, y: 0 };
        isGameOver = false;
        message = '';
    };

    const selectLevel = (level: number) => {
        console.log("Selected level:", level);
        if (level >= 0 && level < mazes.length) {
            currentLevel = level;
            currentMaze = mazes[level];
            resetGame();
        }
    };

    onMount(() => {
        let cancelled = false;
    
        const loadMaze = async () => {
            try {
                const mazeData = await data.maze;
                if (cancelled) return;
                mazes = Array.isArray(mazeData) ? mazeData : [mazeData];
                currentMaze = mazes[currentLevel];
                console.log("Mazes loaded:", mazes.length);
            } catch (error) {
                console.error("Error loading maze:", error);
                message = 'Error loading maze. Please try again.';
            }
        };
    
        loadMaze();
    
        // Add keyboard listener
        window.addEventListener('keydown', handleKeydown);
    
        return () => {
            cancelled = true;
            window.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

<svelte:head>
    <title>Maze Game</title>
</svelte:head>

<main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center">Maze Game</h1>
    
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
        <MazeGrid
            maze={currentMaze}
            {playerPosition}
        />
    {:else}
        <div class="text-center">
            <p class="text-xl text-gray-600">Loading maze...</p>
        </div>
    {/if}
</main>