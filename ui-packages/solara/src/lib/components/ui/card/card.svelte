<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "complib/utils.js";

	type CardVariant = "default" | "neon" | "shadow" | "glass";

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: CardVariant;
	};

	let {
		ref = $bindable(null),
		variant = "default",
		class: className,
		children,
		...restProps
	}: Props = $props();

	const cardVariants = {
		default: "bg-card text-card-foreground border shadow-sm",
		neon: "bg-black/30 text-white border-cyan-500/30 shadow-[0_0_20px_rgba(0,224,255,0.3)] backdrop-blur-sm",
		shadow: "bg-card text-card-foreground border-0 shadow-2xl shadow-black/25",
		glass: "bg-white/10 text-white border-white/20 backdrop-blur-md shadow-xl"
	};
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		"flex flex-col gap-6 rounded-xl py-6",
		cardVariants[variant],
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
