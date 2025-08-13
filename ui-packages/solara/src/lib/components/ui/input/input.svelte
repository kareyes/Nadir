<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
	import { cn, type WithElementRef } from "complib/utils.js";
	import type { Component } from "svelte";
	import { Icons } from "complib";
	import BaseInput from "./base-input.svelte";
	import FileInput from "./file-input.svelte";

	type InputType = Exclude<HTMLInputTypeAttribute, "file">;
	type InputVariant = "default" | "neon";

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined }) & {
				variant?: InputVariant;
				label?: string;
				error?: string;
				description?: string;
				required?: boolean;
				leftIcon?: Component<Icons.IconProps, {}, "">;
				rightIcon?: Component<Icons.IconProps, {}, "">;
				disabled?: boolean;
			}
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		variant = "default",
		label,
		error,
		description,
		required = false,
		leftIcon,
		rightIcon,
		disabled = false,
		class: className,
		id,
		...restProps
	}: Props = $props();

	const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

	const labelVariants = {
		default: "text-sm font-medium text-foreground ",
		neon: "text-sm font-medium text-gray-300"
	};

	const errorTextVariants = {
		default: "text-sm text-destructive",
		neon: "text-sm text-red-400"
	};

	const descriptionVariants = {
		default: "text-sm text-muted-foreground",
		neon: "text-sm text-gray-400"
	};
</script>

<div class="space-y-2">
	{#if label}
		<label for={inputId} class={cn(labelVariants[variant], required && "after:content-['*'] after:ml-0.5 after:text-red-500 ")}>
			{label}
		</label>
	{/if}

	{#if description}
		<p id="{inputId}-description" class={descriptionVariants[variant]}>
			{description}
		</p>
	{/if}

	{#if type === "file"}
		<FileInput
			bind:ref
			id={inputId}
			{variant}
			{error}
			leftIcon={leftIcon}
			rightIcon={rightIcon}
			{disabled}
			class={className}
			bind:files
			bind:value
			aria-describedby={error ? `${inputId}-error` : description ? `${inputId}-description` : undefined}
			{...restProps}
		/>
	{:else}
		<BaseInput
			bind:ref
			id={inputId}
			{type}
			{variant}
			{error}
			leftIcon={leftIcon}
			rightIcon={rightIcon}
			{disabled}
			class={className}
			bind:value
			aria-describedby={error ? `${inputId}-error` : description ? `${inputId}-description` : undefined}
			{...restProps}
		/>
	{/if}

	{#if error}
		<p id="{inputId}-error" class={errorTextVariants[variant]} role="alert">
			{error}
		</p>
	{/if}
</div>
