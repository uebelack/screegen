import { defineConfig, lazyPlugins } from "vite-plus";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: lazyPlugins(() => [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ]),
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ScreegenComponents",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      // Externalize the peers *and their subpaths* (e.g. react/jsx-runtime,
      // react/jsx-dev-runtime). Matching only bare "react" would inline the
      // JSX runtime, which then does `require("react")` and breaks in the browser.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^react-router-dom($|\/)/],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM",
        },
      },
    },
    cssCodeSplit: false,
  },
});
