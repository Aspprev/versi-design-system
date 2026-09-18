import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";
import { resolveOptionalValue, type OptionalValuePolicy } from "../../utils/optional-value";

const COLUMN_STYLES = {
  1: "grid-cols-1",
  2: "grid-cols-1 mobile:grid-cols-2",
  3: "grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-3",
  4: "grid-cols-1 mobile:grid-cols-2 desktop:grid-cols-4",
  6: "grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6",
} as const;

export interface InfoGridProps extends ComponentProps<"dl"> {
  columns?: keyof typeof COLUMN_STYLES;
}

export function InfoGrid({ columns = 3, className, ...rest }: InfoGridProps) {
  return (
    <dl
      className={classNames(
        "grid gap-x-8 gap-y-5",
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
