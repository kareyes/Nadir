<script lang="ts" module>
	import { cn, type WithElementRef } from "complib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
				destructive:
					"bg-destructive shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white",
				outline:
					"bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border",
				secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
				neon: "bg-transparent border border-cyan-400/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:border-cyan-300 hover:text-cyan-300 active:shadow-[0_0_20px_rgba(6,182,212,0.7)] active:border-cyan-200 active:text-cyan-200 transition-[color,box-shadow,border-color] duration-300 min-w-16 px-4 rounded-lg",
				"neon-green": "bg-transparent border border-green-400/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:border-green-300 hover:text-green-300 active:shadow-[0_0_20px_rgba(34,197,94,0.7)] active:border-green-200 active:text-green-200 transition-[color,box-shadow,border-color] duration-300 min-w-16 px-4 rounded-lg",
				"neon-pink": "bg-transparent border border-pink-400/50 text-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.3)] hover:shadow-[0_0_15px_rgba(244,114,182,0.5)] hover:border-pink-300 hover:text-pink-300 active:shadow-[0_0_20px_rgba(244,114,182,0.7)] active:border-pink-200 active:text-pink-200 transition-[color,box-shadow,border-color] duration-300 min-w-16 px-4 rounded-lg",
				"neon-purple": "bg-transparent border border-purple-400/50 text-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.3)] hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:border-purple-300 hover:text-purple-300 active:shadow-[0_0_20px_rgba(147,51,234,0.7)] active:border-purple-200 active:text-purple-200 transition-[color,box-shadow,border-color] duration-300 min-w-16 px-4 rounded-lg",
				"neon-orange": "bg-transparent border border-orange-400/50 text-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.3)] hover:shadow-[0_0_15px_rgba(251,146,60,0.5)] hover:border-orange-300 hover:text-orange-300 active:shadow-[0_0_20px_rgba(251,146,60,0.7)] active:border-orange-200 active:text-orange-200 transition-[color,box-shadow,border-color] duration-300 min-w-16 px-4 rounded-lg",
				"solid-neon": "bg-cyan-500 text-white border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4),inset_0_0_15px_rgba(6,182,212,0.2)] hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.6),inset_0_0_20px_rgba(6,182,212,0.3)] active:bg-cyan-300 active:shadow-[0_0_30px_rgba(6,182,212,0.8),inset_0_0_25px_rgba(6,182,212,0.4)] transition-[background-color,box-shadow] duration-300 min-w-16 px-4 rounded-lg",
				"solid-neon-green": "bg-green-500 text-white border border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4),inset_0_0_15px_rgba(34,197,94,0.2)] hover:bg-green-400 hover:shadow-[0_0_25px_rgba(34,197,94,0.6),inset_0_0_20px_rgba(34,197,94,0.3)] active:bg-green-300 active:shadow-[0_0_30px_rgba(34,197,94,0.8),inset_0_0_25px_rgba(34,197,94,0.4)] transition-[background-color,box-shadow] duration-300 min-w-16 px-4 rounded-lg",
				"solid-neon-pink": "bg-pink-500 text-white border border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.4),inset_0_0_15px_rgba(244,114,182,0.2)] hover:bg-pink-400 hover:shadow-[0_0_25px_rgba(244,114,182,0.6),inset_0_0_20px_rgba(244,114,182,0.3)] active:bg-pink-300 active:shadow-[0_0_30px_rgba(244,114,182,0.8),inset_0_0_25px_rgba(244,114,182,0.4)] transition-[background-color,box-shadow] duration-300 min-w-16 px-4 rounded-lg",
				"solid-neon-purple": "bg-purple-500 text-white border border-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.4),inset_0_0_15px_rgba(147,51,234,0.2)] hover:bg-purple-400 hover:shadow-[0_0_25px_rgba(147,51,234,0.6),inset_0_0_20px_rgba(147,51,234,0.3)] active:bg-purple-300 active:shadow-[0_0_30px_rgba(147,51,234,0.8),inset_0_0_25px_rgba(147,51,234,0.4)] transition-[background-color,box-shadow] duration-300 min-w-16 px-4 rounded-lg",
				"solid-neon-orange": "bg-orange-500 text-white border border-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.4),inset_0_0_15px_rgba(251,146,60,0.2)] hover:bg-orange-400 hover:shadow-[0_0_25px_rgba(251,146,60,0.6),inset_0_0_20px_rgba(251,146,60,0.3)] active:bg-orange-300 active:shadow-[0_0_30px_rgba(251,146,60,0.8),inset_0_0_25px_rgba(251,146,60,0.4)] transition-[background-color,box-shadow] duration-300 min-w-16 px-4 rounded-lg",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
