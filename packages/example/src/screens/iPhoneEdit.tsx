import { ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./iPhoneEdit.module.scss";

function iPhoneEditScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div>
      <div className={styles.teaser}>{t.edit}</div>
      <img
        className={styles.screenshot}
        alt="screenshot"
        src={`/raw/${language}/iPhone_Edit.png`}
      />
      <img className={styles.mock} alt="iphone" src="/iphone.png" />
    </div>
  );
}

export default iPhoneEditScreen;
