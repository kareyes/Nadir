import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			"@nadir/global-types": "../../packages/global-types/src/*",
			// "@nadir/starlight": "../../ui-packages/starlight/src/*",
			"@nadir/solara": "../../ui-packages/solara/src/*",
			complib: "../../ui-packages/solara/src/lib/*",
		},
	},
};

export default config;

