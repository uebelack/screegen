// Base styles (fonts, resets)
import "./styles/base.scss";

// Types
export type {
  ColorScheme,
  Feature,
  FeatureSection,
  ScreenConfig,
  ScreenComponentProps,
  DeviceConfig,
  ProjectConfig,
  ScreenProps as ScreenPropsType,
} from "./types";
export { colorSchemes } from "./types";

// Hooks
export { useColorScheme, getSystemColorScheme } from "./hooks/useColorScheme";
export { useUrlState } from "./hooks/useUrlState";

// Components
export { Screen } from "./components/Screen";
export type { ScreenProps } from "./components/Screen";

export { OverviewGrid } from "./components/OverviewGrid";
export type { OverviewGridProps } from "./components/OverviewGrid";

export { ScreengenConfig } from "./components/ScreengenConfig";
export type { ScreengenConfigProps } from "./components/ScreengenConfig";

export { Screegen } from "./components/Screegen";
export type { ScreegenProps } from "./components/Screegen";
