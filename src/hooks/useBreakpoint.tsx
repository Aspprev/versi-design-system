"use client";

import { useSyncExternalStore } from "react";

export const breakpoints = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
  tv: 1920,
};

export type Breakpoint = keyof typeof breakpoints;

export function getBreakpoint(width: number): Breakpoint {
  const entries = Object.entries(breakpoints) as [Breakpoint, number][];
  return entries.reduce<Breakpoint>(
    (previous, [name, minimumWidth]) =>
      width >= minimumWidth ? name : previous,
    "mobile",
  );
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

function getSnapshot() {
  return getBreakpoint(window.innerWidth);
}

function getServerSnapshot(): Breakpoint {
  return "mobile";
}

export const useBreakpoint = (): Breakpoint =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
