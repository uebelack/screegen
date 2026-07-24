import { ScreenComponentProps } from "@screegen/components";
import { FeatureList } from "../components/FeatureList";
import translations from "../translations";

function Features({ language, width, height }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <FeatureList
      title={t.features.title}
      features={t.features.features}
      columns={width > height ? 2 : 1}
    />
  );
}

export default Features;
