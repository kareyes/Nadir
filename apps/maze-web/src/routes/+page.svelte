<script lang="ts">
import { goto } from "$app/navigation";
import type { Maze } from "@nadir/global-types";
import { Button, ToggleGroup } from "@nadir/solara";
import { onMount } from "svelte";

let { data } = $props();
let mazes = $state<Maze[]>([]);
let selectedLevel = $state("");

onMount(async () => {
	try {
		const mazeData = await data.maze();
		mazes = Array.isArray(mazeData) ? mazeData : [mazeData];

		// Initialize audio
	} catch (error) {
		console.error("Error loading maze list:", error);
	}
});

const handlePlay = () => {
	goto(`/` + selectedLevel);
};
</script>



<main class="container mx-auto px-4 py-16 flex flex-col items-center">
    <img src="/logo.png" alt="Neon Quest Logo" class="mb-8 w-[400px] h-auto drop-shadow-[0_0_16px_#00e0ff]" />
    <p class="mb-8 text-lg text-center">Choose your maze level and start playing!</p>

    {#if mazes.length > 0}
        <div class="flex flex-wrap gap-4 justify-center mb-8">
            <ToggleGroup.Root type="single" size="lg" variant="neon" class="mb-4 gap-3" bind:value={selectedLevel}>
          
            {#each mazes as maze}
                <ToggleGroup.Item value={`${maze.maze_id}`} aria-label="Toggle bold" class="py-10 max-w-[200px]" >
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
