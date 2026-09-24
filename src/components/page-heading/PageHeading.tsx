"use client";

import classNames from "classnames";
import type { ReactNode } from "react";
import { MdArrowBack } from "react-icons/md";
import Typography from "../typography/typography";

export type PageHeadingBackAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type PageHeadingProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: PageHeadingBackAction;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  spacing?: "default" | "none";
};

function getTitleAttribute(title: ReactNode) {
  return typeof title === "string" || typeof title === "number"
    ? String(title)
    : undefined;
}

function BackContent({ label }: Pick<PageHeadingBackAction, "label">) {
  return (
    <>
      <MdArrowBack aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </>
  );
}

function getBackHref(href?: string) {
  if (!href) return undefined;
  // React 18 only warns about javascript: links. Match browser URL parsing
  // without requiring window/document, including ignored tabs and newlines.
  const protocol = href
    // eslint-disable-next-line no-control-regex
    .replace(/^[\u0000-\u0020]+/, "")
    .replace(/[\t\r\n]/g, "");
  return /^javascript:/i.test(protocol) ? undefined : href;
}

export default function PageHeading({
  title,
  subtitle,
  back,
  actions,
  className,
  contentClassName,
  spacing = "default",
}: PageHeadingProps) {
  const backHref = getBackHref(back?.href);
  const titleAttribute = getTitleAttribute(title);
  const backClassName =
    "inline-flex w-fit items-center gap-1 text-sm font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

  return (
    <header
      className={classNames(
        "flex w-full min-w-0 flex-col gap-3 tablet:flex-row tablet:items-start tablet:justify-between",
        { "mb-sm": spacing === "default" },
        className,
      )}
    >
      <div
        className={classNames("w-full min-w-0 tablet:flex-1", contentClassName)}
      >
        <div className="flex w-full min-w-0 items-center gap-4">
          {back && backHref ? (
            <a className={backClassName} href={backHref}>
              <BackContent label={back.label} />
            </a>
          ) : back ? (
            <button
              type="button"
              className={backClassName}
              onClick={back.onClick}
            >
              <BackContent label={back.label} />
            </button>
          ) : null}

          <Typography
            element="h1"
            semanticRole="page-title"
            title={titleAttribute}
            className="block w-full min-w-0 overflow-hidden text-ellipsis tablet:truncate tablet:whitespace-nowrap"
          >
            {title}
          </Typography>
        </div>
        {subtitle !== undefined && subtitle !== null && (
          <Typography
            element="p"
            semanticRole="section-title"
            className="mt-2 font-normal"
          >
            {subtitle}
          </Typography>
        )}
      </div>

      {actions && (
        <div className="flex w-full flex-wrap items-center gap-2 tablet:w-auto tablet:shrink-0 tablet:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}
