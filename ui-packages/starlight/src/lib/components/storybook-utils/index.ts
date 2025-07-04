import type { StoryContext } from "@storybook/svelte";

const addImportCode = (code: string, component: string) =>
	`import { ${component} } from "@saztrek/lightyear";\n\n${code}\n`;

const removeSlotAttribute = (htmlString: string): string => {
	// Regular expression to find the slot attribute and its value
	const slotRegex = / slot="[^"]*"/;
	// Replace the slot attribute with an empty string
	return htmlString.replace(slotRegex, "");
};

const cleanSlottedSBSource = (
	view: string,
	component: string,
	code: string,
	slotFiller: (slot: unknown) => string,
	currentSlotValue: unknown,
) => {
	// <ButtonView ... /> => <Button ... />B
	const codeWithComponentName = code.replace(view, component);

	// <Button ... /> => <Button ... >{default value}</Button>
	const slotValue = slotFiller(currentSlotValue);
	const codeWithSlotWithin = codeWithComponentName.replace("/>", `>${slotValue}</${component}>`);

	// remove the existence of the slot property as that is only for the view.
	// slots are not properties!
	// <Button slot="something" ... >{default value}</Button> => <Button ... >{default value}</Button>
	const codeWithNoSlotProp = removeSlotAttribute(codeWithSlotWithin);

	// remove the annoying space just in case no args are left
	const codeWithNoSpaceInOpeningTag = codeWithNoSlotProp.replace(" >", ">");

	return codeWithNoSpaceInOpeningTag;
};

/**
 * Creates a function to transform source code for a Storybook story by cleaning and optionally adding imports.
 *
 * @param viewName The name of the view, used to identify the specific part of the source code to clean.
 * @param component The name of the component, used for generating import statements.
 * @param slotFiller A function that takes a slot value and returns a string to replace the slot in the source code.
 * @param extraImports Optional. Additional import statements to prepend to the transformed source code.
 * @returns A function that takes the original source code and a story context object, then returns the transformed source code.
 */

export const buildSourceCodeCleanerFn = (
	viewName: string,
	component: string,
	slotFiller: (slot: unknown) => string,
	extraImports?: string,
) => {
	return (code: unknown, storyContext: StoryContext) => {
		const cleanCode = cleanSlottedSBSource(
			viewName,
			component,
			code,
			slotFiller,
			storyContext.args.slot,
		);
		const withImport = addImportCode(cleanCode, component);

		return extraImports ? `${extraImports}\n\n${withImport}` : withImport;
	};
};

export const buildSourceCodeTemplateFn = <Props>(source: (props: Props) => string) => {
	return (code: unknown, storyContext: StoryContext) => {
		return source(storyContext.allArgs);
	};
};
