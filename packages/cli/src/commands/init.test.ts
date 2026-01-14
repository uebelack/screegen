import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import prompts from "prompts";
import { initCommand } from "./init.js";

vi.mock("fs/promises");
vi.mock("prompts");
vi.mock("chalk", () => ({
  default: {
    blue: (s: string) => s,
    green: (s: string) => s,
    red: (s: string) => s,
    gray: (s: string) => s,
    white: (s: string) => s,
  },
}));

const mockFs = vi.mocked(fs);
const mockPrompts = vi.mocked(prompts);

describe("initCommand", () => {
  const originalCwd = process.cwd;
  const originalExit = process.exit;
  const consoleLogs: string[] = [];
  const originalConsoleLog = console.log;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogs.length = 0;
    console.log = vi.fn((...args) => {
      consoleLogs.push(args.join(" "));
    });
    process.cwd = vi.fn(() => "/test/cwd");
    process.exit = vi.fn((code?: number) => {
      throw new Error(`process.exit(${code})`);
    }) as never;

    mockFs.readFile.mockResolvedValue("template content with {{projectName}}");
    mockFs.mkdir.mockResolvedValue(undefined);
    mockFs.writeFile.mockResolvedValue(undefined);
  });

  afterEach(() => {
    process.cwd = originalCwd;
    process.exit = originalExit;
    console.log = originalConsoleLog;
  });

  it("creates project with provided name option", async () => {
    await initCommand({ name: "my-app", directory: "/tmp" });

    expect(mockFs.mkdir).toHaveBeenCalledWith(path.resolve("/tmp", "my-app"), {
      recursive: true,
    });
    expect(mockFs.mkdir).toHaveBeenCalledWith(
      path.join(path.resolve("/tmp", "my-app"), "src", "screens"),
      { recursive: true },
    );
    expect(mockFs.mkdir).toHaveBeenCalledWith(
      path.join(path.resolve("/tmp", "my-app"), "public", "assets"),
      { recursive: true },
    );
  });

  it("prompts for project name when not provided", async () => {
    mockPrompts.mockResolvedValue({ projectName: "prompted-app" });

    await initCommand({ directory: "/tmp" });

    expect(mockPrompts).toHaveBeenCalledWith({
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-screenshot-app",
    });
    expect(mockFs.mkdir).toHaveBeenCalledWith(
      path.resolve("/tmp", "prompted-app"),
      { recursive: true },
    );
  });

  it("exits if no project name is provided after prompt", async () => {
    mockPrompts.mockResolvedValue({ projectName: undefined });

    await expect(initCommand({ directory: "/tmp" })).rejects.toThrow(
      "process.exit(1)",
    );
  });

  it("uses current directory when directory option is not set", async () => {
    await initCommand({ name: "test-project", directory: "" });

    expect(mockFs.mkdir).toHaveBeenCalledWith(
      path.resolve("/test/cwd", "test-project"),
      { recursive: true },
    );
  });

  it("copies all template files with replacements", async () => {
    await initCommand({ name: "my-app", directory: "/tmp" });

    const targetDir = path.resolve("/tmp", "my-app");

    // Check that writeFile was called for each template
    const writeFileCalls = mockFs.writeFile.mock.calls;
    const writtenPaths = writeFileCalls.map((call) => call[0]);

    expect(writtenPaths).toContain(path.join(targetDir, "package.json"));
    expect(writtenPaths).toContain(path.join(targetDir, "tsconfig.json"));
    expect(writtenPaths).toContain(path.join(targetDir, "vite.config.ts"));
    expect(writtenPaths).toContain(path.join(targetDir, ".gitignore"));
    expect(writtenPaths).toContain(path.join(targetDir, "screegen.config.ts"));
    expect(writtenPaths).toContain(path.join(targetDir, "index.html"));
    expect(writtenPaths).toContain(path.join(targetDir, "src", "index.tsx"));
    expect(writtenPaths).toContain(
      path.join(targetDir, "src", "vite-env.d.ts"),
    );
    expect(writtenPaths).toContain(path.join(targetDir, "src", "App.tsx"));
    expect(writtenPaths).toContain(
      path.join(targetDir, "src", "translations.ts"),
    );
    expect(writtenPaths).toContain(
      path.join(targetDir, "src", "screens", "ExampleScreen.tsx"),
    );
    expect(writtenPaths).toContain(
      path.join(targetDir, "src", "screens", "ExampleScreen.module.scss"),
    );
  });

  it("replaces template placeholders with project name", async () => {
    mockFs.readFile.mockResolvedValue("Project: {{projectName}}");

    await initCommand({ name: "replaced-app", directory: "/tmp" });

    // Find the call for package.json which uses replacements
    const packageJsonCall = mockFs.writeFile.mock.calls.find((call) =>
      String(call[0]).endsWith("package.json"),
    );
    expect(packageJsonCall?.[1]).toBe("Project: replaced-app");
  });

  it("displays success message and next steps", async () => {
    await initCommand({ name: "my-app", directory: "/tmp" });

    expect(
      consoleLogs.some((log) => log.includes("Project created successfully")),
    ).toBe(true);
    expect(consoleLogs.some((log) => log.includes("cd my-app"))).toBe(true);
    expect(consoleLogs.some((log) => log.includes("yarn install"))).toBe(true);
    expect(consoleLogs.some((log) => log.includes("yarn dev"))).toBe(true);
    expect(consoleLogs.some((log) => log.includes("screegen generate"))).toBe(
      true,
    );
  });
});
