import React from "react";
import type { IconBaseProps } from "react-icons";
import LoadingDots from "../loadingDots";

export type ButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  variant?: "flat" | "outline" | "plain";
  color?: "primary" | "secondary" | "tertiary" | "danger" | "warning";
  size?: "small" | "medium" | "large";
  width?: "auto" | "full";
  loading?: boolean;
  loadingLabel?: string;
  leadIcon?: React.ComponentType<IconBaseProps>;
  endIcon?: React.ComponentType<IconBaseProps>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).filter(Boolean).join(" ");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }

  return "";
}

const VARIANT_STYLES = {
  flat: {
    disabled: `cursor-not-allowed border-disabled bg-surface-disabled text-content-disabled`,
    default: {
      primary: `bg-action-primary text-action-primary-content hover:bg-action-primary-hover active:bg-action-primary-active`,
      secondary: `bg-action-secondary text-action-secondary-content hover:bg-action-secondary-hover active:bg-action-secondary-active`,
      tertiary: `bg-action-tertiary text-action-tertiary-content opacity-100 hover:bg-action-tertiary-hover active:bg-action-tertiary-active`,
      danger: `bg-action-danger text-action-danger-content hover:bg-action-danger-hover active:bg-action-danger-active`,
      warning: `bg-action-warning text-action-warning-content hover:bg-action-warning-hover active:bg-action-warning-active`,
    },
  },
  outline: {
    disabled: `cursor-not-allowed border-disabled bg-surface-disabled text-content-disabled`,
    default: {
      primary: `border-content-link text-content-link hover:border-action-primary-hover hover:text-content-link active:bg-selection-background active:border-action-primary-active active:text-content-on-brand`,
      secondary: `border-content-brand-secondary text-content-brand-secondary hover:border-action-secondary-hover hover:text-content-brand-secondary active:bg-action-secondary active:border-action-secondary-active active:text-action-secondary-content`,
      tertiary: `border-border-strong text-content-primary hover:text-content-secondary active:bg-surface-muted active:text-content-muted`,
      danger: `border-feedback-danger-border text-feedback-danger-content hover:border-action-danger-hover hover:text-feedback-danger-content active:bg-feedback-danger-soft active:border-action-danger-active active:text-feedback-danger-content`,
      warning: `border-feedback-warning-border text-feedback-warning-content hover:text-feedback-warning-content active:bg-feedback-warning-soft active:border-feedback-warning-content active:text-feedback-warning-content`,
    },
  },
  plain: {
    disabled: `cursor-not-allowed border-none text-content-disabled`,
    default: {
      primary: `border-transparent text-content-link hover:bg-action-primary-ghost hover:text-content-link active:border-content-link`,
      secondary: `border-transparent text-content-brand-secondary hover:bg-action-secondary-ghost hover:text-content-brand-secondary active:border-content-brand-secondary`,
      tertiary: `border-transparent text-content-primary hover:bg-surface-muted hover:text-content-muted active:border-border-default`,
      danger: `border-transparent text-feedback-danger-content hover:bg-feedback-danger-soft hover:text-feedback-danger-content active:border-feedback-danger-content`,
      warning: `border-transparent text-feedback-warning-content hover:bg-feedback-warning-soft hover:text-feedback-warning-content active:border-feedback-warning-content`,
    },
  },
};

function getVariant(
  color: ButtonProps["color"],
  variant: ButtonProps["variant"],
  disabled: ButtonProps["disabled"],
) {
  const variantStyles =
    VARIANT_STYLES[variant === undefined ? "flat" : variant];
  return disabled
    ? variantStyles.disabled
    : variantStyles.default[color === undefined ? "primary" : color];
}

function getSize(size: ButtonProps["size"]) {
  switch (size) {
    case "small":
      return `h-control-sm`;
    case "medium":
      return `h-control-md`;
    case "large":
      return `h-control-lg`;
  }
}

const WIDTH_STYLES: Record<NonNullable<ButtonProps["width"]>, string> = {
  auto: "w-auto",
  full: "w-full",
};

const Button: React.FC<ButtonProps> = ({
  variant = "flat",
  children,
  className,
  disabled = false,
  size = "medium",
  width = "auto",
  color = "primary",
  leadIcon: LeadIcon,
  endIcon: EndIcon,
  loading = false,
  loadingLabel,
  ...rest
}) => {
  const actionName =
    rest["aria-label"] ?? getTextContent(children).replace(/\s+/g, " ").trim();
  const loadingAnnouncement =
    loadingLabel ??
    (actionName ? `Carregando: ${actionName}` : "Carregando ação solicitada");

  return (
    <>
      <button
        className={`
          flex items-center justify-center rounded-sm px-xs border-[1px] gap-4xs leading-none
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring
          ${getVariant(color, variant, disabled)}
          ${className}
          ${getSize(size)}
          ${WIDTH_STYLES[width]}
        `}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {LeadIcon && !loading && (
          <LeadIcon aria-hidden="true" focusable="false" className="h-3 w-3" />
        )}
        {loading && (
          <span aria-hidden="true">
            <LoadingDots
              color={
                variant !== "flat"
                  ? color
                  : color === "primary"
                    ? "actionPrimary"
                    : color === "warning"
                      ? "actionWarning"
                      : "white"
              }
              announce={false}
            />
          </span>
        )}
        {loading && <span className="sr-only">{actionName || "Ação"}</span>}
        {!loading && children}
        {EndIcon && !loading && (
          <EndIcon aria-hidden="true" focusable="false" className="h-3 w-3" />
        )}
      </button>
      <span
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {loading ? loadingAnnouncement : ""}
      </span>
    </>
  );
};

export default Button;

