import { ProjectConfig } from "../../types";

export interface ScreengenConfigProps {
  config: ProjectConfig;
}

export function ScreengenConfig({ config }: ScreengenConfigProps) {
  // Create a serializable version without React components
  const serializedConfig = {
    languages: config.languages,
    devices: config.devices.map((device) => ({
      key: device.key,
      fastlaneKeys: device.fastlaneKeys,
      width: device.width,
      height: device.height,
      ...(device.path !== undefined ? { path: device.path } : {}),
      screens: device.screens.map((screen) => ({
        key: screen.key,
      })),
    })),
    ...(config.graphics
      ? {
          graphics: config.graphics.map((graphic, index) => ({
            key: graphic.key ?? String(index),
            path: graphic.path,
            ...(graphic.width !== undefined ? { width: graphic.width } : {}),
            ...(graphic.height !== undefined ? { height: graphic.height } : {}),
            ...(graphic.filename !== undefined ? { filename: graphic.filename } : {}),
          })),
        }
      : {}),
  };

  return (
    <pre id="screegen-config" data-testid="screegen-config">
      {JSON.stringify(serializedConfig, null, 2)}
    </pre>
  );
}
