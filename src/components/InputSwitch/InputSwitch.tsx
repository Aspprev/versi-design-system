"use client";

import React, { useState } from "react";
import useStyle from "./InputSwitch.style";
import { MdCheck, MdOutlineClose, MdSunny, MdNightsStay } from "react-icons/md";
import type { IconType } from "react-icons";

type NativeSwitchProps = {
  id?: string;
  name?: string;
  value?: string;
  form?: string;
  autoFocus?: boolean;
  tabIndex?: number;
} & React.AriaAttributes & (
  | {
      "aria-label": string;
      "aria-labelledby"?: never;
    }
  | {
      "aria-label"?: never;
      "aria-labelledby": string;
    }
);

export type InputSwitchProps = {
  defaultEnable?: boolean;
  checked?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "contract" | "theme";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onChange?: (enabled: boolean) => void;
  icon?: IconType;
} & NativeSwitchProps;

export type InputSwitchStyleProps = Pick<
  InputSwitchProps,
  "variant" | "disabled" | "size"
> & {
  enabled: boolean;
};

export type SwitchProps = InputSwitchProps;

const InputSwitch: React.FC<InputSwitchProps> = ({
  defaultEnable: enabledByDefault,
  id,
  name,
  value,
  form,
  autoFocus,
  tabIndex,
  variant = "primary",
  size = "md",
  disabled,
  onChange,
  checked,
  icon: Icon,
  ...rest
}) => {
  const [enabled, setEnabled] = useState(enabledByDefault ?? false);
  const resolvedEnabled = typeof checked === "boolean" ? checked : enabled;
  const style = useStyle({
    variant,
    enabled: resolvedEnabled,
    disabled,
    size,
  });

  const toggle = () => {
    const newState = !resolvedEnabled;
    if (typeof checked !== "boolean") {
      setEnabled(newState);
    }
    onChange?.(newState);
  };
  return (
    <>
      {name && (
        <input
          type="checkbox"
          name={name}
          value={value ?? "on"}
          form={form}
          checked={resolvedEnabled}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        />
      )}
      <button
        {...rest}
        id={id}
        type="button"
        role="switch"
        aria-checked={resolvedEnabled}
        disabled={disabled ?? false}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        onClick={toggle}
        className={style.Container}
      >
      {variant !== "contract" && variant !== "theme" && (
        <span className={style.Switch}>
          {Icon && <Icon aria-hidden="true" className={style.Icon} />}
        </span>
      )}
      {variant === "contract" && (
        <span className={style.Switch}>
          {resolvedEnabled && (
            <MdCheck className={style.Icon} aria-disabled={disabled} />
          )}
          {resolvedEnabled || (
            <MdOutlineClose className={style.Icon} aria-disabled={disabled} />
          )}
        </span>
      )}

      {variant === "theme" && (
        <span className={style.SwitchTheme}>
          {resolvedEnabled && (
            <MdNightsStay
              className={style.IconTheme}
              aria-disabled={disabled}
            />
          )}
          {resolvedEnabled || (
            <MdSunny className={style.IconTheme} aria-disabled={disabled} />
          )}
        </span>
      )}
      </button>
    </>
  );
};

export default InputSwitch;

