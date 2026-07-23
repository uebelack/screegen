import { DeviceFrame, ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./iPhoneOverview.module.scss";

function iPhoneOverviewScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div>
      <div className={styles.teaser}>{t.overview}</div>
      <DeviceFrame
        variant="phone"
        className={styles.device}
        src={`/raw/${language}/iPhone_Overview.png`}
      />
    </div>
  );
}

export default iPhoneOverviewScreen;
