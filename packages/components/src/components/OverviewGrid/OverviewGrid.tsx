import React from 'react';
import { ProjectConfig, ColorScheme, colorSchemes } from '../../types';
import { Screen } from '../Screen';
import styles from './OverviewGrid.module.scss';

const SCALE_OPTIONS = [0.1, 0.25, 1.0];
const DEFAULT_SCALE = 0.25;

export interface OverviewGridProps {
  config: ProjectConfig;
  language: string;
  scale?: number;
  colorScheme?: ColorScheme;
  onLanguageChange?: (language: string) => void;
  onScaleChange?: (scale: number) => void;
  onColorSchemeChange?: (scheme: ColorScheme) => void;
  className?: string;
}

export function OverviewGrid({
  config,
  language,
  scale = DEFAULT_SCALE,
  colorScheme = 'light',
  onLanguageChange,
  onScaleChange,
  onColorSchemeChange,
  className,
}: OverviewGridProps) {
  return (
    <div
      data-testid="overview-grid"
      className={`${styles.overviewPage} ${styles[colorScheme]} ${
        className || ''
      }`}
    >
      <div className={styles.overviewControls}>
        <label>
          Language:
          <select
            value={language}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onLanguageChange?.(e.target.value)
            }
          >
            {config.languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </label>

        <label>
          Scale:
          <select
            value={scale}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onScaleChange?.(parseFloat(e.target.value))
            }
          >
            {SCALE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s * 100}%
              </option>
            ))}
          </select>
        </label>

        <label>
          Color Scheme:
          <select
            value={colorScheme}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onColorSchemeChange?.(e.target.value as ColorScheme)
            }
          >
            {colorSchemes.map((scheme) => (
              <option key={scheme} value={scheme}>
                {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.overviewGrid}>
        {config.devices.map((device) => (
          <div key={device.key} className={styles.overviewDevice}>
            <h2>{device.key}</h2>
            <div className={styles.overviewScreens}>
              {device.screens.map((screen) => (
                <div
                  key={screen.key}
                  className={styles.overviewScreenWrapper}
                  style={{
                    width: device.width * scale,
                    height: device.height * scale,
                  }}
                >
                  <div
                    className={styles.overviewScreenScaled}
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <Screen
                      config={config}
                      deviceKey={device.key}
                      screenKey={screen.key}
                      language={language}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
