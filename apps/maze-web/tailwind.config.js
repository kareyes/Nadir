/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		// "./node_modules/@nadir/starlight/dist/**/*.{html,js,svelte,ts}",
		"../../ui-packages/solara/src/**/*.{html,js,svelte,ts}",
	],
};
export default config;
