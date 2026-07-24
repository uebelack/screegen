import { ScreenComponentProps } from "@screegen/components";
import { DeviceTeaser } from "../components/DeviceTeaser";
import translations from "../translations";

function iPadEditScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return <DeviceTeaser teaser={t.edit} variant="tablet" src={`/raw/${language}/iPad_Edit.png`} />;
}

export default iPadEditScreen;
