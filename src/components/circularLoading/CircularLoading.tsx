"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import React from "react";

export type CircularLoadingProps = {
  size?: number;
  thickness?: number;
  trackColor?: string;
  indicatorColor?: string;
  withTrack?: boolean;
  color?:
    | "white"
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "warning"
    | "success";
  message?: string;
  className?: string;
  ariaLabel?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const colorMap = {
  white: "rgb(var(--white))",
  primary: "rgb(var(--loading-circular-indicator))",
  secondary: "rgb(var(--secondary-1))",
  tertiary: "rgb(var(--tertiary-1))",
  danger: "rgb(var(--feedback-danger-strong))",
  warning: "rgb(var(--feedback-warning-strong))",
  success: "rgb(var(--feedback-success-strong))",
} as const;

export default function CircularLoading({
  size = 48,
  thickness = 6,
  trackColor = "rgb(var(--loading-circular-track))",
  indicatorColor,
  withTrack = true,
  color = "primary",
  message,
  className,
  ariaLabel = "Carregando",
  ...rest
}: CircularLoadingProps) {
  const breakpoint = useBreakpoint();
  const finalSize = breakpoint === "mobile" ? Math.min(size, 100) : size;
  const finalThickness =
    breakpoint === "mobile" ? Math.min(thickness, 16) : thickness;
  const radius = (finalSize - finalThickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = finalSize / 2;
  const finalIndicatorColor = indicatorColor ?? colorMap[color];

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`inline-flex flex-col items-center justify-center gap-4 leading-none ${className ?? ""}`.trim()}
      {...rest}
    >
      <svg
        className="shrink-0"
        width={finalSize}
        height={finalSize}
        viewBox={`0 0 ${finalSize} ${finalSize}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {withTrack && (
          <circle
            className="circular-loading-track"
            cx={finalSize / 2}
            cy={finalSize / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={finalThickness}
            fill="none"
          />
        )}
        <circle
          className="circular-loading-indicator"
          cx={finalSize / 2}
          cy={finalSize / 2}
          r={radius}
          stroke={finalIndicatorColor}
          strokeWidth={finalThickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${center} ${center}`}
            to={`360 ${center} ${center}`}
            dur="1.4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      {message && (
        <p className="text-center text-sm font-medium text-content-secondary">
          {message}
        </p>
      )}
    </div>
  );
}


