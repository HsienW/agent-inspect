import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "packages/mcp-server/src/index.ts",
    cli: "packages/mcp-server/src/cli.ts",
  },
  outDir: "packages/mcp-server/dist",
  format: ["esm", "cjs"],
  outExtension({ format }) {
    return { js: format === "esm" ? ".mjs" : ".cjs" };
  },
  dts: {
    entry: {
      index: "packages/mcp-server/src/index.ts",
    },
  },
  sourcemap: true,
  clean: true,
  treeshake: true,
  platform: "node",
  target: "es2022",
});
