// Base styles (fonts, resets)
import "./styles/base.scss";

// Types
export type {
  ColorScheme,
  ScreenConfig,
  ScreenComponentProps,
  DeviceConfig,
  GraphicConfig,
  ProjectConfig,
  ScreenProps as ScreenPropsType,
} from "./types/index.js";
export { colorSchemes, GRAPHIC_WIDTH, GRAPHIC_HEIGHT, GRAPHIC_FILENAME } from "./types/index.js";

// Hooks
export { useColorScheme, getSystemColorScheme } from "./hooks/useColorScheme.js";
export { useUrlState } from "./hooks/useUrlState.js";

// Components
export { Screen } from "./components/Screen/index.js";
export type { ScreenProps } from "./components/Screen/index.js";

export { DeviceFrame } from "./components/DeviceFrame/index.js";
export type { DeviceFrameProps, DeviceVariant } from "./components/DeviceFrame/index.js";

export { Graphic } from "./components/Graphic/index.js";
export type { GraphicProps } from "./components/Graphic/index.js";

export { OverviewGrid } from "./components/OverviewGrid/index.js";
export type { OverviewGridProps } from "./components/OverviewGrid/index.js";

export { ScreengenConfig } from "./components/ScreengenConfig/index.js";
export type { ScreengenConfigProps } from "./components/ScreengenConfig/index.js";

export { Screegen } from "./components/Screegen/index.js";
export type { ScreegenProps } from "./components/Screegen/index.js";
