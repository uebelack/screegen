import { DeviceFrame, ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./iPadEdit.module.scss";

function iPadEditScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div className={styles.edit}>
      <div className={styles.teaser}>{t.edit}</div>
      <DeviceFrame
        variant="tablet"
        className={styles.device}
        src={`/raw/${language}/iPad_Edit.png`}
      />
    </div>
  );
}

export default iPadEditScreen;
