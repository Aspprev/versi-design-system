"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";

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

export function resolveContainerBreakpoint(
  width: number,
  breakpoints: ContainerBreakpointMap = defaultContainerBreakpoints,
): ContainerBreakpoint {
  const entries = Object.entries(breakpoints).sort(([, first], [, second]) =>
    first === second ? 0 : first - second,
  );

  return entries.reduce<string | undefined>(
    (result, [name, threshold]) =>
      width >= threshold ? name : result,
    undefined,
  );
}

function getBreakpointMapKey(breakpoints: ContainerBreakpointMap) {
  return Object.entries(breakpoints)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([name, threshold]) => `${name}:${threshold}`)
    .join("|");
}

export function useContainerBreakpoint<TElement extends HTMLElement = HTMLElement>(
  ref: RefObject<TElement | null>,
  options: UseContainerBreakpointOptions = {},
): ContainerBreakpoint {
  const thresholds = options.breakpoints ?? defaultContainerBreakpoints;
  const thresholdsKey = getBreakpointMapKey(thresholds);
  const sortedThresholds = useMemo(
    () =>
      Object.entries(thresholds).sort(([, first], [, second]) =>
        first === second ? 0 : first - second,
      ),
    [thresholdsKey],
  );
  const [current, setCurrent] = useState<ContainerBreakpoint>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resolve = (width: number) =>
      sortedThresholds.reduce<string | undefined>(
        (result, [name, threshold]) =>
          width >= threshold ? name : result,
        undefined,
      );
    const update = () =>
      setCurrent(resolve(element.getBoundingClientRect().width));

    if (typeof ResizeObserver === "undefined") {
      update();
      return undefined;
    }
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [ref, sortedThresholds]);

  return current;
}
