import styles from "./DeviceFrame.module.scss";

export type DeviceVariant = "phone" | "tablet" | "laptop";

export interface DeviceFrameProps {
  variant: DeviceVariant;
  src: string;
  alt?: string;
  className?: string;
  /** Frame body colour. Defaults to white. */
  background?: string;
}

/**
 * CSS-drawn device frame (replaces the old iphone/ipad/mac PNG mockups).
 * A minimal, white, platform-neutral shell that wraps a screenshot so the
 * frame scales with the image. The body colour is configurable via `background`.
 */
export function DeviceFrame({
  variant,
  src,
  alt = "screenshot",
  className,
  background,
}: DeviceFrameProps) {
  const classNames = [styles.frame, styles[variant], className].filter(Boolean).join(" ");
  const bodyStyle = background ? { backgroundColor: background } : undefined;

  if (variant === "laptop") {
    return (
      <div className={classNames}>
        <div className={styles.lid} style={bodyStyle}>
          <img className={styles.screen} alt={alt} src={src} />
        </div>
        <div className={styles.base} />
      </div>
    );
  }

  return (
    <div className={classNames} style={bodyStyle}>
      <img className={styles.screen} alt={alt} src={src} />
    </div>
  );
}
