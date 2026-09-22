"use client";

import classNames from "classnames";

export type FileUploadProgressStatus = "idle" | "uploading" | "success" | "error";

export interface FileUploadProgressProps {
  value?: number | null;
  label?: string;
  status?: FileUploadProgressStatus;
  showValue?: boolean;
  className?: string;
}

export function FileUploadProgress({
  value,
  label = "Progresso do upload",
  status = "uploading",
  showValue = true,
  className,
}: FileUploadProgressProps) {
  const resolvedValue = typeof value === "number"
    ? Math.min(100, Math.max(0, value))
    : undefined;
  const statusText = status === "success"
    ? "Concluído"
    : status === "error"
      ? "Erro"
      : resolvedValue === undefined
        ? "Em andamento"
        : `${Math.round(resolvedValue)}%`;

  return (
    <div className={classNames("w-full", className)}>
      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-content-secondary">
        <span>{label}</span>
        {showValue && <span aria-hidden="true">{statusText}</span>}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={resolvedValue === undefined ? undefined : 0}
        aria-valuemax={resolvedValue === undefined ? undefined : 100}
        aria-valuenow={resolvedValue}
        aria-valuetext={statusText}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-muted"
      >
        <div
          className={classNames(
            "h-full rounded-full transition-[width] duration-200",
            status === "error" ? "bg-feedback-danger-strong" : "bg-action-primary",
            resolvedValue === undefined ? "w-1/2 animate-pulse" : undefined,
          )}
          style={resolvedValue === undefined ? undefined : { width: `${resolvedValue}%` }}
        />
      </div>
      <span className="sr-only" role="status" aria-live="polite">{statusText}</span>
    </div>
  );
}

export default FileUploadProgress;
