import { ScreenComponentProps } from "@screegen/components";
import translations from "../translations";
import styles from "./Graphic.module.scss";

function Graphic({ language }: ScreenComponentProps) {
  const t = translations[language];

  return (
    <div className={styles.graphic}>
      <img className={styles.logo} src="/logo.svg" alt="SnailMail" />
      <div className={styles.text}>
        <div className={styles.name}>{t.slogan}</div>
        <div className={styles.tagline}>{t.overview}</div>
      </div>
    </div>
  );
}

export default Graphic;
