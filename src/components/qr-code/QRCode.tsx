"use client";

import QRCodeGenerator from "qrcode";
import { useEffect, useState, type HTMLAttributes } from "react";
import classNames from "classnames";

export type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  value: string;
  size?: number;
  level?: QRCodeErrorCorrectionLevel;
  includeMargin?: boolean;
  fgColor?: string;
  bgColor?: string;
  ariaLabel?: string;
  description?: string;
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
  className,
  ...rest
}: QRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const descriptionId = description ? `${rest.id ?? "qr-code"}-description` : undefined;
  const colors = resolveAccessibleColors(fgColor, bgColor);

  useEffect(() => {
    let active = true;
    setDataUrl(null);
    QRCodeGenerator.toDataURL(value, {
      width: size,
      margin: includeMargin ? 4 : 0,
      errorCorrectionLevel: level,
       color: colors,
    })
      .then((url) => { if (active) setDataUrl(url); })
      .catch(() => { if (active) setDataUrl(null); });
    return () => { active = false; };
  }, [bgColor, fgColor, includeMargin, level, size, value]);

  return (
    <div
      {...rest}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={descriptionId}
      className={classNames("inline-flex max-w-full flex-col items-center gap-2", className)}
    >
      {dataUrl ? (
        <img src={dataUrl} alt="" width={size} height={size} className="h-auto max-w-full" />
      ) : (
        <span
          aria-hidden="true"
          className="inline-block animate-pulse rounded-sm bg-surface-muted"
          style={{ width: size, height: size, maxWidth: "100%" }}
        />
      )}
      {description && <span id={descriptionId} className="sr-only">{description}</span>}
    </div>
  );
}

export default QRCode;
