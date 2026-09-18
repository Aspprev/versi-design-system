"use client";

import { useId, useState } from "react";
import {
  MdAccessibilityNew,
  MdAnimation,
  MdCenterFocusStrong,
  MdContrast,
  MdLink,
  MdPalette,
  MdRestartAlt,
  MdTextFields,
} from "react-icons/md";
import InputSwitch from "../InputSwitch/InputSwitch";
import Modal from "../Modal/Modal";

export type AccessibilityColorScheme = "system" | "light" | "dark";
export type AccessibilityHighContrastTheme = "light" | "dark";
export type AccessibilityFontScale = "standard" | "large" | "extra-large";

export interface AccessibilityPreferences {
  colorScheme: AccessibilityColorScheme;
  highContrast: boolean;
  highContrastTheme: AccessibilityHighContrastTheme;
  fontScale: AccessibilityFontScale;
  reduceMotion: boolean;
  emphasizeFocus: boolean;
  underlineLinks: boolean;
}

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  colorScheme: "light",
  highContrast: false,
  highContrastTheme: "light",
  fontScale: "standard",
  reduceMotion: false,
  emphasizeFocus: false,
  underlineLinks: false,
};

export type AccessibilityPreferencesPanelProps = {
  preferences: AccessibilityPreferences;
  onPreferencesChange: (
    changes: Partial<AccessibilityPreferences>,
  ) => void;
  onReset?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  triggerLabel?: string;
  className?: string;
};

const readingOptions = [
  {
    key: "reduceMotion" as const,
    label: "Reduzir animações",
    description: "Minimiza animações, transições e rolagens suaves.",
    Icon: MdAnimation,
  },
  {
    key: "emphasizeFocus" as const,
    label: "Destacar foco",
    description: "Evidencia o elemento selecionado durante o uso do teclado.",
    Icon: MdCenterFocusStrong,
  },
  {
    key: "underlineLinks" as const,
    label: "Sublinhar links",
    description: "Mantém links de texto sublinhados fora do foco.",
    Icon: MdLink,
  },
];

const sectionClass =
  "rounded-md border border-border-default bg-surface-subtle p-4 tablet:p-5";
const choiceClass =
  "flex min-h-11 cursor-pointer gap-3 rounded-sm border border-border-default bg-surface-card p-3 text-content-primary transition-colors hover:border-border-strong hover:bg-surface-muted";

export default function AccessibilityPreferencesPanel({
  preferences,
  onPreferencesChange,
  onReset,
  isOpen: controlledOpen,
  onOpenChange,
  showTrigger = true,
  triggerLabel = "Preferências de acessibilidade",
  className,
}: AccessibilityPreferencesPanelProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const titleId = useId();
  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = (open: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(open);
    onOpenChange?.(open);
  };
  const update = (changes: Partial<AccessibilityPreferences>, message: string) => {
    onPreferencesChange(changes);
    setAnnouncement(message);
  };
  const isDark = preferences.colorScheme === "dark";

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => setOpen(true)}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border-2 border-action-primary-content bg-action-primary px-3 text-sm font-bold text-action-primary-content shadow-sm hover:bg-action-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${className ?? ""}`.trim()}
        >
          <MdAccessibilityNew aria-hidden="true" className="h-5 w-5" />
          <span>{triggerLabel}</span>
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        title={triggerLabel}
        showIcon={false}
        size="large"
      >
        <p className="mt-2 text-center text-sm text-content-secondary">
          As alterações são aplicadas pelo consumidor do componente.
        </p>

        <div className="mt-5 grid gap-4 desktop:grid-cols-2">
          <fieldset className={sectionClass}>
            <legend className="sr-only">Aparência</legend>
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-5 text-primary-1">
                <MdPalette aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold">Aparência</h3>
                <p className="text-sm text-content-secondary">Tema e contraste visual.</p>
              </div>
            </div>
            <div className="divide-y divide-border-subtle rounded-sm border border-border-default bg-surface-card px-3">
              <div className="flex min-h-16 items-center justify-between gap-4 py-3">
                <span className="font-semibold">Tema {isDark ? "escuro" : "claro"}</span>
                <InputSwitch
                  aria-label="Alternar tema claro ou escuro"
                  variant="theme"
                  size="lg"
                  checked={isDark}
                  disabled={preferences.colorScheme === "system"}
                  onChange={(enabled) =>
                    update(
                      { colorScheme: enabled ? "dark" : "light", highContrastTheme: enabled ? "dark" : "light" },
                      `Tema ${enabled ? "escuro" : "claro"} ativado.`,
                    )
                  }
                />
              </div>
              <label className="flex min-h-14 cursor-pointer items-start gap-3 py-3">
                <input
                  type="checkbox"
                  className="checkbox-control mt-0.5"
                  checked={preferences.colorScheme === "system"}
                  onChange={(event) =>
                    update(
                      { colorScheme: event.target.checked ? "system" : isDark ? "dark" : "light" },
                      event.target.checked ? "Tema definido pelo dispositivo." : "Tema do dispositivo desativado.",
                    )
                  }
                />
                <span className="font-semibold">Usar configuração do dispositivo</span>
              </label>
              <div className="flex min-h-16 items-center justify-between gap-4 py-3">
                <span className="flex items-center gap-1.5 font-semibold"><MdContrast aria-hidden="true" className="h-4 w-4" />Alto contraste</span>
                <InputSwitch
                  aria-label="Alternar alto contraste"
                  checked={preferences.highContrast}
                  size="lg"
                  onChange={(enabled) => update({ highContrast: enabled }, `Alto contraste ${enabled ? "ativado" : "desativado"}.`)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={sectionClass}>
            <legend className="sr-only">Tamanho do texto</legend>
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-5 text-primary-1"><MdTextFields aria-hidden="true" className="h-5 w-5" /></span>
              <div><h3 className="font-bold">Tamanho do texto</h3><p className="text-sm text-content-secondary">Amplie os textos para facilitar a leitura.</p></div>
            </div>
            <div className="grid gap-2">
              {(["standard", "large", "extra-large"] as const).map((scale) => (
                <label key={scale} className={`${choiceClass} items-center`}>
                  <input type="radio" name={`${titleId}-font-scale`} value={scale} checked={preferences.fontScale === scale} onChange={() => update({ fontScale: scale }, `Tamanho do texto alterado.`)} className="radio-control shrink-0" />
                  <span className="flex w-9 shrink-0 justify-center font-extrabold text-primary-1">Aa</span>
                  <span className="font-semibold">{scale === "standard" ? "Padrão" : scale === "large" ? "Grande" : "Muito grande"}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={`${sectionClass} desktop:col-span-2`}>
            <legend className="sr-only">Leitura e navegação</legend>
            <div className="mb-4 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-5 text-primary-1"><MdAccessibilityNew aria-hidden="true" className="h-5 w-5" /></span><div><h3 className="font-bold">Leitura e navegação</h3><p className="text-sm text-content-secondary">Ajustes para reduzir distrações e facilitar a orientação.</p></div></div>
            <div className="grid gap-3 tablet:grid-cols-3">
              {readingOptions.map(({ key, label, description, Icon }) => (
                <label key={key} className={`${choiceClass} items-start`}>
                  <input type="checkbox" checked={preferences[key]} onChange={(event) => update({ [key]: event.target.checked }, `${label} ${event.target.checked ? "ativado" : "desativado"}.`)} className="checkbox-control mt-1" />
                  <span><span className="flex items-center gap-2 font-semibold"><Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-primary-1" />{label}</span><span className="mt-1 block text-sm text-content-secondary">{description}</span></span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="mt-5 flex justify-center border-t border-border-subtle pt-4 tablet:justify-start">
          <button type="button" onClick={() => { onReset?.(); setAnnouncement("Configurações padrão restauradas."); }} className="inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-action-primary px-4 font-bold text-content-link hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"><MdRestartAlt aria-hidden="true" className="h-5 w-5" />Restaurar configurações padrão</button>
        </div>
        <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      </Modal>
    </>
  );
}
