import classNames from "classnames";
import type { HTMLAttributes, ReactNode } from "react";

export interface DocumentItemDetail {
  label: ReactNode;
  value: ReactNode;
}

export interface DocumentItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  details?: DocumentItemDetail[];
  status?: ReactNode;
  actions?: ReactNode;
  illustration?: ReactNode;
  variant?: "plain" | "subtle";
  titleClassName?: string;
}

export function DocumentItem({
  title,
  label,
  description,
  details = [],
  status,
  actions,
  illustration,
  variant = "plain",
  titleClassName,
  className,
  ...rest
}: DocumentItemProps) {
  return (
    <div
      className={classNames(
        "flex min-w-0 flex-col gap-4 rounded-md tablet:flex-row tablet:items-center tablet:justify-between",
        variant === "subtle" && "bg-surface-subtle p-4 tablet:p-5",
        className,
      )}
      {...rest}
    >
      <div className="min-w-0 flex-1 space-y-3">
        <div className="min-w-0">
          {label && (
            <p className="text-sm text-content-secondary">{label}</p>
          )}
          <p
            className={classNames(
              "break-words text-content-primary",
              titleClassName,
            )}
          >
            {title}
          </p>
          {description && (
            <div className="mt-1 break-words text-sm text-content-secondary">
              {description}
            </div>
          )}
        </div>

        {(details.length > 0 || status) && (
          <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
            {details.map((detail, index) => (
              <div key={index} className="min-w-0">
                <p className="text-sm text-content-secondary">{detail.label}</p>
                <div className="break-words font-semibold text-content-primary">
                  {detail.value}
                </div>
              </div>
            ))}
            {status && <div className="min-w-0">{status}</div>}
          </div>
        )}
      </div>

      {illustration && (
        <div className="hidden shrink-0 desktop:block" aria-hidden="true">
          {illustration}
        </div>
      )}

      {actions && (
        <div className="flex w-full shrink-0 flex-col gap-2 tablet:w-auto tablet:flex-row tablet:flex-wrap tablet:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
