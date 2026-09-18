"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface SliderProps {
  min: number;
  max: number;
  step: number;
  initialValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  onDragOver?: (value: number) => void;
  disabled?: boolean;
  marks?: number[];
  ariaLabel: string;
  getAriaValueText: (value: number) => string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step,
  initialValue = min,
  value,
  onChange,
  onDragOver,
  disabled = false,
  marks,
  ariaLabel,
  getAriaValueText,
}) => {
  const [internalValue, setInternalValue] = useState(initialValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<Array<HTMLDivElement | null>>([]);
  const markRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const isDraggingRef = useRef(false);
  const [tooltipOffset, setTooltipOffset] = useState(0);

  const currentValue = value !== undefined ? value : internalValue;

  useEffect(() => {
    if (value === undefined) {
      setInternalValue(initialValue);
    }
  }, [initialValue, value]);

  const roundToStep = (val: number) => {
    const precision = Math.max(0, Math.ceil(-Math.log10(step)));
    return parseFloat((Math.round(val / step) * step).toFixed(precision));
  };

  const updateValueFromPosition = (clientX: number) => {
    if (!sliderRef.current) return undefined;
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newLeft = Math.min(
      Math.max(clientX - sliderRect.left, 0),
      sliderRect.width,
    );
    const rawValue = min + ((max - min) * newLeft) / sliderRect.width;
    return roundToStep(rawValue);
  };

  // ---- Mouse ----
  const handleMouseMove = (event: MouseEvent) => {
    if (disabled || !isDraggingRef.current) return;
    const roundedValue = updateValueFromPosition(event.clientX);
    if (roundedValue === undefined) return;

    if (value === undefined) setInternalValue(roundedValue);
    if (onChange) onChange(roundedValue);
  };

  const handleMouseUp = (event: MouseEvent) => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    if (isDraggingRef.current) {
      const finalValue = updateValueFromPosition(event.clientX);
      if (finalValue !== undefined) {
        if (value === undefined) setInternalValue(finalValue);
        if (onChange) onChange(finalValue);
        if (onDragOver) onDragOver(finalValue);
      } else {
        if (onDragOver) onDragOver(currentValue);
      }
    }

    isDraggingRef.current = false;
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !sliderRef.current) return;
    isDraggingRef.current = true;

    const roundedValue = updateValueFromPosition(event.clientX);
    if (roundedValue !== undefined) {
      if (value === undefined) setInternalValue(roundedValue);
      if (onChange) onChange(roundedValue);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // ---- Touch ----
  const handleTouchMove = (event: TouchEvent) => {
    if (disabled || !isDraggingRef.current) return;
    const touch = event.touches[0];
    const roundedValue = updateValueFromPosition(touch.clientX);
    if (roundedValue === undefined) return;

    if (value === undefined) setInternalValue(roundedValue);
    if (onChange) onChange(roundedValue);
  };

  const handleTouchEnd = (event: TouchEvent) => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);

    if (isDraggingRef.current) {
      const touch = event.changedTouches[0];
      const finalValue = updateValueFromPosition(touch.clientX);

      if (finalValue !== undefined) {
        if (value === undefined) setInternalValue(finalValue);
        if (onChange) onChange(finalValue);
        if (onDragOver) onDragOver(finalValue);
      } else {
        if (onDragOver) onDragOver(currentValue);
      }
    }

    isDraggingRef.current = false;
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || !sliderRef.current) return;
    isDraggingRef.current = true;

    const touch = event.touches[0];
    const roundedValue = updateValueFromPosition(touch.clientX);
    if (roundedValue !== undefined) {
      if (value === undefined) setInternalValue(roundedValue);
      if (onChange) onChange(roundedValue);
    }

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  // ---- Atualiza posição do thumb e barra ----
  const updateThumbPosition = useCallback(() => {
    if (thumbRef.current && sliderRef.current && progressRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      if (max <= min || sliderRect.width <= 0) {
        thumbRef.current.style.left = "0px";
        progressRef.current.style.width = "0px";
        setTooltipOffset(0);
        return;
      }
      const clampedValue = Math.max(min, Math.min(max, currentValue));
      const left = ((clampedValue - min) / (max - min)) * sliderRect.width;
      const tooltipWidth =
        tooltipRef.current?.getBoundingClientRect().width ?? 48;
      const tooltipHalfWidth = tooltipWidth / 2;
      const thumbHalfWidth = thumbRef.current.getBoundingClientRect().width / 2;
      const clampedTooltipCenter = Math.min(
        Math.max(left, tooltipHalfWidth - thumbHalfWidth),
        sliderRect.width - (tooltipHalfWidth - thumbHalfWidth),
      );

      thumbRef.current.style.left = `${left}px`;
      progressRef.current.style.width = `${left}px`;
      setTooltipOffset(clampedTooltipCenter - left);
    }
  }, [currentValue, max, min]);

  useEffect(() => {
    updateThumbPosition();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateThumbPosition);
      return () => window.removeEventListener("resize", updateThumbPosition);
    }

    const resizeObserver = new ResizeObserver(updateThumbPosition);
    if (sliderRef.current) resizeObserver.observe(sliderRef.current);
    return () => resizeObserver.disconnect();
  }, [currentValue, max, min, updateThumbPosition]);

  const effectiveMarks = useMemo(
    () => (marks && marks.length > 0 ? marks : [min, max]),
    [marks, max, min],
  );

  const ticks = useMemo(() => {
    if (max <= min || step <= 0) return [min];

    const maxTicks = 50;
    const interval = (max - min) / Math.min(maxTicks, (max - min) / step);
    const calculatedTicks: number[] = [];

    for (let tick = min; tick <= max; tick += interval) {
      calculatedTicks.push(tick);
    }

    return calculatedTicks;
  }, [max, min, step]);

  useEffect(() => {
    ticks.forEach((tick, idx) => {
      const element = tickRefs.current[idx];
      if (!element) return;

      const percent = ((tick - min) / (max - min)) * 100;
      const isMain = effectiveMarks.includes(Math.round(tick * 100) / 100);
      element.style.left = `${percent}%`;
      element.style.height = `${isMain ? 10 : 6}px`;
    });

    effectiveMarks.forEach((mark, idx) => {
      const element = markRefs.current[idx];
      if (!element) return;

      const percent = ((mark - min) / (max - min)) * 100;
      element.style.left = `${percent}%`;
    });
  }, [effectiveMarks, max, min, ticks]);

  return (
    <div className="block relative w-full h-12">
      <div
        className={`relative w-full ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } mt-10`}
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        tabIndex={disabled ? -1 : 0} // foco do teclado
        onKeyDown={(event) => {
          if (disabled) return;

          const setValue = (val: number) => {
            const clamped = Math.max(min, Math.min(max, roundToStep(val)));
            if (value === undefined) setInternalValue(clamped);
            if (onChange) onChange(clamped);
            if (onDragOver) onDragOver(clamped);
          };

          switch (event.key) {
            case "ArrowLeft":
            case "ArrowDown":
              setValue(currentValue - step);
              event.preventDefault();
              break;
            case "ArrowRight":
            case "ArrowUp":
              setValue(currentValue + step);
              event.preventDefault();
              break;
            case "Home":
              setValue(min);
              event.preventDefault();
              break;
            case "End":
              setValue(max);
              event.preventDefault();
              break;
            default:
              break;
          }
        }}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-valuetext={getAriaValueText(currentValue)}
        aria-label={ariaLabel}
        aria-disabled={disabled}
      >
        {/* trilha */}
        <div className="absolute left-0 top-1/2 h-[4px] w-full -translate-y-1/2 transform rounded bg-border-default" />

        {/* progresso */}
        <div
          className={`absolute top-1/2 left-0 h-[4px] rounded ${
            disabled ? "bg-surface-disabled" : "bg-action-primary"
          } transform -translate-y-1/2`}
          ref={progressRef}
        />

        {/* thumb */}
        <div
          className="absolute top-1/2 w-4 h-4 bg-surface-card border border-border-default rounded-full transform -translate-x-1/2 -translate-y-1/2 select-none"
          ref={thumbRef}
        >
          {!disabled && (
            <div
              ref={tooltipRef}
              className="absolute left-1/2 bottom-full transform -translate-x-1/2 mb-1 font-semibold rounded px-1 py-[2px] text-center text-content-inverse bg-surface-tooltip text-sm "
              style={{ marginLeft: `${tooltipOffset}px` }}
            >
              {currentValue}
            </div>
          )}
        </div>
      </div>

      {/* risquinhos */}
      {ticks.map((tick, idx) => {
        return (
          <div
            key={idx}
            ref={(element) => {
              tickRefs.current[idx] = element;
            }}
            className="absolute top-2 w-px -translate-x-1/2 bg-border-strong"
          />
        );
      })}

      {/* números principais */}
      {effectiveMarks.map((mark, idx) => {
        return (
          <span
            key={idx}
            ref={(element) => {
              markRefs.current[idx] = element;
            }}
            className="absolute top-5 -translate-x-1/2 text-xs text-content-primary"
          >
            {mark}
          </span>
        );
      })}
    </div>
  );
};

export default Slider;


