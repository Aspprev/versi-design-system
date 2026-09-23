"use client";

import { useEffect, useState } from "react";
import {
  getLoadedCountryFlagUrl,
  loadCountryFlags,
} from "../../data/country-flags-runtime";

type CountryFlagProps = {
  cca2?: string | null;
  src?: string;
  alt?: string;
  className?: string;
  loading?: "eager" | "lazy";
};

export function CountryFlag({
  cca2,
  src,
  alt = "",
  className,
  loading = "lazy",
}: CountryFlagProps) {
  const normalizedSrc = src?.trim() || "";
  const [loadedSrc, setLoadedSrc] = useState(
    () => normalizedSrc || getLoadedCountryFlagUrl(cca2),
  );

  useEffect(() => {
    const immediateSrc = normalizedSrc || getLoadedCountryFlagUrl(cca2);
    if (immediateSrc) {
      setLoadedSrc(immediateSrc);
      return;
    }

    setLoadedSrc("");

    let mounted = true;
    void loadCountryFlags().then(() => {
      if (mounted) setLoadedSrc(getLoadedCountryFlagUrl(cca2));
    });

    return () => {
      mounted = false;
    };
  }, [cca2, normalizedSrc]);

  if (!loadedSrc) {
    return <span aria-hidden="true" className="h-5 w-7 shrink-0 rounded-sm bg-surface-muted" />;
  }

  return (
    <img
      src={loadedSrc}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={className}
      loading={loading}
      referrerPolicy="no-referrer"
    />
  );
}
