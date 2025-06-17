// import { defineConfig } from "vite";
// import { VitePluginNode } from "vite-plugin-node";

// export default defineConfig({
// 	// test: {
// 	// 	globals: true,
// 	// 	environment: "node",
// 	// 	coverage: {
// 	// 		reporter: ["text", "lcov"],
// 	// 	},
// 	// 	include: ["src/**/*.test.ts"],
// 	// },
// });

import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		alias: {
			"@root": path.resolve(__dirname, "../../"),
		},
	},
});
