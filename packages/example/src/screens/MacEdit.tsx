import { DeviceFrame, ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./MacEdit.module.scss";

function MacEditScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div className={styles.edit}>
      <div className={styles.teaser}>{t.edit}</div>
      <DeviceFrame
        variant="laptop"
        className={styles.device}
        src={`/raw/${language}/Mac_Edit.png`}
      />
    </div>
  );
}

export default MacEditScreen;
