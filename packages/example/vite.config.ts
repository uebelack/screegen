import { defineConfig, lazyPlugins } from "vite-plus";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Consume @screegen/components from source instead of its built dist/ output, so
// editing the component library hot-reloads here without a rebuild. The bare
// specifier maps to the source entry; the styles subpath maps to the source
// base stylesheet (component CSS modules load themselves from source).
const componentsSrc = resolve(__dirname, "../components/src");

export default defineConfig({
  plugins: lazyPlugins(() => [react()]),
  resolve: {
    alias: [
      {
        find: "@screegen/components/styles.css",
        replacement: resolve(componentsSrc, "styles/base.scss"),
      },
      {
        find: /^@screegen\/components$/,
        replacement: resolve(componentsSrc, "index.ts"),
      },
    ],
  },
  server: {
    open: true,
  },
});
