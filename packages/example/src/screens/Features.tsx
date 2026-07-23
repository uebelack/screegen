import { ScreenComponentProps } from "@screegen/components";
import { FeatureList } from "../components/FeatureList";
import translations from "../translations";
import styles from "./Features.module.scss";

function Features({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div className={styles.features}>
      <FeatureList
        title={t.features.title}
        features={t.features.features}
        className={styles.features}
      />
    </div>
  );
}

export default Features;
