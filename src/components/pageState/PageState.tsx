"use client";

import Button from "../button/Button";
import classNames from "classnames";
import { ReactNode, useEffect, useId, useRef } from "react";
import {
  MdErrorOutline,
  MdInfoOutline,
  MdRefresh,
  MdSearchOff,
} from "react-icons/md";

type PageStateVariant = "error" | "empty" | "unavailable" | "not-found";

export type PageStateProps = {
  variant: PageStateVariant;
  title: string;
  description?: ReactNode;
  illustration?: ReactNode;
  actions?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  compact?: boolean;
  focusOnMount?: boolean;
  headingLevel?: 1 | 2;
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
};

const icons = {
  error: MdErrorOutline,
  empty: MdSearchOff,
  unavailable: MdInfoOutline,
  "not-found": MdSearchOff,
};

export default function PageState({
  variant,
  title,
  description,
  illustration,
  actions,
  onRetry,
  retryLabel = "Tentar novamente",
  compact = false,
  focusOnMount = false,
  headingLevel = 1,
  className,
  titleClassName,
  children,
}: PageStateProps) {
  const titleId = useId();
  const stateRef = useRef<HTMLElement>(null);
  const Icon = icons[variant];
  const TitleTag = headingLevel === 2 ? "h2" : "h1";

  useEffect(() => {
    if (focusOnMount) {
      stateRef.current?.focus();
    }
  }, [focusOnMount]);

  return (
    <section
      ref={stateRef}
      role={variant === "error" ? "alert" : "status"}
      aria-labelledby={titleId}
      tabIndex={focusOnMount ? -1 : undefined}
      className={classNames(
        "grid w-full items-center gap-6 rounded-md bg-surface-card",
        compact
          ? "min-h-40 p-4"
          : "p-4 mobile:p-6 tablet:p-10 desktop:grid-cols-[minmax(0,1fr)_minmax(240px,420px)]",
        className,
      )}
    >
      <div className="min-w-0 space-y-5">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            {!illustration && (
              <Icon
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-content-link"
              />
            )}
            <TitleTag
              id={titleId}
              className={classNames(
                "font-extrabold text-content-primary",
                compact ? "text-lg" : "text-xl tablet:text-2xl",
                titleClassName,
              )}
            >
              {title}
            </TitleTag>
          </div>
          {description && (
            <div className="text-md text-content-primary">{description}</div>
          )}
        </div>

        {children}

        {(onRetry || actions) && (
          <div className="flex w-full flex-col gap-2 mobile:flex-row mobile:flex-wrap">
            {onRetry && (
              <Button
                type="button"
                variant="outline"
                leadIcon={MdRefresh}
                onClick={onRetry}
                className="w-full mobile:w-auto"
              >
                {retryLabel}
              </Button>
            )}
            {actions}
          </div>
        )}
      </div>

      {illustration && (
        <div
          aria-hidden="true"
          className="flex min-w-0 justify-center desktop:justify-end"
        >
          {illustration}
        </div>
      )}
    </section>
  );
}

