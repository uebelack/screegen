import { ProjectConfig, ColorScheme } from '../../types';
import { OverviewGrid } from '../OverviewGrid';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useUrlState } from '../../hooks/useUrlState';

export interface OverviewPageProps {
  config: ProjectConfig;
}

export function OverviewPage({
  config,
}: OverviewPageProps) {
  const [language, setLanguage] = useUrlState(
    'language',
    config.languages[0]
  );
  const [scale, setScale] = useUrlState<string>('scale', '0.25');
  const [colorSchemeParam, setColorScheme] = useUrlState<ColorScheme | ''>(
    'colorScheme',
    ''
  );
  const systemColorScheme = useColorScheme();
  const colorScheme = colorSchemeParam || systemColorScheme;

  return (
    <OverviewGrid
      config={config}
      language={language}
      scale={parseFloat(scale)}
      colorScheme={colorScheme}
      onLanguageChange={setLanguage}
      onScaleChange={(s) => setScale(String(s))}
      onColorSchemeChange={setColorScheme}
    />
  );
}
