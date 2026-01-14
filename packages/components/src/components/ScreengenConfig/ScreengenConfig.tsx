import { ProjectConfig } from '../../types';

export interface ScreengenConfigProps {
  config: ProjectConfig;
}

export function ScreengenConfig({
  config,
}: ScreengenConfigProps) {
  // Create a serializable version without React components
  const serializedConfig = {
    languages: config.languages,
    devices: config.devices.map((device) => ({
      key: device.key,
      fastlaneKeys: device.fastlaneKeys,
      width: device.width,
      height: device.height,
      screens: device.screens.map((screen) => ({
        key: screen.key,
      })),
    })),
  };

  return (
    <pre id="screegen-config" data-testid="screegen-config">
      {JSON.stringify(serializedConfig, null, 2)}
    </pre>
  );
}
