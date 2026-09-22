"use client";

import type { ComponentProps } from "react";
import {
  resolveStatusAppearance,
  type StatusAppearanceMap,
  type StatusDomain,
} from "../../utils/resolve-status-appearance";
import { StatusBadge } from "./StatusBadge";

export interface DomainStatusBadgeProps
  extends Omit<
    ComponentProps<typeof StatusBadge>,
    "children" | "tone" | "appearance"
  > {
  status?: string | null;
  domain?: StatusDomain;
  empty?: "hide" | "placeholder";
  placeholder?: string;
  /** Optional consumer-owned map for statuses specific to a product domain. */
  statusMap?: StatusAppearanceMap;
}

export function DomainStatusBadge({
  status,
  domain = "generic",
  empty = "hide",
  placeholder = "-",
  statusMap,
  ...rest
}: DomainStatusBadgeProps) {
  const label = status?.trim();
  if (!label && empty === "hide") return null;

  const resolved = resolveStatusAppearance(label, domain, { map: statusMap });
  return (
    <StatusBadge
      tone={resolved.tone}
      appearance={resolved.appearance}
      {...rest}
    >
      {label || placeholder}
    </StatusBadge>
  );
}
