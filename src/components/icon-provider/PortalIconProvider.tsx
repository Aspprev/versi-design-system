"use client";

import type { ReactNode } from "react";
import { IconContext } from "react-icons";

const PORTAL_ICON_CONTEXT = {
  className: "shrink-0",
};

export type IconProviderProps = {
  children: ReactNode;
};

/** Keeps every react-icons glyph at its declared size inside flex layouts. */
export function IconProvider({ children }: IconProviderProps) {
  return (
    <IconContext.Provider value={PORTAL_ICON_CONTEXT}>
      {children}
    </IconContext.Provider>
  );
}

export { IconProvider as PortalIconProvider };

