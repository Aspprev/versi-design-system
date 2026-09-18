"use client";

import classNames from "classnames";
import { FormikContext, FormikContextType, FormikValues, getIn } from "formik";
import {
  ChangeEvent,
  ReactNode,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";

export type RadioCardOption = {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type RadioCardGroupProps = {
  name?: string;
  label?: ReactNode;
  options: RadioCardOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  touched?: boolean;
  className?: string;
  optionClassName?: string;
  columnsClassName?: string;
  disabled?: boolean;
};

const isFormikContext = (
  context: FormikContextType<FormikValues> | undefined,
): context is FormikContextType<FormikValues> =>
  Boolean(context && typeof context.setFieldValue === "function");

export function RadioCardGroup({
  name,
  label,
  options,
  value,
  defaultValue = "",
  onChange,
  error,
  touched,
  className,
  optionClassName,
  columnsClassName,
  disabled = false,
}: RadioCardGroupProps) {
  const formikContext = useContext(
    FormikContext as unknown as React.Context<
      FormikContextType<FormikValues> | undefined
    >,
  );
  const generatedName = useId();
  const errorId = `${generatedName}-error`;
  const [internalValue, setInternalValue] = useState(defaultValue);

  const hasFormikBinding = Boolean(name) && isFormikContext(formikContext);
  const fieldName = name ?? generatedName;

  const fieldValue = useMemo(() => {
    if (hasFormikBinding && name) {
      return String(getIn(formikContext.values, name) ?? "");
    }

    if (value !== undefined) {
      return value;
    }

    return internalValue;
  }, [formikContext?.values, hasFormikBinding, internalValue, name, value]);

  const fieldTouched =
    hasFormikBinding && name
      ? Boolean(getIn(formikContext.touched, name))
      : Boolean(touched);

  const fieldError =
    hasFormikBinding && name ? getIn(formikContext.errors, name) : error;

  const hasError = Boolean(fieldTouched && fieldError);
  const helperText =
    typeof fieldError === "string" && hasError ? fieldError : undefined;

  const handleChange = (
    nextValue: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (hasFormikBinding && name) {
      formikContext.setFieldValue(name, nextValue);
      formikContext.setFieldTouched(name, true, false);
    } else if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue, event);
  };

  return (
    <fieldset
      className={classNames("flex min-w-0 flex-col", className)}
      aria-describedby={helperText ? errorId : undefined}
      aria-invalid={hasError || undefined}
    >
      {label && (
        <legend className="mb-2 px-0.5 text-[16px] tracking-wide">
          {label}
        </legend>
      )}

      <div className={classNames("grid gap-3", columnsClassName)}>
        {options.map((option) => {
          const optionId = `${fieldName}-${option.value}`;
          const checked = fieldValue === option.value;
          const optionDisabled = disabled || Boolean(option.disabled);

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={classNames(
                "block rounded-md border p-4 transition-colors",
                checked
                  ? "border-primary-1 bg-primary-5"
                  : "border-transparent bg-bg-light",
                hasError && !checked
                  ? "outline outline-1 outline-feedback-danger-border"
                  : "outline outline-1 outline-transparent",
                optionDisabled
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer",
                optionClassName,
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  id={optionId}
                  type="radio"
                  name={fieldName}
                  value={option.value}
                  checked={checked}
                  disabled={optionDisabled}
                  onChange={(event) => handleChange(option.value, event)}
                  onBlur={() => {
                    if (hasFormikBinding && name) {
                      formikContext.setFieldTouched(name, true, false);
                    }
                  }}
                  aria-describedby={helperText ? errorId : undefined}
                  className="radio-control mt-0.5"
                />

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-content-primary">
                    {option.title}
                  </div>
                  {option.description && (
                    <div className="mt-1 text-content-primary">
                      {option.description}
                    </div>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {helperText && (
        <span
          id={errorId}
          role="alert"
          aria-live="assertive"
          className="mt-1 text-xs tracking-wide text-feedback-danger-content"
        >
          {helperText}
        </span>
      )}
    </fieldset>
  );
}

