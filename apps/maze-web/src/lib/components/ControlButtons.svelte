<script lang="ts">
function dispatch(key: string) {
	return new CustomEvent("move", { detail: key });
}
</script>

<div class="mt-8 text-center">
    <p class="mb-4 text-gray-600">Use arrow keys to move through the maze</p>
    <div class="flex justify-center gap-4">
        <button 
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            on:click={() => dispatch('ArrowUp')}
        >
            ↑
        </button>
    </div>
    <div class="flex justify-center gap-4 my-2">
        <button 
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            on:click={() => dispatch('ArrowLeft')}
        >
            ←
        </button>
        <button 
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            on:click={() => dispatch('ArrowDown')}
        >
            ↓
        </button>
        <button 
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            on:click={() => dispatch('ArrowRight')}
        >
            →
        </button>
    </div>
</div>
