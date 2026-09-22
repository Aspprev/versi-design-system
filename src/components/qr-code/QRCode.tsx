"use client";

import QRCodeGenerator from "qrcode";
import { useEffect, useId, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import classNames from "classnames";

export type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "onError"> {
  value: string;
  size?: number;
  level?: QRCodeErrorCorrectionLevel;
  includeMargin?: boolean;
  fgColor?: string;
  bgColor?: string;
  ariaLabel?: string;
  description?: string;
  loading?: boolean;
  error?: ReactNode;
  onError?: (error: Error) => void;
}

function getRelativeLuminance(color: string) {
  const match = color.trim().match(/^#([\da-f]{6})$/i);
  if (!match) return null;

  const channels = [0, 2, 4].map((offset) => Number.parseInt(match[1].slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) => (
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));

  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function resolveAccessibleColors(fgColor: string, bgColor: string) {
  const foregroundLuminance = getRelativeLuminance(fgColor);
  const backgroundLuminance = getRelativeLuminance(bgColor);

  if (foregroundLuminance === null || backgroundLuminance === null) {
    return { dark: fgColor, light: bgColor };
  }

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  const contrastRatio = (lighter + 0.05) / (darker + 0.05);

  return contrastRatio >= 3
    ? { dark: fgColor, light: bgColor }
    : { dark: "#000000", light: "#FFFFFF" };
}

export function QRCode({
  value,
  size = 192,
  level = "M",
  includeMargin = true,
  fgColor = "#000000",
  bgColor = "#FFFFFF",
  ariaLabel = "Código QR",
  description,
  loading = false,
  error,
  onError,
  className,
  ...rest
}: QRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<Error | null>(null);
  const onErrorRef = useRef(onError);
  const generatedId = useId();
  const resolvedSize = Math.max(1, Number.isFinite(size) ? Math.floor(size) : 192);
  const descriptionId = description
    ? `${rest.id ?? generatedId}-description`
    : undefined;
  const colors = useMemo(
    () => resolveAccessibleColors(fgColor, bgColor),
    [bgColor, fgColor],
  );
  const describedBy = [rest["aria-describedby"], descriptionId].filter(Boolean).join(" ") || undefined;
  const displayError = error ?? generationError?.message;
  const isLoading = loading || (!dataUrl && !displayError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let active = true;
    if (error) {
      setDataUrl(null);
      setGenerationError(null);
      return () => { active = false; };
    }
    setDataUrl(null);
    setGenerationError(null);
    QRCodeGenerator.toDataURL(value, {
      width: resolvedSize,
      margin: includeMargin ? 4 : 0,
      errorCorrectionLevel: level,
      color: colors,
    })
      .then((url) => { if (active) setDataUrl(url); })
      .catch((cause: unknown) => {
        if (!active) return;
        const nextError = cause instanceof Error
          ? cause
          : new Error("Não foi possível gerar o código QR.");
        setDataUrl(null);
        setGenerationError(nextError);
        onErrorRef.current?.(nextError);
      });
    return () => { active = false; };
  }, [colors, error, includeMargin, level, resolvedSize, value]);

  return (
    <div
      {...rest}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      aria-busy={isLoading || undefined}
      aria-invalid={displayError ? true : undefined}
      className={classNames("inline-flex max-w-full flex-col items-center gap-2", className)}
    >
      {displayError ? (
        <span role="alert" className="rounded-sm border border-field-border-error p-3 text-sm text-field-assistive-error">
          {displayError}
        </span>
      ) : dataUrl ? (
        <img src={dataUrl} alt="" width={resolvedSize} height={resolvedSize} className="h-auto max-w-full" />
      ) : (
        <span
          aria-hidden="true"
          className="inline-block animate-pulse rounded-sm bg-surface-muted"
          style={{ width: resolvedSize, height: resolvedSize, maxWidth: "100%" }}
        />
      )}
      {description && <span id={descriptionId} className="sr-only">{description}</span>}
    </div>
  );
}

export default QRCode;
