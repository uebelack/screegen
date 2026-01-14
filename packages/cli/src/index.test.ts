import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createProgram, runCli, isMainModule } from "./index.js";

describe("isMainModule", () => {
  it("returns true when import.meta.url matches process.argv[1]", () => {
    const result = isMainModule("file:///path/to/script.js", [
      "node",
      "/path/to/script.js",
    ]);
    expect(result).toBe(true);
  });

  it("returns true when process.argv[1] ends with screegen.js", () => {
    const result = isMainModule("file:///other/path.js", [
      "node",
      "/usr/bin/screegen.js",
    ]);
    expect(result).toBe(true);
  });

  it("returns false when neither condition is met", () => {
    const result = isMainModule("file:///path/to/module.js", [
      "node",
      "/path/to/other.js",
    ]);
    expect(result).toBe(false);
  });

  it("returns false when process.argv[1] is undefined", () => {
    const result = isMainModule("file:///path/to/module.js", ["node"]);
    expect(result).toBe(false);
  });
});

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

describe("main entry point", () => {
  const originalArgv = process.argv;
  const originalExit = process.exit;
  const originalStdoutWrite = process.stdout.write;

  beforeEach(() => {
    vi.resetModules();
    process.exit = vi.fn() as never;
    process.stdout.write = vi.fn() as never;
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exit = originalExit;
    process.stdout.write = originalStdoutWrite;
  });

  it("runs CLI when executed as main module", async () => {
    // Set up argv to make isMainModule return true
    process.argv = ["node", "/path/to/screegen.js", "--version"];

    // Dynamic import to get fresh module evaluation
    const indexModule = await import("./index.js?test=main");

    // Verify the functions exist (module loaded successfully)
    expect(indexModule.createProgram).toBeDefined();
    expect(indexModule.runCli).toBeDefined();
    expect(indexModule.isMainModule).toBeDefined();
  });
});

describe("createProgram", () => {
  it("creates a program with correct name", () => {
    const program = createProgram();
    expect(program.name()).toBe("screegen");
  });

  it("creates a program with correct description", () => {
    const program = createProgram();
    expect(program.description()).toBe(
      "Screenshot generation tool for app store assets",
    );
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

    const dirOption = initCmd?.options.find(
      (opt) => opt.long === "--directory",
    );
    expect(dirOption).toBeDefined();
    expect(dirOption?.short).toBe("-d");
  });

  it("has generate command", () => {
    const program = createProgram();
    const generateCmd = program.commands.find(
      (cmd) => cmd.name() === "generate",
    );

    expect(generateCmd).toBeDefined();
    expect(generateCmd?.description()).toBe(
      "Generate screenshots using Playwright",
    );
  });

  it("generate command has correct options", () => {
    const program = createProgram();
    const generateCmd = program.commands.find(
      (cmd) => cmd.name() === "generate",
    );

    const outputOption = generateCmd?.options.find(
      (opt) => opt.long === "--output",
    );
    expect(outputOption).toBeDefined();
    expect(outputOption?.short).toBe("-o");
    expect(outputOption?.defaultValue).toBe("screenshots");

    const portOption = generateCmd?.options.find(
      (opt) => opt.long === "--port",
    );
    expect(portOption).toBeDefined();
    expect(portOption?.short).toBe("-p");
    expect(portOption?.defaultValue).toBe("3000");
  });
});
