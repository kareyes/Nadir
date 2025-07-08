<script lang="ts">
import { fade } from "svelte/transition";

export let message: string;
export let isGameOver: boolean;

function dispatch(e: CustomEvent) {
	return e;
}
</script>

{#if message}
    <div class="mb-4 p-4 text-center" transition:fade>
        <p class="text-xl {isGameOver ? 'text-green-600' : 'text-red-600'}">{message}</p>
        {#if isGameOver}
            <button 
                class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                on:click={() => dispatch(new CustomEvent('reset'))}
            >
                Play Again
            </button>
        {/if}
    </div>
{/if}
