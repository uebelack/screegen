import { ScreenComponentProps } from "@screegen/components";
import { DeviceTeaser } from "../components/DeviceTeaser";
import translations from "../translations";

function MacEditScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return <DeviceTeaser teaser={t.edit} variant="laptop" src={`/raw/${language}/Mac_Edit.png`} />;
}

export default MacEditScreen;
