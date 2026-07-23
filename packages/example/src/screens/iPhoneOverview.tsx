import { ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./iPhoneOverview.module.scss";

function iPhoneOverviewScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div>
      <div className={styles.teaser}>{t.overview}</div>
      <img
        className={styles.screenshot}
        alt="screenshot"
        src={`/raw/${language}/iPhone_Overview.png`}
      />
      <img className={styles.mock} alt="iphone" src="/iphone.png" />
    </div>
  );
}

export default iPhoneOverviewScreen;
