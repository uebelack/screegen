import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    semi: true,
    tabWidth: 2,
    trailingComma: "all",
    // Don't format vendored SDKs, build output, or generated artifacts.
    ignorePatterns: [
      ".yarn/**",
      "**/dist/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/public/raw/**",
    ],
  },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    ignorePatterns: ["**/dist/**", "**/coverage/**", "**/node_modules/**", ".yarn/**"],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "no-unused-vars": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        // Test files reference mocked/unbound methods (e.g. expect(fs.mkdir))
        // and stringify objects in assertions; these type-aware rules are noise here.
        files: ["**/*.test.ts", "**/*.test.tsx"],
        rules: {
          "typescript/unbound-method": "off",
          "typescript/no-base-to-string": "off",
        },
      },
    ],
  },
});
