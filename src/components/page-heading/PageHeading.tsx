"use client";

import Typography from "../typography/typography";
import classNames from "classnames";
import type { ReactNode } from "react";
import { MdArrowBack } from "react-icons/md";

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

function BackContent({ label }: Pick<PageHeadingBackAction, "label">) {
  return (
    <>
      <MdArrowBack aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </>
  );
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
  const backClassName =
    "mb-2 inline-flex w-fit items-center gap-1 text-sm font-semibold text-content-link hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

  return (
    <header
      className={classNames(
        "flex flex-col gap-3 tablet:flex-row tablet:items-start tablet:justify-between",
        { "mb-sm": spacing === "default" },
        className,
      )}
    >
      <div className={classNames("min-w-0", contentClassName)}>
        {back?.href ? (
          <a className={backClassName} href={back.href}>
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

        <Typography element="h1" semanticRole="page-title">
          {title}
        </Typography>
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
        <div className="flex w-full flex-wrap items-center gap-2 tablet:w-auto tablet:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}
