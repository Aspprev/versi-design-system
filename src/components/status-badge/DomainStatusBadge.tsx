"use client";

import type { ComponentProps } from "react";
import {
  resolveStatusAppearance,
  type StatusAppearanceMap,
  type StatusAppearanceConfig,
  type StatusBadgeColor,
  type StatusAppearance,
  type StatusTone,
  type StatusDomain,
} from "../../utils/resolve-status-appearance";
import { StatusBadge } from "./StatusBadge";

export interface DomainStatusBadgeProps
  extends Omit<
    ComponentProps<typeof StatusBadge>,
    "children"
  > {
  status?: string | null;
  domain?: StatusDomain;
  empty?: "hide" | "placeholder";
  placeholder?: string;
  /** Optional consumer-owned map for statuses specific to a product domain. */
  statusMap?: StatusAppearanceMap;
  fallback?: StatusAppearanceConfig;
}

export function DomainStatusBadge({
  status,
  domain = "generic",
  empty = "hide",
  placeholder = "-",
  statusMap,
  fallback,
  color,
  tone,
  appearance,
  ...rest
}: DomainStatusBadgeProps) {
  const label = status?.trim();
  if (!label && empty === "hide") return null;

  const resolved = resolveStatusAppearance(label, domain, {
    map: statusMap,
    color: color as StatusBadgeColor | undefined,
    tone: tone as StatusTone | undefined,
    appearance: appearance as StatusAppearance | undefined,
    fallback,
  });
  return (
    <StatusBadge
      color={resolved.color}
      appearance={resolved.appearance}
      {...rest}
    >
      {label || placeholder}
    </StatusBadge>
  );
}
