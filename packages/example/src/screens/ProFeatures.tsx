import { ScreenComponentProps } from "@screegen/components";
import { FeatureList } from "../components/FeatureList";
import translations from "../translations";
import styles from "./ProFeatures.module.scss";

function ProFeatures({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div className={styles.features}>
      <FeatureList
        title={t.proFeatures.title}
        features={t.proFeatures.features}
        className={styles.features}
      />
    </div>
  );
}

export default ProFeatures;
