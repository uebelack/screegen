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

interface ScreenConfig {
  key: string;
}

interface DeviceConfig {
  key: string;
  fastlaneKeys: string[];
  width: number;
  height: number;
  screens: ScreenConfig[];
}

interface ProjectConfig {
  languages: string[];
  devices: DeviceConfig[];
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

function startDevServer(
  port: number,
): Promise<{ process: ChildProcess; url: string }> {
  return new Promise((resolve, reject) => {
    const devProcess = spawn("yarn", ["dev", "--port", String(port)], {
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

    // Start dev server using yarn dev
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

    if (config.devices.length === 0) {
      spinner.fail("No devices found in config");
      process.exit(1);
    }

    spinner.succeed("Setup complete");
    console.log(chalk.blue("\nGenerating screenshots...\n"));

    const outputDir = path.resolve(process.cwd(), options.output);
    await fs.mkdir(outputDir, { recursive: true });

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

          const langDir = path.join(outputDir, language);
          await fs.mkdir(langDir, { recursive: true });

          for (const fastlaneKey of device.fastlaneKeys) {
            const screenIndex = device.screens.indexOf(screen) + 1;
            const filename = `${screenIndex}_${fastlaneKey}_${screenIndex}.png`;
            const filepath = path.join(langDir, filename);

            await page.screenshot({ path: filepath });
            screenshotCount++;

            console.log(chalk.gray(`  ${language}/${filename}`));
          }

          await page.close();
        }
      }
    }

    await browser.close();

    // Kill dev server
    devProcess.kill();
    devProcess = null;

    console.log(
      chalk.green(`\nGenerated ${screenshotCount} screenshots to ${outputDir}`),
    );
  } catch (error) {
    // Clean up dev server on error
    if (devProcess) {
      devProcess.kill();
    }
    spinner.fail("Generation failed");
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error)),
    );
    process.exit(1);
  }
}
