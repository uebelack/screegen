import { Routes, Route } from "react-router-dom";
import { ProjectConfig } from "../../types/index.js";
import { ScreengenConfig } from "../ScreengenConfig/index.js";
import { ScreenPage } from "./ScreenPage.js";
import { OverviewPage } from "./OverviewPage.js";
import { GraphicPage } from "./GraphicPage.js";

export interface ScreegenProps {
  config: ProjectConfig;
}

export function Screegen({ config }: ScreegenProps) {
  return (
    <Routes>
      <Route path="/" element={<OverviewPage config={config} />} />
      <Route path="/config" element={<ScreengenConfig config={config} />} />
      <Route
        path="/screens/:deviceKey/:screenKey/:language"
        element={<ScreenPage config={config} />}
      />
      <Route path="/graphics/:index/:language" element={<GraphicPage config={config} />} />
    </Routes>
  );
}
