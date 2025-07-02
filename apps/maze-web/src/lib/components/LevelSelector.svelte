<script lang="ts">
    const { levels, currentLevel, selectLevel } = $props<{
        levels: number;
        currentLevel: number;
        selectLevel: (index: number) => void;
    }>();

</script>

{#if levels > 1}
    <div class="mb-8 text-center">
        <h2 class="text-xl mb-4">Select Level</h2>
        <select
            class="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={currentLevel}
            onchange={e => selectLevel(Number(e.target.value))}
        >
            {#each Array(levels) as _, index}
                <option value={index} selected={currentLevel === index}>
                    Level {index + 1}
                </option>
            {/each}
        </select>
    </div>
{/if}
