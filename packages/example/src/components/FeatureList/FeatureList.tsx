import { Feature } from '../../types';
import { FeatureItem } from '../FeatureItem';
import styles from './FeatureList.module.scss';

export interface FeatureListProps {
  title: string;
  features: Feature[];
  className?: string;
  titleClassName?: string;
  listClassName?: string;
  itemClassName?: string;
}

export function FeatureList({
  title,
  features,
  className,
  titleClassName,
  listClassName,
  itemClassName,
}: FeatureListProps) {
  return (
    <div className={`${styles.features} ${className || ''}`}>
      <div className={`${styles.featuresTitle} ${titleClassName || ''}`}>
        {title}
      </div>
      <div className={`${styles.featuresList} ${listClassName || ''}`}>
        {features.map((feature) => (
          <FeatureItem
            key={feature.title}
            feature={feature}
            className={itemClassName}
          />
        ))}
      </div>
    </div>
  );
}
