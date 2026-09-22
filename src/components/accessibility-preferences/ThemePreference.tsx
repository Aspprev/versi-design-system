import { MdPalette } from "react-icons/md";
import InputSwitch from "../InputSwitch/InputSwitch";
import PreferenceSection from "./PreferenceSection";
import type { AccessibilityColorScheme } from "./types";

export type ThemePreferenceProps = {
  value: AccessibilityColorScheme;
  onChange: (value: AccessibilityColorScheme) => void;
  className?: string;
};

export default function ThemePreference({
  value,
  onChange,
  className,
}: ThemePreferenceProps) {
  const isDark = value === "dark";
  const isSystem = value === "system";

  return (
    <PreferenceSection
      title="Aparência"
      description="Tema e esquema de cores da interface."
      icon={MdPalette}
      className={className}
    >
      <div className="divide-y divide-border-subtle rounded-sm border border-border-default bg-surface-card px-3">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <span className="font-semibold">Tema {isDark ? "escuro" : "claro"}</span>
          <InputSwitch
            aria-label="Alternar tema claro ou escuro"
            variant="theme"
            size="lg"
            checked={isDark}
            disabled={isSystem}
            onChange={(enabled) => onChange(enabled ? "dark" : "light")}
          />
        </div>
        <label className="flex min-h-14 cursor-pointer items-start gap-3 py-3">
          <input
            type="checkbox"
            className="checkbox-control mt-0.5"
            checked={isSystem}
            onChange={(event) =>
              onChange(event.target.checked ? "system" : isDark ? "dark" : "light")
            }
          />
          <span className="font-semibold">Usar configuração do dispositivo</span>
        </label>
      </div>
    </PreferenceSection>
  );
}
