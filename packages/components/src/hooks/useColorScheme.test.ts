import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { getSystemColorScheme, useColorScheme } from "./useColorScheme";

describe("getSystemColorScheme", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns "dark" when system prefers dark mode', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(getSystemColorScheme()).toBe("dark");
  });

  it('returns "light" when system prefers light mode', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(getSystemColorScheme()).toBe("light");
  });

  it('returns "light" when matchMedia is not available', () => {
    // @ts-expect-error - testing undefined case
    window.matchMedia = undefined;

    expect(getSystemColorScheme()).toBe("light");
  });
});

describe("useColorScheme", () => {
  const originalMatchMedia = window.matchMedia;
  let mediaQueryListeners: Array<(e: MediaQueryListEvent) => void> = [];

  beforeEach(() => {
    mediaQueryListeners = [];
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_, handler) => {
        mediaQueryListeners.push(handler);
      }),
      removeEventListener: vi.fn((_, handler) => {
        mediaQueryListeners = mediaQueryListeners.filter((h) => h !== handler);
      }),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("returns system color scheme when no override is provided", () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current).toBe("light");
  });

  it("returns override when provided", () => {
    const { result } = renderHook(() => useColorScheme("dark"));

    expect(result.current).toBe("dark");
  });

  it("updates to dark when system color scheme changes to dark", () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current).toBe("light");

    act(() => {
      mediaQueryListeners.forEach((listener) =>
        listener({ matches: true } as MediaQueryListEvent),
      );
    });

    expect(result.current).toBe("dark");
  });

  it("updates to light when system color scheme changes to light", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true, // Start with dark mode
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_, handler) => {
        mediaQueryListeners.push(handler);
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useColorScheme());

    expect(result.current).toBe("dark");

    act(() => {
      mediaQueryListeners.forEach((listener) =>
        listener({ matches: false } as MediaQueryListEvent),
      );
    });

    expect(result.current).toBe("light");
  });

  it("cleans up event listener on unmount", () => {
    const removeEventListener = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener,
      dispatchEvent: vi.fn(),
    }));

    const { unmount } = renderHook(() => useColorScheme());

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("handles missing matchMedia gracefully", () => {
    // @ts-expect-error - testing undefined case
    window.matchMedia = undefined;

    const { result } = renderHook(() => useColorScheme());

    expect(result.current).toBe("light");
  });
});
