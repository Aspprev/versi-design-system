import type { InputHTMLAttributes } from "react";
import SelectMultiView from "./SelectMultiView";

export interface SelectMultiOption {
  label: string;
  value: string;
}

export interface SelectMultiProps extends InputHTMLAttributes<HTMLInputElement> {
  options: SelectMultiOption[];
  label?: string;
  error?: string;
  onReset?: () => void;
}

export function SelectMulti(props: SelectMultiProps) {
  return (
    <SelectMultiView
      {...props}
      checkedList={props.value as string[]}
      onClear={props.onReset}
    />
  );
}

/** @deprecated Use SelectMulti. */
export const MultiSelect = SelectMulti;
/** @deprecated Use SelectMultiOption. */
export type MultiSelectOption = SelectMultiOption;
/** @deprecated Use SelectMultiProps. */
export type MultiSelectProps = SelectMultiProps;

export default SelectMulti;
