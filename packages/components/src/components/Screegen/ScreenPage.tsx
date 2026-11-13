import { useParams } from "react-router-dom";
import { ProjectConfig } from "../../types/index.js";
import { Screen } from "../Screen/index.js";

export interface ScreenPageProps {
  config: ProjectConfig;
}

export function ScreenPage({ config }: ScreenPageProps) {
  const { deviceKey, screenKey, language } = useParams<{
    deviceKey: string;
    screenKey: string;
    language: string;
  }>();

  if (!deviceKey || !screenKey || !language) {
    return <div>Invalid screen parameters</div>;
  }

  return <Screen config={config} deviceKey={deviceKey} screenKey={screenKey} language={language} />;
}
