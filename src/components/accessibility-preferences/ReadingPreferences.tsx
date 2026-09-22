import {
  MdAccessibilityNew,
  MdAnimation,
  MdCenterFocusStrong,
  MdLink,
} from "react-icons/md";
import PreferenceSection from "./PreferenceSection";
import type { AccessibilityPreferences } from "./types";

type ReadingPreferenceKey =
  | "reduceMotion"
  | "emphasizeFocus"
  | "underlineLinks";

const READING_OPTIONS: Array<{
  key: ReadingPreferenceKey;
  label: string;
  description: string;
  Icon: typeof MdAnimation;
}> = [
  {
    key: "reduceMotion",
    label: "Reduzir animações",
    description: "Minimiza animações, transições e rolagens suaves.",
    Icon: MdAnimation,
  },
  {
    key: "emphasizeFocus",
    label: "Destacar foco",
    description: "Evidencia o elemento selecionado durante o uso do teclado.",
    Icon: MdCenterFocusStrong,
  },
  {
    key: "underlineLinks",
    label: "Sublinhar links",
    description: "Mantém links de texto sublinhados fora do foco.",
    Icon: MdLink,
  },
];

export type ReadingPreferencesProps = Pick<
  AccessibilityPreferences,
  ReadingPreferenceKey
> & {
  onChange: (
    changes: Partial<Pick<AccessibilityPreferences, ReadingPreferenceKey>>,
  ) => void;
  className?: string;
};

export default function ReadingPreferences({
  reduceMotion,
  emphasizeFocus,
  underlineLinks,
  onChange,
  className,
}: ReadingPreferencesProps) {
  const values = { reduceMotion, emphasizeFocus, underlineLinks };

  return (
    <PreferenceSection
      title="Leitura e navegação"
      description="Ajustes para reduzir distrações e facilitar a orientação."
      icon={MdAccessibilityNew}
      className={`desktop:col-span-2 ${className ?? ""}`.trim()}
    >
      <div className="grid gap-3 tablet:grid-cols-3">
        {READING_OPTIONS.map(({ key, label, description, Icon }) => (
          <label
            key={key}
            className="flex min-h-11 cursor-pointer items-start gap-3 rounded-sm border border-border-default bg-surface-card p-3 text-content-primary transition-colors hover:border-border-strong hover:bg-surface-muted"
          >
            <input
              type="checkbox"
              aria-label={label}
              checked={values[key]}
              onChange={(event) => onChange({ [key]: event.target.checked })}
              className="checkbox-control mt-1"
            />
            <span>
              <span className="flex items-center gap-2 font-semibold">
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-primary-1" />
                {label}
              </span>
              <span className="mt-1 block text-sm text-content-secondary">
                {description}
              </span>
            </span>
          </label>
        ))}
      </div>
    </PreferenceSection>
  );
}
