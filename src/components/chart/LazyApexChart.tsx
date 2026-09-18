"use client";

import { useEffect, useState } from "react";
import type { Props as ReactApexChartProps } from "react-apexcharts";

export type Props = ReactApexChartProps;

export default function LazyApexChart(props: Props) {
  const [ApexChart, setApexChart] = useState<
    React.ComponentType<Props> | null
  >(null);

  useEffect(() => {
    let active = true;
    import("react-apexcharts").then(({ default: component }) => {
      if (active) setApexChart(() => component);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!ApexChart) {
    return (
      <div
        className="flex min-h-40 items-center justify-center text-sm text-content-muted"
        role="status"
        aria-label="Carregando grafico"
      >
        Carregando grafico...
      </div>
    );
  }

  return <ApexChart {...props} />;
}
