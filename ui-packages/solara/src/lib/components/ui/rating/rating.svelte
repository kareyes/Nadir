<script lang="ts" module>
	import { cn, type WithElementRef } from "complib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";
	import { Star, StarHalf } from "@lucide/svelte";

	export const ratingVariants = tv({
		slots: {
			root: "flex items-center gap-1",
			star: "cursor-pointer transition-colors duration-200",
			filledStar: "text-yellow-400 fill-yellow-400",
			halfStar: "text-yellow-400 fill-yellow-400",
			emptyStar: "text-gray-300 fill-gray-300 hover:text-yellow-200 hover:fill-yellow-200",
			readOnlyEmptyStar: "text-gray-300 fill-gray-300",
			readOnlyFilledStar: "text-yellow-400 fill-yellow-400",
		},
		variants: {
			size: {
				sm: {
					star: "size-4",
				},
				default: {
					star: "size-5",
				},
				lg: {
					star: "size-6",
				},
				xl: {
					star: "size-8",
				},
			},
			color: {
				yellow: {
					filledStar: "text-yellow-400 fill-yellow-400",
					halfStar: "text-yellow-400 fill-yellow-400",
					emptyStar: "text-gray-300 fill-gray-300 hover:text-yellow-200 hover:fill-yellow-200",
					readOnlyFilledStar: "text-yellow-400 fill-yellow-400",
				},
				red: {
					filledStar: "text-red-400 fill-red-400",
					halfStar: "text-red-400 fill-red-400",
					emptyStar: "text-gray-300 fill-gray-300 hover:text-red-200 hover:fill-red-200",
					readOnlyFilledStar: "text-red-400 fill-red-400",
				},
				blue: {
					filledStar: "text-blue-400 fill-blue-400",
					halfStar: "text-blue-400 fill-blue-400",
					emptyStar: "text-gray-300 fill-gray-300 hover:text-blue-200 hover:fill-blue-200",
					readOnlyFilledStar: "text-blue-400 fill-blue-400",
				},
				green: {
					filledStar: "text-green-400 fill-green-400",
					halfStar: "text-green-400 fill-green-400",
					emptyStar: "text-gray-300 fill-gray-300 hover:text-green-200 hover:fill-green-200",
					readOnlyFilledStar: "text-green-400 fill-green-400",
				},
				purple: {
					filledStar: "text-purple-400 fill-purple-400",
					halfStar: "text-purple-400 fill-purple-400",
					emptyStar: "text-gray-300 fill-gray-300 hover:text-purple-200 hover:fill-purple-200",
					readOnlyFilledStar: "text-purple-400 fill-purple-400",
				},
			},
		},
		defaultVariants: {
			size: "default",
			color: "yellow",
		},
	});

	export type RatingSize = VariantProps<typeof ratingVariants>["size"];
	export type RatingColor = VariantProps<typeof ratingVariants>["color"];

	export type RatingProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		value?: number;
		max?: number;
		readonly?: boolean;
		allowHalf?: boolean;
		size?: RatingSize;
		color?: RatingColor;
		showValue?: boolean;
		precision?: number;
		onRatingChange?: (rating: number) => void;
	};
</script>

<script lang="ts">
	let {
		value = 0,
		max = 5,
		readonly = false,
		allowHalf = true,
		size = "default",
		color = "yellow",
		showValue = false,
		precision = 1,
		onRatingChange,
		class: className,
		...restProps
	}: RatingProps = $props();

	let hoverValue = $state(0);
	let isHovering = $state(false);

	const variants = ratingVariants({ size, color });

	function getStarType(index: number): "filled" | "half" | "empty" {
		const currentValue = isHovering && !readonly ? hoverValue : value;
		
		if (currentValue >= index + 1) return "filled";
		if (allowHalf && currentValue >= index + 0.5) return "half";
		return "empty";
	}

	function handleStarClick(index: number, isHalf: boolean = false) {
		if (readonly) return;
		
		const newValue = isHalf ? index + 0.5 : index + 1;
		onRatingChange?.(Number(newValue.toFixed(precision)));
	}

	function handleStarHover(index: number, isHalf: boolean = false) {
		if (readonly) return;
		
		isHovering = true;
		hoverValue = isHalf ? index + 0.5 : index + 1;
	}

	function handleMouseLeave() {
		if (readonly) return;
		
		isHovering = false;
		hoverValue = 0;
	}

	function getStarClass(starType: "filled" | "half" | "empty") {
		if (readonly) {
			return cn(
				variants.star(),
				starType === "filled" || starType === "half" 
					? variants.readOnlyFilledStar() 
					: variants.readOnlyEmptyStar()
			);
		}

		switch (starType) {
			case "filled":
				return cn(variants.star(), variants.filledStar());
			case "half":
				return cn(variants.star(), variants.halfStar());
			case "empty":
			default:
				return cn(variants.star(), variants.emptyStar());
		}
	}
</script>

<div 
	class={cn(variants.root(), className)} 
	onmouseleave={handleMouseLeave}
	role="radiogroup"
	aria-label="Rating"
	{...restProps}
>
	{#each Array(max) as _, index}
		{@const starType = getStarType(index)}
		
		{#if starType === "half" && allowHalf}
			<!-- Half star implementation -->
			<div class="relative inline-block">
				<!-- Background empty star -->
				<Star class={getStarClass("empty")} />
				<!-- Foreground half star -->
				<div class="absolute inset-0 overflow-hidden" style="width: 50%;">
					<Star class={getStarClass("filled")} />
				</div>
				
				{#if !readonly}
					<!-- Left half click area -->
					<button
						type="button"
						class="absolute inset-0 w-1/2 bg-transparent"
						onclick={() => handleStarClick(index, true)}
						onmouseenter={() => handleStarHover(index, true)}
						aria-label={`Rate ${index + 0.5} out of ${max} stars`}
					></button>
					<!-- Right half click area -->
					<button
						type="button"
						class="absolute inset-0 left-1/2 w-1/2 bg-transparent"
						onclick={() => handleStarClick(index, false)}
						onmouseenter={() => handleStarHover(index, false)}
						aria-label={`Rate ${index + 1} out of ${max} stars`}
					></button>
				{/if}
			</div>
		{:else}
			<!-- Full star -->
			{#if readonly}
				<Star class={getStarClass(starType)} />
			{:else}
				<button
					type="button"
					onclick={() => handleStarClick(index)}
					onmouseenter={() => handleStarHover(index)}
					aria-label={`Rate ${index + 1} out of ${max} stars`}
					class="bg-transparent border-none p-0"
				>
					<Star class={getStarClass(starType)} />
				</button>
			{/if}
		{/if}
	{/each}
	
	{#if showValue}
		<span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
			{Number(value.toFixed(precision))}/{max}
		</span>
	{/if}
</div>
