import type {
  StatusAppearance,
  StatusBadgeColor,
  StatusTone,
} from "../../utils/resolve-status-appearance";
import { getStatusBadgeColorFromTone } from "../../utils/resolve-status-appearance";
import classNames from "classnames";
import type { HTMLAttributes, ReactNode } from "react";

const COLOR_STYLES: Record<StatusBadgeColor, Record<StatusAppearance, string>> = {
  primary: {
    outline: "border-primary-1 text-primary-1",
    soft: "border-primary-1 bg-primary-5 text-primary-2",
    solid: "border-action-primary bg-action-primary text-action-primary-content",
  },
  blue: {
    outline: "border-status-blue-outline-border text-status-blue-outline-foreground",
    soft: "border-status-blue-outline-border bg-status-blue-soft-background text-status-blue-soft-foreground",
    solid: "border-status-blue-solid-background bg-status-blue-solid-background text-status-blue-solid-foreground",
  },
  green: {
    outline: "border-status-green-outline-border text-status-green-outline-foreground",
    soft: "border-status-green-outline-border bg-status-green-soft-background text-status-green-soft-foreground",
    solid: "border-status-green-solid-background bg-status-green-solid-background text-status-green-solid-foreground",
  },
  orange: {
    outline: "border-status-orange-outline-border text-status-orange-outline-foreground",
    soft: "border-status-orange-outline-border bg-status-orange-soft-background text-status-orange-soft-foreground",
    solid: "border-status-orange-solid-background bg-status-orange-solid-background text-status-orange-solid-foreground",
  },
  yellow: {
    outline: "border-status-yellow-outline-border text-status-yellow-outline-foreground",
    soft: "border-status-yellow-outline-border bg-status-yellow-soft-background text-status-yellow-soft-foreground",
    solid: "border-status-yellow-solid-background bg-status-yellow-solid-background text-status-yellow-solid-foreground",
  },
  red: {
    outline: "border-status-red-outline-border text-status-red-outline-foreground",
    soft: "border-status-red-outline-border bg-status-red-soft-background text-status-red-soft-foreground",
    solid: "border-status-red-solid-background bg-status-red-solid-background text-status-red-solid-foreground",
  },
  slate: {
    outline: "border-status-slate-outline-border text-status-slate-outline-foreground",
    soft: "border-status-slate-outline-border bg-status-slate-soft-background text-status-slate-soft-foreground",
    solid: "border-status-slate-solid-background bg-status-slate-solid-background text-status-slate-solid-foreground",
  },
  black: {
    outline: "border-status-black-outline-border text-status-black-outline-foreground",
    soft: "border-status-black-outline-border bg-status-black-soft-background text-status-black-soft-foreground",
    solid: "border-status-black-solid-background bg-status-black-solid-background text-status-black-solid-foreground",
  },
};

const SIZE_STYLES = {
  sm: "min-h-5 px-1 py-0.5 text-xs",
  md: "min-h-6 px-2 py-0.5 text-sm",
} as const;

export interface StatusBadgeProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  children: ReactNode;
  color?: StatusBadgeColor;
  tone?: StatusTone;
  appearance?: StatusAppearance;
  size?: keyof typeof SIZE_STYLES;
  overflow?: "wrap" | "truncate";
  /** Adds a non-color status announcement for assistive technology. */
  statusLabel?: string;
}

export function StatusBadge({
  children,
  color,
  tone,
  appearance = "outline",
  size = "md",
  overflow = "wrap",
  statusLabel,
  className,
  title,
  ...rest
}: StatusBadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex w-fit max-w-full items-center justify-center rounded-sm border-2 text-center font-bold uppercase tracking-wide",
        SIZE_STYLES[size],
        COLOR_STYLES[color ?? getStatusBadgeColorFromTone(tone ?? "neutral")][
          appearance
        ],
        overflow === "truncate"
          ? "overflow-hidden text-ellipsis whitespace-nowrap"
          : "whitespace-normal break-words",
        className,
      )}
      title={title ?? (typeof children === "string" ? children : undefined)}
      aria-label={statusLabel}
      {...rest}
    >
      {children}
    </span>
  );
}

export const getStatusBadgeClassName = (
  colorOrTone: StatusBadgeColor | StatusTone,
  appearance: StatusAppearance,
) => {
  const color =
    colorOrTone in COLOR_STYLES
      ? (colorOrTone as StatusBadgeColor)
      : getStatusBadgeColorFromTone(colorOrTone as StatusTone);
  return COLOR_STYLES[color][appearance];
};
