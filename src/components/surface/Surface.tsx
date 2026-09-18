import classNames from "classnames";
import React from "react";

export type SurfaceProps = React.HTMLAttributes<HTMLDivElement> & {
  elevation?: "none" | "sm" | "md";
  padding?: "none" | "compact" | "default";
  radius?: "none" | "sm" | "md";
  tone?:
    | "card"
    | "subtle"
    | "muted"
    | "disabled"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "transparent";
};

const ELEVATION_STYLES: Record<
  NonNullable<SurfaceProps["elevation"]>,
  string
> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
};

const PADDING_STYLES: Record<NonNullable<SurfaceProps["padding"]>, string> = {
  none: "p-0",
  compact: "p-2",
  default: "p-3 desktop:p-5",
};

const RADIUS_STYLES: Record<NonNullable<SurfaceProps["radius"]>, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
};

const TONE_STYLES: Record<NonNullable<SurfaceProps["tone"]>, string> = {
  card: "bg-surface-card",
  subtle: "bg-surface-subtle",
  muted: "bg-surface-muted",
  disabled: "bg-surface-disabled",
  info: "bg-feedback-info-soft text-feedback-info-content",
  success: "bg-feedback-success-soft text-feedback-success-content",
  warning: "bg-feedback-warning-soft text-feedback-warning-content",
  danger: "bg-feedback-danger-soft text-feedback-danger-content",
  transparent: "bg-transparent",
};

export default function Surface({
  children,
  className,
  elevation = "sm",
  padding = "default",
  radius = "md",
  tone = "card",
  ...rest
}: SurfaceProps) {
  return (
    <div
      className={classNames(
        "w-full",
        ELEVATION_STYLES[elevation],
        PADDING_STYLES[padding],
        RADIUS_STYLES[radius],
        TONE_STYLES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

