<script lang="ts">
  import * as ToggleGroup from "complib/components/ui/toggle-group/index.js";
import { Button, Dialog, Loading, Rating } from "complib/index.js";
import { RefreshCw, Loader } from "@lucide/svelte";

let ratingValue = $state(3.5);
let interactiveRating = $state(0);

  </script>

<div class="space-y-8 p-8">

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

<!-- Loading Component Examples -->
<div class="space-y-6">
  <h2 class="text-2xl font-bold">Loading Component Examples</h2>
  
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Basic Loading</h3>
    <Loading.Root text="Loading..." />
  </div>

  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Different Sizes</h3>
    <div class="flex items-center gap-4">
      <Loading.Root size="sm" text="Small" />
      <Loading.Root size="default" text="Default" />
      <Loading.Root size="lg" text="Large" />
      <Loading.Root size="xl" text="Extra Large" />
    </div>
  </div>

  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Different Colors</h3>
    <div class="flex flex-wrap gap-4">
      <Loading.Root color="default" text="Default" />
      <Loading.Root color="primary" text="Primary" />
      <Loading.Root color="muted" text="Muted" />
      <Loading.Root color="destructive" text="Error" />
    </div>
  </div>

  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Neon Colors</h3>
    <div class="flex flex-wrap gap-4">
      <Loading.Root color="neon" text="Neon Cyan" />
      <Loading.Root color="neon-green" text="Neon Green" />
      <Loading.Root color="neon-pink" text="Neon Pink" />
      <Loading.Root color="neon-purple" text="Neon Purple" />
      <Loading.Root color="neon-orange" text="Neon Orange" />
    </div>
  </div>

  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Alignment Options</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-muted-foreground">Horizontal (Default)</h4>
        <div class="space-y-3">
          <Loading.Root alignment="horizontal" color="neon" size="sm" text="Small horizontal" />
          <Loading.Root alignment="horizontal" color="primary" text="Default horizontal" />
          <Loading.Root alignment="horizontal" color="neon-green" size="lg" text="Large horizontal" />
        </div>
      </div>
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-muted-foreground">Vertical</h4>
        <div class="flex gap-6">
          <Loading.Root alignment="vertical" color="neon-purple" size="sm" text="Small vertical" />
          <Loading.Root alignment="vertical" color="destructive" text="Default vertical" />
          <Loading.Root alignment="vertical" color="neon-orange" size="lg" text="Large vertical" />
        </div>
      </div>
    </div>
  </div>

  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Custom SVG with Alignment</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-muted-foreground">Horizontal Custom Icons</h4>
        <div class="space-y-3">
          <Loading.Root 
            alignment="horizontal"
            color="neon-green" 
            text="Refreshing data..."
          >
            <RefreshCw class="size-full" />
          </Loading.Root>
          <Loading.Root 
            alignment="horizontal"
            color="neon-purple" 
            text="Processing request..."
          >
            <Loader class="size-full" />
          </Loading.Root>
        </div>
      </div>
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-muted-foreground">Vertical Custom Icons</h4>
        <div class="flex gap-6">
          <Loading.Root 
            alignment="vertical"
            color="neon-pink" 
            text="Syncing"
            size="lg"
          >
            <RefreshCw class="size-full" />
          </Loading.Root>
          <Loading.Root 
            alignment="vertical"
            color="neon-orange" 
            text="Computing"
            size="lg"
          >
            <Loader class="size-full" />
          </Loading.Root>
        </div>
      </div>
    </div>
  </div>

  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Loading Only (No Text)</h3>
    <div class="flex items-center gap-4">
      <Loading.Root color="neon" />
      <Loading.Root color="primary" size="lg" />
      <Loading.Root color="destructive" size="sm" />
    </div>
  </div>
</div>

<!-- Rating Component Examples -->
<div class="space-y-6">
  <h2 class="text-2xl font-bold">Rating Component Examples</h2>
  
  <div class="space-y-4">
    <div>
      <h3 class="text-lg font-semibold mb-2">Basic Rating (Read-only)</h3>
      <Rating.Root value={4.5} readonly showValue />
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Interactive Rating</h3>
      <Rating.Root 
        value={interactiveRating} 
        onRatingChange={(rating) => interactiveRating = rating}
        showValue 
      />
      <p class="text-sm text-gray-600 mt-1">Current rating: {interactiveRating}</p>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Different Sizes</h3>
      <div class="space-y-2">
        <div class="flex items-center gap-4">
          <span class="w-12 text-sm">Small:</span>
          <Rating.Root value={4} size="sm" readonly />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-12 text-sm">Default:</span>
          <Rating.Root value={4} readonly />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-12 text-sm">Large:</span>
          <Rating.Root value={4} size="lg" readonly />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-12 text-sm">Extra Large:</span>
          <Rating.Root value={4} size="xl" readonly />
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Different Colors</h3>
      <div class="space-y-2">
        <div class="flex items-center gap-4">
          <span class="w-16 text-sm">Yellow:</span>
          <Rating.Root value={4} color="yellow" readonly />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-16 text-sm">Red:</span>
          <Rating.Root value={4} color="red" readonly />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-16 text-sm">Blue:</span>
          <Rating.Root value={4} color="blue" readonly />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-16 text-sm">Green:</span>
          <Rating.Root value={4} color="green" readonly />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-16 text-sm">Purple:</span>
          <Rating.Root value={4} color="purple" readonly />
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Half Stars</h3>
      <div class="space-y-2">
        <div class="flex items-center gap-4">
          <span class="w-20 text-sm">With halves:</span>
          <Rating.Root value={3.5} readonly allowHalf showValue />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-20 text-sm">Without halves:</span>
          <Rating.Root value={3.5} readonly allowHalf={false} showValue />
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Custom Max Stars</h3>
      <Rating.Root value={7} max={10} readonly showValue />
    </div>
  </div>
</div>

 
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

</div>


<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->
