function toRgba(cssVariable) {
  const color = `var(${cssVariable})`;
  return ({ opacityValue }) => `rgba(${color}, ${opacityValue})`;
}

const generatedTokenColors = require("./tokens/tailwind-colors.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      mobile: "640px",
      tablet: "1024px",
      desktop: "1440px",
      tv: "1920px",
    },
    fontSize: {
      "2xs": [
        "var(--text-2xs)",
        {
          lineHeight: "var(--leading-2xs)",
          letterSpacing: "calc(var(--text-2xs)*0.02)",
        },
      ] /* 10px */,
      xs: [
        "var(--text-xs)",
        {
          lineHeight: "var(--leading-xs)",
          letterSpacing: "calc(var(--text-xs)*0.02)",
        },
      ] /* 12px */,
      sm: [
        "var(--text-sm)",
        {
          lineHeight: "var(--leading-sm)",
          letterSpacing: "calc(var(--text-sm)*0.02)",
        },
      ] /* 14px */,
      md: [
        "var(--text-md)",
        {
          lineHeight: "var(--leading-md)",
          letterSpacing: "calc(var(--text-md)*0.02)",
        },
      ] /* 16px */,
      base: [
        "var(--text-md)",
        {
          lineHeight: "var(--leading-md)",
          letterSpacing: "calc(var(--text-md)*0.02)",
        },
      ] /* 16px — alias semântico para consumidores legados */,
      lg: [
        "var(--text-lg)",
        {
          lineHeight: "var(--leading-lg)",
          letterSpacing: "calc(var(--text-lg)*0.02)",
        },
      ] /* 18px */,
      xl: [
        "var(--text-xl)",
        {
          lineHeight: "var(--leading-xl)",
          letterSpacing: "calc(var(--text-xl)*0.02)",
        },
      ] /* 20px */,
      "2xl": [
        "var(--text-2xl)",
        {
          lineHeight: "var(--leading-2xl)",
          letterSpacing: "calc(var(--text-2xl)*0.02)",
        },
      ] /* 24px */,
      titlesm: [
        "var(--title-sm)",
        {
          lineHeight: "var(--title-leading-sm)",
          letterSpacing: "calc(var(--title-sm)*0.02)",
        },
      ] /* 32px */,
      titlemd: [
        "var(--title-md)",
        {
          lineHeight: "var(--title-leading-md)",
          letterSpacing: "calc(var(--title-md)*0.02)",
        },
      ] /* 40px */,
      titlelg: [
        "var(--title-lg)",
        {
          lineHeight: "var(--title-leading-lg)",
          letterSpacing: "calc(var(--title-lg)*0.02)",
        },
      ] /* 48px */,
      titlexl: [
        "var(--title-xl)",
        {
          lineHeight: "var(--title-leading-xl)",
          letterSpacing: "calc(var(--title-xl)*0.02)",
        },
      ] /* 56px */,
    },
    fontFamily: {
      nunito: ["var(--font-nunito-sans, 'Nunito Sans')", "sans-serif"],
    },
    extend: {
      colors: {
        ...generatedTokenColors,
        "primary-1": "rgba(var(--primary-1), <alpha-value>)",
        "primary-2": "rgba(var(--primary-2), <alpha-value>)",
        "primary-3": "rgba(var(--primary-3), <alpha-value>)",
        "primary-4": "rgba(var(--primary-4), <alpha-value>)",
        "primary-5": "rgba(var(--primary-5), <alpha-value>)",

        "secondary-1": "rgba(var(--secondary-1), <alpha-value>)",
        "secondary-2": "rgba(var(--secondary-2), <alpha-value>)",
        "secondary-3": "rgba(var(--secondary-3), <alpha-value>)",
        "secondary-4": "rgba(var(--secondary-4), <alpha-value>)",
        "secondary-5": "rgba(var(--secondary-5), <alpha-value>)",

        "tertiary-1": "rgba(var(--tertiary-1), <alpha-value>)",
        "tertiary-2": "rgba(var(--tertiary-2), <alpha-value>)",
        "tertiary-3": "rgba(var(--tertiary-3), <alpha-value>)",
        "tertiary-4": "rgba(var(--tertiary-4), <alpha-value>)",
        "tertiary-5": "rgba(var(--tertiary-5), <alpha-value>)",

        "danger-1": "rgba(var(--danger-1), <alpha-value>)",
        "danger-2": "rgba(var(--danger-2), <alpha-value>)",
        "danger-3": "rgba(var(--danger-3), <alpha-value>)",
        "danger-4": "rgba(var(--danger-4), <alpha-value>)",
        "danger-5": "rgba(var(--danger-5), <alpha-value>)",
        "danger-6": "rgba(var(--danger-6), <alpha-value>)",

        "warning-1": "rgba(var(--warning-1), <alpha-value>)",
        "warning-2": "rgba(var(--warning-2), <alpha-value>)",
        "warning-3": "rgba(var(--warning-3), <alpha-value>)",
        "warning-4": "rgba(var(--warning-4), <alpha-value>)",
        "warning-5": "rgba(var(--warning-5), <alpha-value>)",

        "success-1": "rgba(var(--success-1), <alpha-value>)",
        "success-2": "rgba(var(--success-2), <alpha-value>)",
        "success-3": "rgba(var(--success-3), <alpha-value>)",
        // "success-4": "rgba(var(--success-4), <alpha-value>)",
        // "success-5": "rgba(var(--success-5), <alpha-value>)",

        "grayscale-1": "rgba(var(--grayscale-1), <alpha-value>)",
        "grayscale-2": "rgba(var(--grayscale-2), <alpha-value>)",
        "grayscale-3": "rgba(var(--grayscale-3), <alpha-value>)",
        "grayscale-4": "rgba(var(--grayscale-4), <alpha-value>)",
        "grayscale-5": "rgba(var(--grayscale-5), <alpha-value>)",


        overlay: "rgba(var(--overlay), <alpha-value>)",

        "bg-lighter": "rgba(var(--bg-lighter), <alpha-value>)",
        "bg-light": "rgba(var(--bg-light), <alpha-value>)",
        "bg-dark": "rgba(var(--bg-dark), <alpha-value>)",
        "bg-disabled": "rgba(var(--bg-disabled), <alpha-value>)",

        background: "rgba(var(--bg-lighter), <alpha-value>)",
        "content-primary": "rgba(var(--content-primary), <alpha-value>)",
        "content-secondary": "rgba(var(--content-secondary), <alpha-value>)",
        "content-muted": "rgba(var(--content-muted), <alpha-value>)",
        "content-disabled": "rgba(var(--content-disabled), <alpha-value>)",
        "content-link": "rgba(var(--content-link), <alpha-value>)",
        "content-inverse": "rgba(var(--content-inverse), <alpha-value>)",
        "content-on-brand": "rgba(var(--content-on-brand), <alpha-value>)",
        "action-primary":
          "rgba(var(--action-primary-background), <alpha-value>)",
        "action-primary-hover":
          "rgba(var(--action-primary-background-hover), <alpha-value>)",
        "action-primary-active":
          "rgba(var(--action-primary-background-active), <alpha-value>)",
        "action-primary-content":
          "rgba(var(--action-primary-content), <alpha-value>)",
        "action-primary-ghost":
          "rgba(var(--action-primary-ghost-background), <alpha-value>)",
        "action-secondary":
          "rgba(var(--action-secondary-background), <alpha-value>)",
        "action-secondary-hover":
          "rgba(var(--action-secondary-background-hover), <alpha-value>)",
        "action-secondary-active":
          "rgba(var(--action-secondary-background-active), <alpha-value>)",
        "action-secondary-content":
          "rgba(var(--action-secondary-content), <alpha-value>)",
        "action-secondary-ghost":
          "rgba(var(--action-secondary-ghost-background), <alpha-value>)",
        "action-tertiary":
          "rgba(var(--action-tertiary-background), <alpha-value>)",
        "action-tertiary-hover":
          "rgba(var(--action-tertiary-background-hover), <alpha-value>)",
        "action-tertiary-active":
          "rgba(var(--action-tertiary-background-active), <alpha-value>)",
        "action-tertiary-content":
          "rgba(var(--action-tertiary-content), <alpha-value>)",
        "action-danger":
          "rgba(var(--action-danger-background), <alpha-value>)",
        "action-danger-hover":
          "rgba(var(--action-danger-background-hover), <alpha-value>)",
        "action-danger-active":
          "rgba(var(--action-danger-background-active), <alpha-value>)",
        "action-danger-content":
          "rgba(var(--action-danger-content), <alpha-value>)",
        "content-brand-secondary":
          "rgba(var(--content-brand-secondary), <alpha-value>)",
        "selection-background":
          "rgba(var(--selection-background), <alpha-value>)",
        "selection-background-hover":
          "rgba(var(--selection-background-hover), <alpha-value>)",
        "selection-border": "rgba(var(--selection-border), <alpha-value>)",
        "selection-content": "rgba(var(--selection-content), <alpha-value>)",
        "notice-secondary-content":
          "rgba(var(--notice-secondary-content), <alpha-value>)",
        "action-warning":
          "rgba(var(--action-warning-background), <alpha-value>)",
        "action-warning-hover":
          "rgba(var(--action-warning-background-hover), <alpha-value>)",
        "action-warning-active":
          "rgba(var(--action-warning-background-active), <alpha-value>)",
        "action-warning-content":
          "rgba(var(--action-warning-content), <alpha-value>)",
        "text-primary": "rgba(var(--text-primary), <alpha-value>)",
        "text-secondary": "rgba(var(--text-secondary), <alpha-value>)",
        "text-tertiary": "rgba(var(--text-tertiary), <alpha-value>)",
        "text-light": "rgba(var(--text-tertiary), <alpha-value>)",
        disabled: "rgba(var(--text-disabled), <alpha-value>)",
        "border-light": "rgba(var(--border-default), <alpha-value>)",
        "border-dark": "rgba(var(--border-strong), <alpha-value>)",
        "border-subtle": "rgba(var(--border-subtle), <alpha-value>)",
        "border-default": "rgba(var(--border-default), <alpha-value>)",
        "border-strong": "rgba(var(--border-strong), <alpha-value>)",
        "focus-ring": "rgba(var(--focus-ring), <alpha-value>)",
        error: "rgba(var(--feedback-danger-content), <alpha-value>)",
        "surface-page": "rgba(var(--surface-page), <alpha-value>)",
        "surface-card": "rgba(var(--surface-card-semantic), <alpha-value>)",
        "surface-subtle": "rgba(var(--surface-subtle), <alpha-value>)",
        "surface-muted": "rgba(var(--surface-muted), <alpha-value>)",
        "surface-disabled": "rgba(var(--surface-disabled), <alpha-value>)",
        "surface-action-neutral": "rgba(var(--surface-action-neutral), <alpha-value>)",
        "surface-tooltip": "rgba(var(--surface-tooltip), <alpha-value>)",
        "footer-background": "rgba(var(--footer-background), <alpha-value>)",
        "feedback-danger-strong": "rgba(var(--feedback-danger-strong), <alpha-value>)",
        "feedback-danger-soft": "rgba(var(--feedback-danger-soft), <alpha-value>)",
        "feedback-danger-border": "rgba(var(--feedback-danger-border), <alpha-value>)",
        "feedback-danger-content": "rgba(var(--feedback-danger-content), <alpha-value>)",
        "feedback-warning-strong": "rgba(var(--feedback-warning-strong), <alpha-value>)",
        "feedback-warning-soft": "rgba(var(--feedback-warning-soft), <alpha-value>)",
        "feedback-warning-border": "rgba(var(--feedback-warning-border), <alpha-value>)",
        "feedback-warning-content": "rgba(var(--feedback-warning-content), <alpha-value>)",
        "feedback-success-strong": "rgba(var(--feedback-success-strong), <alpha-value>)",
        "feedback-success-soft": "rgba(var(--feedback-success-soft), <alpha-value>)",
        "feedback-success-border": "rgba(var(--feedback-success-border), <alpha-value>)",
        "feedback-success-content": "rgba(var(--feedback-success-content), <alpha-value>)",
        "feedback-info-strong": "rgba(var(--feedback-info-strong), <alpha-value>)",
        "feedback-info-soft": "rgba(var(--feedback-info-soft), <alpha-value>)",
        "feedback-info-border": "rgba(var(--feedback-info-border), <alpha-value>)",
        "feedback-info-content": "rgba(var(--feedback-info-content), <alpha-value>)",
        "icon-default": "rgba(var(--icon-default), <alpha-value>)",
        "field-surface": "rgba(var(--field-surface), <alpha-value>)",
        "field-surface-disabled":
          "rgba(var(--field-surface-disabled), <alpha-value>)",
        "field-border-default":
          "rgba(var(--field-border-default), <alpha-value>)",
        "field-border-active":
          "rgba(var(--field-border-active), <alpha-value>)",
        "field-border-error":
          "rgba(var(--field-border-error), <alpha-value>)",
        "field-content": "rgba(var(--field-content), <alpha-value>)",
        "field-placeholder":
          "rgba(var(--field-placeholder), <alpha-value>)",
        "field-content-disabled":
          "rgba(var(--field-content-disabled), <alpha-value>)",
        "field-icon": "rgba(var(--field-icon), <alpha-value>)",
        "field-assistive": "rgba(var(--field-assistive), <alpha-value>)",
        "field-assistive-error":
          "rgba(var(--field-assistive-error), <alpha-value>)",
        "switch-track-off": "rgba(var(--switch-track-off), <alpha-value>)",
        "switch-track-disabled":
          "rgba(var(--switch-track-disabled), <alpha-value>)",
        "switch-track-primary-on":
          "rgba(var(--switch-track-primary-on), <alpha-value>)",
        "switch-track-secondary-on":
          "rgba(var(--switch-track-secondary-on), <alpha-value>)",
        "switch-track-tertiary-on":
          "rgba(var(--switch-track-tertiary-on), <alpha-value>)",
        "switch-track-contract-on":
          "rgba(var(--switch-track-contract-on), <alpha-value>)",
        "switch-track-contract-off":
          "rgba(var(--switch-track-contract-off), <alpha-value>)",
        "switch-track-theme-on":
          "rgba(var(--switch-track-theme-on), <alpha-value>)",
        "switch-track-theme-off":
          "rgba(var(--switch-track-theme-off), <alpha-value>)",
        "switch-knob": "rgba(var(--switch-knob), <alpha-value>)",
        "switch-knob-disabled":
          "rgba(var(--switch-knob-disabled), <alpha-value>)",
        "switch-knob-theme-on":
          "rgba(var(--switch-knob-theme-on), <alpha-value>)",

        // hover: "rgba(var(--hover), <alpha-value>)",
        // click: "rgba(var(--click), <alpha-value>)",
        // icon: "rgba(var(--icon), <alpha-value>)",
        // outline: "rgba(var(--outline), <alpha-value>)",
        // divider: "rgba(var(--divider), <alpha-value>)",
      },
      backgroundColor: {
        lighter: "rgba(var(--bg-lighter), <alpha-value>)",
        light: "rgba(var(--bg-light), <alpha-value>)",
        dark: "rgba(var(--bg-dark), <alpha-value>)",
      },
      borderColor: {
        disabled: "rgba(var(--border-disabled), <alpha-value>)",
      },
      textColor: {
        gray: {
          primary: "rgba(var(--text-primary), <alpha-value>)",
          secondary: "rgba(var(--text-secondary), <alpha-value>)",
          tertiary: "rgba(var(--text-tertiary), <alpha-value>)",
        },
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        focus: "var(--shadow-focus)",
        outline: "var(--shadow-outline)",
        "button-focus": "var(--shadow-button-focus)",
      },
      blur: {
        default: "var(--blur)",
      },
      borderRadius: {
        none: "var(--border-radius-none)" /* 0px */,
        sm: "var(--border-radius-sm)" /* 4px */,
        md: "var(--border-radius-md)" /* 8px */,
        lg: "var(--border-radius-lg)" /* 16px */,
      },
      spacing: {
        "control-sm": "var(--control-height-sm)",
        "control-md": "var(--control-height-md)",
        "control-lg": "var(--control-height-lg)",
        none: "var(--spacing-none)" /* 0px */,
        "4xs": "var(--spacing-4xs)" /* 8px */,
        "2xs": "var(--spacing-2xs)" /* 12px */,
        xs: "var(--spacing-xs)" /* 16px */,
        sm: "var(--spacing-sm)" /* 20px */,
        md: "var(--spacing-md)" /* 24px */,
        lg: "var(--spacing-lg)" /* 32px */,
        xl: "var(--spacing-xl)" /* 40px */,
        "2xl": "var(--spacing-2xl)" /* 48px */,
        "4xl": "var(--spacing-4xl)" /* 56px */,
        0: "var(--spacing-none)" /* 0px */,
        1: "var(--spacing-4xs)" /* 8px */,
        2: "var(--spacing-2xs)" /* 12px */,
        3: "var(--spacing-xs)" /* 16px */,
        4: "var(--spacing-sm)" /* 20px */,
        5: "var(--spacing-md)" /* 24px */,
        6: "var(--spacing-lg)" /* 32px */,
        7: "var(--spacing-xl)" /* 40px */,
        8: "var(--spacing-2xl)" /* 48px */,
        9: "var(--spacing-4xl)" /* 56px */,
      },
      zIndex: {
        header: "var(--z-header)",
        navigation: "var(--z-navigation)",
        drawer: "var(--z-drawer)",
        popover: "var(--z-popover)",
        tooltip: "var(--z-tooltip)",
        integration: "var(--z-integration)",
        "menu-backdrop": "var(--z-menu-backdrop)",
        menu: "var(--z-menu)",
        "menu-control": "var(--z-menu-control)",
        modal: "var(--z-modal)",
        "modal-overlay": "var(--z-modal-overlay)",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.9)" },
        },
      },
    },
  },
  plugins: [],
};
