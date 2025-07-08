<script lang="ts">
    import {Button, Badge} from "$library/index.js";
      import * as Select from "$lib/components/ui/select/index.js";
 
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


<Button variant="destructive" size="lg" class="mb-4">
    Click Me
</Button>

<Badge variant="default" class="mb-4">
    Default Badge
</Badge>


<Select.Root type="single" name="favoriteFruit" bind:value>
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
</Select.Root>



<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
