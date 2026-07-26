import { describe, it, expect } from "vite-plus/test";
import { render } from "@testing-library/react";
import { ScreengenConfig } from "./ScreengenConfig";
import { ProjectConfig, ScreenComponentProps } from "../../types";

function MockComponent({ language }: ScreenComponentProps) {
  return <div>Mock: {language}</div>;
}

const mockConfig: ProjectConfig = {
  languages: ["en-US", "de-DE", "fr-FR"],
  devices: [
    {
      key: "iphone",
      fastlaneKeys: ["APP_IPHONE_67"],
      width: 1290,
      height: 2796,
      screens: [
        { key: "overview", component: MockComponent },
        { key: "details", component: MockComponent },
      ],
    },
    {
      key: "ipad",
      fastlaneKeys: ["APP_IPAD_PRO_129"],
      width: 2732,
      height: 2048,
      screens: [{ key: "home", component: MockComponent }],
    },
  ],
};

describe("ScreengenConfig", () => {
  it("renders a pre element with id screegen-config", () => {
    render(<ScreengenConfig config={mockConfig} />);

    const preElement = document.getElementById("screegen-config");
    expect(preElement).toBeInTheDocument();
    expect(preElement?.tagName.toLowerCase()).toBe("pre");
  });

  it("outputs valid JSON", () => {
    render(<ScreengenConfig config={mockConfig} />);

    const preElement = document.getElementById("screegen-config");
    expect(preElement).toBeInTheDocument();

    const content = preElement?.textContent;
    expect(() => JSON.parse(content!)).not.toThrow();
  });

  it("includes all languages in the output", () => {
    render(<ScreengenConfig config={mockConfig} />);

    const preElement = document.getElementById("screegen-config");
    const parsedConfig = JSON.parse(preElement!.textContent!);

    expect(parsedConfig.languages).toEqual(["en-US", "de-DE", "fr-FR"]);
  });

  it("includes all devices with correct keys", () => {
    render(<ScreengenConfig config={mockConfig} />);

    const preElement = document.getElementById("screegen-config");
    const parsedConfig = JSON.parse(preElement!.textContent!);

    expect(parsedConfig.devices).toHaveLength(2);
    expect(parsedConfig.devices[0].key).toBe("iphone");
    expect(parsedConfig.devices[1].key).toBe("ipad");
  });

  it("includes device dimensions", () => {
    render(<ScreengenConfig config={mockConfig} />);

    const preElement = document.getElementById("screegen-config");
    const parsedConfig = JSON.parse(preElement!.textContent!);

    const iphone = parsedConfig.devices[0];
    expect(iphone.width).toBe(1290);
    expect(iphone.height).toBe(2796);

    const ipad = parsedConfig.devices[1];
    expect(ipad.width).toBe(2732);
    expect(ipad.height).toBe(2048);
  });

  it("includes fastlaneKeys", () => {
    render(<ScreengenConfig config={mockConfig} />);

    const preElement = document.getElementById("screegen-config");
    const parsedConfig = JSON.parse(preElement!.textContent!);

    expect(parsedConfig.devices[0].fastlaneKeys).toEqual(["APP_IPHONE_67"]);
    expect(parsedConfig.devices[1].fastlaneKeys).toEqual(["APP_IPAD_PRO_129"]);
  });

  it("includes screen keys without components", () => {
    render(<ScreengenConfig config={mockConfig} />);

    const preElement = document.getElementById("screegen-config");
    const parsedConfig = JSON.parse(preElement!.textContent!);

    const iphoneScreens = parsedConfig.devices[0].screens;
    expect(iphoneScreens).toHaveLength(2);
    expect(iphoneScreens[0]).toEqual({ key: "overview" });
    expect(iphoneScreens[1]).toEqual({ key: "details" });

    const ipadScreens = parsedConfig.devices[1].screens;
    expect(ipadScreens).toHaveLength(1);
    expect(ipadScreens[0]).toEqual({ key: "home" });
  });

  it("does not include React component references in output", () => {
    render(<ScreengenConfig config={mockConfig} />);

    const preElement = document.getElementById("screegen-config");
    const content = preElement!.textContent!;

    // Should not contain function or component references
    expect(content).not.toContain("function");
    expect(content).not.toContain("MockComponent");
  });

  it("outputs pretty-printed JSON with 2-space indentation", () => {
    render(<ScreengenConfig config={mockConfig} />);

    const preElement = document.getElementById("screegen-config");
    const content = preElement!.textContent!;

    // Verify it's formatted with newlines (pretty printed)
    expect(content).toContain("\n");
    // Verify 2-space indentation
    expect(content).toContain('  "languages"');
  });

  it("includes the device path when present", () => {
    const configWithPath: ProjectConfig = {
      languages: ["en-US"],
      devices: [
        {
          key: "phone",
          fastlaneKeys: ["phoneScreenshots"],
          width: 1080,
          height: 1920,
          path: "[language]/images/[fastlaneKey]",
          screens: [{ key: "home", component: MockComponent }],
        },
      ],
    };

    render(<ScreengenConfig config={configWithPath} />);

    const parsedConfig = JSON.parse(document.getElementById("screegen-config")!.textContent!);
    expect(parsedConfig.devices[0].path).toBe("[language]/images/[fastlaneKey]");
  });

  it("serializes graphics without component references", () => {
    const configWithGraphics: ProjectConfig = {
      languages: ["en-US"],
      devices: [],
      graphics: [
        {
          key: "play-store",
          component: MockComponent,
          path: "[language]/images",
          width: 1200,
          height: 600,
          filename: "banner.png",
        },
        {
          // No key/width/height/filename -> key falls back to the index, the
          // optional fields are omitted.
          component: MockComponent,
          path: "[language]",
        },
      ],
    };

    render(<ScreengenConfig config={configWithGraphics} />);

    const content = document.getElementById("screegen-config")!.textContent!;
    const parsedConfig = JSON.parse(content);

    expect(content).not.toContain("MockComponent");
    expect(parsedConfig.graphics).toHaveLength(2);
    expect(parsedConfig.graphics[0]).toEqual({
      key: "play-store",
      path: "[language]/images",
      width: 1200,
      height: 600,
      filename: "banner.png",
    });
    expect(parsedConfig.graphics[1]).toEqual({
      key: "1",
      path: "[language]",
    });
  });

  it("handles empty devices array", () => {
    const emptyConfig: ProjectConfig = {
      languages: ["en-US"],
      devices: [],
    };

    render(<ScreengenConfig config={emptyConfig} />);

    const preElement = document.getElementById("screegen-config");
    const parsedConfig = JSON.parse(preElement!.textContent!);

    expect(parsedConfig.devices).toEqual([]);
  });

  it("handles empty languages array", () => {
    const emptyConfig: ProjectConfig = {
      languages: [],
      devices: [],
    };

    render(<ScreengenConfig config={emptyConfig} />);

    const preElement = document.getElementById("screegen-config");
    const parsedConfig = JSON.parse(preElement!.textContent!);

    expect(parsedConfig.languages).toEqual([]);
  });
});
