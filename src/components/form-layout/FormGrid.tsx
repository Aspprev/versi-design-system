import classNames from "classnames";
import type { HTMLAttributes } from "react";

const COLUMN_STYLES = {
  1: "grid-cols-1",
  2: "grid-cols-1 tablet:grid-cols-2",
  3: "grid-cols-1 tablet:grid-cols-3",
  4: "grid-cols-1 tablet:grid-cols-4",
  5: "grid-cols-1 tablet:grid-cols-5",
  6: "grid-cols-1 tablet:grid-cols-6",
  7: "grid-cols-1 tablet:grid-cols-7",
  8: "grid-cols-1 tablet:grid-cols-8",
  10: "grid-cols-1 tablet:grid-cols-10",
  12: "grid-cols-1 tablet:grid-cols-12",
} as const;

export interface FormGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: keyof typeof COLUMN_STYLES;
}

export function FormGrid({ columns = 2, className, ...rest }: FormGridProps) {
  return (
    <div
      className={classNames(
        "field-alignment-grid grid w-full gap-x-4 gap-y-5",
        COLUMN_STYLES[columns],
        className,
      )}
      {...rest}
    />
  );
}
