<script lang="ts">
import { onMount } from "svelte";
import "../app.css";
import { Button } from "@nadir/solara";

let { children } = $props();

let soundEnabled = $state(false);
let backgroundMusic: HTMLAudioElement | null = $state(null);
let clickSound: HTMLAudioElement | null = $state(null);

const initializeAudio = () => {
	// Create background music audio element
	backgroundMusic = new Audio("/audio/background-music.mp3");
	backgroundMusic.loop = true;
	backgroundMusic.volume = 0.3;

	// Create click sound effect
	clickSound = new Audio("/audio/click.mp3");
	clickSound.volume = 0.5;

	// Start playing background music if sound is enabled
	if (soundEnabled && backgroundMusic) {
		backgroundMusic.play().catch((e) => {
			console.log("Auto-play prevented. Music will start on user interaction.");
		});
	}
};

const playClickSound = () => {
	if (soundEnabled && clickSound) {
		clickSound.currentTime = 0; // Reset to beginning
		clickSound
			.play()
			.catch((e) => console.log("Error playing click sound:", e));
	}
};

const toggleSound = () => {
	soundEnabled = !soundEnabled;

	if (soundEnabled) {
		// Enable sound and start background music
		if (backgroundMusic) {
			backgroundMusic
				.play()
				.catch((e) => console.log("Error playing background music:", e));
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

onMount(async () => {
	try {
		initializeAudio();
	} catch (error) {
		console.error("Error loading maze list:", error);
	}
});
</script>


<svelte:head>
    <title>Neon Quest</title>
</svelte:head>

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
{@render children()}
