import { ScreenComponentProps } from "@screegen/components";
import { DeviceTeaser } from "../components/DeviceTeaser";
import translations from "../translations";

function MacOverviewScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <DeviceTeaser teaser={t.overview} variant="laptop" src={`/raw/${language}/Mac_Overview.png`} />
  );
}

export default MacOverviewScreen;
