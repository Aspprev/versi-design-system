import classNames from "classnames";
import type { HTMLAttributes, ReactNode } from "react";
import { FormActions, FormGrid } from "../form-layout";

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  filters: ReactNode;
  actions?: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  actionClassName?: string;
}

export function FilterBar({
  filters,
  actions,
  columns = 3,
  className,
  actionClassName,
  ...rest
}: FilterBarProps) {
  return (
    <div
      className={classNames(
        "flex w-full flex-col gap-5 desktop:flex-row desktop:items-end",
        className,
      )}
      {...rest}
    >
      <FormGrid columns={columns} className="min-w-0 flex-1">
        {filters}
      </FormGrid>
      {actions ? (
        <FormActions className={classNames("desktop:w-auto", actionClassName)}>
          {actions}
        </FormActions>
      ) : null}
    </div>
  );
}
