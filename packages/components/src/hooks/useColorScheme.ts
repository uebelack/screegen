import { useState, useEffect } from "react";
import { ColorScheme } from "../types";

/**
 * Get the system color scheme preference
 */
export function getSystemColorScheme(): ColorScheme {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

/**
 * Hook to track system color scheme preference with optional override
 */
export function useColorScheme(override?: ColorScheme): ColorScheme {
  const [systemScheme, setSystemScheme] = useState<ColorScheme>(() => getSystemColorScheme());

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemScheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return override ?? systemScheme;
}
