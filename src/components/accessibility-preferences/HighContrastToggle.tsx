"use client";

import { MdContrast } from "react-icons/md";

export interface HighContrastToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export default function HighContrastToggle({
  checked,
  onChange,
  label = "Alto contraste",
  className,
}: HighContrastToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border-2 border-action-primary-content bg-action-primary px-3 text-sm font-bold text-action-primary-content shadow-sm hover:bg-action-primary-hover active:bg-action-primary-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${className ?? ""}`.trim()}
    >
      <MdContrast aria-hidden="true" className="h-5 w-5" />
      <span>{label}</span>
      <span aria-hidden="true" className="rounded-sm bg-surface-card px-1.5 py-0.5 text-xs text-content-primary">
        {checked ? "Ativado" : "Desativado"}
      </span>
    </button>
  );
}
