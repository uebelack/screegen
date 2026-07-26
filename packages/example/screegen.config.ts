import { ProjectConfig } from "@screegen/components";

import translations from "./src/translations";

import FeaturesScreen from "./src/screens/Features";
import Graphic from "./src/screens/Graphic";
import iPadEdit from "./src/screens/iPadEdit";
import iPadOverview from "./src/screens/iPadOverview";
import iPhoneDetail from "./src/screens/iPhoneDetail";
import iPhoneEditScreen from "./src/screens/iPhoneEdit";
import iPhoneOverview from "./src/screens/iPhoneOverview";
import MacOverview from "./src/screens/MacOverview";
import MacEdit from "./src/screens/MacEdit";
import ProFeaturesScreen from "./src/screens/ProFeatures";

const config: ProjectConfig = {
  languages: Object.keys(translations),
  devices: [
    {
      key: "iphone",
      fastlaneKeys: ["APP_IPHONE_67"],
      width: 1290,
      height: 2796,
      path: "[language]/images/[fastlaneKey]",
      screens: [
        { key: "overview", component: iPhoneOverview },
        { key: "details", component: iPhoneDetail },
        { key: "edit", component: iPhoneEditScreen },
        { key: "features", component: FeaturesScreen },
        { key: "proFeatures", component: ProFeaturesScreen },
      ],
    },
    {
      key: "ipad",
      fastlaneKeys: ["APP_IPAD_PRO_129"],
      width: 2732,
      height: 2048,
      path: "[language]/images/[fastlaneKey]",
      screens: [
        { key: "overview", component: iPadOverview },
        { key: "edit", component: iPadEdit },
        { key: "features", component: FeaturesScreen },
        { key: "proFeatures", component: ProFeaturesScreen },
      ],
    },
    {
      key: "mac",
      fastlaneKeys: ["APP_DESKTOP"],
      width: 2880,
      height: 1800,
      path: "[language]/images/[fastlaneKey]",
      screens: [
        { key: "overview", component: MacOverview },
        { key: "edit", component: MacEdit },
        { key: "features", component: FeaturesScreen },
        { key: "proFeatures", component: ProFeaturesScreen },
      ],
    },
  ],
  graphics: [
    {
      key: "featureGraphic",
      component: Graphic,
      path: "[language]/images",
      width: 1024,
      height: 500,
    },
  ],
};

export default config;
