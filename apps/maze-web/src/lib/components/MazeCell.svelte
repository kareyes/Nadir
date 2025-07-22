<script lang="ts">
const {
	isPlayer,
	isStart,
	isEnd,
	isInSolution,
	hasTopWall,
	hasLeftWall,
	hasBottomWall,
	hasRightWall,
} = $props();

const directions = {
	top: hasTopWall ? "top-0 left-0 right-0 h-0.5" : "",
	left: hasLeftWall ? "top-0 bottom-0 left-0 w-0.5" : "",
	bottom: hasBottomWall ? "bottom-0 left-0 right-0 h-0.5" : "",
	right: hasRightWall ? "top-0 bottom-0 right-0 w-0.5" : "",
};
</script>

<div class="w-full h-full relative aspect-square bg-gray-900">
    {#if isPlayer}
        <div class="absolute inset-0 flex items-center justify-center m-1 text-2xl filter drop-shadow-[0_0_8px_#00e0ff]">
            <img src="/Fox.gif" alt="Player"  />
        </div>
    {:else if isStart}
        <div class="absolute inset-0 bg-green-400/30 border border-green-400/50 shadow-[0_0_10px_rgba(34,197,94,0.3)] m-1"></div>
    {:else if isEnd}
        <div class="absolute inset-0 bg-red-400/30 border border-red-400/50 shadow-[0_0_10px_rgba(239,68,68,0.3)] m-1"></div>
    {:else if isInSolution}
        <div class="absolute inset-0 flex items-center justify-center m-1">
            <div class="w-2 h-2 bg-pink-400 border border-pink-300 rounded-full shadow-[0_0_6px_rgba(244,114,182,0.6)] animate-pulse"></div>
        </div>
    {/if}

    {#each Object.entries(directions) as [_, wall]}
        {#if wall}
            <div class="absolute bg-cyan-400 shadow-[0_0_4px_rgba(6,182,212,0.5)] {wall}"></div>
        {/if}
    {/each}
</div>

