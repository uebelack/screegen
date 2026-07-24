import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    platform: "node",
    target: "node18",
    shims: true,
    // Declared dependencies (commander, chalk, ora, prompts, get-port,
    // playwright, vite) are externalized automatically by tsdown.
  },
});
