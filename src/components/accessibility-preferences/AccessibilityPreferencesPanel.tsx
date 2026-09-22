"use client";

import { useState } from "react";
import { MdAccessibilityNew, MdRestartAlt } from "react-icons/md";
import Modal from "../Modal/Modal";
import ContrastPreference from "./ContrastPreference";
import FontSizePreference from "./FontSizePreference";
import ReadingPreferences from "./ReadingPreferences";
import ThemePreference from "./ThemePreference";
import type { AccessibilityPreferences } from "./types";

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
  const isOpen = controlledOpen ?? internalOpen;

  const setOpen = (open: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(open);
    onOpenChange?.(open);
  };

  const update = (
    changes: Partial<AccessibilityPreferences>,
    message: string,
  ) => {
    onPreferencesChange(changes);
    setAnnouncement(message);
  };

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
          <ThemePreference
            value={preferences.colorScheme}
            onChange={(colorScheme) =>
              update(
                {
                  colorScheme,
                  ...(colorScheme === "system"
                    ? {}
                    : {
                        highContrastTheme:
                          colorScheme === "dark" ? "dark" : "light",
                      }),
                },
                `Tema ${colorScheme === "dark" ? "escuro" : colorScheme === "light" ? "claro" : "do dispositivo"} ativado.`,
              )
            }
          />
          <ContrastPreference
            checked={preferences.highContrast}
            onChange={(highContrast) =>
              update(
                { highContrast },
                `Alto contraste ${highContrast ? "ativado" : "desativado"}.`,
              )
            }
          />
          <FontSizePreference
            value={preferences.fontScale}
            onChange={(fontScale) =>
              update({ fontScale }, "Tamanho do texto alterado.")
            }
          />
          <ReadingPreferences
            reduceMotion={preferences.reduceMotion}
            emphasizeFocus={preferences.emphasizeFocus}
            underlineLinks={preferences.underlineLinks}
            onChange={(changes) => {
              const key = Object.keys(changes)[0] as
                | "reduceMotion"
                | "emphasizeFocus"
                | "underlineLinks";
              const label =
                key === "reduceMotion"
                  ? "Reduzir animações"
                  : key === "emphasizeFocus"
                    ? "Destacar foco"
                    : "Sublinhar links";
              update(
                changes,
                `${label} ${changes[key] ? "ativado" : "desativado"}.`,
              );
            }}
          />
        </div>
        <div className="mt-5 flex justify-center border-t border-border-subtle pt-4 tablet:justify-start">
          <button
            type="button"
            onClick={() => {
              onReset?.();
              setAnnouncement("Configurações padrão restauradas.");
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-action-primary px-4 font-bold text-content-link hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            <MdRestartAlt aria-hidden="true" className="h-5 w-5" />
            Restaurar configurações padrão
          </button>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>
      </Modal>
    </>
  );
}
