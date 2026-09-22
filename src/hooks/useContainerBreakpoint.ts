"use client";

import { useEffect, useState, type RefObject } from "react";

export type ContainerBreakpointMap = Record<string, number>;
export type ContainerBreakpoint = string | undefined;

export interface UseContainerBreakpointOptions {
  breakpoints?: ContainerBreakpointMap;
}

export const defaultContainerBreakpoints: ContainerBreakpointMap = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  wide: 1440,
};

export function useContainerBreakpoint<TElement extends HTMLElement = HTMLElement>(
  ref: RefObject<TElement | null>,
  options: UseContainerBreakpointOptions = {},
): ContainerBreakpoint {
  const thresholds = options.breakpoints ?? defaultContainerBreakpoints;
  const [current, setCurrent] = useState<ContainerBreakpoint>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resolve = (width: number) => {
      const entries = Object.entries(thresholds).sort(([, a], [, b]) => a - b);
      return entries.reduce<string | undefined>(
        (result, [name, threshold]) => width >= threshold ? name : result,
        undefined,
      );
    };
    const update = () => setCurrent(resolve(element.getBoundingClientRect().width));

    if (typeof ResizeObserver === "undefined") {
      update();
      return undefined;
    }
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [ref, thresholds]);

  return current;
}
