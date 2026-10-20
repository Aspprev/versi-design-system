import { useEffect, useState, type RefObject } from "react";

/** Read tokens where the example renders, including inherited theme overrides. */
export function useTokenValues(tokens: readonly string[], element?: RefObject<HTMLElement | null>) {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    let frame = 0;
    const read = () => {
      const styles = getComputedStyle(element?.current ?? document.body);
      const next = Object.fromEntries(tokens.map((token) => [token, styles.getPropertyValue(token).trim()]));
      setValues((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    read();
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [tokens, element]);
  return values;
}
