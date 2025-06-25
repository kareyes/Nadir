//

import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
	},
	assetsInclude: ["**/*.wasm"],
	resolve: {
		conditions: ["development"],
	},
});
