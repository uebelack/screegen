import { DeviceFrame, ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./iPhoneEdit.module.scss";

function iPhoneEditScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div>
      <div className={styles.teaser}>{t.edit}</div>
      <DeviceFrame
        variant="phone"
        className={styles.device}
        src={`/raw/${language}/iPhone_Edit.png`}
      />
    </div>
  );
}

export default iPhoneEditScreen;
