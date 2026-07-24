import { Feature } from "../../types";
import { FeatureItem } from "../FeatureItem";
import styles from "./FeatureList.module.scss";

export interface FeatureListProps {
  title: string;
  features: Feature[];
  /** Column count for the feature grid — 1 for portrait, 2 for landscape. */
  columns?: number;
}

export function FeatureList({ title, features, columns = 1 }: FeatureListProps) {
  const innerClass = `${styles.inner} ${columns > 1 ? styles.wide : ""}`;

  return (
    <div className={styles.screen}>
      <div className={innerClass}>
        <h2 className={styles.title}>{title}</h2>
        <div
          className={styles.list}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {features.map((feature) => (
            <FeatureItem key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
}
