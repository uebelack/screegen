import { ProjectConfig, ColorScheme } from '../../types';
import { OverviewGrid } from '../OverviewGrid';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useUrlState } from '../../hooks/useUrlState';

export interface OverviewPageProps<L extends string = string> {
  config: ProjectConfig<L>;
}

export function OverviewPage<L extends string>({
  config,
}: OverviewPageProps<L>) {
  const [language, setLanguage] = useUrlState<L>(
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
