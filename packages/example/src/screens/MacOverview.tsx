import { ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./MacOverview.module.scss";

function MacOverviewScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div className={styles.overview}>
      <div className={styles.teaser}>{t.overview}</div>
      <img className={styles.mock} alt="mac" src="/mac.png" />
      <img
        className={styles.screenshot}
        alt="screenshot"
        src={`/raw/${language}/Mac_Overview.png`}
      />
    </div>
  );
}

export default MacOverviewScreen;
