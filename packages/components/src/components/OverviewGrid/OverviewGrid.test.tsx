import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import { OverviewGrid } from "./OverviewGrid";
import { ProjectConfig, ScreenComponentProps } from "../../types";

function MockScreenComponent({ language }: ScreenComponentProps) {
  return <div data-testid="mock-screen">Screen: {language}</div>;
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
        { key: "overview", component: MockScreenComponent },
        { key: "details", component: MockScreenComponent },
      ],
    },
    {
      key: "ipad",
      fastlaneKeys: ["APP_IPAD_PRO_129"],
      width: 2732,
      height: 2048,
      screens: [{ key: "home", component: MockScreenComponent }],
    },
  ],
};

describe("OverviewGrid", () => {
  it("renders language selector with all languages", () => {
    render(<OverviewGrid config={mockConfig} language="en-US" />);

    const languageSelect = screen.getByLabelText(/language/i);
    expect(languageSelect).toBeInTheDocument();

    const options = languageSelect.querySelectorAll("option");
    expect(options).toHaveLength(3);
    expect(options[0].value).toBe("en-US");
    expect(options[1].value).toBe("de-DE");
    expect(options[2].value).toBe("fr-FR");
  });

  it("renders scale selector with scale options", () => {
    render(<OverviewGrid config={mockConfig} language="en-US" />);

    const scaleSelect = screen.getByLabelText(/scale/i);
    expect(scaleSelect).toBeInTheDocument();

    const options = scaleSelect.querySelectorAll("option");
    expect(options).toHaveLength(3);
    expect(options[0].textContent).toBe("10%");
    expect(options[1].textContent).toBe("25%");
    expect(options[2].textContent).toBe("100%");
  });

  it("renders color scheme selector", () => {
    render(<OverviewGrid config={mockConfig} language="en-US" />);

    const colorSchemeSelect = screen.getByLabelText(/color scheme/i);
    expect(colorSchemeSelect).toBeInTheDocument();

    const options = colorSchemeSelect.querySelectorAll("option");
    expect(options).toHaveLength(2);
    expect(options[0].value).toBe("light");
    expect(options[1].value).toBe("dark");
  });

  it("renders all devices", () => {
    render(<OverviewGrid config={mockConfig} language="en-US" />);

    expect(screen.getByText("iphone")).toBeInTheDocument();
    expect(screen.getByText("ipad")).toBeInTheDocument();
  });

  it("renders all screens for each device", () => {
    render(<OverviewGrid config={mockConfig} language="en-US" />);

    // iphone has 2 screens, ipad has 1 screen = 3 mock screens total
    const mockScreens = screen.getAllByTestId("mock-screen");
    expect(mockScreens).toHaveLength(3);
  });

  it("calls onLanguageChange when language is changed", () => {
    const onLanguageChange = vi.fn();
    render(
      <OverviewGrid config={mockConfig} language="en-US" onLanguageChange={onLanguageChange} />,
    );

    const languageSelect = screen.getByLabelText(/language/i);
    fireEvent.change(languageSelect, { target: { value: "de-DE" } });

    expect(onLanguageChange).toHaveBeenCalledWith("de-DE");
  });

  it("calls onScaleChange when scale is changed", () => {
    const onScaleChange = vi.fn();
    render(<OverviewGrid config={mockConfig} language="en-US" onScaleChange={onScaleChange} />);

    const scaleSelect = screen.getByLabelText(/scale/i);
    fireEvent.change(scaleSelect, { target: { value: "0.1" } });

    expect(onScaleChange).toHaveBeenCalledWith(0.1);
  });

  it("calls onColorSchemeChange when color scheme is changed", () => {
    const onColorSchemeChange = vi.fn();
    render(
      <OverviewGrid
        config={mockConfig}
        language="en-US"
        onColorSchemeChange={onColorSchemeChange}
      />,
    );

    const colorSchemeSelect = screen.getByLabelText(/color scheme/i);
    fireEvent.change(colorSchemeSelect, { target: { value: "dark" } });

    expect(onColorSchemeChange).toHaveBeenCalledWith("dark");
  });

  it("applies custom className", () => {
    const { container } = render(
      <OverviewGrid config={mockConfig} language="en-US" className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("uses default scale of 0.25", () => {
    render(<OverviewGrid config={mockConfig} language="en-US" />);

    const scaleSelect = screen.getByLabelText(/scale/i) as HTMLSelectElement;
    expect(scaleSelect.value).toBe("0.25");
  });

  it("uses default color scheme of light", () => {
    render(<OverviewGrid config={mockConfig} language="en-US" />);

    const colorSchemeSelect = screen.getByLabelText(/color scheme/i) as HTMLSelectElement;
    expect(colorSchemeSelect.value).toBe("light");
  });

  it("applies the selected scale to screen wrappers", () => {
    const { container } = render(<OverviewGrid config={mockConfig} language="en-US" scale={0.1} />);

    // Check that the wrapper has the scaled dimensions
    // iphone: 1290 * 0.1 = 129px width
    const wrappers = container.querySelectorAll('[style*="width"]');
    const iphoneWrapper = Array.from(wrappers).find(
      (el) => (el as HTMLElement).style.width === "129px",
    );
    expect(iphoneWrapper).toBeDefined();
  });

  it("does not crash without change handlers", () => {
    render(<OverviewGrid config={mockConfig} language="en-US" />);

    const languageSelect = screen.getByLabelText(/language/i);
    const scaleSelect = screen.getByLabelText(/scale/i);
    const colorSchemeSelect = screen.getByLabelText(/color scheme/i);

    // These should not throw
    fireEvent.change(languageSelect, { target: { value: "de-DE" } });
    fireEvent.change(scaleSelect, { target: { value: "0.1" } });
    fireEvent.change(colorSchemeSelect, { target: { value: "dark" } });
  });
});
