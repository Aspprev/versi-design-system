"use client";

import { useState, useEffect } from "react";

export const breakpoints = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
  tv: 1920,
};

type Breakpoint = keyof typeof breakpoints;

export const useBreakpoint = (): Breakpoint => {
  const getBreakpoint = (width: number): Breakpoint => {
    const entries = Object.entries(breakpoints) as [Breakpoint, number][];
    return entries.reduce<Breakpoint>(
      (prev, [key, minWidth]) => (width >= minWidth ? key : prev),
      "mobile"
    );
  };

  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<Breakpoint>("mobile");

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getBreakpoint(window.innerWidth);
      setCurrentBreakpoint(newBreakpoint);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return currentBreakpoint;
};
