import { ScreenComponentProps } from "@screegen/components";
import styles from "./iPhoneDetail.module.scss";

function iPhoneDetailsScreen({ language }: ScreenComponentProps) {
  return (
    <div className={styles.details}>
      <img
        className={styles.screenshot}
        alt="screenshot"
        src={`/raw/${language}/iPhone_Detail.png`}
      />
      <img className={styles.mock} alt="iphone" src="/iphone.png" />
    </div>
  );
}

export default iPhoneDetailsScreen;
