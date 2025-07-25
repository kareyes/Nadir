<script lang="ts">
import { onMount } from "svelte";
import "../app.css";
import { Button, Icons } from "@nadir/solara";

let { children } = $props();

let soundEnabled = $state(false);
let backgroundMusic: HTMLAudioElement | null = $state(null);

const initializeAudio = () => {
	backgroundMusic = new Audio("/audio/background-music.mp3");
	backgroundMusic.loop = true;
	backgroundMusic.volume = 0.3;
	if (soundEnabled && backgroundMusic) {
		backgroundMusic.play().catch((e) => {
			console.log("Auto-play prevented. Music will start on user interaction.");
		});
	}
};

const toggleSound = () => {
	soundEnabled = !soundEnabled;

	if (soundEnabled) {
		if (backgroundMusic) {
			backgroundMusic
				.play()
				.catch((e) => console.log("Error playing background music:", e));
		}
		console.log("Sound enabled");
	} else {
		if (backgroundMusic) {
			backgroundMusic.pause();
		}
		console.log("Sound disabled");
	}
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
			 <Icons.Volume2Icon />
        {:else}
			 <Icons.VolumeXIcon />

        {/if}
    </Button>
</div>
{@render children()}
