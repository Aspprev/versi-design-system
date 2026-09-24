"use client";

import React, { useCallback, useState, useEffect } from "react";

export interface InputSliderProps {
  name: string;
  start: number;
  end: number;
  initialValue: number;
  functionChange: React.Dispatch<React.SetStateAction<number>>;
  step?: number | null;
  prefix?: string;
  /** Canonical suffix displayed beside the value. */
  suffix?: string;
  /** @deprecated Use `suffix`. Kept for migration compatibility. */
  sufix?: string;
  marks?: boolean | ReadonlyArray<{ value: number; label?: React.ReactNode }>;
  valueLabelDisplay?: "off" | "on" | "auto";
  showLabel?: boolean;
  disabled?: boolean;
  inputDisabled?: boolean;
  valueFormmated?: string;
  showInput?: boolean;
  ariaLabel?: string;
}

const InputSlider: React.FC<InputSliderProps> = ({
  name,
  start,
  step = 1,
  end,
  functionChange,
  initialValue,
  prefix,
  suffix,
  sufix,
  marks,
  valueLabelDisplay = "auto",
  showLabel = false,
  disabled = false,
  inputDisabled = false,
  valueFormmated,
  showInput = false,
  ariaLabel,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue);
  const resolvedSuffix = suffix ?? sufix;
  const controlLabel = ariaLabel || name;
  const valueInputId = `${name}-value`;

  const handleSliderChange = useCallback(
    (newValue: number | string) => {
      const parsedValue = Number(newValue);
      setValue(parsedValue);
    },
    [functionChange]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value === "") {
        setValue(start);
        return;
      }

      const nextValue = Number(event.target.value);
      if (Number.isFinite(nextValue)) setValue(nextValue);
    },
    [start],
  );

  const handleBlur = useCallback(() => {
    if (value < start) {
      setValue(start);
    } else if (value > end) {
      setValue(end);
    }
  }, [end, start, value]);

  useEffect(() => {
    functionChange(value);
  }, [functionChange, value]);

  return (
    <div className="w-full flex flex-row gap-2">
      <input
        className="w-full range pr-6 accent-primary-1"
        type="range"
        name={name}
        id={name}
        min={start}
        max={end}
        step={step ?? 1}
        disabled={disabled}
        value={value}
        aria-label={controlLabel}
        onChange={(e) => handleSliderChange(e.target.value)}
      />
      {showInput && (
        <input
          id={valueInputId}
          className="min-w-0"
          value={inputDisabled ? "-" : value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          type="number"
          step={step ?? 1}
          min={start}
          max={end}
          aria-label={`${controlLabel} valor`}
          disabled={disabled || inputDisabled}
        />
      )}
      {(showLabel || prefix || resolvedSuffix || valueFormmated) && (
        <span className="shrink-0 text-sm text-content-secondary">
          {prefix}
          {valueFormmated ?? value}
          {resolvedSuffix}
        </span>
      )}
    </div>
  );
};

export default InputSlider;

