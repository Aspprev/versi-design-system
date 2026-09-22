"use client";

import classNames from "classnames";
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ClipboardEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import FieldFrame from "../field/FieldFrame";

export type OtpCodeInputMask =
  | "numeric"
  | "alphanumeric"
  | RegExp
  | ((value: string) => string);

export interface OtpCodeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size"> {
  length?: number;
  value?: string;
  values?: string[];
  onChange?: (value: string, values: string[]) => void;
  onComplete?: (value: string) => void;
  onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  error?: boolean;
  errorText?: string;
  helperText?: string;
  label?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  mask?: OtpCodeInputMask;
}

export interface OtpCodeInputHandle {
  focus: (index?: number) => void;
  clear: () => void;
}

const normalizeMask = (value: string, mask: OtpCodeInputMask): string => {
  if (typeof mask === "function") return mask(value).slice(0, 1);
  if (mask instanceof RegExp) return mask.test(value) ? value.slice(0, 1) : "";
  if (mask === "alphanumeric") return value.replace(/[^a-z\d]/gi, "").slice(0, 1);
  return value.replace(/\D/g, "").slice(0, 1);
};

const normalizeValues = (
  source: string | string[] | undefined,
  length: number,
  mask: OtpCodeInputMask,
) => {
  const values = Array.isArray(source) ? source : Array.from(source ?? "");
  return Array.from({ length }, (_, index) => normalizeMask(values[index] ?? "", mask));
};

const OtpCodeInput = forwardRef<OtpCodeInputHandle, OtpCodeInputProps>(
  function OtpCodeInput(
    {
      length = 6,
      value,
      values,
      onChange,
      onComplete,
      onPaste,
      autoFocus = false,
      disabled = false,
      error = false,
      errorText,
      helperText,
      label = "Código de uso único",
      inputMode = "numeric",
      mask = "numeric",
      name,
      className,
      ...inputProps
    },
    ref,
  ) {
    const safeLength = Math.max(1, Math.floor(length));
    const groupId = useId();
    const errorId = `${groupId}-error`;
    const helperId = `${groupId}-helper`;
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const isControlled = value !== undefined || values !== undefined;
    const [internalValues, setInternalValues] = useState(() =>
      normalizeValues(values ?? value, safeLength, mask),
    );
    const currentValues = isControlled
      ? normalizeValues(values ?? value, safeLength, mask)
      : internalValues;

    useEffect(() => {
      if (!isControlled) {
        setInternalValues((previous) =>
          previous.length === safeLength
            ? previous
            : normalizeValues(previous, safeLength, mask),
        );
      }
    }, [isControlled, mask, safeLength]);

    useImperativeHandle(ref, () => ({
      focus: (index = 0) => inputRefs.current[Math.min(Math.max(index, 0), safeLength - 1)]?.focus(),
      clear: () => {
        const next = Array.from({ length: safeLength }, () => "");
        if (!isControlled) setInternalValues(next);
        onChange?.("", next);
        inputRefs.current[0]?.focus();
      },
    }), [isControlled, onChange, safeLength]);

    useEffect(() => {
      if (autoFocus) inputRefs.current[0]?.focus();
    }, [autoFocus]);

    const emit = (next: string[], focusIndex?: number) => {
      const normalized = normalizeValues(next, safeLength, mask);
      if (!isControlled) setInternalValues(normalized);
      const nextValue = normalized.join("");
      onChange?.(nextValue, normalized);
      if (normalized.every(Boolean) && nextValue.length === safeLength) {
        onComplete?.(nextValue);
      }
      if (focusIndex !== undefined) inputRefs.current[focusIndex]?.focus();
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
      onPaste?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      const pasted = Array.from(event.clipboardData.getData("text"))
        .map((item) => normalizeMask(item, mask))
        .filter(Boolean)
        .slice(0, safeLength - index);
      if (!pasted.length) return;
      const next = [...currentValues];
      pasted.forEach((item, offset) => { next[index + offset] = item; });
      emit(next, Math.min(index + pasted.length, safeLength - 1));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (event.key === "ArrowRight" && index < safeLength - 1) {
        event.preventDefault();
        inputRefs.current[index + 1]?.focus();
      } else if (event.key === "Backspace") {
        if (currentValues[index]) {
          const next = [...currentValues];
          next[index] = "";
          emit(next);
        } else if (index > 0) {
          event.preventDefault();
          const next = [...currentValues];
          next[index - 1] = "";
          emit(next, index - 1);
        }
      } else if (event.key === "Delete" && currentValues[index]) {
        const next = [...currentValues];
        next[index] = "";
        emit(next);
      } else if (event.key === "Home") {
        event.preventDefault();
        inputRefs.current[0]?.focus();
      } else if (event.key === "End") {
        event.preventDefault();
        inputRefs.current[safeLength - 1]?.focus();
      }
    };

    const hasError = Boolean(error || errorText);
    const describedBy = [helperText ? helperId : "", hasError && errorText ? errorId : ""]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <FieldFrame
        label={label}
        labelId={`${groupId}-label`}
        labelFor={`${groupId}-0`}
        message={errorText}
        messageId={errorId}
        description={helperText}
        descriptionId={helperId}
        invalid={hasError}
        className={className}
      >
        <div
          role="group"
          aria-labelledby={label ? `${groupId}-label` : undefined}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          className="mt-1 flex flex-wrap gap-2"
        >
          {Array.from({ length: safeLength }, (_, index) => (
            <input
              {...inputProps}
              key={index}
              ref={(element) => { inputRefs.current[index] = element; }}
              id={`${groupId}-${index}`}
              name={index === 0 ? name : undefined}
              type="text"
              inputMode={inputMode}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={currentValues[index]}
              disabled={disabled}
              aria-label={`${label}, dígito ${index + 1} de ${safeLength}`}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              onChange={(event) => {
                const next = [...currentValues];
                const nextValue = normalizeMask(event.target.value, mask);
                next[index] = nextValue;
                emit(next, nextValue && index < safeLength - 1 ? index + 1 : undefined);
              }}
              onPaste={(event) => handlePaste(event, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onFocus={(event) => event.currentTarget.select()}
              className={classNames(
                "h-11 w-11 rounded-sm border bg-field-surface text-center text-lg font-bold text-field-content outline-none transition-colors focus-visible:border-field-border-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:bg-field-surface-disabled",
                hasError ? "border-field-border-error" : "border-field-border-default",
              )}
            />
          ))}
        </div>
      </FieldFrame>
    );
  },
);

OtpCodeInput.displayName = "OtpCodeInput";
export default OtpCodeInput;
