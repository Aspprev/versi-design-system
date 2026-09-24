"use client";

import JsBarcode from "jsbarcode";
import { useEffect, useRef, useState, type ReactNode } from "react";

const linhaDigitavelParaCodigoBarras = (linha: string): string => {
  const d = linha.replace(/\D/g, "");

  const banco = d.substring(0, 3);
  const moeda = d.substring(3, 4);
  const campo1 = d.substring(4, 9);
  const campo2 = d.substring(10, 20);
  const campo3 = d.substring(21, 31);
  const digitoGeral = d.substring(32, 33);
  const vencimento = d.substring(33, 37);
  const valor = d.substring(37, 47);

  return banco + moeda + digitoGeral + vencimento + valor + campo1 + campo2 + campo3;
};

export interface BoletoBarCodeProps {
  linhaDigitavel: string;
  /** Bar width passed to JsBarcode. */
  width?: number;
  /** Bar height in pixels. */
  height?: number;
  /** Quiet zone/margin in pixels. */
  quietZone?: number;
  error?: ReactNode;
  onError?: (error: Error) => void;
}

export function BoletoBarCode({
  linhaDigitavel,
  width = 2,
  height = 80,
  quietZone = 0,
  error,
  onError,
}: BoletoBarCodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [generationError, setGenerationError] = useState<Error | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    setGenerationError(null);

    try {
      const codigoBarras = linhaDigitavelParaCodigoBarras(linhaDigitavel);

      JsBarcode(svgRef.current, codigoBarras, {
        format: "ITF",
        lineColor: "#000000",
        background: "#FFFFFF",
        displayValue: false,
        width,
        height,
        margin: quietZone,
      });
    } catch (cause: unknown) {
      const nextError = cause instanceof Error
        ? cause
        : new Error("Não foi possível gerar o código de barras.");
      setGenerationError(nextError);
      onError?.(nextError);
    }
  }, [height, linhaDigitavel, onError, quietZone, width]);

  const displayError = error ?? generationError?.message;

  return (
    <div className="w-full space-y-3 bg-surface-card">
      {displayError ? (
        <p role="alert" className="text-sm text-field-assistive-error">
          {displayError}
        </p>
      ) : (
        <svg ref={svgRef} className="w-full" />
      )}
      <p className="text-center font-mono text-sm tracking-widest text-content-primary">
        {linhaDigitavel}
      </p>
    </div>
  );
}
