import { ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./iPadEdit.module.scss";

function iPadEditScreen({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div className={styles.edit}>
      <div className={styles.teaser}>{t.edit}</div>
      <img className={styles.screenshot} alt="screenshot" src={`/raw/${language}/iPad_Edit.png`} />
      <img className={styles.mock} alt="ipad" src="/ipad.png" />
    </div>
  );
}

export default iPadEditScreen;
