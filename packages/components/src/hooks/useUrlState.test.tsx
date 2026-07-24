import { describe, it, expect } from "vite-plus/test";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useUrlState } from "./useUrlState";

function createWrapper(initialEntries: string[] = ["/"]) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
  };
}

describe("useUrlState", () => {
  it("returns default value when param is not in URL", () => {
    const { result } = renderHook(() => useUrlState<string>("theme", "light"), {
      wrapper: createWrapper(),
    });

    expect(result.current[0]).toBe("light");
  });

  it("returns URL param value when present", () => {
    const { result } = renderHook(() => useUrlState<string>("theme", "light"), {
      wrapper: createWrapper(["/?theme=dark"]),
    });

    expect(result.current[0]).toBe("dark");
  });

  it("updates URL when setValue is called", () => {
    const { result } = renderHook(() => useUrlState<string>("theme", "light"), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current[1]("dark");
    });

    expect(result.current[0]).toBe("dark");
  });

  it("preserves other URL params when updating", () => {
    const { result } = renderHook(
      () => ({
        theme: useUrlState<string>("theme", "light"),
        lang: useUrlState("lang", "en"),
      }),
      {
        wrapper: createWrapper(["/?lang=de"]),
      },
    );

    expect(result.current.lang[0]).toBe("de");

    act(() => {
      result.current.theme[1]("dark");
    });

    expect(result.current.theme[0]).toBe("dark");
    expect(result.current.lang[0]).toBe("de");
  });

  it("returns typed value", () => {
    type Theme = "light" | "dark" | "system";

    const { result } = renderHook(() => useUrlState<Theme>("theme", "system"), {
      wrapper: createWrapper(["/?theme=dark"]),
    });

    const value: Theme = result.current[0];
    expect(value).toBe("dark");
  });
});
