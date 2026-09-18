"use client";

import {
  Switch as HeadlessSwitch,
} from "@headlessui/react";
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
} & (
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
    <HeadlessSwitch
      checked={resolvedEnabled}
      onChange={toggle}
      disabled={disabled ?? false}
      className={style.Container}
      {...rest}
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
    </HeadlessSwitch>
  );
};

export default InputSwitch;

