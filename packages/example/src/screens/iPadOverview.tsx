import { DeviceFrame, ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./iPadOverview.module.scss";

function iPadOverviewScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div className={styles.overview}>
      <div className={styles.teaser}>{t.overview}</div>
      <DeviceFrame
        variant="tablet"
        className={styles.device}
        src={`/raw/${language}/iPad_Overview.png`}
      />
    </div>
  );
}

export default iPadOverviewScreen;
