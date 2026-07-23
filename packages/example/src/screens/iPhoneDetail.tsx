import { DeviceFrame, ScreenComponentProps } from "@screegen/components";
import styles from "./iPhoneDetail.module.scss";

function iPhoneDetailsScreen({ language }: ScreenComponentProps) {
  return (
    <div>
      <DeviceFrame
        variant="phone"
        className={styles.device}
        src={`/raw/${language}/iPhone_Detail.png`}
      />
    </div>
  );
}

export default iPhoneDetailsScreen;
