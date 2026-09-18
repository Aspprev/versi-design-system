import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const colorVariant = cva(`w-[14px] h-[14px] rounded-full`, {
  variants: {
    color: {
      white: "bg-content-inverse",
      primary: "bg-content-link",
      secondary: "bg-content-brand-secondary",
      tertiary: "bg-content-primary",
      danger: "bg-feedback-danger-content",
      warning: "bg-feedback-warning-content",
      success: "bg-feedback-success-content",
      actionPrimary: "bg-action-primary-content",
      actionWarning: "bg-action-warning-content",
    },
    defaultVariants: {
      color: "white",
    },
  },
});

export type LoadingDotsProps = VariantProps<typeof colorVariant> & {
  color?:
    | "white"
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "warning"
    | "success"
    | "actionPrimary"
    | "actionWarning";
  fullContainer?: boolean;
  announce?: boolean;
  ariaLabel?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const LoadingDots: React.FC<LoadingDotsProps> = ({
  color = "white",
  fullContainer = false,
  announce = true,
  ariaLabel,
  className,
  "aria-label": ariaLabelAttribute,
  ...rest
}) => {
  const accessibleLabel = ariaLabel ?? ariaLabelAttribute ?? "Carregando";

  return (
    <div
      {...rest}
      className={`flex items-center justify-center gap-[10px]${fullContainer ? " w-full h-full min-h-[400px]" : ""}${className ? ` ${className}` : ""}`}
      role={announce ? "status" : undefined}
      aria-live={announce ? "polite" : undefined}
      aria-atomic={announce || undefined}
      aria-hidden={!announce || undefined}
    >
      {announce && <span className="sr-only">{accessibleLabel}</span>}
      <span
        className={`animate-[1s_pulse_0s_ease-in-out_infinite] ${colorVariant({
          color,
        })}`}
      ></span>
      <span
        className={`animate-[1s_pulse_0.3s_ease-in-out_infinite] ${colorVariant(
          { color },
        )}`}
      ></span>
      <span
        className={`animate-[1s_pulse_0.6s_ease-in-out_infinite] ${colorVariant(
          { color },
        )}`}
      ></span>
    </div>
  );
};

export default LoadingDots;

