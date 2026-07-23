import { describe, it, expect } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { Screen } from "./Screen";
import { ProjectConfig, ScreenComponentProps, ScreenConfig } from "../../types";

function MockScreenComponent({ language, deviceKey }: ScreenComponentProps) {
  return (
    <div data-testid="mock-screen">
      MockScreen: {language} - {deviceKey}
    </div>
  );
}

const mockConfig: ProjectConfig = {
  languages: ["en-US", "de-DE"],
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

describe("Screen", () => {
  it("renders the screen component for a valid device and screen", () => {
    render(<Screen config={mockConfig} deviceKey="iphone" screenKey="overview" language="en-US" />);

    expect(screen.getByTestId("mock-screen")).toBeInTheDocument();
    expect(screen.getByText("MockScreen: en-US - iphone")).toBeInTheDocument();
  });

  it("renders null for an invalid device key", () => {
    const { container } = render(
      <Screen config={mockConfig} deviceKey="invalid" screenKey="overview" language="en-US" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders null for an invalid screen key", () => {
    const { container } = render(
      <Screen config={mockConfig} deviceKey="iphone" screenKey="invalid" language="en-US" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("sets the correct width and height on the container", () => {
    const { container } = render(
      <Screen config={mockConfig} deviceKey="iphone" screenKey="overview" language="en-US" />,
    );

    const screenDiv = container.firstChild as HTMLElement;
    expect(screenDiv.style.width).toBe("1290px");
    expect(screenDiv.style.height).toBe("2796px");
  });

  it("sets the data-device attribute", () => {
    const { container } = render(
      <Screen config={mockConfig} deviceKey="ipad" screenKey="home" language="de-DE" />,
    );

    const screenDiv = container.firstChild as HTMLElement;
    expect(screenDiv.getAttribute("data-device")).toBe("ipad");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Screen
        config={mockConfig}
        deviceKey="iphone"
        screenKey="overview"
        language="en-US"
        className="custom-class"
      />,
    );

    const screenDiv = container.firstChild as HTMLElement;
    expect(screenDiv.classList.contains("custom-class")).toBe(true);
  });

  it("passes correct props to screen component", () => {
    render(<Screen config={mockConfig} deviceKey="ipad" screenKey="home" language="de-DE" />);

    expect(screen.getByText("MockScreen: de-DE - ipad")).toBeInTheDocument();
  });

  it("renders screen key as fallback when component is missing", () => {
    const configWithoutComponent: ProjectConfig = {
      languages: ["en-US"],
      devices: [
        {
          key: "iphone",
          fastlaneKeys: ["APP_IPHONE_67"],
          width: 1290,
          height: 2796,
          // Intentionally omit `component` to test the missing-component fallback.
          screens: [{ key: "no-component" } as ScreenConfig],
        },
      ],
    };

    render(
      <Screen
        config={configWithoutComponent}
        deviceKey="iphone"
        screenKey="no-component"
        language="en-US"
      />,
    );

    expect(screen.getByText("no-component")).toBeInTheDocument();
  });
});
