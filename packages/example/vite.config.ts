import { defineConfig, lazyPlugins } from "vite-plus";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: lazyPlugins(() => [react()]),
  server: {
    open: true,
  },
});
