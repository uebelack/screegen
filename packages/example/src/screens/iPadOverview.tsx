import { ScreenComponentProps } from "@screegen/components";
import { DeviceTeaser } from "../components/DeviceTeaser";
import translations from "../translations";

function iPadOverviewScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <DeviceTeaser teaser={t.overview} variant="tablet" src={`/raw/${language}/iPad_Overview.png`} />
  );
}

export default iPadOverviewScreen;
