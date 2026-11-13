import { describe, it, expect } from "vite-plus/test";

// Import from main index to ensure coverage
import {
  Screen,
  OverviewGrid,
  ScreengenConfig,
  useColorScheme,
  getSystemColorScheme,
  useUrlState,
  colorSchemes,
} from "./index.js";

// Import from sub-indexes to ensure coverage
import {
  Screen as ScreenFromComponents,
  OverviewGrid as OverviewGridFromComponents,
  ScreengenConfig as ScreengenConfigFromComponents,
} from "./components/index.js";
import {
  useColorScheme as useColorSchemeFromHooks,
  getSystemColorScheme as getSystemColorSchemeFromHooks,
  useUrlState as useUrlStateFromHooks,
} from "./hooks/index.js";

// Import from component-level indexes
import { Screen as ScreenDirect } from "./components/Screen/index.js";
import { OverviewGrid as OverviewGridDirect } from "./components/OverviewGrid/index.js";
import { ScreengenConfig as ScreengenConfigDirect } from "./components/ScreengenConfig/index.js";

describe("package exports", () => {
  it("exports Screen component from all entry points", () => {
    expect(Screen).toBeDefined();
    expect(ScreenFromComponents).toBe(Screen);
    expect(ScreenDirect).toBe(Screen);
  });

  it("exports OverviewGrid component from all entry points", () => {
    expect(OverviewGrid).toBeDefined();
    expect(OverviewGridFromComponents).toBe(OverviewGrid);
    expect(OverviewGridDirect).toBe(OverviewGrid);
  });

  it("exports ScreengenConfig component from all entry points", () => {
    expect(ScreengenConfig).toBeDefined();
    expect(ScreengenConfigFromComponents).toBe(ScreengenConfig);
    expect(ScreengenConfigDirect).toBe(ScreengenConfig);
  });

  it("exports useColorScheme hook from all entry points", () => {
    expect(useColorScheme).toBeDefined();
    expect(useColorSchemeFromHooks).toBe(useColorScheme);
  });

  it("exports getSystemColorScheme function from all entry points", () => {
    expect(getSystemColorScheme).toBeDefined();
    expect(getSystemColorSchemeFromHooks).toBe(getSystemColorScheme);
  });

  it("exports useUrlState hook from all entry points", () => {
    expect(useUrlState).toBeDefined();
    expect(useUrlStateFromHooks).toBe(useUrlState);
  });

  it("exports colorSchemes constant", () => {
    expect(colorSchemes).toEqual(["light", "dark"]);
  });
});
