"use client";

import classNames from "classnames";
import { useEffect, useMemo, useState, type ReactNode } from "react";

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
  onDownload?: () => void;
  fallback?: ReactNode;
  title?: string;
  className?: string;
}

const extensionType = (fileName?: string) => {
  const extension = fileName?.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "application/pdf";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension ?? "")) return `image/${extension === "jpg" ? "jpeg" : extension}`;
  if (["txt", "csv", "json", "xml", "md"].includes(extension ?? "")) return "text/plain";
  return "application/octet-stream";
};

export function FileViewer({ source, fileName, contentType, loading = false, error, onDownload, fallback, title = fileName ?? "Visualização do arquivo", className }: FileViewerProps) {
  const [objectUrl, setObjectUrl] = useState<string>();
  const [textContent, setTextContent] = useState<string>();
  const resolved = typeof source === "object" && source !== null && !(source instanceof Blob) ? source : undefined;
  const blob = source instanceof Blob ? source : resolved?.blob;
  const url = typeof source === "string" ? source : resolved?.url;
  const resolvedName = fileName ?? resolved?.fileName;
  const resolvedType = contentType ?? resolved?.contentType ?? blob?.type ?? extensionType(resolvedName);

  useEffect(() => {
    if (!blob) {
      setObjectUrl(undefined);
      setTextContent(undefined);
      return;
    }
    const nextUrl = URL.createObjectURL(blob);
    setObjectUrl(nextUrl);
    let active = true;
    if (resolvedType.startsWith("text/") || resolvedType === "application/json") {
      blob.text().then((text) => { if (active) setTextContent(text); });
    } else {
      setTextContent(undefined);
    }
    return () => { active = false; URL.revokeObjectURL(nextUrl); };
  }, [blob, resolvedType]);

  const displayUrl = objectUrl ?? url;
  const downloadUrl = useMemo(() => displayUrl, [displayUrl]);
  if (loading) return <div className={classNames("flex min-h-32 items-center justify-center rounded-sm border border-border-default bg-surface-card p-6 text-content-secondary", className)} role="status" aria-live="polite">Carregando arquivo…</div>;
  if (error) return <div className={classNames("rounded-sm border border-field-border-error bg-surface-card p-4 text-field-assistive-error", className)} role="alert">{error}</div>;
  if (!displayUrl && !textContent) return <div className={classNames("rounded-sm border border-border-default bg-surface-card p-4 text-content-secondary", className)}>{fallback ?? "Arquivo indisponível."}</div>;

  const download = onDownload ? <button type="button" onClick={onDownload} className="min-h-11 rounded-sm border border-border-default px-3 text-sm font-semibold text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring">Baixar arquivo</button> : downloadUrl ? <a href={downloadUrl} download={resolvedName} className="inline-flex min-h-11 items-center rounded-sm border border-border-default px-3 text-sm font-semibold text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring">Baixar arquivo</a> : null;

  return (
    <div className={classNames("flex min-w-0 flex-col gap-3 rounded-sm border border-border-default bg-surface-card p-3", className)}>
      {resolvedType.startsWith("image/") && displayUrl && <img src={displayUrl} alt={title} className="max-h-[70vh] max-w-full object-contain" />}
      {resolvedType === "application/pdf" && displayUrl && <iframe src={displayUrl} title={title} className="min-h-[32rem] w-full border-0" />}
      {(resolvedType.startsWith("text/") || resolvedType === "application/json") && (textContent !== undefined ? <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap break-words text-sm text-content-primary">{textContent}</pre> : displayUrl && <iframe src={displayUrl} title={title} sandbox="" className="min-h-64 w-full border-0" />)}
      {!resolvedType.startsWith("image/") && resolvedType !== "application/pdf" && !resolvedType.startsWith("text/") && resolvedType !== "application/json" && (fallback ?? <p className="text-content-secondary">Este tipo de arquivo não possui visualização disponível.</p>)}
      {download && <div className="flex justify-end">{download}</div>}
    </div>
  );
}

export default FileViewer;
