import { useParams } from 'react-router-dom';
import { ProjectConfig } from '../../types';
import { Screen } from '../Screen';

export interface ScreenPageProps<L extends string = string> {
  config: ProjectConfig<L>;
}

export function ScreenPage<L extends string>({ config }: ScreenPageProps<L>) {
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
      language={language as L}
    />
  );
}
