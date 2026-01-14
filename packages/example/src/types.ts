export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface FeatureSection {
  title: string;
  features: Feature[];
}

export interface Translation {
  overview: string;
  edit: string;
  features: FeatureSection;
  proFeatures: FeatureSection;
}