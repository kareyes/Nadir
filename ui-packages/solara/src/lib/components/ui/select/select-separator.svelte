<script lang="ts">
	import type { Separator as SeparatorPrimitive } from "bits-ui";
	import { Separator } from "complib/components/ui/separator/index.js";
	import { cn } from "complib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SeparatorPrimitive.RootProps = $props();
</script>

<Separator
	bind:ref
	data-slot="select-separator"
	class={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
	{...restProps}
/>
