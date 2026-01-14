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
}

/**
 * Root project configuration
 */
export interface ProjectConfig {
  languages: string[];
  devices: DeviceConfig[];
}

/**
 * Props for screen components
 */
export interface ScreenProps {
  deviceKey: string;
  screenKey: string;
  language: string;
}
