import { ScreenComponentProps } from "@screegen/components";
import { FeatureList } from "../components/FeatureList";
import translations from "../translations";

function ProFeatures({ language, width, height }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <FeatureList
      title={t.proFeatures.title}
      features={t.proFeatures.features}
      columns={width > height ? 2 : 1}
    />
  );
}

export default ProFeatures;
