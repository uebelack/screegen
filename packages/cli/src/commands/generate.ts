import { chromium } from "playwright";
import { spawn, ChildProcess } from "child_process";
import path from "path";
import fs from "fs/promises";
import chalk from "chalk";
import ora from "ora";
import getPort from "get-port";

interface GenerateOptions {
  output: string;
  port: string;
}

const LANGUAGE_PLACEHOLDER = "[language]";
const FASTLANE_KEY_PLACEHOLDER = "[fastlaneKey]";

const GRAPHIC_WIDTH = 1024;
const GRAPHIC_HEIGHT = 500;
const GRAPHIC_FILENAME = "featureGraphic.png";

/**
 * Replaces the `[language]` and `[fastlaneKey]` placeholders in a path template.
 */
function resolveTemplate(template: string, language: string, fastlaneKey: string): string {
  return template
    .split(LANGUAGE_PLACEHOLDER)
    .join(language)
    .split(FASTLANE_KEY_PLACEHOLDER)
    .join(fastlaneKey);
}

/**
 * Resolves the output directory for a given language and fastlane key.
 *
 * When the device declares a relative `path` template, `--output` is treated as
 * a plain base directory and the (placeholder-expanded) `path` is joined onto
 * it — e.g. base `.../fastlane/metadata/android` + path
 * `[language]/images/[fastlaneKey]`.
 *
 * When no `path` is given, the legacy behaviour applies: the `[language]` and
 * `[fastlaneKey]` placeholders are expanded within `--output` itself, and if
 * `[language]` is absent the language is appended as a subdirectory.
 */
function resolveOutputDir(
  output: string,
  language: string,
  fastlaneKey: string,
  relativePath?: string,
): string {
  const cwd = process.cwd();

  if (relativePath !== undefined) {
    const base = path.resolve(cwd, output);
    return path.join(base, resolveTemplate(relativePath, language, fastlaneKey));
  }

  const hasLanguagePlaceholder = output.includes(LANGUAGE_PLACEHOLDER);
  const base = path.resolve(cwd, resolveTemplate(output, language, fastlaneKey));
  return hasLanguagePlaceholder ? base : path.join(base, language);
}

interface ScreenConfig {
  key: string;
}

interface DeviceConfig {
  key: string;
  fastlaneKeys: string[];
  width: number;
  height: number;
  screens: ScreenConfig[];
  path?: string;
}

interface GraphicConfig {
  key: string;
  path: string;
  width?: number;
  height?: number;
  filename?: string;
}

interface ProjectConfig {
  languages: string[];
  devices: DeviceConfig[];
  graphics?: GraphicConfig[];
}

async function fetchConfig(
  baseUrl: string,
  browser: import("playwright").Browser,
): Promise<ProjectConfig> {
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/config`);
  await page.waitForSelector("#screegen-config");

  const configText = await page.$eval(
    "#screegen-config",
    /* v8 ignore next */
    (el) => el.textContent,
  );
  await page.close();

  if (!configText) {
    throw new Error("Failed to read config from /config page");
  }

  return JSON.parse(configText);
}

function startDevServer(port: number): Promise<{ process: ChildProcess; url: string }> {
  return new Promise((resolve, reject) => {
    // Pass the command as a single string (not command + args array) so that
    // Node does not emit DEP0190 for combining an args array with `shell: true`.
    // `port` is a number from get-port, so there is nothing to escape.
    const devProcess = spawn(`pnpm dev --port ${port}`, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });

    let resolved = false;
    const timeout = setTimeout(() => {
      /* v8 ignore start -- timeout is cleared on resolve, this is defensive */
      if (!resolved) {
        reject(new Error("Dev server failed to start within 30 seconds"));
      }
      /* v8 ignore stop */
    }, 30000);

    devProcess.stdout?.on("data", (data: Buffer) => {
      const output = data.toString();
      // Look for Vite's ready message with the local URL
      const match = output.match(/Local:\s+(http:\/\/localhost:\d+)/);
      if (match && !resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ process: devProcess, url: match[1] });
      }
    });

    devProcess.stderr?.on("data", (data: Buffer) => {
      const output = data.toString();
      // Vite sometimes outputs to stderr
      const match = output.match(/Local:\s+(http:\/\/localhost:\d+)/);
      if (match && !resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ process: devProcess, url: match[1] });
      }
    });

    devProcess.on("error", (err) => {
      if (!resolved) {
        clearTimeout(timeout);
        reject(err);
      }
    });

    devProcess.on("exit", (code) => {
      if (!resolved) {
        clearTimeout(timeout);
        reject(new Error(`Dev server exited with code ${code}`));
      }
    });
  });
}

export async function generateCommand(options: GenerateOptions): Promise<void> {
  const spinner = ora("Starting dev server...").start();
  let devProcess: ChildProcess | null = null;

  try {
    // Get available port
    const port = await getPort({ port: parseInt(options.port) });

    // Start dev server using pnpm dev
    const { process: serverProcess, url: baseUrl } = await startDevServer(port);
    devProcess = serverProcess;

    spinner.text = "Launching browser...";

    // Launch Playwright
    const browser = await chromium.launch();

    spinner.text = "Loading configuration...";

    // Fetch config from the running app via /config route
    const config = await fetchConfig(baseUrl, browser);

    if (config.languages.length === 0) {
      spinner.fail("No languages found in config");
      process.exit(1);
    }

    if (config.devices.length === 0 && (config.graphics ?? []).length === 0) {
      spinner.fail("No devices or graphics found in config");
      process.exit(1);
    }

    spinner.succeed("Setup complete");
    console.log(chalk.blue("\nGenerating screenshots...\n"));

    // Output directories are created per language/fastlane key inside the loop
    // below, since either may be part of the resolved path.
    let screenshotCount = 0;

    for (const device of config.devices) {
      console.log(chalk.cyan(`\n${device.key}:`));

      for (const screen of device.screens) {
        for (const language of config.languages) {
          const page = await browser.newPage();

          await page.setViewportSize({
            width: Math.floor(device.width),
            height: Math.floor(device.height),
          });

          const url = `${baseUrl}/screens/${device.key}/${screen.key}/${language}`;
          await page.goto(url);
          await page.waitForLoadState("networkidle");

          // Wait for fonts and images
          await page.waitForTimeout(500);

          for (const fastlaneKey of device.fastlaneKeys) {
            const outputDir = resolveOutputDir(options.output, language, fastlaneKey, device.path);
            await fs.mkdir(outputDir, { recursive: true });

            const screenIndex = device.screens.indexOf(screen) + 1;
            const filename = `${screenIndex}_${fastlaneKey}_${screenIndex}.png`;
            const filepath = path.join(outputDir, filename);

            await page.screenshot({ path: filepath });
            screenshotCount++;

            console.log(chalk.gray(`  ${language}/${filename}`));
          }

          await page.close();
        }
      }
    }

    // Graphics (e.g. the Google Play "Feature graphic", 1024×500).
    // Rendered once per language and written to a single file each.
    const graphics = config.graphics ?? [];
    for (let index = 0; index < graphics.length; index++) {
      const graphic = graphics[index];
      console.log(chalk.cyan(`\n${graphic.key}:`));

      const width = Math.floor(graphic.width ?? GRAPHIC_WIDTH);
      const height = Math.floor(graphic.height ?? GRAPHIC_HEIGHT);
      const filename = graphic.filename ?? GRAPHIC_FILENAME;

      for (const language of config.languages) {
        const page = await browser.newPage();

        await page.setViewportSize({ width, height });

        const url = `${baseUrl}/graphics/${index}/${language}`;
        await page.goto(url);
        await page.waitForLoadState("networkidle");

        // Wait for fonts and images
        await page.waitForTimeout(500);

        const outputDir = path.join(
          path.resolve(process.cwd(), options.output),
          resolveTemplate(graphic.path, language, ""),
        );
        await fs.mkdir(outputDir, { recursive: true });

        const filepath = path.join(outputDir, filename);
        await page.screenshot({ path: filepath });
        screenshotCount++;

        console.log(chalk.gray(`  ${language}/${filename}`));

        await page.close();
      }
    }

    await browser.close();

    // Kill dev server
    devProcess.kill();
    devProcess = null;

    console.log(chalk.green(`\nGenerated ${screenshotCount} screenshots to ${options.output}`));
  } catch (error) {
    // Clean up dev server on error
    if (devProcess) {
      devProcess.kill();
    }
    spinner.fail("Generation failed");
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}
