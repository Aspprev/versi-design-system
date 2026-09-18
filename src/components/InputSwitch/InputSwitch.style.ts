import { cva } from "class-variance-authority";
import classNames from "classnames";
import { InputSwitchProps, InputSwitchStyleProps } from "./InputSwitch";

const SIZE_STYLES: Record<
  NonNullable<InputSwitchProps["size"]>,
  {
    container: string;
    knob: string;
    icon: string;
  }
> = {
  sm: {
    container:
      "h-[1rem] w-[1.75rem] [--switch-padding:2px] [--switch-knob-size:0.75rem] [--switch-width:1.75rem]",
    knob: "h-[var(--switch-knob-size)] w-[var(--switch-knob-size)]",
    icon: "h-2 w-2",
  },
  md: {
    container:
      "h-[1.25rem] w-[3rem] [--switch-padding:2px] [--switch-knob-size:1rem] [--switch-width:3rem]",
    knob: "h-[var(--switch-knob-size)] w-[var(--switch-knob-size)]",
    icon: "h-3 w-3",
  },
  lg: {
    container:
      "h-[1.5rem] w-[3.5rem] [--switch-padding:2px] [--switch-knob-size:1.25rem] [--switch-width:3.5rem]",
    knob: "h-[var(--switch-knob-size)] w-[var(--switch-knob-size)]",
    icon: "h-4 w-4",
  },
};

const getInputSwitchStyles = ({
  variant,
  enabled,
  disabled,
  size = "md",
}: InputSwitchStyleProps) => {
  const sizeStyle = SIZE_STYLES[size];
  const containerVariant = cva(
    classNames(
      "switch-control relative inline-flex shrink-0 items-center rounded-full transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-5 before:w-full before:min-w-5 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 disabled:bg-switch-track-disabled",
      sizeStyle.container,
      { "pointer-events-none": disabled },
    ),
    {
      variants: {
        variant: {
          primary: classNames(
            "[--switch-state-layer:var(--switch-track-primary-on)]",
            { "bg-switch-track-primary-on": enabled },
            { "bg-switch-track-off": !enabled },
          ),
          secondary: classNames(
            "[--switch-state-layer:var(--switch-track-secondary-on)]",
            { "bg-switch-track-secondary-on": enabled },
            { "bg-switch-track-off": !enabled },
          ),
          tertiary: classNames(
            "[--switch-state-layer:var(--switch-track-tertiary-on)]",
            { "bg-switch-track-tertiary-on": enabled },
            { "bg-switch-track-off": !enabled },
          ),
          contract: classNames(
            enabled
              ? "bg-switch-track-contract-on [--switch-state-layer:var(--switch-track-contract-on)]"
              : "bg-switch-track-contract-off [--switch-state-layer:var(--switch-track-contract-off)]",
          ),
          theme: classNames(
            enabled
              ? "bg-switch-track-theme-on [--switch-state-layer:var(--switch-track-theme-on)]"
              : "bg-switch-track-theme-off [--switch-state-layer:var(--switch-track-theme-off)]",
          ),
        },
      },
      defaultVariants: {
        variant: "primary",
      },
    },
  );
  const containerClasses = containerVariant({ variant });

  const switchClasses = classNames(
    "switch-knob absolute left-[var(--switch-padding)] top-1/2 flex items-center justify-center rounded-full transition-[transform,box-shadow,background-color] duration-200 ease-in-out -translate-y-1/2",
    sizeStyle.knob,
    disabled ? "bg-switch-knob-disabled" : "bg-switch-knob",
    enabled
      ? "translate-x-[calc(var(--switch-width)-var(--switch-knob-size)-var(--switch-padding)*2)]"
      : "translate-x-0",
  );

  const switchClassesTheme = classNames(
    "switch-knob absolute left-[var(--switch-padding)] top-1/2 flex items-center justify-center rounded-full transition-[transform,box-shadow,background-color] duration-200 ease-in-out -translate-y-1/2",
    sizeStyle.knob,
    {
      "bg-switch-knob-theme-on": enabled && !disabled,
      "bg-switch-knob": !enabled && !disabled,
      "bg-switch-knob-disabled": disabled,
      "translate-x-[calc(var(--switch-width)-var(--switch-knob-size)-var(--switch-padding)*2)]":
        enabled,
      "translate-x-0": !enabled,
    },
  );

  const iconClasses = classNames(
    "aria-disabled:text-font-disabled",
    sizeStyle.icon,
    { "text-feedback-success-content": enabled && !disabled },
    { "text-feedback-danger-content": !enabled && !disabled },
    { "text-content-disabled": disabled },
  );

  const iconClassesTheme = classNames(
    "aria-disabled:text-font-disabled",
    sizeStyle.icon,
    { "text-content-inverse": enabled && !disabled },
    { "text-feedback-warning-content": !enabled && !disabled },
    { "text-content-disabled": disabled },
  );

  return {
    Icon: iconClasses,
    IconTheme: iconClassesTheme,
    Switch: switchClasses,
    SwitchTheme: switchClassesTheme,
    Container: containerClasses,
  };
};

export default getInputSwitchStyles;

