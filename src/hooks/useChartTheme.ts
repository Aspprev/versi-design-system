"use client";

import { useEffect, useState } from "react";
import { getChartTheme } from "../utils/chart-theme";

/** Refresh mounted charts when the consumer changes identity or display mode. */
export function useChartTheme() {
  const [theme, setTheme] = useState(getChartTheme);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      const next = getChartTheme();
      setTheme(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    });
    const options = { attributes: true, attributeFilter: ["class", "style", "data-ds-theme", "data-color-scheme", "data-contrast", "data-contrast-theme"] };
    observer.observe(document.documentElement, options);
    observer.observe(document.body, options);
    read();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return theme;
}
