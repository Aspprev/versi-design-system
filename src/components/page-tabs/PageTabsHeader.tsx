"use client";

import type { ComponentType, ReactNode } from "react";
import type { IconBaseProps } from "react-icons";
import PageHeading from "../page-heading";

export type PageTabItem = {
  id: string;
  label: string;
  icon?: ComponentType<IconBaseProps>;
  notification?: ReactNode;
  disabled?: boolean;
};

export interface PageTabsHeaderProps {
  title: string;
  tabs: PageTabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  size?: "small" | "default";
}

export default function PageTabsHeader({
  title,
  tabs,
  activeTab,
  onTabChange,
  className = "",
  size = "default",
}: PageTabsHeaderProps) {
  return (
    <div
      className={`flex w-full min-w-0 flex-col gap-4 tablet:flex-row tablet:items-end tablet:justify-between ${className}`}
    >
      <div className="w-full min-w-0 tablet:flex-1">
        <PageHeading title={title} spacing="none" />
      </div>

      {tabs.length > 1 && (
        <nav
          aria-label={title}
          className="flex w-auto flex-row flex-nowrap items-end gap-3 overflow-x-auto tablet:w-fit tablet:shrink-0 tablet:justify-end tablet:overflow-visible"
        >
          <div role="tablist" className="flex flex-nowrap items-end gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-current={isActive ? "page" : undefined}
                  disabled={tab.disabled}
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`inline-flex items-center gap-1 whitespace-nowrap border-b-[3px] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 disabled:cursor-not-allowed disabled:opacity-50 tablet:px-1 ${
                    size === "small" ? "px-0.5 py-0 text-sm" : "p-0.5 text-base"
                  } ${
                    isActive
                      ? "border-primary-1 font-semibold text-primary-1"
                      : "border-transparent text-content-secondary hover:text-content-muted"
                  }`}
                >
                  {Icon && (
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  )}
                  <span>{tab.label}</span>
                  {tab.notification !== undefined &&
                    tab.notification !== null && (
                      <span className="inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-feedback-danger-strong px-1 text-2xs font-bold text-action-tertiary-content">
                        {tab.notification}
                      </span>
                    )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
