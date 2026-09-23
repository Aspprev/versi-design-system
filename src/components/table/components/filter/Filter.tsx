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
  /** Stable id used to associate the popup with its trigger. */
  id?: string;
  /** Accessible name for the filter popup. */
  accessibleName?: string;
  /** Unique radio group prefix when multiple filters are rendered together. */
  groupName?: string;
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
      id={props.id}
      accessibleName={props.accessibleName}
      groupName={props.groupName}
      optionChecked={optionChecked}
      onChange={onChange}
      controls={controls}
      onControlChange={onControlChange}
      maxHeight={maxHeight}
    />
  );
}

export default Filter;
