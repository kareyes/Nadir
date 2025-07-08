<script lang="ts">
    // import {Select} from "@nadir/starlight"
const { levels, currentLevel, selectLevel } = $props<{
	levels: number;
	currentLevel: number;
	selectLevel: (index: number) => void;
}>();


const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" }
  ];
 
  let value = $state("");
 
  const triggerContent = $derived(
    fruits.find((f) => f.value === value)?.label ?? "Select a fruit"
  );
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

<!-- <Select.Root type="single" name="favoriteFruit" bind:value>
  <Select.Trigger class="w-[180px]">
    {triggerContent}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      {#each fruits as fruit (fruit.value)}
        <Select.Item
          value={fruit.value}
          label={fruit.label}
          disabled={fruit.value === "grapes"}
        >
          {fruit.label}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root> -->

<!-- <div class="flex justify-center">
    <Select.Root
        class="w-48"
    >
        <Select.Trigger class="w-full">
            <Select.Value placeholder="Select Level" />
        </Select.Trigger>
        <Select.Content>
            {#each Array(levels) as _, index}
                <Select.Item value={index}>
                    Level {index + 1}
                </Select.Item>
            {/each}
        </Select.Content>
    </Select.Root>
</div> -->
