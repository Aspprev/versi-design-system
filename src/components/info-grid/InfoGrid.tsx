import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";
import { resolveOptionalValue, type OptionalValuePolicy } from "../../utils/optional-value";

const COLUMN_STYLES = {
  1: "versi-info-grid--1",
  2: "versi-info-grid--2",
  3: "versi-info-grid--3",
  4: "versi-info-grid--4",
  6: "versi-info-grid--6",
} as const;

export interface InfoGridProps extends ComponentProps<"dl"> {
  columns?: keyof typeof COLUMN_STYLES;
}

export function InfoGrid({ columns = 3, className, ...rest }: InfoGridProps) {
  return (
    <dl
      className={classNames(
        "versi-info-grid grid gap-x-8 gap-y-5",
        COLUMN_STYLES[columns],
        className,
      )}
      {...rest}
    />
  );
}

export interface InfoItemProps extends ComponentProps<"div"> {
  label: ReactNode;
  value?: ReactNode;
  optional?: OptionalValuePolicy;
  placeholder?: string;
  numeric?: boolean;
  variant?: "default" | "metric";
  valueClassName?: string;
}

export function InfoItem({
  label,
  value,
  optional = "placeholder",
  placeholder = "-",
  numeric = false,
  variant = "default",
  className,
  valueClassName,
  children,
  ...rest
}: InfoItemProps) {
  const resolved = resolveOptionalValue(value, { policy: optional, placeholder });
  if (resolved === null) return null;

  return (
    <div className={classNames("min-w-0", className)} {...rest}>
      <dt className="break-words text-sm text-content-secondary">{label}</dt>
      <dd
        className={classNames(
          "mt-1 break-words",
          variant === "metric" ? "text-md font-bold" : "text-md font-semibold",
          numeric && "tabular-nums",
          valueClassName,
        )}
      >
        {children ?? resolved}
      </dd>
    </div>
  );
}
