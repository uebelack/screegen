#!/usr/bin/env npx tsx

/**
 * This script generates the CLI templates from the example package.
 * Run with: yarn generate-templates
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exampleDir = path.resolve(__dirname, "../../example");
const templatesDir = path.resolve(__dirname, "../templates");

interface FileMapping {
  source: string;
  target: string;
  transform?: (content: string) => string;
}

// Files to copy from example to templates
const fileMappings: FileMapping[] = [
  {
    source: "package.json",
    target: "package.json.template",
    transform: (content) => {
      const pkg = JSON.parse(content);

      // Create a simplified package.json for templates
      const templatePkg = {
        name: "{{projectName}}",
        version: "1.0.0",
        private: true,
        type: "module",
        scripts: {
          dev: "vite",
          build: "tsc && vite build",
          preview: "vite preview",
          generate: "screegen generate",
        },
        dependencies: {
          "@screegen/components": pkg.dependencies["@screegen/components"],
          react: pkg.dependencies["react"],
          "react-dom": pkg.dependencies["react-dom"],
          "react-router-dom": pkg.dependencies["react-router-dom"],
        },
        devDependencies: {
          "@types/react": pkg.devDependencies["@types/react"],
          "@types/react-dom": pkg.devDependencies["@types/react-dom"],
          "@vitejs/plugin-react": pkg.devDependencies["@vitejs/plugin-react"],
          sass: pkg.devDependencies["sass"],
          typescript: pkg.devDependencies["typescript"],
          vite: pkg.devDependencies["vite"],
        },
      };

      return JSON.stringify(templatePkg, null, 2) + "\n";
    },
  },
  {
    source: "tsconfig.json",
    target: "tsconfig.json.template",
  },
  {
    source: "vite.config.ts",
    target: "vite.config.ts.template",
  },
  {
    source: "screegen.config.ts",
    target: "screegen.config.ts.template",
    transform: () => {
      // Create a simplified config that works with the template structure
      return `import { ProjectConfig, ScreenComponentProps } from "@screegen/components";
import { FeaturesScreen } from "./src/screens/FeaturesScreen";
import { t } from "./src/translations";

export type AppLanguageCode = "en-US" | "de-DE";

// Wrapper component that provides translations
function FeaturesScreenWrapper({ language, deviceKey }: ScreenComponentProps) {
  return (
    <FeaturesScreen
      language={language}
      deviceKey={deviceKey}
      title={t(language, "title")}
      subtitle={t(language, "subtitle")}
      features={[
        { title: t(language, "feature1"), description: t(language, "feature1Desc") },
        { title: t(language, "feature2"), description: t(language, "feature2Desc") },
      ]}
    />
  );
}

const config: ProjectConfig<AppLanguageCode> = {
  languages: ["en-US", "de-DE"],
  devices: [
    {
      key: "iphone",
      fastlaneKeys: ["APP_IPHONE_67"],
      width: 1290,
      height: 2796,
      screens: [{ key: "features", component: FeaturesScreenWrapper }],
    },
    {
      key: "ipad",
      fastlaneKeys: ["APP_IPAD_PRO_129"],
      width: 2048,
      height: 2732,
      screens: [{ key: "features", component: FeaturesScreenWrapper }],
    },
  ],
};

export default config;
`;
    },
  },
  {
    source: "index.html",
    target: "index.html.template",
    transform: (content) => {
      // Replace title with placeholder
      return content.replace(
        /<title>.*<\/title>/,
        "<title>{{projectName}}</title>"
      );
    },
  },
  {
    source: "src/index.tsx",
    target: "src/index.tsx.template",
  },
  {
    source: "src/vite-env.d.ts",
    target: "src/vite-env.d.ts.template",
  },
  {
    source: "src/App.tsx",
    target: "src/App.tsx.template",
  },
  {
    source: "src/translations.ts",
    target: "src/translations.ts.template",
    transform: (content) => {
      // Provide a simpler translations template
      return `/**
 * Translations for your app screenshots.
 * Add your supported languages and translation keys here.
 */

export const translations: Record<string, Record<string, string>> = {
  "en-US": {
    title: "Your App Name",
    subtitle: "The best app for your needs",
    feature1: "Amazing Feature",
    feature1Desc: "Description of this amazing feature",
    feature2: "Another Feature",
    feature2Desc: "Description of another great feature",
  },
  "de-DE": {
    title: "Deine App",
    subtitle: "Die beste App für deine Bedürfnisse",
    feature1: "Tolle Funktion",
    feature1Desc: "Beschreibung dieser tollen Funktion",
    feature2: "Weitere Funktion",
    feature2Desc: "Beschreibung einer weiteren Funktion",
  },
};

/**
 * Helper function to get a translation for a given language and key.
 * Falls back to en-US if the key is not found in the requested language.
 */
export function t(language: string, key: string): string {
  return translations[language]?.[key] ?? translations["en-US"]?.[key] ?? key;
}
`;
    },
  },
  {
    source: "src/screens/Features.tsx",
    target: "src/screens/FeaturesScreen.tsx.template",
    transform: () => {
      // Create a self-contained screen component that doesn't depend on example components
      return `import { ScreenComponentProps } from "@screegen/components";
import styles from "./FeaturesScreen.module.scss";

interface Feature {
  title: string;
  description: string;
}

interface FeaturesScreenProps extends ScreenComponentProps {
  title: string;
  subtitle: string;
  features: Feature[];
}

export function FeaturesScreen({
  title,
  subtitle,
  features,
}: FeaturesScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.features}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
`;
    },
  },
  {
    source: "src/screens/Features.module.scss",
    target: "src/screens/FeaturesScreen.module.scss.template",
    transform: () => {
      // Create styles that match the FeaturesScreen component
      return `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 60px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: "Lexend", system-ui, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 60px;
}

.title {
  font-size: 64px;
  font-weight: 400;
  margin: 0 0 16px 0;
}

.subtitle {
  font-size: 28px;
  font-weight: 300;
  opacity: 0.9;
  margin: 0;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 800px;
}

.feature {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 32px;
  backdrop-filter: blur(10px);
}

.featureTitle {
  font-size: 24px;
  font-weight: 400;
  margin: 0 0 8px 0;
}

.featureDescription {
  font-size: 18px;
  font-weight: 300;
  opacity: 0.9;
  margin: 0;
}
`;
    },
  },
];

async function generateTemplates() {
  console.log("Generating templates from example package...\n");

  // Ensure templates directory exists
  await fs.mkdir(templatesDir, { recursive: true });
  await fs.mkdir(path.join(templatesDir, "src"), { recursive: true });
  await fs.mkdir(path.join(templatesDir, "src", "screens"), { recursive: true });

  for (const mapping of fileMappings) {
    const sourcePath = path.join(exampleDir, mapping.source);
    const targetPath = path.join(templatesDir, mapping.target);

    try {
      let content = await fs.readFile(sourcePath, "utf-8");

      if (mapping.transform) {
        content = mapping.transform(content);
      }

      await fs.writeFile(targetPath, content);
      console.log(`✓ ${mapping.source} → ${mapping.target}`);
    } catch (error) {
      console.error(`✗ Failed to process ${mapping.source}:`, error);
    }
  }

  console.log("\nTemplates generated successfully!");
}

generateTemplates().catch(console.error);
