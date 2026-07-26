import { ComponentType } from "react";

/**
 * Color scheme for light/dark mode
 */
export type ColorScheme = "light" | "dark";

export const colorSchemes: ColorScheme[] = ["light", "dark"];

/**
 * Props passed to screen components
 */
export interface ScreenComponentProps {
  language: string;
  deviceKey: string;
  width: number;
  height: number;
}

/**
 * Configuration for a single screen
 */
export interface ScreenConfig {
  key: string;
  component: ComponentType<ScreenComponentProps>;
}

/**
 * Configuration for a device (iPhone, iPad, Mac, etc.)
 */
export interface DeviceConfig {
  key: string;
  fastlaneKeys: string[];
  width: number;
  height: number;
  screens: ScreenConfig[];
  /**
   * Relative output path template for this device, joined onto the CLI
   * `--output` base directory. Supports the `[language]` and `[fastlaneKey]`
   * placeholders, e.g. `"[language]/images/[fastlaneKey]"`.
   *
   * When omitted, the CLI falls back to applying those placeholders to
   * `--output` directly (or appending the language when no placeholder is
   * present), preserving the previous behaviour.
   */
  path?: string;
}

/**
 * Default dimensions (px) for a Google Play "Feature graphic".
 */
export const GRAPHIC_WIDTH = 1024;
export const GRAPHIC_HEIGHT = 500;

/**
 * Default output filename for a graphic.
 */
export const GRAPHIC_FILENAME = "featureGraphic.png";

/**
 * Configuration for a graphic (e.g. the Google Play "Feature graphic",
 * 1024×500). Unlike a device it has no frame and no `fastlaneKeys`: it is
 * rendered once per language and written to a single file.
 */
export interface GraphicConfig {
  /**
   * Optional key, used to label the preview route. Defaults to the feature
   * graphic's index in the config.
   */
  key?: string;
  component: ComponentType<ScreenComponentProps>;
  /**
   * Relative output path template, joined onto the CLI `--output` base
   * directory. Supports the `[language]` placeholder, e.g. `"[language]/images"`.
   */
  path: string;
  /** Image width in px. Defaults to {@link GRAPHIC_WIDTH} (1024). */
  width?: number;
  /** Image height in px. Defaults to {@link GRAPHIC_HEIGHT} (500). */
  height?: number;
  /** Output filename. Defaults to {@link GRAPHIC_FILENAME}. */
  filename?: string;
}

/**
 * Root project configuration
 */
export interface ProjectConfig {
  languages: string[];
  devices: DeviceConfig[];
  graphics?: GraphicConfig[];
}

/**
 * Props for screen components
 */
export interface ScreenProps {
  deviceKey: string;
  screenKey: string;
  language: string;
}
