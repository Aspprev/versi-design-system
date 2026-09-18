"use client";

import React, { useRef } from "react";
import classNames from "classnames";
import { IconBaseProps } from "react-icons";
import { useField } from "formik";
import { mergeAriaDescribedBy } from "../../utils/accessibility";
import FieldFrame from "../field/FieldFrame";
import {
  FIELD_CONTROL_CLASS,
  FIELD_DISABLED_CLASS,
  FIELD_ERROR_CLASS,
  FIELD_INPUT_CLASS,
} from "../field/field-styles";

export type TextAreaProps = {
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  icon?: React.ComponentType<IconBaseProps>;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea: React.FC<TextAreaProps> = ({
  name,
  label,
  helperText,
  className,
  placeholder,
  prefix,
  suffix,
  disabled,
  icon: Icon,
  ...rest
}) => {
  const [field, meta] = useField(name);
  const componentRef = useRef<HTMLTextAreaElement>(null);

  const hasError = meta.touched && meta.error;
  const errorId = `${name}-error`;
  const descriptionId = `${name}-description`;
  const ariaDescribedBy = mergeAriaDescribedBy(
    rest["aria-describedby"],
    helperText && !hasError ? descriptionId : undefined,
    hasError ? errorId : undefined,
  );

  return (
    <FieldFrame
      label={label}
      labelFor={name}
      description={helperText}
      descriptionId={descriptionId}
      message={meta.error}
      messageId={errorId}
      invalid={Boolean(hasError)}
    >
      <div
        data-has-value={String(field.value ?? "").length > 0}
        className={classNames(
          `${FIELD_CONTROL_CLASS} py-1`,
          {
            [FIELD_DISABLED_CLASS]: disabled,
            [FIELD_ERROR_CLASS]: hasError,
          },
        )}
      >
        {Icon && <Icon aria-hidden="true" className="h-5 w-5" />}
        {prefix && <span>{prefix}</span>}
        <textarea
          {...field}
          {...rest}
          id={name}
          aria-invalid={Boolean(hasError) || undefined}
          aria-describedby={ariaDescribedBy}
          ref={componentRef}
          placeholder={placeholder}
          disabled={disabled}
          className={classNames(FIELD_INPUT_CLASS, className)}
        />
        {suffix && <span>{suffix}</span>}
      </div>

    </FieldFrame>
  );
};

export default TextArea;
