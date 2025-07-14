<script lang="ts">
  import * as ToggleGroup from "complib/components/ui/toggle-group/index.js";
import { Button, Dialog } from "complib/index.js";

  </script>

<Button variant="destructive" onclick={() => alert("Hello from Solara!")}>
  Click Me
</Button>

<ToggleGroup.Root type="single" size="lg" variant="neon" class="mb-4 gap-2">
  <ToggleGroup.Item value="bold" aria-label="Toggle bold">
     <span class="font-bold">Bold</span>
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic" aria-label="Toggle italic">
    <span class="font-bold">Italic</span>
  </ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
    <span class="font-bold">Soeafer</span>
  </ToggleGroup.Item>
</ToggleGroup.Root>


 
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>



<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->
