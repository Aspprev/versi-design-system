"use client";

import classNames from "classnames";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type FileViewerSource = string | Blob | {
  url?: string;
  blob?: Blob;
  contentType?: string;
  fileName?: string;
};

export interface FileViewerProps {
  source?: FileViewerSource;
  fileName?: string;
  contentType?: string;
  loading?: boolean;
  error?: ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onDownload?: () => void;
  fallback?: ReactNode;
  title?: string;
  className?: string;
}

const extensionType = (fileName?: string) => {
  const extension = fileName?.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "application/pdf";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension ?? "")) {
    return `image/${extension === "jpg" ? "jpeg" : extension}`;
  }
  if (["txt", "csv", "json", "xml", "md"].includes(extension ?? "")) return "text/plain";
  return "application/octet-stream";
};

const normalizeContentType = (contentType: string) => contentType.split(";", 1)[0].trim().toLowerCase();

const toError = (cause: unknown) => (
  cause instanceof Error ? cause : new Error("Não foi possível ler o arquivo.")
);

export function FileViewer({
  source,
  fileName,
  contentType,
  loading = false,
  error,
  onLoad,
  onError,
  onDownload,
  fallback,
  title = fileName ?? "Visualização do arquivo",
  className,
}: FileViewerProps) {
  const [objectUrl, setObjectUrl] = useState<string>();
  const [textContent, setTextContent] = useState<string>();
  const [readError, setReadError] = useState<Error | null>(null);
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);
  const resolved = typeof source === "object" && source !== null && !(source instanceof Blob) ? source : undefined;
  const blob = source instanceof Blob ? source : resolved?.blob;
  const url = typeof source === "string" ? source : resolved?.url;
  const resolvedName = fileName ?? resolved?.fileName;
  const rawType = contentType?.trim() || resolved?.contentType || blob?.type || extensionType(resolvedName);
  const resolvedType = normalizeContentType(rawType);
  const isText = resolvedType.startsWith("text/") || resolvedType === "application/json";
  const displayError = error ?? readError?.message;

  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let active = true;
    setReadError(null);
    setTextContent(undefined);

    if (!blob) {
      setObjectUrl(undefined);
      return () => { active = false; };
    }

    let nextUrl: string;
    try {
      nextUrl = URL.createObjectURL(blob);
      setObjectUrl(nextUrl);
    } catch (cause) {
      const nextError = toError(cause);
      setReadError(nextError);
      onErrorRef.current?.(nextError);
      return () => { active = false; };
    }

    if (isText) {
      blob.text()
        .then((text) => {
          if (!active) return;
          setTextContent(text);
          onLoadRef.current?.();
        })
        .catch((cause: unknown) => {
          if (!active) return;
          const nextError = toError(cause);
          setReadError(nextError);
          onErrorRef.current?.(nextError);
        });
    }

    return () => {
      active = false;
      URL.revokeObjectURL(nextUrl);
    };
  }, [blob, isText]);

  const handleMediaError = () => {
    const nextError = new Error("Não foi possível carregar a visualização do arquivo.");
    setReadError(nextError);
    onErrorRef.current?.(nextError);
  };
  const handleLoad = () => onLoadRef.current?.();

  if (loading) {
    return (
      <div
        className={classNames("flex min-h-32 items-center justify-center rounded-sm border border-border-default bg-surface-card p-6 text-content-secondary", className)}
        role="status"
        aria-busy="true"
        aria-live="polite"
      >
        Carregando arquivo…
      </div>
    );
  }

  if (displayError) {
    return (
      <div className={classNames("rounded-sm border border-field-border-error bg-surface-card p-4 text-field-assistive-error", className)} role="alert">
        {displayError}
      </div>
    );
  }

  const displayUrl = objectUrl ?? url;
  if (!displayUrl && !textContent) {
    return (
      <div
        className={classNames("rounded-sm border border-border-default bg-surface-card p-4 text-content-secondary", className)}
        role="region"
        aria-label={title}
      >
        {fallback ?? "Arquivo indisponível."}
      </div>
    );
  }

  const download = onDownload
    ? <button type="button" onClick={onDownload} className="min-h-11 rounded-sm border border-border-default px-3 text-sm font-semibold text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring">Baixar arquivo</button>
    : displayUrl
      ? <a href={displayUrl} download={resolvedName} className="inline-flex min-h-11 items-center rounded-sm border border-border-default px-3 text-sm font-semibold text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring">Baixar arquivo</a>
      : null;

  return (
    <div
      className={classNames("flex min-w-0 flex-col gap-3 rounded-sm border border-border-default bg-surface-card p-3", className)}
      role="region"
      aria-label={title}
    >
      {resolvedType.startsWith("image/") && displayUrl && (
        <img src={displayUrl} alt={title} onLoad={handleLoad} onError={handleMediaError} className="max-h-[70vh] max-w-full object-contain" />
      )}
      {resolvedType === "application/pdf" && displayUrl && (
        <iframe src={displayUrl} title={title} onLoad={handleLoad} onError={handleMediaError} sandbox="" className="min-h-[32rem] w-full border-0" />
      )}
      {isText && (textContent !== undefined
        ? <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap break-words text-sm text-content-primary">{textContent}</pre>
        : displayUrl && <iframe src={displayUrl} title={title} onLoad={handleLoad} onError={handleMediaError} sandbox="" className="min-h-64 w-full border-0" />)}
      {!resolvedType.startsWith("image/") && resolvedType !== "application/pdf" && !isText && (
        fallback ?? <p className="text-content-secondary">Este tipo de arquivo não possui visualização disponível.</p>
      )}
      {download && <div className="flex justify-end">{download}</div>}
    </div>
  );
}

export default FileViewer;
