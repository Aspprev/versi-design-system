"use client";

import { useRef, type ComponentType, type ReactNode } from "react";
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
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const enabledTabs = tabs.filter((tab) => !tab.disabled);
  const entryTab = enabledTabs.find((tab) => tab.id === activeTab)?.id ?? enabledTabs[0]?.id;

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
          className="flex w-auto flex-row flex-nowrap items-end gap-3 overflow-x-auto p-1 tablet:w-fit tablet:shrink-0 tablet:justify-end tablet:overflow-visible"
        >
          <div role="tablist" aria-label={title} className="flex flex-nowrap items-end gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  type="button"
                  ref={(element) => {
                    if (element) tabRefs.current.set(tab.id, element);
                    else tabRefs.current.delete(tab.id);
                  }}
                  role="tab"
                  tabIndex={tab.id === entryTab ? 0 : -1}
                  aria-selected={isActive}
                  aria-current={isActive ? "page" : undefined}
                  disabled={tab.disabled}
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  onKeyDown={(event) => {
                    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                    event.preventDefault();
                    const index = enabledTabs.findIndex((item) => item.id === tab.id);
                    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
                    const forward = event.key === (rtl ? "ArrowLeft" : "ArrowRight");
                    const targetIndex = event.key === "Home" ? 0
                      : event.key === "End" ? enabledTabs.length - 1
                        : (index + (forward ? 1 : -1) + enabledTabs.length) % enabledTabs.length;
                    const target = enabledTabs[targetIndex];
                    if (!target) return;
                    tabRefs.current.get(target.id)?.focus();
                    onTabChange(target.id);
                  }}
                  className={`inline-flex items-center gap-1 whitespace-nowrap border-b-[3px] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 tablet:px-1 ${
                    size === "small" ? "px-0.5 py-0 text-sm" : "p-0.5 text-base"
                  } ${
                    isActive
                      ? "border-content-link font-semibold text-content-link"
                      : "border-transparent text-content-secondary hover:text-content-muted"
                  }`}
                >
                  {Icon && (
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  )}
                  <span>{tab.label}</span>
                  {tab.notification !== undefined &&
                    tab.notification !== null && (
                      <span className="inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-feedback-danger-strong px-1 text-2xs font-bold text-feedback-danger-on-strong">
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
