import { ReactNode } from "react";
import FilterView from "./FilterView";

export interface IFilterOption {
  label: string;
  value: string;
}

export interface IFilterControl {
  id: string;
  label?: string;
  type: "options" | "sort" | "search";
  optionList?: IFilterOption[];
  value?: string;
  placeholder?: string;
}

export interface IFilterProps {
  optionList?: IFilterOption[];
  optionChecked?: string;
  onChange?: (value: string) => void;
  controls?: IFilterControl[];
  onControlChange?: (control: IFilterControl, value: string) => void;
  maxHeight?: number;
}

function Filter(props: IFilterProps) {
  const {
    optionList,
    optionChecked,
    onChange,
    controls,
    onControlChange,
    maxHeight,
  } = props;

  return (
    <FilterView
      optionList={optionList}
      optionChecked={optionChecked}
      onChange={onChange}
      controls={controls}
      onControlChange={onControlChange}
      maxHeight={maxHeight}
    />
  );
}

export default Filter;
