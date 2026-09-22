"use client";

import cs from "classnames";
import { ChangeEvent, useEffect, useRef } from "react";
import { IFilterControl } from "./Filter";

interface IFilterProps {
  id?: string;
  accessibleName?: string;
  groupName?: string;
  optionList?: { label: string; value: string }[];
  optionChecked?: string;
  onChange?: (value: string) => void;
  controls?: IFilterControl[];
  onControlChange?: (control: IFilterControl, value: string) => void;
  maxHeight?: number;
}

function FilterView({
  id,
  accessibleName,
  groupName,
  optionList,
  optionChecked,
  onChange,
  controls,
  onControlChange,
  maxHeight,
}: IFilterProps) {
  const handleChangeCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const handleControlChange = (
    control: IFilterControl,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onControlChange?.(control, event.target.value);
  };
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.style.maxHeight = maxHeight ? `${maxHeight}px` : "";
  }, [maxHeight]);

  if (controls?.length) {
    return (
      <div
        ref={containerRef}
        id={id}
        role="dialog"
        aria-label={accessibleName ?? "Filtros da tabela"}
        className="bg-surface-card rounded shadow-sm p-3 font-normal w-[calc(100vw-16px)] max-w-[320px] overflow-y-auto text-sm"
      >
        <div className="flex flex-col gap-3">
          {controls.map((control) => (
            <div
              key={control.id}
              className="flex flex-col gap-2 border-b border-border-default pb-3 last:border-b-0 last:pb-0"
            >
              {control.label && (
                <span
                  id={`${control.id}-label`}
                  className="text-xs font-bold uppercase tracking-wide text-content-muted"
                >
                  {control.label}
                </span>
              )}

              {control.type === "search" ? (
                <input
                  type="text"
                  aria-label={control.label ?? control.placeholder ?? "Buscar"}
                  aria-describedby={control.label ? `${control.id}-label` : undefined}
                  value={control.value ?? ""}
                  placeholder={control.placeholder ?? "Buscar"}
                  onChange={(event) => handleControlChange(control, event)}
                  className="field-keyboard-focus-ring h-10 rounded border border-field-border-default bg-field-surface px-3 text-sm text-field-content outline-none placeholder:text-field-placeholder focus:border-field-border-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                />
              ) : (
                <div className="flex flex-col gap-1">
                  {control.optionList?.map((option, index) => (
                    <label
                      key={`${control.id}-${index}`}
                      className={cs(
                        "min-h-6 flex items-start gap-2 px-3 py-0.5 cursor-pointer rounded",
                        control.value === option.value
                          ? "bg-primary-5 text-primary-1"
                          : "text-content-primary",
                      )}
                    >
                      <input
                        type="radio"
                        className="peer sr-only"
                        value={option.value}
                        checked={control.value === option.value}
                        name={`table-filter-${groupName ?? "default"}-${control.id}`}
                        onChange={(event) =>
                          handleControlChange(control, event)
                        }
                      />
                      <span
                        aria-hidden="true"
                        className="radio-control-proxy mt-1 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring"
                      />
                      <span className="min-w-0 flex-1 mt-[4px]">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={id}
      role="dialog"
      aria-label={accessibleName ?? "Filtros da tabela"}
      className="bg-surface-card rounded shadow-sm p-2 font-normal w-[calc(100vw-16px)] max-w-[320px] overflow-y-auto"
    >
      {optionList &&
        optionList.map((option, index) => (
          <label
            key={index}
            className={cs(
              "min-h-10 flex items-start gap-2 px-3 py-1 cursor-pointer rounded",
              optionChecked === option.value
                ? "bg-primary-5 text-primary-1"
                : "text-content-primary",
            )}
          >
            <input
              type="radio"
              className="peer sr-only"
              value={option.value}
              checked={optionChecked === option.value}
              name={`table-filter-${groupName ?? "default"}`}
              onChange={handleChangeCheckbox}
            />
            <span
              aria-hidden="true"
              className="radio-control-proxy mt-1 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring"
            />
            <span className="min-w-0 flex-1">
              {option.label}
            </span>
          </label>
        ))}
    </div>
  );
}

export default FilterView;
