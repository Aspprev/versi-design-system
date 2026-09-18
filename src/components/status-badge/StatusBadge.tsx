import type {
  StatusAppearance,
  StatusTone,
} from "../../utils/resolve-status-appearance";
import classNames from "classnames";
import type { HTMLAttributes, ReactNode } from "react";

const TONE_STYLES: Record<StatusTone, Record<StatusAppearance, string>> = {
  info: {
    outline: "border-feedback-info-border text-feedback-info-content",
    soft: "border-feedback-info-border bg-feedback-info-soft text-feedback-info-content",
    solid:
      "border-feedback-info-strong bg-feedback-info-strong text-surface-subtle",
  },
  warning: {
    outline: "border-feedback-warning-border text-feedback-warning-content",
    soft: "border-feedback-warning-border bg-feedback-warning-soft text-feedback-warning-content",
    solid:
      "border-feedback-warning-strong bg-feedback-warning-strong text-surface-subtle",
  },
  success: {
    outline: "border-feedback-success-border text-feedback-success-content",
    soft: "border-feedback-success-border bg-feedback-success-soft text-feedback-success-content",
    solid:
      "border-feedback-success-strong bg-feedback-success-strong text-surface-subtle",
  },
  danger: {
    outline: "border-feedback-danger-border text-feedback-danger-content",
    soft: "border-feedback-danger-border bg-feedback-danger-soft text-feedback-danger-content",
    solid:
      "border-feedback-danger-strong bg-feedback-danger-strong text-surface-subtle",
  },
  neutral: {
    outline: "border-border-strong text-content-secondary",
    soft: "border-border-default bg-surface-subtle text-content-secondary",
    solid: "border-surface-action-neutral bg-surface-action-neutral text-surface-subtle",
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
  tone?: StatusTone;
  appearance?: StatusAppearance;
  size?: keyof typeof SIZE_STYLES;
  overflow?: "wrap" | "truncate";
}

export function StatusBadge({
  children,
  tone = "neutral",
  appearance = "outline",
  size = "md",
  overflow = "wrap",
  className,
  title,
  ...rest
}: StatusBadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex w-fit max-w-full items-center justify-center rounded-sm border-2 text-center font-bold uppercase tracking-wide",
        SIZE_STYLES[size],
        TONE_STYLES[tone][appearance],
        overflow === "truncate"
          ? "overflow-hidden text-ellipsis whitespace-nowrap"
          : "whitespace-normal break-words",
        className,
      )}
      title={title ?? (typeof children === "string" ? children : undefined)}
      {...rest}
    >
      {children}
    </span>
  );
}

export const getStatusBadgeClassName = (
  tone: StatusTone,
  appearance: StatusAppearance,
) => TONE_STYLES[tone][appearance];
