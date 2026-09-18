"use client";

import { useEffect, type RefObject } from "react";
import { mergeAriaDescribedBy } from "../../utils/accessibility";

export function useTooltipRelationship(
  targetRef: RefObject<HTMLElement | null> | undefined,
  tooltipId: string,
  visible: boolean,
) {
  useEffect(() => {
    const target = targetRef?.current;
    if (!target || !visible) return;

    const previousDescription = target.getAttribute("aria-describedby");
    target.setAttribute(
      "aria-describedby",
      mergeAriaDescribedBy(previousDescription, tooltipId) ?? tooltipId,
    );

    return () => {
      if (previousDescription) {
        target.setAttribute("aria-describedby", previousDescription);
      } else {
        target.removeAttribute("aria-describedby");
      }
    };
  }, [targetRef, tooltipId, visible]);
}


