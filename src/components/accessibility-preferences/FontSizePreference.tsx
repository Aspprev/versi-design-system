import { useId } from "react";
import { MdTextFields } from "react-icons/md";
import PreferenceSection from "./PreferenceSection";
import type { AccessibilityFontScale } from "./types";

const FONT_SCALE_OPTIONS: Array<{
  value: AccessibilityFontScale;
  label: string;
}> = [
  { value: "standard", label: "Padrão" },
  { value: "large", label: "Grande" },
  { value: "extra-large", label: "Muito grande" },
];

export type FontSizePreferenceProps = {
  value: AccessibilityFontScale;
  onChange: (value: AccessibilityFontScale) => void;
  className?: string;
};

export default function FontSizePreference({
  value,
  onChange,
  className,
}: FontSizePreferenceProps) {
  const groupId = useId();

  return (
    <PreferenceSection
      title="Tamanho do texto"
      description="Amplie os textos para facilitar a leitura."
      icon={MdTextFields}
      className={className}
    >
      <div className="grid gap-2">
        {FONT_SCALE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm border border-border-default bg-surface-card p-3 text-content-primary transition-colors hover:border-border-strong hover:bg-surface-muted"
          >
            <input
              type="radio"
              name={`${groupId}-font-scale`}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="radio-control shrink-0"
            />
            <span className="flex w-9 shrink-0 justify-center font-extrabold text-primary-1">
              Aa
            </span>
            <span className="font-semibold">{option.label}</span>
          </label>
        ))}
      </div>
    </PreferenceSection>
  );
}
