<script lang="ts">
import { goto } from "$app/navigation";
import GamePad from "$lib/svg/GamePad.svelte";
import LoadGame from "$lib/svg/LoadGame.svelte";
import Podium from "$lib/svg/Podium.svelte";
import type { Maze } from "@nadir/global-types";
import { Button, Icons, Loading } from "@nadir/solara";
import { onMount } from "svelte";

let { data } = $props();
let mazes = $state<Maze[]>([]);

onMount(async () => {
	try {
		const mazeData = await data.maze();
		mazes = Array.isArray(mazeData) ? mazeData : [mazeData];
	} catch (error) {
		console.error("Error loading maze list:", error);
	}
});
</script>

<main class="container mx-auto px-4 py-16 flex flex-col items-center">

    <img src="/logo.png" alt="Neon Quest Logo" class="mb-8 w-[400px] h-auto drop-shadow-[0_0_16px_#00e0ff]" />
    <!-- <p class="mb-8 text-lg text-center">Choose your maze level and start playing!</p> -->

    {#if mazes.length > 0}
        <div class="grid grid-cols-1 gap-4 justify-center mb-14 max-w-md">
              <Button variant="neon" size="xl" class="w-[20rem] h-[8rem] flex flex-col items-center justify-center border-3" onclick={() => goto(`/register`)}>
                <GamePad class="size-10" />
                New Game
              </Button>
                <Button variant="neon-pink" size="xl" class="w-[20rem] h-[8rem] flex flex-col items-center justify-center border-3" onclick={() => goto(`/login`)}>
               <LoadGame class="size-10" />
                Load Game
              </Button>

               <Button variant="neon-green" size="xl" class="w-[20rem] h-[8rem] flex flex-col items-center justify-center border-3">
                <Podium size={3} class="size-10"/>
                Leaderboard

              </Button>      
        </div>

    {:else}
        <div class="flex justify-center items-center h-screen">
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
