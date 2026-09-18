"use client";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import {
  calculateTooltipPosition,
  type TooltipPosition,
} from "./calculate-tooltip-position";
import { useTooltipRelationship } from "./use-tooltip-relationship";
import { getFloatingLayerClass } from "../../utils/floating-layer";

export type TooltipProps = {
  targetRef: React.RefObject<HTMLElement | null>;
  content: React.ReactNode;
  visible: boolean;
  preferredPosition?: "top" | "bottom" | "left" | "right";
};

const Tooltip: React.FC<TooltipProps> = ({
  targetRef,
  content,
  visible,
  preferredPosition = "bottom",
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [finalPosition, setFinalPosition] =
    useState<TooltipPosition>(preferredPosition);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  useTooltipRelationship(targetRef, tooltipId, visible);

  const updatePosition = useCallback(() => {
    if (!targetRef.current || !tooltipRef.current) return;

    const target = targetRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();

    if (isMobile) {
      setCoords({
        top: Math.max(8, (window.innerHeight - tooltip.height) / 2),
        left: Math.max(8, (window.innerWidth - tooltip.width) / 2),
      });
      setFinalPosition("bottom");
      return;
    }

    const nextPosition = calculateTooltipPosition({
      target,
      tooltip,
      preferred: preferredPosition,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
    setCoords({ top: nextPosition.top, left: nextPosition.left });
    setFinalPosition(nextPosition.position);
  }, [isMobile, preferredPosition, targetRef]);

  useLayoutEffect(() => {
    if (!visible) return;
    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [content, updatePosition, visible]);

  useLayoutEffect(() => {
    if (
      !arrowRef.current ||
      isMobile ||
      !targetRef.current ||
      !tooltipRef.current
    ) {
      return;
    }

    const arrow = arrowRef.current;
    const tooltip = tooltipRef.current;
    const rect = targetRef.current.getBoundingClientRect();
    const horizontalCenter = Math.min(
      Math.max(rect.left + rect.width / 2 - coords.left - 6, 8),
      Math.max(8, tooltip.offsetWidth - 20),
    );
    const verticalCenter = Math.min(
      Math.max(rect.top + rect.height / 2 - coords.top - 6, 8),
      Math.max(8, tooltip.offsetHeight - 20),
    );

    arrow.style.top = "";
    arrow.style.bottom = "";
    arrow.style.left = "";
    arrow.style.right = "";

    if (finalPosition === "bottom") {
      arrow.style.top = "-6px";
      arrow.style.left = `${horizontalCenter}px`;
      return;
    }

    if (finalPosition === "top") {
      arrow.style.bottom = "-6px";
      arrow.style.left = `${horizontalCenter}px`;
      return;
    }

    if (finalPosition === "right") {
      arrow.style.left = "-6px";
      arrow.style.top = `${verticalCenter}px`;
      return;
    }

    arrow.style.right = "-6px";
    arrow.style.top = `${verticalCenter}px`;
  }, [coords, finalPosition, isMobile, targetRef, visible]);

  useEffect(() => {
    if (!visible) return;

    tooltipRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 150,
      easing: "ease-out",
    });
  }, [visible]);

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    visible ? (
      <div
        id={tooltipId}
        ref={tooltipRef}
        role="tooltip"
        style={{ top: coords.top, left: coords.left }}
        className={`fixed ${getFloatingLayerClass(targetRef.current, "tooltip")} max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain break-words whitespace-normal rounded-sm bg-surface-tooltip px-3 py-2 text-sm text-content-inverse shadow-lg ${
          isMobile ? "w-[90vw] max-w-[90vw]" : "w-max max-w-sm"
        }`}
      >
        {content}

        {/* Setinha só no desktop */}
        {!isMobile && (
          <>
            {finalPosition === "bottom" && (
              <div
                ref={arrowRef}
                className="absolute h-0 w-0 border-b-[6px] border-l-[6px] border-r-[6px] border-b-surface-tooltip border-l-transparent border-r-transparent"
              />
            )}
            {finalPosition === "top" && (
              <div
                ref={arrowRef}
                className="absolute h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-surface-tooltip"
              />
            )}
            {finalPosition === "right" && (
              <div
                ref={arrowRef}
                className="absolute h-0 w-0 border-b-[6px] border-r-[6px] border-t-[6px] border-b-transparent border-r-surface-tooltip border-t-transparent"
              />
            )}
            {finalPosition === "left" && (
              <div
                ref={arrowRef}
                className="absolute h-0 w-0 border-b-[6px] border-l-[6px] border-t-[6px] border-b-transparent border-l-surface-tooltip border-t-transparent"
              />
            )}
          </>
        )}
      </div>
    ) : null,
    document.body,
  );
};

export default Tooltip;


