"use client";

import { useEffect, useState } from "react";

export function useHighContrastPreference() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setHighContrast(root.dataset.contrast === "high");
    read();

    const observer = new MutationObserver(read);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-contrast"],
    });
    return () => observer.disconnect();
  }, []);

  return highContrast;
}
