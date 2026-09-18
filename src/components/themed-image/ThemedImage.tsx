import {
  normalizeThemedImageSource,
  type ThemedImageSource,
} from "../../types/themed-image";
import classNames from "classnames";
import type { ImgHTMLAttributes } from "react";

export type ThemedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  source: ThemedImageSource;
  basePath?: string;
  svgClassName?: string;
};

const DEFAULT_LOGOS_BASE_PATH = "/logos";

function resolvePath(
  source: string,
  basePath: string = DEFAULT_LOGOS_BASE_PATH,
) {
  if (!basePath || source.startsWith("/") || source.includes(":")) {
    return source;
  }

  return `${basePath.replace(/\/?$/, "/")}${source.replace(/^\/+/, "")}`;
}

function isSvgSource(source: string) {
  return source.split(/[?#]/, 1)[0].toLowerCase().endsWith(".svg");
}

export default function ThemedImage({
  source,
  basePath,
  svgClassName,
  className,
  alt,
  ...props
}: ThemedImageProps) {
  const sources = normalizeThemedImageSource(source);
  const lightSource = resolvePath(sources.light, basePath);
  const darkSource = sources.dark
    ? resolvePath(sources.dark, basePath)
    : undefined;

  return (
    <>
      <img
        {...props}
        src={lightSource}
        alt={alt}
        data-color-scheme-logo="light"
        className={classNames(
          className,
          isSvgSource(lightSource) && svgClassName,
          "themed-image-light",
          {
            "themed-image-has-dark": Boolean(darkSource),
          },
        )}
      />
      {darkSource && (
        <img
          {...props}
          src={darkSource}
          alt={alt}
          data-color-scheme-logo="dark"
          className={classNames(
            className,
            isSvgSource(darkSource) && svgClassName,
            "themed-image-dark",
          )}
        />
      )}
    </>
  );
}

