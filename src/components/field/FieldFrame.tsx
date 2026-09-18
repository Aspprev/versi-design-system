import classNames from "classnames";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import {
  FIELD_DESCRIPTION_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_MESSAGE_CLASS,
  FIELD_ROOT_CLASS,
} from "./field-styles";

export type FieldFrameProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
  label?: ReactNode;
  labelFor?: string;
  labelId?: string;
  labelAdornment?: ReactNode;
  description?: ReactNode;
  descriptionId?: string;
  message?: ReactNode;
  messageId?: string;
  invalid?: boolean;
};

const FieldFrame = forwardRef<HTMLDivElement, FieldFrameProps>(
  function FieldFrame(
    {
      children,
      label,
      labelFor,
      labelId,
      labelAdornment,
      description,
      descriptionId,
      message,
      messageId,
      invalid = false,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={classNames(FIELD_ROOT_CLASS, className)}
        {...rest}
      >
      {(label || labelAdornment) && (
        <div className="field-label-slot flex flex-row items-end justify-between">
          {label && (
            <label
              id={labelId}
              htmlFor={labelFor}
              className={FIELD_LABEL_CLASS}
            >
              {label}
            </label>
          )}
          {labelAdornment}
        </div>
      )}

      {children}

      {description !== undefined && description !== null && !invalid && (
        <span id={descriptionId} className={FIELD_DESCRIPTION_CLASS}>
          {description}
        </span>
      )}

      {message !== undefined && message !== null && invalid && (
        <span
          id={messageId}
          role="alert"
          aria-live="polite"
          className={FIELD_MESSAGE_CLASS}
        >
          {message}
        </span>
      )}
      </div>
    );
  },
);

FieldFrame.displayName = "FieldFrame";

export default FieldFrame;
