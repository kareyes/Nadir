import type { Meta, StoryContext, StoryObj } from "@storybook/sveltekit";
import { ButtonVariant, ButtonSize } from "../button.svelte";
import Button from "../button.svelte";
import { buildSourceCodeCleanerFn } from "../../../storybook-utils/index.js";

// need to mask svelte components that use slots in a view.
// svelte only figures out stuff during build, we are doing dynamic testing here, so, we are out of luck.
// created a pretty janky approach for this, check out the storybook-utils folder

const viewName = "ButtonView";
const componentName = "Button";
const defaultSlotValue = "Button";

const slotFiller = (slot: unknown) => `${slot ?? defaultSlotValue}`;

const meta = {
	title: "lightyear/Buttons/Button",
	component: Button,
	tags: ["autodocs"],
	argTypes: {
		loading: { control: { type: "boolean" } },
		variant: {
			control: { type: "select" },
			options: Variants,
		},
		size: {
			control: { type: "select" },
			options: Sizes,
		},
		slot: {
			control: { type: "text" },
			options: [slotFiller(defaultSlotValue)],
		},
	},

	parameters: {
		docs: {
			source: {
				language: "typescript",
				transform: buildSourceCodeCleanerFn(viewName, componentName, slotFiller),
			},
		},
	},
} satisfies Meta<ButtonView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: "default",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
	},
};

export const Destructive: Story = {
	args: {
		variant: "destructive",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
	},
};

export const Link: Story = {
	args: {
		variant: "link",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
	},
};

export const Small: Story = {
	args: {
		size: "sm",
	},
};
