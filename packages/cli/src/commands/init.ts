import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import prompts from "prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// When running from dist/index.js, templates are at ../templates
// When running from src/commands/init.ts, templates are at ../../templates
const templatesDir = path.resolve(__dirname, "..", "templates");

interface InitOptions {
  name?: string;
  directory: string;
}

async function copyTemplate(
  templateName: string,
  targetDir: string,
  targetName: string,
  replacements: Record<string, string> = {},
): Promise<void> {
  const templatePath = path.join(templatesDir, templateName);
  const targetPath = path.join(targetDir, targetName);

  let content = await fs.readFile(templatePath, "utf-8");

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content);
}

export async function initCommand(options: InitOptions): Promise<void> {
  let projectName = options.name;
  const directory = options.directory || process.cwd();

  console.log("--------------------------------");
  console.log("directory", directory);
  console.log("projectName", projectName);
  console.log("--------------------------------");

  if (!projectName) {
    const response = await prompts({
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: projectName || "my-screenshot-app",
    });
    projectName = response.projectName;
  }

  if (!projectName) {
    console.log(chalk.red("Project name is required"));
    process.exit(1);
  }

  const targetDir = path.resolve(directory, projectName);

  console.log(chalk.blue(`\nCreating screegen project: ${projectName}\n`));

  // Create directory structure
  await fs.mkdir(targetDir, { recursive: true });
  await fs.mkdir(path.join(targetDir, "src", "screens"), { recursive: true });
  await fs.mkdir(path.join(targetDir, "public", "assets"), { recursive: true });

  // Copy templates
  const replacements = { projectName };

  await copyTemplate(
    "package.json.template",
    targetDir,
    "package.json",
    replacements,
  );
  await copyTemplate("tsconfig.json.template", targetDir, "tsconfig.json");
  await copyTemplate("vite.config.ts.template", targetDir, "vite.config.ts");
  await copyTemplate(".gitignore.template", targetDir, ".gitignore");
  await copyTemplate(
    "screegen.config.ts.template",
    targetDir,
    "screegen.config.ts",
  );
  await copyTemplate(
    "index.html.template",
    targetDir,
    "index.html",
    replacements,
  );
  await copyTemplate("src/index.tsx.template", targetDir, "src/index.tsx");
  await copyTemplate(
    "src/vite-env.d.ts.template",
    targetDir,
    "src/vite-env.d.ts",
  );
  await copyTemplate("src/App.tsx.template", targetDir, "src/App.tsx");
  await copyTemplate(
    "src/translations.ts.template",
    targetDir,
    "src/translations.ts",
  );
  await copyTemplate(
    "src/screens/ExampleScreen.tsx.template",
    targetDir,
    "src/screens/ExampleScreen.tsx",
  );
  await copyTemplate(
    "src/screens/ExampleScreen.module.scss.template",
    targetDir,
    "src/screens/ExampleScreen.module.scss",
  );

  console.log(chalk.green("Project created successfully!\n"));
  console.log(chalk.gray("Next steps:\n"));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(chalk.white("  yarn install"));
  console.log(chalk.white("  yarn dev           # Start dev server"));
  console.log(chalk.white("  screegen generate  # Generate screenshots\n"));
}
