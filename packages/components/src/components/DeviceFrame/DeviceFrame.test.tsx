import { describe, it, expect } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { DeviceFrame } from "./DeviceFrame";

describe("DeviceFrame", () => {
  it("renders a phone frame with a custom alt and extra className", () => {
    const { container } = render(
      <DeviceFrame variant="phone" src="/phone.png" alt="phone shot" className="extra" />,
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/phone.png");
    expect(img).toHaveAttribute("alt", "phone shot");
    expect(container.firstChild).toHaveClass("extra");
  });

  it("renders a tablet frame and falls back to the default alt", () => {
    render(<DeviceFrame variant="tablet" src="/tablet.png" />);

    expect(screen.getByRole("img")).toHaveAttribute("alt", "screenshot");
  });

  it("renders a laptop frame with a configurable background", () => {
    const { container } = render(
      <DeviceFrame variant="laptop" src="/mac.png" alt="mac shot" background="#eeeeee" />,
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/mac.png");
    expect(img).toHaveAttribute("alt", "mac shot");

    const lid = (container.firstChild as HTMLElement).firstElementChild;
    expect(lid).toHaveStyle({ backgroundColor: "#eeeeee" });
  });
});
