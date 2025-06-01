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

import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@root': path.resolve(__dirname, '../../')
    }
  }
});