<script lang="ts" module>
	import { cn, type WithElementRef, type WithoutChildren } from "complib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import { type VariantProps, tv } from "tailwind-variants";

	export const loadingVariants = tv({
		slots: {
			root: "inline-flex items-center gap-2",
			spinner: "animate-spin",
			text: "text-sm font-medium",
		},
		variants: {
			alignment: {
				horizontal: {
					root: "flex-row items-center",
				},
				vertical: {
					root: "flex-col items-center",
				},
			},
			size: {
				sm: {
					spinner: "size-4",
					text: "text-xs",
				},
				default: {
					spinner: "size-5",
					text: "text-sm",
				},
				lg: {
					spinner: "size-6",
					text: "text-base",
				},
				xl: {
					spinner: "size-8",
					text: "text-lg",
				},
			},
			color: {
				default: {
					spinner: "text-foreground",
					text: "text-foreground",
				},
				primary: {
					spinner: "text-primary",
					text: "text-primary",
				},
				secondary: {
					spinner: "text-secondary-foreground",
					text: "text-secondary-foreground",
				},
				muted: {
					spinner: "text-muted-foreground",
					text: "text-muted-foreground",
				},
				destructive: {
					spinner: "text-destructive",
					text: "text-destructive",
				},
				neon: {
					spinner: "text-cyan-400",
					text: "text-cyan-400",
				},
				"neon-green": {
					spinner: "text-green-400",
					text: "text-green-400",
				},
				"neon-pink": {
					spinner: "text-pink-400",
					text: "text-pink-400",
				},
				"neon-purple": {
					spinner: "text-purple-400",
					text: "text-purple-400",
				},
				"neon-orange": {
					spinner: "text-orange-400",
					text: "text-orange-400",
				},
			},
		},
		defaultVariants: {
			alignment: "horizontal",
			size: "default",
			color: "default",
		},
	});

	export type LoadingVariant = VariantProps<typeof loadingVariants>;
	export type LoadingAlignment = NonNullable<LoadingVariant["alignment"]>;
	export type LoadingSize = NonNullable<LoadingVariant["size"]>;
	export type LoadingColor = NonNullable<LoadingVariant["color"]>;

	export type LoadingProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		alignment?: LoadingAlignment;
		size?: LoadingSize;
		color?: LoadingColor;
		text?: string;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { Loader2 } from "@lucide/svelte";

	let {
		ref = $bindable(null),
		class: className,
		alignment = "horizontal",
		size = "default",
		color = "default",
		text,
		children,
		...restProps
	}: LoadingProps = $props();

	const variants = $derived(loadingVariants({ alignment, size, color }));
</script>

<div
	bind:this={ref}
	data-slot="loading"
	class={cn(variants.root(), className)}
	{...restProps}
>
	<div class={variants.spinner()}>
		{#if children}
			{@render children()}
		{:else}
			<Loader2 class="size-full" />
		{/if}
	</div>
	
	{#if text}
		<span class={variants.text()}>
			{text}
		</span>
	{/if}
</div>
