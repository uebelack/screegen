import { Routes, Route, useParams } from 'react-router-dom';
import {
  Screen,
  OverviewGrid,
  ScreengenConfig,
  useColorScheme,
  useUrlState,
  ColorScheme,
} from '@screegen/components';
import config, { AppLanguageCode } from '../screegen.config';

function ScreenPage() {
  const { deviceKey, screenKey, language } = useParams<{
    deviceKey: string;
    screenKey: string;
    language: string;
  }>();

  if (!deviceKey || !screenKey || !language) {
    return <div>Invalid screen parameters</div>;
  }

  return (
    <Screen
      config={config}
      deviceKey={deviceKey}
      screenKey={screenKey}
      language={language as AppLanguageCode}
    />
  );
}

function OverviewPage() {
  const [language, setLanguage] = useUrlState<AppLanguageCode>(
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<OverviewPage />} />
      <Route path="/config" element={<ScreengenConfig config={config} />} />
      <Route
        path="/screens/:deviceKey/:screenKey/:language"
        element={<ScreenPage />}
      />
    </Routes>
  );
}

export default App;
