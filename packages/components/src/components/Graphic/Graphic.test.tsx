import { describe, it, expect } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { Graphic } from "./Graphic";
import { ProjectConfig, ScreenComponentProps, GraphicConfig } from "../../types";

function MockGraphic({ language, deviceKey, width, height }: ScreenComponentProps) {
  return (
    <div data-testid="mock-graphic">
      MockGraphic: {language} - {deviceKey} - {width}x{height}
    </div>
  );
}

const mockConfig: ProjectConfig = {
  languages: ["en-US", "de-DE"],
  devices: [],
  graphics: [
    {
      key: "play-store",
      component: MockGraphic,
      path: "[language]/images",
    },
    {
      // No key -> falls back to the index; custom dimensions.
      component: MockGraphic,
      path: "[language]/banners",
      width: 1200,
      height: 600,
    },
  ],
};

describe("Graphic", () => {
  it("renders the component for a valid graphic", () => {
    render(<Graphic config={mockConfig} index={0} language="en-US" />);

    expect(screen.getByTestId("mock-graphic")).toBeInTheDocument();
    // deviceKey is the configured key; dimensions default to 1024x500.
    expect(screen.getByText("MockGraphic: en-US - play-store - 1024x500")).toBeInTheDocument();
  });

  it("defaults the dimensions to 1024x500", () => {
    const { container } = render(<Graphic config={mockConfig} index={0} language="en-US" />);

    const div = container.firstChild as HTMLElement;
    expect(div.style.width).toBe("1024px");
    expect(div.style.height).toBe("500px");
    expect(div.getAttribute("data-graphic")).toBe("play-store");
  });

  it("uses custom dimensions and falls back to the index for the key", () => {
    const { container } = render(<Graphic config={mockConfig} index={1} language="de-DE" />);

    const div = container.firstChild as HTMLElement;
    expect(div.style.width).toBe("1200px");
    expect(div.style.height).toBe("600px");
    // No key configured -> data attribute and deviceKey fall back to the index.
    expect(div.getAttribute("data-graphic")).toBe("1");
    expect(screen.getByText("MockGraphic: de-DE - 1 - 1200x600")).toBeInTheDocument();
  });

  it("applies a custom className", () => {
    const { container } = render(
      <Graphic config={mockConfig} index={0} language="en-US" className="custom-class" />,
    );

    const div = container.firstChild as HTMLElement;
    expect(div.classList.contains("custom-class")).toBe(true);
  });

  it("renders null when the config has no graphics", () => {
    const configWithout: ProjectConfig = { languages: ["en-US"], devices: [] };

    const { container } = render(<Graphic config={configWithout} index={0} language="en-US" />);

    expect(container.firstChild).toBeNull();
  });

  it("renders null when the index is out of range", () => {
    const { container } = render(<Graphic config={mockConfig} index={5} language="en-US" />);

    expect(container.firstChild).toBeNull();
  });

  it("renders the key as fallback when the component is missing", () => {
    const configWithoutComponent: ProjectConfig = {
      languages: ["en-US"],
      devices: [],
      graphics: [
        // Intentionally omit `component` to test the fallback.
        { key: "no-component", path: "[language]" } as GraphicConfig,
      ],
    };

    render(<Graphic config={configWithoutComponent} index={0} language="en-US" />);

    expect(screen.getByText("no-component")).toBeInTheDocument();
  });
});
