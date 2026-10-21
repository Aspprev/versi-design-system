import classNames from "classnames";
import React from "react";

export type SurfaceProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Optional brand detail, independent of feedback. Inherits a neutral fallback on legacy themes. */
  brandAccent?: 1 | 2 | 3;
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

const BRAND_STYLES = {
  1: "bg-brand-accent-1-soft text-brand-accent-1-content border-brand-accent-1-border",
  2: "bg-brand-accent-2-soft text-brand-accent-2-content border-brand-accent-2-border",
  3: "bg-brand-accent-3-soft text-brand-accent-3-content border-brand-accent-3-border",
};

export default function Surface({
  children,
  className,
  elevation = "sm",
  padding = "default",
  radius = "md",
  tone = "card",
  brandAccent,
  ...rest
}: SurfaceProps) {
  return (
    <div
      className={classNames(
        "w-full",
        ELEVATION_STYLES[elevation],
        PADDING_STYLES[padding],
        RADIUS_STYLES[radius],
        brandAccent ? BRAND_STYLES[brandAccent] : TONE_STYLES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

