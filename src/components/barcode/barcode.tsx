"use client";

import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

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

  return (
    banco + moeda + digitoGeral + vencimento + valor + campo1 + campo2 + campo3
  );
};

export interface BoletoBarCodeProps {
  linhaDigitavel: string;
}

export function BoletoBarCode({ linhaDigitavel }: BoletoBarCodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    try {
      const codigoBarras = linhaDigitavelParaCodigoBarras(linhaDigitavel);

      JsBarcode(svgRef.current, codigoBarras, {
        format: "ITF",
        lineColor: "#000000",
        background: "#FFFFFF",
        displayValue: false,
        width: 2,
        height: 80,
        margin: 0,
      });
    } catch (error) {
      console.error("Erro ao gerar código de barras:", error);
    }
  }, [linhaDigitavel]);

  return (
    <div className="w-full space-y-3 bg-surface-card">
      <svg ref={svgRef} className="w-full" />
      <p className="text-center font-mono text-sm tracking-widest text-content-primary">
        {linhaDigitavel}
      </p>
    </div>
  );
}

