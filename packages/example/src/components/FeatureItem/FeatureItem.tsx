import {
  AlignJustify,
  BookUser,
  Cloud,
  ExternalLink,
  FileText,
  IdCard,
  type LucideIcon,
  Printer,
  Search,
  Settings,
  Signature,
  Type,
  WandSparkles,
} from "lucide-react";
import { Feature } from "../../types";
import styles from "./FeatureItem.module.scss";

// Feature icons are named after their lucide-react equivalent in translations.ts.
const ICONS: Record<string, LucideIcon> = {
  "align-justify": AlignJustify,
  printer: Printer,
  "external-link": ExternalLink,
  search: Search,
  cloud: Cloud,
  "wand-sparkles": WandSparkles,
  signature: Signature,
  "id-card": IdCard,
  "book-user": BookUser,
  "file-text": FileText,
  settings: Settings,
  type: Type,
};

export interface FeatureItemProps {
  feature: Feature;
}

export function FeatureItem({ feature }: FeatureItemProps) {
  const Icon = ICONS[feature.icon] ?? FileText;

  return (
    <div className={styles.feature}>
      <div className={styles.icon}>
        <Icon className={styles.glyph} strokeWidth={2.25} absoluteStrokeWidth />
      </div>
      <div className={styles.text}>
        <div className={styles.title}>{feature.title}</div>
        <div className={styles.description}>{feature.description}</div>
      </div>
    </div>
  );
}
