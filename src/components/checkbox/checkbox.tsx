import type React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  layout?: "row" | "col" | "grid-2";
}

export function Checkbox({
  options,
  value,
  onChange,
  layout = "row",
  ...props
}: CheckboxProps) {
  let containerClass = "";
  if (layout === "col") {
    containerClass = "flex flex-col gap-y-3 mt-3";
  } else if (layout === "grid-2") {
    containerClass = "grid grid-cols-2 gap-y-2 mt-3";
  } else {
    containerClass = "flex flex-row mt-3";
  }

  return (
    <div className={containerClass}>
      {options.map((option) => (
        <label
          key={option.value}
          className="mr-6 flex min-h-7 cursor-pointer items-center gap-2"
        >
          <input
            type="checkbox"
            className="checkbox-control"
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            {...props}
          />
          <span className="text-content-secondary">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

/** @deprecated Use Checkbox. */
export const CheckBox = Checkbox;
/** @deprecated Use CheckboxProps. */
export type CheckBoxProps = CheckboxProps;