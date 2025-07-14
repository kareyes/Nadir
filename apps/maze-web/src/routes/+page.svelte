<script lang="ts">
import { goto } from "$app/navigation";
import { onMount } from "svelte";
import { ToggleGroup, Button } from "@nadir/solara";
import type { Maze } from "@nadir/global-types";

let { data } = $props();
let mazes = $state<Maze[]>([]);
let selectedLevel = $state("");
let soundEnabled = $state(true);
let backgroundMusic: HTMLAudioElement | null = $state(null);
let clickSound: HTMLAudioElement | null = $state(null);

onMount(async () => {
	try {
		const mazeData = await data.maze();
		mazes = Array.isArray(mazeData) ? mazeData : [mazeData];
		
		// Initialize audio
		initializeAudio();
	} catch (error) {
		console.error("Error loading maze list:", error);
	}
});

const initializeAudio = () => {
	// Create background music audio element
	backgroundMusic = new Audio('/audio/background-music.mp3');
	backgroundMusic.loop = true;
	backgroundMusic.volume = 0.3;
	
	// Create click sound effect
	clickSound = new Audio('/audio/click.mp3');
	clickSound.volume = 0.5;
	
	// Start playing background music if sound is enabled
	if (soundEnabled && backgroundMusic) {
		backgroundMusic.play().catch(e => {
			console.log("Auto-play prevented. Music will start on user interaction.");
		});
	}
};

const playClickSound = () => {
	if (soundEnabled && clickSound) {
		clickSound.currentTime = 0; // Reset to beginning
		clickSound.play().catch(e => console.log("Error playing click sound:", e));
	}
};

const handlePlay = () => {
	playClickSound();
	goto(`/` + selectedLevel);
};

const toggleSound = () => {
	soundEnabled = !soundEnabled;
	
	if (soundEnabled) {
		// Enable sound and start background music
		if (backgroundMusic) {
			backgroundMusic.play().catch(e => console.log("Error playing background music:", e));
		}
		console.log("Sound enabled");
	} else {
		// Disable sound and pause background music
		if (backgroundMusic) {
			backgroundMusic.pause();
		}
		console.log("Sound disabled");
	}
	
	// Play click sound for the toggle action itself
	playClickSound();
};
</script>

<!-- Sound Toggle Button - Upper Left Corner -->
<div class="fixed top-4 left-4 z-10">
    <Button 
        variant="neon" 
        size="icon" 
        onclick={toggleSound}
        class="w-12 h-12"
        aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
    >
        {#if soundEnabled}
            <!-- Sound On Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
        {:else}
            <!-- Sound Off Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="22" y1="9" x2="16" y2="15"></line>
                <line x1="16" y1="9" x2="22" y2="15"></line>
            </svg>
        {/if}
    </Button>
</div>

<main class="container mx-auto px-4 py-16 flex flex-col items-center">
    <img src="/logo.png" alt="Neon Quest Logo" class="mb-8 w-[400px] h-auto drop-shadow-[0_0_16px_#00e0ff]" />
    <p class="mb-8 text-lg text-center">Choose your maze level and start playing!</p>

    {#if mazes.length > 0}
        <div class="flex flex-wrap gap-4 justify-center mb-8">
            <ToggleGroup.Root type="single" size="lg" variant="neon" class="mb-4 gap-3" bind:value={selectedLevel}>
          
            {#each mazes as maze}
                <ToggleGroup.Item value={`${maze.maze_id}`} aria-label="Toggle bold" class="py-10 max-w-[200px]" onclick={playClickSound}>
                    <span class="font-bold px-6 py-6 text-wrap">{maze.mazeName}</span>
                </ToggleGroup.Item>
            {/each}
              </ToggleGroup.Root>
        </div>
        <Button variant="solid-neon" disabled={!selectedLevel} size="lg" class="mb-8 w-40" onclick={handlePlay}>
            Start Game
        </Button>

    {:else}
        <div class="text-center text-xl text-gray-500">Loading maze levels...</div>
    {/if}
</main>
