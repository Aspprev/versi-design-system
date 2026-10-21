import type { InputHTMLAttributes } from "react";
import SelectMultiView from "./SelectMultiView";

export interface SelectMultiOption {
  label: string;
  value: string;
}

/** Values must be unique across the entire select. */
export interface SelectMultiGroup {
  title: string;
  options: SelectMultiOption[];
}

export type SelectMultiItem = SelectMultiOption | SelectMultiGroup;

export interface SelectMultiProps extends InputHTMLAttributes<HTMLInputElement> {
  options: SelectMultiItem[];
  /** Blocks removal at this count; validate an initially empty form on submit. */
  minSelected?: number;
  /** Blocks new selections at this count. */
  maxSelected?: number;
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
