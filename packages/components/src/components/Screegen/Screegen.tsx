import { Routes, Route } from 'react-router-dom';
import { ProjectConfig } from '../../types';
import { ScreengenConfig } from '../ScreengenConfig';
import { ScreenPage } from './ScreenPage';
import { OverviewPage } from './OverviewPage';

export interface ScreegenProps<L extends string = string> {
  config: ProjectConfig<L>;
}

export function Screegen<L extends string>({ config }: ScreegenProps<L>) {
  return (
    <Routes>
      <Route path="/" element={<OverviewPage config={config} />} />
      <Route path="/config" element={<ScreengenConfig config={config} />} />
      <Route
        path="/screens/:deviceKey/:screenKey/:language"
        element={<ScreenPage config={config} />}
      />
    </Routes>
  );
}
