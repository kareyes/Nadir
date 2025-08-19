<script lang="ts">
import { onMount } from "svelte";
import "../app.css";
import { authService, user } from "$lib/auther/auth";
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

const handleSignOut = async () => {
	const result = await authService.signOut();
	if (result.success) {
		console.log("Signed out successfully");
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

<!-- Sound Control -->
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

<!-- Authentication UI -->
<div class="fixed top-4 right-4 z-10">
    {#if $user}
        <!-- User is signed in -->
        <div class="flex items-center space-x-2">
            <span class="text-white text-sm">Welcome, {$user.username}</span>
            <Button 
                variant="outline" 
                size="sm"
                onclick={handleSignOut}
                class="text-gray-300 border-gray-600 hover:bg-gray-800"
            >
                <Icons.LogOutIcon class="w-4 h-4 mr-1" />
                Sign Out
            </Button>
        </div>
    {:else}
        <!-- User is not signed in -->
        <div class="flex space-x-2">
            <Button 
                variant="outline" 
                size="sm"
                onclick={() => window.location.href = '/login'}
                class="text-gray-300 border-gray-600 hover:bg-gray-800"
            >
                <Icons.LogInIcon class="w-4 h-4 mr-1" />
                Sign In
            </Button>
            <Button 
                variant="solid-neon" 
                size="sm"
                onclick={() => window.location.href = '/register'}
            >
                <Icons.UserPlusIcon class="w-4 h-4 mr-1" />
                Sign Up
            </Button>
        </div>
    {/if}
</div>

{@render children()}
