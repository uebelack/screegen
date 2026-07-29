import { describe, it, expect, vi, beforeEach, afterEach } from "vite-plus/test";
import { createProgram, runCli } from "./index.js";

describe("runCli", () => {
  const originalExit = process.exit;
  const originalStdoutWrite = process.stdout.write;

  beforeEach(() => {
    process.exit = vi.fn() as never;
    process.stdout.write = vi.fn() as never;
  });

  afterEach(() => {
    process.exit = originalExit;
    process.stdout.write = originalStdoutWrite;
  });

  it("creates and parses the program with --version", () => {
    runCli(["node", "screegen", "--version"]);
    expect(process.stdout.write).toHaveBeenCalled();
  });
});

describe("createProgram", () => {
  it("creates a program with correct name", () => {
    const program = createProgram();
    expect(program.name()).toBe("screegen");
  });

  it("creates a program with correct description", () => {
    const program = createProgram();
    expect(program.description()).toBe("Screenshot generation tool for app store assets");
  });

  it("creates a program with correct version", () => {
    const program = createProgram();
    expect(program.version()).toBe("1.0.0");
  });

  it("has init command", () => {
    const program = createProgram();
    const initCmd = program.commands.find((cmd) => cmd.name() === "init");

    expect(initCmd).toBeDefined();
    expect(initCmd?.description()).toBe("Create a new screegen project");
  });

  it("init command has correct options", () => {
    const program = createProgram();
    const initCmd = program.commands.find((cmd) => cmd.name() === "init");

    const nameOption = initCmd?.options.find((opt) => opt.long === "--name");
    expect(nameOption).toBeDefined();
    expect(nameOption?.short).toBe("-n");

    const dirOption = initCmd?.options.find((opt) => opt.long === "--directory");
    expect(dirOption).toBeDefined();
    expect(dirOption?.short).toBe("-d");
  });

  it("has generate command", () => {
    const program = createProgram();
    const generateCmd = program.commands.find((cmd) => cmd.name() === "generate");

    expect(generateCmd).toBeDefined();
    expect(generateCmd?.description()).toBe("Generate screenshots using Playwright");
  });

  it("generate command has correct options", () => {
    const program = createProgram();
    const generateCmd = program.commands.find((cmd) => cmd.name() === "generate");

    const outputOption = generateCmd?.options.find((opt) => opt.long === "--output");
    expect(outputOption).toBeDefined();
    expect(outputOption?.short).toBe("-o");
    expect(outputOption?.defaultValue).toBe("screenshots");

    const portOption = generateCmd?.options.find((opt) => opt.long === "--port");
    expect(portOption).toBeDefined();
    expect(portOption?.short).toBe("-p");
    expect(portOption?.defaultValue).toBe("3000");
  });
});
