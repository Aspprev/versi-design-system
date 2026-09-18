"use client";

import type { ComponentProps } from "react";
import {
  resolveStatusAppearance,
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
}

export function DomainStatusBadge({
  status,
  domain = "generic",
  empty = "hide",
  placeholder = "-",
  ...rest
}: DomainStatusBadgeProps) {
  const label = status?.trim();
  if (!label && empty === "hide") return null;

  const resolved = resolveStatusAppearance(label, domain);
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
