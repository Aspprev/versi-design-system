"use client";
import React, { useRef, useCallback, useId, useState } from "react";
import classNames from "classnames";
import { IconBaseProps } from "react-icons";
import { PatternFormat, NumberFormatValues } from "react-number-format";
import { useField } from "formik";
import { MdInfoOutline, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { mergeAriaDescribedBy } from "../../utils/accessibility";
import Tooltip from "../tooltip/Tooltip";
import FieldFrame from "../field/FieldFrame";
import {
  FIELD_CONTROL_CLASS,
  FIELD_DISABLED_CLASS,
  FIELD_ERROR_CLASS,
  FIELD_INPUT_CLASS,
} from "../field/field-styles";

export type InputProps = {
  name: string;
  label?: string;
  helperText?: string | React.ReactNode;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  mask?:
    | "cep"
    | "conta"
    | "currency"
    | "cpf"
    | "phone"
    | "date"
    | "datePicker"
    | "specialChars"
    | "cnpj"
    | "agencia";
  disabled?: boolean;
  error?: boolean;
  disallowSpaces?: boolean;
  leadIcon?: React.ComponentType<IconBaseProps>;
  endIcon?: React.ComponentType<IconBaseProps>;
} & React.InputHTMLAttributes<HTMLInputElement>;

const BaseInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    {...props}
    ref={ref}
    className={classNames(FIELD_INPUT_CLASS, props.className)}
  />
));
BaseInput.displayName = "BaseInput";

function normalizeCurrencyDigits(value: unknown) {
  if (value === undefined || value === null) return "";
  return String(value).replace(/\D/g, "");
}

function formatCurrencyAmount(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCurrencyDigitsForDisplay(value: unknown) {
  if (value === undefined || value === null || value === "") return "";

  if (typeof value === "number" && Number.isFinite(value)) {
    return formatCurrencyAmount(value);
  }

  const stringValue = String(value).trim();

  if (!stringValue) return "";

  const digits = normalizeCurrencyDigits(stringValue);

  if (!digits) return "";

  const normalized = digits.padStart(3, "0");
  const integerPart = normalized.slice(0, -2).replace(/^0+(?=\d)/, "") || "0";
  const decimalPart = normalized.slice(-2);
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formattedInteger},${decimalPart}`;
}

function formatContaValue(value: string) {
  const upperValue = value.toUpperCase();
  const hasHyphen = upperValue.includes("-");
  const [rawBody = "", rawDigit = ""] = upperValue.split("-", 2);

  if (hasHyphen) {
    const bodySeed = rawBody.replace(/\D/g, "");
    const suffixChars = rawDigit.replace(/[^0-9X]/g, "");
    const suffixBody = suffixChars.slice(0, -1).replace(/\D/g, "");
    const body = `${bodySeed}${suffixBody}`.slice(0, 12);
    const digit = suffixChars.slice(-1);

    if (!body) return "";
    return digit ? `${body}-${digit}` : `${body}-`;
  }

  const compactDigits = upperValue.replace(/\D/g, "").slice(0, 13);
  if (!compactDigits) return "";

  if (compactDigits.length <= 12) {
    return `${compactDigits}-`;
  }

  return `${compactDigits.slice(0, 12)}-${compactDigits.slice(12, 13)}`;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  helperText,
  placeholder,
  prefix,
  suffix,
  mask,
  disabled,
  error,
  disallowSpaces,
  leadIcon: LeadIcon,
  endIcon: EndIcon,
  type,
  className,
  ...rest
}) => {
  const [field, meta, helpers] = useField(name);

  const inputRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const isPasswordType = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const currentType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  const hasError = Boolean((meta.touched && meta.error) || error);
  const inputId = rest.id ?? name;
  const errorId = `${inputId}-error`;
  const ariaDescribedBy = mergeAriaDescribedBy(
    rest["aria-describedby"],
    hasError ? errorId : undefined,
  );
  const accessibilityProps = {
    id: inputId,
    "aria-invalid": hasError || undefined,
    "aria-describedby": ariaDescribedBy,
  };

  const safeValue = (v: unknown) =>
    v === undefined || v === null ? "" : (v as string | number);

  const sanitizeValue = useCallback(
    (value: string) => {
      if (!disallowSpaces) return value;
      return value.replace(/\s/g, "");
    },
    [disallowSpaces],
  );

  const handlePasteFormik = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (!disallowSpaces) {
        rest.onPaste?.(e);
        return;
      }

      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");
      const sanitizedValue = sanitizeValue(pastedText);
      helpers.setValue(sanitizedValue);
      rest.onPaste?.(e);
    },
    [disallowSpaces, helpers, rest, sanitizeValue],
  );

  const handleValueChange = useCallback(
    (values: NumberFormatValues) => {
      helpers.setValue(values.value);
    },
    [helpers],
  );

  const handleCurrencyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedCurrencyValue = formatCurrencyDigitsForDisplay(
        e.target.value,
      );

      helpers.setValue(formattedCurrencyValue);

      if (rest.onChange) {
        const event = {
          ...e,
          target: { ...e.target, value: formattedCurrencyValue },
          currentTarget: {
            ...e.currentTarget,
            value: formattedCurrencyValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        rest.onChange(event);
      }
    },
    [helpers, rest],
  );

  const cleanSpecialChars = (value: string) => {
    if (!value) return "";
    let newValue = value;
    newValue = newValue.replace(/[áàãâä]/gi, "a");
    newValue = newValue.replace(/[éèêë]/gi, "e");
    newValue = newValue.replace(/[íìîï]/gi, "i");
    newValue = newValue.replace(/[óòõôö]/gi, "o");
    newValue = newValue.replace(/[úùûü]/gi, "u");
    newValue = newValue.replace(/[ç]/gi, "c");
    // Mantém a lista explícita de caracteres removidos para preservar o contrato legado.
    // eslint-disable-next-line no-useless-escape
    newValue = newValue.replace(/['"`´@!#$%&¨()*;:?\-_+={}\[\]\\\/|<>.,]/g, "");
    return newValue;
  };

  const patternMasks: Record<string, string> = {
    cpf: "###.###.###-##",
    cnpj: "##.###.###/####-##",
    cep: "#####-###",
    phone: "(##) #####-####",
    date: "##/##/####",
    agencia: "####",
  };

  const renderMaskedInput = (inputType?: string) => {
    const autoCompleteValue = rest.autoComplete;

    if (mask === "currency") {
      const rawCurrencyValue =
        typeof field.value === "string" || typeof field.value === "number"
          ? field.value
          : "";

      return (
        <input
          {...rest}
          {...accessibilityProps}
          name={name}
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={formatCurrencyDigitsForDisplay(rawCurrencyValue)}
          onChange={handleCurrencyChange}
          onBlur={field.onBlur}
          placeholder={placeholder}
          className={classNames(FIELD_INPUT_CLASS, className)}
          autoComplete={autoCompleteValue}
          disabled={disabled}
        />
      );
    }

    if (mask === "specialChars") {
      return (
        <input
          {...rest}
          {...accessibilityProps}
          {...field}
          name={name}
          ref={inputRef}
          placeholder={placeholder}
          type={inputType === "date" ? "text" : inputType}
          value={String(safeValue(field.value))}
          onKeyDown={(e) => {
            if (disallowSpaces && e.key === " ") {
              e.preventDefault();
            }
            rest.onKeyDown?.(e);
          }}
          onPaste={handlePasteFormik}
          onChange={(e) => {
            const cleanedValue = cleanSpecialChars(e.target.value);
            const sanitizedValue = sanitizeValue(cleanedValue);
            helpers.setValue(sanitizedValue);
            rest.onChange?.(e);
          }}
          autoComplete={autoCompleteValue}
          className={classNames(FIELD_INPUT_CLASS, className)}
          disabled={disabled}
        />
      );
    }

    if (mask === "datePicker") {
      const dateValue = field.value
        ? typeof field.value === "string"
          ? field.value
          : field.value instanceof Date
            ? field.value.toLocaleDateString("pt-BR")
            : String(field.value)
        : "";

      return (
        <input
          {...rest}
          {...accessibilityProps}
          {...field}
          name={name}
          ref={inputRef}
          placeholder={placeholder}
          type={inputType}
          value={dateValue}
          onKeyDown={(e) => {
            if (disallowSpaces && e.key === " ") {
              e.preventDefault();
            }
            rest.onKeyDown?.(e);
          }}
          onPaste={handlePasteFormik}
          onChange={(e) => {
            const cleanedValue = cleanSpecialChars(e.target.value);
            const sanitizedValue = sanitizeValue(cleanedValue);
            helpers.setValue(sanitizedValue);
          }}
          autoComplete={autoCompleteValue}
          className={classNames(FIELD_INPUT_CLASS, className)}
          disabled={disabled}
        />
      );
    }

    if (mask === "conta") {
      return (
        <input
          {...rest}
          {...accessibilityProps}
          name={name}
          ref={inputRef}
          placeholder={placeholder}
          maxLength={14}
          value={String(safeValue(field.value))}
          disabled={disabled}
          className={classNames(FIELD_INPUT_CLASS, className)}
          onKeyDown={(e) => {
            if (disallowSpaces && e.key === " ") {
              e.preventDefault();
            }
            if (
              e.key === "Backspace" &&
              e.currentTarget.selectionStart === e.currentTarget.selectionEnd &&
              e.currentTarget.selectionStart === e.currentTarget.value.length &&
              e.currentTarget.value.endsWith("-")
            ) {
              e.preventDefault();
              const nextValue = formatContaValue(
                e.currentTarget.value.slice(0, -2),
              );
              helpers.setValue(nextValue);
              return;
            }
            rest.onKeyDown?.(e);
          }}
          onPaste={handlePasteFormik}
          onChange={(e) => {
            const val = sanitizeValue(formatContaValue(e.target.value));
            e.target.value = val;
            e.currentTarget.value = val;
            helpers.setValue(val);
            rest.onChange?.(e);
          }}
          autoComplete={autoCompleteValue}
        />
      );
    }

    if (mask && patternMasks[mask]) {
      const patternValue =
        typeof field.value === "string" || typeof field.value === "number"
          ? field.value
          : "";

      return (
        <PatternFormat
          {...rest}
          {...accessibilityProps}
          {...field}
          name={name}
          value={patternValue}
          defaultValue=""
          getInputRef={inputRef}
          customInput={BaseInput}
          format={patternMasks[mask]}
          allowEmptyFormatting={false}
          mask=""
          placeholder={placeholder}
          onValueChange={handleValueChange}
          className={classNames(FIELD_INPUT_CLASS, className)}
          autoComplete={autoCompleteValue}
          disabled={disabled}
        />
      );
    }

    return (
      <input
        {...rest}
        {...accessibilityProps}
        {...field}
        name={name}
        ref={inputRef}
        placeholder={placeholder}
        type={inputType === "date" ? "text" : inputType}
        value={String(safeValue(field.value))}
        onKeyDown={(e) => {
          if (disallowSpaces && e.key === " ") {
            e.preventDefault();
          }
          rest.onKeyDown?.(e);
        }}
        onPaste={handlePasteFormik}
        onChange={(e) => {
          const sanitizedValue = sanitizeValue(e.target.value);
          helpers.setValue(sanitizedValue);
          rest.onChange?.(e);
        }}
        autoComplete={autoCompleteValue}
        className={classNames(FIELD_INPUT_CLASS, className)}
        disabled={disabled}
      />
    );
  };

  return (
    <FieldFrame
      label={label}
      labelFor={inputId}
      invalid={Boolean(hasError)}
      message={meta.error}
      messageId={errorId}
      labelAdornment={
        helperText ? (
          <>
            <button
              ref={iconRef}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              type="button"
              aria-label={`Mais informações sobre ${label ?? name}`}
              className="rounded-sm pb-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
            >
              <MdInfoOutline aria-hidden="true" className="mr-0 text-content-muted" />
            </button>

            <Tooltip
              targetRef={iconRef}
              content={helperText}
              visible={hovered}
              preferredPosition="bottom"
            />
          </>
        ) : undefined
      }
    >
      <div
        data-has-value={String(safeValue(field.value)).length > 0}
        className={classNames(
          FIELD_CONTROL_CLASS,
          {
            [FIELD_DISABLED_CLASS]: disabled,
            [FIELD_ERROR_CLASS]: hasError,
          },
        )}
      >
        {LeadIcon && (
          <LeadIcon
            aria-hidden="true"
            focusable="false"
            className={classNames("h-5 w-5", {
              "text-field-assistive-error": hasError,
            })}
          />
        )}
        {prefix && <span>{prefix}</span>}
        {renderMaskedInput(currentType)}
        {suffix && <span>{suffix}</span>}

        {isPasswordType ? (
          <button
            type="button"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
            className="flex items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
          >
            {showPassword ? (
              <MdVisibilityOff
                aria-hidden="true"
                className={classNames("h-5 w-5", {
                  "text-field-assistive-error": hasError,
                })}
              />
            ) : (
              <MdVisibility
                aria-hidden="true"
                className={classNames("h-5 w-5", {
                  "text-field-assistive-error": hasError,
                })}
              />
            )}
          </button>
        ) : (
          EndIcon && (
            <EndIcon
              aria-hidden="true"
              focusable="false"
              className={classNames("h-5 w-5", {
                "text-field-assistive-error": hasError,
              })}
            />
          )
        )}
      </div>
    </FieldFrame>
  );
};

export default Input;

// ==========================
// Input sem Formik (standalone) com máscaras
// ==========================
export type InputStandaloneProps = {
  label?: string;
  helperText?: string | React.ReactNode;
  prefix?: string;
  suffix?: string;
  mask?:
    | "cep"
    | "conta"
    | "currency"
    | "cpf"
    | "phone"
    | "date"
    | "datePicker"
    | "specialChars"
    | "cnpj"
    | "agencia";
  disabled?: boolean;
  error?: boolean;
  errorText?: string;
  disallowSpaces?: boolean;
  leadIcon?: React.ComponentType<IconBaseProps>;
  endIcon?: React.ComponentType<IconBaseProps>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputStandalone: React.FC<InputStandaloneProps> = (props) => {
  const {
    label,
    helperText,
    prefix,
    suffix,
    mask,
    disabled,
    error,
    errorText,
    disallowSpaces,
    leadIcon: LeadIcon,
    endIcon: EndIcon,
    type,
    className,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const isPasswordType = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const currentType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  const hasError = Boolean(error);
  const generatedInputId = useId();
  const inputId = rest.id ?? generatedInputId;
  const errorId = `${inputId}-error`;
  const ariaDescribedBy = mergeAriaDescribedBy(
    rest["aria-describedby"],
    hasError && errorText ? errorId : undefined,
  );
  const accessibilityProps = {
    id: inputId,
    "aria-invalid": hasError || undefined,
    "aria-describedby": ariaDescribedBy,
  };

  const safeValue = (v: unknown) =>
    v === undefined || v === null ? "" : (v as string | number);

  const sanitizeValue = useCallback(
    (value: string) => {
      if (!disallowSpaces) return value;
      return value.replace(/\s/g, "");
    },
    [disallowSpaces],
  );

  const handlePasteStandalone = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (!disallowSpaces) {
        rest.onPaste?.(e);
        return;
      }

      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");
      const sanitizedValue = sanitizeValue(pastedText);

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue,
        },
        currentTarget: {
          ...e.currentTarget,
          value: sanitizedValue,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      rest.onChange?.(syntheticEvent);
      rest.onPaste?.(e);
    },
    [disallowSpaces, rest, sanitizeValue],
  );

  const cleanSpecialChars = (value: string) => {
    if (!value) return "";
    let newValue = value;
    newValue = newValue.replace(/[áàãâä]/gi, "a");
    newValue = newValue.replace(/[éèêë]/gi, "e");
    newValue = newValue.replace(/[íìîï]/gi, "i");
    newValue = newValue.replace(/[óòõôö]/gi, "o");
    newValue = newValue.replace(/[úùûü]/gi, "u");
    newValue = newValue.replace(/[ç]/gi, "c");
    // Mantém a lista explícita de caracteres removidos para preservar o contrato legado.
    // eslint-disable-next-line no-useless-escape
    newValue = newValue.replace(/['"`´@!#$%&¨()*;:?\-_+={}\[\]\\\/|<>.,]/g, "");
    return newValue;
  };

  const patternMasks: Record<string, string> = {
    cpf: "###.###.###-##",
    cnpj: "##.###.###/####-##",
    cep: "#####-###",
    phone: "(##) #####-####",
    date: "##/##/####",
    agencia: "####",
  };

  const renderMaskedInput = (inputType?: string) => {
    const autoCompleteValue = rest.autoComplete;

    if (mask === "currency") {
      const rawCurrencyValue =
        typeof rest.value === "string" || typeof rest.value === "number"
          ? rest.value
          : "";

      return (
        <input
          {...rest}
          {...accessibilityProps}
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={formatCurrencyDigitsForDisplay(rawCurrencyValue)}
          onChange={(e) => {
            if (rest.onChange) {
              const formattedCurrencyValue = formatCurrencyDigitsForDisplay(
                e.target.value,
              );
              const event = {
                target: { value: formattedCurrencyValue },
                currentTarget: { value: formattedCurrencyValue },
              } as React.ChangeEvent<HTMLInputElement>;
              rest.onChange(event);
            }
          }}
          placeholder={rest.placeholder}
          className={classNames(FIELD_INPUT_CLASS, className)}
          autoComplete={autoCompleteValue}
          disabled={disabled}
        />
      );
    }

    if (mask === "specialChars") {
      return (
        <input
          {...rest}
          {...accessibilityProps}
          ref={inputRef}
          placeholder={rest.placeholder}
          type={inputType === "date" ? "text" : inputType}
          value={String(safeValue(rest.value))}
          onKeyDown={(e) => {
            if (disallowSpaces && e.key === " ") {
              e.preventDefault();
            }
            rest.onKeyDown?.(e);
          }}
          onPaste={handlePasteStandalone}
          onChange={(e) => {
            const cleaned = cleanSpecialChars(e.target.value);
            const sanitizedValue = sanitizeValue(cleaned);
            e.target.value = sanitizedValue;
            rest.onChange?.(e);
          }}
          autoComplete={autoCompleteValue}
          className={classNames(FIELD_INPUT_CLASS, className)}
          disabled={disabled}
        />
      );
    }

    if (mask === "datePicker") {
      const dateValue = rest.value
        ? typeof rest.value === "string"
          ? rest.value
          : rest.value instanceof Date
            ? rest.value.toLocaleDateString("pt-BR")
            : String(rest.value)
        : "";

      return (
        <input
          {...rest}
          {...accessibilityProps}
          ref={inputRef}
          placeholder={rest.placeholder}
          type={inputType}
          value={dateValue}
          onKeyDown={(e) => {
            if (disallowSpaces && e.key === " ") {
              e.preventDefault();
            }
            rest.onKeyDown?.(e);
          }}
          onPaste={handlePasteStandalone}
          onChange={(e) => {
            const cleaned = cleanSpecialChars(e.target.value);
            const sanitizedValue = sanitizeValue(cleaned);
            e.target.value = sanitizedValue;
            rest.onChange?.(e);
          }}
          autoComplete={autoCompleteValue}
          className={classNames(FIELD_INPUT_CLASS, className)}
          disabled={disabled}
        />
      );
    }

    if (mask === "conta") {
      return (
        <input
          {...rest}
          {...accessibilityProps}
          ref={inputRef}
          placeholder={rest.placeholder}
          maxLength={14}
          value={String(safeValue(rest.value))}
          disabled={disabled}
          className={classNames(FIELD_INPUT_CLASS, className)}
          onKeyDown={(e) => {
            if (disallowSpaces && e.key === " ") {
              e.preventDefault();
            }
            if (
              e.key === "Backspace" &&
              e.currentTarget.selectionStart === e.currentTarget.selectionEnd &&
              e.currentTarget.selectionStart === e.currentTarget.value.length &&
              e.currentTarget.value.endsWith("-")
            ) {
              e.preventDefault();
              const nextValue = formatContaValue(
                e.currentTarget.value.slice(0, -2),
              );
              e.currentTarget.value = nextValue;
              if (rest.onChange) {
                const event = {
                  target: { value: nextValue },
                  currentTarget: { value: nextValue },
                } as React.ChangeEvent<HTMLInputElement>;
                rest.onChange(event);
              }
              return;
            }
            rest.onKeyDown?.(e);
          }}
          onPaste={handlePasteStandalone}
          onChange={(e) => {
            const val = sanitizeValue(formatContaValue(e.target.value));
            e.target.value = val;
            rest.onChange?.(e);
          }}
          autoComplete={autoCompleteValue}
        />
      );
    }

    if (mask && patternMasks[mask]) {
      const patternValue =
        typeof rest.value === "string" || typeof rest.value === "number"
          ? rest.value
          : "";

      return (
        <PatternFormat
          {...rest}
          {...accessibilityProps}
          value={patternValue}
          defaultValue=""
          getInputRef={inputRef}
          customInput={BaseInput}
          format={patternMasks[mask]}
          allowEmptyFormatting={false}
          mask=""
          placeholder={rest.placeholder}
          onValueChange={(values: NumberFormatValues) => {
            if (rest.onChange) {
              const event = {
                target: { value: values.value },
              } as React.ChangeEvent<HTMLInputElement>;
              rest.onChange(event);
            }
          }}
          className={classNames(FIELD_INPUT_CLASS, className)}
          autoComplete={autoCompleteValue}
          disabled={disabled}
        />
      );
    }

    return (
      <input
        {...rest}
        {...accessibilityProps}
        ref={inputRef}
        placeholder={rest.placeholder}
        type={inputType === "date" ? "text" : inputType}
        value={String(safeValue(rest.value))}
        onKeyDown={(e) => {
          if (disallowSpaces && e.key === " ") {
            e.preventDefault();
          }
          rest.onKeyDown?.(e);
        }}
        onPaste={handlePasteStandalone}
        onChange={(e) => {
          const sanitizedValue = sanitizeValue(e.target.value);
          e.target.value = sanitizedValue;
          rest.onChange?.(e);
        }}
        autoComplete={autoCompleteValue}
        className={classNames(FIELD_INPUT_CLASS, className)}
        disabled={disabled}
      />
    );
  };

  return (
    <FieldFrame
      label={label}
      labelFor={inputId}
      invalid={Boolean(hasError)}
      message={errorText}
      messageId={errorId}
      labelAdornment={
        helperText ? (
          <>
            <button
              ref={iconRef}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              type="button"
              aria-label={`Mais informações sobre ${label ?? rest.name ?? "este campo"}`}
              className="rounded-sm pb-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
            >
              <MdInfoOutline aria-hidden="true" className="mr-0 text-content-muted" />
            </button>

            <Tooltip
              targetRef={iconRef}
              content={helperText}
              visible={hovered}
              preferredPosition="bottom"
            />
          </>
        ) : undefined
      }
    >
      <div
        data-has-value={
          String(safeValue(rest.value ?? rest.defaultValue)).length > 0
        }
        className={classNames(
          FIELD_CONTROL_CLASS,
          {
            [FIELD_DISABLED_CLASS]: disabled,
            [FIELD_ERROR_CLASS]: hasError,
          },
        )}
      >
        {LeadIcon && (
          <LeadIcon
            aria-hidden="true"
            focusable="false"
            className={classNames("h-5 w-5", {
              "text-field-assistive-error": hasError,
            })}
          />
        )}
        {prefix && <span>{prefix}</span>}

        {renderMaskedInput(currentType)}

        {suffix && <span>{suffix}</span>}

        {isPasswordType ? (
          <button
            type="button"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
            className="flex items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
          >
            {showPassword ? (
              <MdVisibilityOff
                aria-hidden="true"
                className={classNames("h-5 w-5", {
                  "text-field-assistive-error": hasError,
                })}
              />
            ) : (
              <MdVisibility
                aria-hidden="true"
                className={classNames("h-5 w-5", {
                  "text-field-assistive-error": hasError,
                })}
              />
            )}
          </button>
        ) : (
          EndIcon && (
            <EndIcon
              aria-hidden="true"
              focusable="false"
              className={classNames("h-5 w-5", {
                "text-field-assistive-error": hasError,
              })}
            />
          )
        )}
      </div>
    </FieldFrame>
  );
};
