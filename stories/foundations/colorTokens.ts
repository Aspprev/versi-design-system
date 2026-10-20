export const GROUPS = [
  {
    "title": "Principais · Primary, Secondary e Tertiary",
    "tokens": [
      "--primary-1",
      "--primary-2",
      "--primary-3",
      "--primary-4",
      "--primary-5",
      "--secondary-1",
      "--secondary-2",
      "--secondary-3",
      "--secondary-4",
      "--secondary-5",
      "--tertiary-1",
      "--tertiary-2",
      "--tertiary-3",
      "--tertiary-4",
      "--tertiary-5"
    ]
  },
  {
    "title": "Semânticos",
    "tokens": [
      "--surface-page",
      "--surface-card-semantic",
      "--content-primary",
      "--content-secondary",
      "--content-link",
      "--border-default",
      "--focus-ring",
      "--action-primary-background"
    ]
  },
  {
    "title": "Campos",
    "tokens": [
      "--field-surface",
      "--field-content",
      "--field-placeholder",
      "--field-border-default",
      "--field-border-active",
      "--field-border-error",
      "--field-surface-disabled",
      "--field-content-disabled",
      "--field-placeholder-disabled"
    ]
  },
  {
    "title": "Feedback",
    "tokens": [
      "--feedback-info-strong",
      "--feedback-info-soft",
      "--feedback-warning-strong",
      "--feedback-warning-soft",
      "--feedback-success-strong",
      "--feedback-success-soft",
      "--feedback-danger-strong",
      "--feedback-danger-soft"
    ]
  },
  {
    "title": "Neutros",
    "tokens": [
      "--grayscale-1",
      "--grayscale-2",
      "--grayscale-3",
      "--grayscale-4",
      "--grayscale-5",
      "--surface-muted",
      "--bg-disabled"
    ]
  }
];
export const TOKENS = [...new Set(GROUPS.flatMap(group => group.tokens))];
export const THEMES = ['default', 'azul1', 'azul2', 'azul3', 'laranja1', 'laranja2', 'verde1', 'verde2', 'verde3', 'verde4', 'rosa1'];
export const MODES = [
 { label: 'Claro', scheme: 'light', contrast: 'normal' },
 { label: 'Escuro', scheme: 'dark', contrast: 'normal' },
 { label: 'Claro · alto contraste', scheme: 'light', contrast: 'high' },
 { label: 'Escuro · alto contraste', scheme: 'dark', contrast: 'high' },
];
export function hex(value: string) {
 const channels = value.split(/[,\s]+/).filter(Boolean).map(Number);
 return channels.length === 3 && channels.every(n => Number.isFinite(n) && n >= 0 && n <= 255)
 ? '#' + channels.map(n => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase() : value || 'Indisponível';
}
