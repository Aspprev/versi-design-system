"use client";

import { useEffect } from "react";

const FOCUS_NAVIGATION_ATTRIBUTE = "data-focus-navigation";

export function FocusNavigationMode() {
  useEffect(() => {
    const root = document.documentElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Tab" &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        root.setAttribute(FOCUS_NAVIGATION_ATTRIBUTE, "keyboard");
      }
    };

    const handlePointerDown = () => {
      root.setAttribute(FOCUS_NAVIGATION_ATTRIBUTE, "pointer");
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, []);

  return null;
}
