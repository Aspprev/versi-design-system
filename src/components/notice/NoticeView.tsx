import classNames from "classnames";
import React from "react";
import { IconBaseProps } from "react-icons";
import { MdClose, MdHelpOutline } from "react-icons/md";

export type BoxProps = {
  rounded?: boolean;
  type?:
    | "info"
    | "primary"
    | "secondary"
    | "tertiary"
    | "gray"
    | "success"
    | "warning"
    | "danger";
  children: React.ReactNode;
  textColor?: "default" | "color";
  onDismiss?: () => void;
  onTriggerHelp?: () => void;
  icon?: React.ComponentType<IconBaseProps>;
} & React.HTMLAttributes<HTMLDivElement>;

const boxClassMap = {
  info: "bg-feedback-info-soft",
  primary: "border border-selection-border bg-selection-background",
  secondary: "bg-action-secondary",
  tertiary: "bg-action-tertiary",
  gray: "bg-surface-muted",
  success: "bg-feedback-success-soft",
  warning: "bg-feedback-warning-soft",
  danger: "bg-feedback-danger-soft",
};

const colorTextClassMap = {
  info: "text-feedback-info-content",
  primary: "text-selection-content",
  secondary: "text-action-secondary-content",
  tertiary: "text-action-tertiary-content",
  gray: "text-content-link",
  success: "text-feedback-success-content",
  warning: "text-feedback-warning-content",
  danger: "text-feedback-danger-content",
};

const defaultTextClassMap = {
  info: "text-content-primary",
  primary: "text-selection-content",
  secondary: "text-action-secondary-content",
  tertiary: "text-action-tertiary-content",
  gray: "text-content-primary",
  success: "text-content-primary",
  warning: "text-content-primary",
  danger: "text-content-primary",
};

const NoticeView: React.FC<BoxProps> = ({
  rounded = false,
  type = "info",
  children,
  className,
  onDismiss,
  onTriggerHelp,
  icon: Icon,
  textColor = "default",
  ...rest
}) => {
  const classes = classNames(boxClassMap[type], {
    "rounded-md": rounded,
  });

  return (
    <div className={classes} {...rest}>
      <div className={`flex p-3 gap-3 ${className}`}>
        {Icon && (
          <div className="flex gap-2">
            <Icon
              aria-hidden="true"
              focusable="false"
              className={`h-5 w-5 ${colorTextClassMap[type]}`}
            />
          </div>
        )}

        <div
          className={
            textColor === "color"
              ? colorTextClassMap[type]
              : defaultTextClassMap[type]
          }
        >
          {children}
        </div>

        <div className="flex gap-2 ml-auto">
          {onTriggerHelp && (
            <button
              type="button"
              aria-label="Obter ajuda sobre este aviso"
              className={`inline-flex h-6 w-6 items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${colorTextClassMap[type]}`}
              onClick={onTriggerHelp}
            >
              <MdHelpOutline
                aria-hidden="true"
                focusable="false"
                className="h-5 w-5"
              />
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              aria-label="Fechar aviso"
              className={`inline-flex h-6 w-6 items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${colorTextClassMap[type]}`}
              onClick={onDismiss}
            >
              <MdClose
                aria-hidden="true"
                focusable="false"
                className="h-5 w-5"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeView;

