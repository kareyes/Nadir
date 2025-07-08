<script lang="ts">
const {
	row,
	col,
	isPlayer,
	isStart,
	isEnd,
	isInSolution,
	hasTopWall,
	hasLeftWall,
	hasBottomWall,
	hasRightWall,
} = $props<{
	row: number;
	col: number;
	isPlayer: boolean;
	isStart: boolean;
	isEnd: boolean;
	isInSolution: boolean;
	hasTopWall: boolean;
	hasLeftWall: boolean;
	hasBottomWall: boolean;
	hasRightWall: boolean;
}>();

const directions = {
	top: hasTopWall ? "top-0 left-0 right-0 h-0.5" : "",
	left: hasLeftWall ? "top-0 bottom-0 left-0 w-0.5" : "",
	bottom: hasBottomWall ? "bottom-0 left-0 right-0 h-0.5" : "",
	right: hasRightWall ? "top-0 bottom-0 right-0 w-0.5" : "",
};
</script>

<div class="w-full h-full relative aspect-square bg-white">
    {#if isPlayer}
        <div class="absolute inset-0 flex items-center justify-center m-1 text-2xl">🧑‍🦱</div>
    {:else if isStart}
        <div class="absolute inset-0 bg-green-200 m-1"></div>
    {:else if isEnd}
        <div class="absolute inset-0 bg-red-200 m-1"></div>
    {:else if isInSolution}
        <div class="absolute inset-0 bg-yellow-200 opacity-70 m-1 animate-fade-in"></div>
    {/if}

    {#each Object.entries(directions) as [index, wall]}
        {#if wall}
            <div class="absolute bg-gray-800 {wall}"></div>
        {/if}
    {/each}

    <!-- {#if hasTopWall}
        <div class="absolute top-0 left-0 right-0 h-0.5 bg-gray-800"></div>
    {/if}
    {#if hasLeftWall}
        <div class="absolute top-0 bottom-0 left-0 w-0.5 bg-gray-800"></div>
    {/if} -->

    <!-- {#if hasTopWall}
        <div class="absolute top-0 left-0 right-0 h-0.5 bg-gray-800"></div>
    {/if}
    {#if hasLeftWall}
        <div class="absolute top-0 bottom-0 left-0 w-0.5 bg-gray-800"></div>
    {/if}
    {#if hasBottomWall}
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800"></div>
    {/if}
    {#if hasRightWall}
        <div class="absolute top-0 bottom-0 right-0 w-0.5 bg-gray-800"></div>
    {/if} -->
</div>

<style>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 0.7; }
}
.animate-fade-in {
  animation: fade-in 0.4s ease-in;
}
</style>
