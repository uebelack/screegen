import { ProjectConfig } from '@screegen/components';

import translations from './src/translations';

import FeaturesScreen from './src/screens/Features';
import iPadEdit from './src/screens/iPadEdit';
import iPadOverview from './src/screens/iPadOverview';
import iPhoneDetail from './src/screens/iPhoneDetail';
import iPhoneEditScreen from './src/screens/iPhoneEdit';
import iPhoneOverview from './src/screens/iPhoneOverview';
import MacOverview from './src/screens/MacOverview';
import MacEdit from './src/screens/MacEdit';
import ProFeaturesScreen from './src/screens/ProFeatures';

const config: ProjectConfig = {
  languages: Object.keys(translations),
  devices: [
    {
      key: 'iphone',
      fastlaneKeys: ['APP_IPHONE_67'],
      width: 1290,
      height: 2796,
      screens: [
        { key: 'overview', component: iPhoneOverview },
        { key: 'details', component: iPhoneDetail },
        { key: 'edit', component: iPhoneEditScreen },
        { key: 'features', component: FeaturesScreen },
        { key: 'proFeatures', component: ProFeaturesScreen },
      ],
    },
    {
      key: 'ipad',
      fastlaneKeys: ['APP_IPAD_PRO_129'],
      width: 2732,
      height: 2048,
      screens: [
        { key: 'overview', component: iPadOverview },
        { key: 'edit', component: iPadEdit },
        { key: 'features', component: FeaturesScreen },
        { key: 'proFeatures', component: ProFeaturesScreen },
      ],
    },
    {
      key: 'mac',
      fastlaneKeys: ['APP_DESKTOP'],
      width: 2880,
      height: 1800,
      screens: [
        { key: 'overview', component: MacOverview },
        { key: 'edit', component: MacEdit },
        { key: 'features', component: FeaturesScreen },
        { key: 'proFeatures', component: ProFeaturesScreen },
      ],
    },
  ],
};

export default config;
