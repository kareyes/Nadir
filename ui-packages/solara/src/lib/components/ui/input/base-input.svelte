<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "complib/utils.js";
	import type { Component } from "svelte";
	import { Icons } from "complib";

	type InputVariant = "default" | "neon";

	type Props = WithElementRef<
		HTMLInputAttributes & {
			variant?: InputVariant;
			error?: string;
			leftIcon?: Component<Icons.IconProps, {}, "">;
			rightIcon?: Component<Icons.IconProps, {}, "">;
		}
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		variant = "default",
		error,
		leftIcon: LeftIcon,
		rightIcon: RightIcon,
		disabled = false,
		class: className,
		id,
		...restProps
	}: Props = $props();

	const inputVariants = {
		default: "border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground shadow-xs",
		neon: "border-cyan-500/50 bg-gray-900/50 text-white placeholder:text-gray-400 shadow-[0_0_10px_rgba(0,224,255,0.2)] selection:bg-cyan-400 selection:text-black backdrop-blur-sm"
	};

	const focusVariants = {
		default: "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
		neon: "focus-visible:border-cyan-400 focus-visible:ring-cyan-400/30 focus-visible:ring-[3px] focus-visible:shadow-[0_0_20px_rgba(0,224,255,0.4)]"
	};

	const errorVariants = {
		default: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
		neon: "border-red-500 focus-visible:border-red-400 focus-visible:ring-red-400/30 focus-visible:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
	};
</script>

<div class="relative">
	{#if LeftIcon}
		<div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
			<LeftIcon class={cn("h-4 w-4", variant === "neon" ? "text-gray-400" : "text-muted-foreground")} />
		</div>
	{/if}

	<input
		bind:this={ref}
		data-slot="input"
		{id}
		class={cn(
			"flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			inputVariants[variant],
			error ? errorVariants[variant] : focusVariants[variant],
			LeftIcon && "pl-9",
			RightIcon && "pr-9",
			disabled && "opacity-50 cursor-not-allowed",
			className
		)}
		{type}
		bind:value
		{disabled}
		aria-invalid={error ? "true" : "false"}
		{...restProps}
	/>

	{#if RightIcon}
		<div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
			<RightIcon class={cn("h-4 w-4", variant === "neon" ? "text-gray-400" : "text-muted-foreground")} />
		</div>
	{/if}
</div>
