import { ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./iPadOverview.module.scss";

function iPadOverviewScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div className={styles.overview}>
      <div className={styles.teaser}>{t.overview}</div>
      <img
        className={styles.screenshot}
        alt="screenshot"
        src={`/raw/${language}/iPad_Overview.png`}
      />
      <img className={styles.mock} alt="ipad" src="/ipad.png" />
    </div>
  );
}

export default iPadOverviewScreen;
