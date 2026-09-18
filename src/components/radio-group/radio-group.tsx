"use client";

import { useField } from "formik";
import { useId } from "react";
import {
  FIELD_LABEL_CLASS,
  FIELD_MESSAGE_CLASS,
  FIELD_ROOT_CLASS,
} from "../field/field-styles";

export interface RadioGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  options: {
    label: string;
    value: string;
  }[];
}

export function RadioGroup({
  name,
  label,
  options,
  className,
  ...rest
}: RadioGroupProps) {
  const [field, meta] = useField(name!);

  const hasError = Boolean(meta.touched && meta.error);
  const errorId = `${useId()}-error`;

  return (
    <fieldset
      className={`${FIELD_ROOT_CLASS} ${className ?? ""}`}
      aria-describedby={hasError ? errorId : undefined}
      aria-invalid={hasError || undefined}
    >
      {label && <legend className={FIELD_LABEL_CLASS}>{label}</legend>}
      <div className="field-control-slot mt-4xs mb-[4px] flex min-h-control-md flex-wrap items-center gap-x-6 gap-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-7 cursor-pointer items-center gap-2"
          >
            <input
              type="radio"
              {...rest}
              {...field}
              value={option.value}
              checked={field.value === option.value}
              aria-describedby={hasError ? errorId : undefined}
              data-invalid={hasError || undefined}
              className="radio-control"
            />
            <span className="text-content-secondary">{option.label}</span>
          </label>
        ))}
      </div>
      {hasError && (
        <span
          id={errorId}
          role="alert"
          aria-live="polite"
          className={FIELD_MESSAGE_CLASS}
        >
          {meta.error}
        </span>
      )}
    </fieldset>
  );
}


