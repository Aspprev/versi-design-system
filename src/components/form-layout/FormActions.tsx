import classNames from "classnames";
import type { HTMLAttributes } from "react";

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end" | "between";
  fullWidthOnMobile?: boolean;
}

const ALIGN_STYLES = {
  start: "tablet:justify-start",
  center: "tablet:justify-center",
  end: "tablet:justify-end",
  between: "tablet:justify-between",
} as const;

export function FormActions({
  align = "end",
  fullWidthOnMobile = true,
  className,
  ...rest
}: FormActionsProps) {
  return (
    <div
      className={classNames(
        "flex w-full flex-col gap-3 tablet:flex-row tablet:items-end",
        ALIGN_STYLES[align],
        fullWidthOnMobile && "[&>*]:w-full tablet:[&>*]:w-auto",
        className,
      )}
      {...rest}
    />
  );
}
