// vite.config.ts

import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
    server: {
        port: 8080,
    },
    plugins: [
        ...VitePluginNode({
            adapter: "fastify",
            appPath: "./src/index.ts",
            tsCompiler: "esbuild",
        }),
    ],
    build: {
        target: "esnext",
        outDir: "dist",
        assetsDir: "assets",
        minify: true,
    },
});