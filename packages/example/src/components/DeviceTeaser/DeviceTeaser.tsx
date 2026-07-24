import { DeviceFrame, DeviceVariant } from "@screegen/components";
import styles from "./DeviceTeaser.module.scss";

export interface DeviceTeaserProps {
  teaser: string;
  variant: DeviceVariant;
  src: string;
}

/**
 * Shared layout for the landscape device screens (iPad / Mac): a centred
 * headline above a centred device, the whole group balanced in the frame.
 */
export function DeviceTeaser({ teaser, variant, src }: DeviceTeaserProps) {
  return (
    <div className={styles.screen} data-variant={variant}>
      <p className={styles.teaser}>{teaser}</p>
      <DeviceFrame variant={variant} src={src} className={styles.device} />
    </div>
  );
}
