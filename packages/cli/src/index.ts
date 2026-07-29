import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { generateCommand } from "./commands/generate.js";

export function createProgram(): Command {
  const program = new Command();

  program
    .name("screegen")
    .description("Screenshot generation tool for app store assets")
    .version("1.0.0");

  program
    .command("init")
    .description("Create a new screegen project")
    .option("-n, --name <name>", "Project name")
    .option("-d, --directory <dir>", "Target directory", process.cwd())
    .action(initCommand);

  program
    .command("generate")
    .description("Generate screenshots using Playwright")
    .option(
      "-o, --output <dir>",
      "Output base directory. Devices/graphics resolve their relative `path` (with [language] and [fastlaneKey] placeholders) against it (e.g. fastlane/metadata/android). For devices without a `path`, the placeholders may also be used directly in this value.",
      "screenshots",
    )
    .option("-p, --port <port>", "Dev server port", "3000")
    .action(generateCommand);

  return program;
}

export function runCli(argv?: string[]): void {
  createProgram().parse(argv);
}
