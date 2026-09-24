"use client";

import classNames from "classnames";
import { MdClose, MdRefresh } from "react-icons/md";
import type { ReactNode } from "react";
import FileUploadProgress, { type FileUploadProgressStatus } from "./FileUploadProgress";

export type FileUploadItemStatus = FileUploadProgressStatus | "pending";

export interface FileUploadItem {
  id?: string;
  file: File;
  progress?: number | null;
  status?: FileUploadItemStatus;
  error?: string;
}

export interface FileListProps {
  files: FileUploadItem[];
  accessibleName?: string;
  onRemove?: (item: FileUploadItem, index: number) => void;
  onRetry?: (item: FileUploadItem, index: number) => void;
  actions?: (item: FileUploadItem, index: number) => ReactNode;
  className?: string;
}

const fileId = (item: FileUploadItem, index: number) => item.id ?? `${item.file.name}-${item.file.size}-${item.file.lastModified}-${index}`;

const statusDescription = (status: FileUploadItemStatus) => {
  if (status === "uploading") return "Enviando";
  if (status === "success") return "Enviado";
  if (status === "error") return "Erro no envio";
  return "Aguardando envio";
};

export function FileList({ files, accessibleName = "Arquivos selecionados", onRemove, onRetry, actions, className }: FileListProps) {
  return (
    <ul aria-label={accessibleName} className={classNames("w-full space-y-2", className)}>
      {files.map((item, index) => {
        const status = item.status ?? "pending";
        const progressStatus: FileUploadProgressStatus = status === "pending" ? "idle" : status;
        return (
          <li key={fileId(item, index)} aria-busy={status === "uploading" || undefined} className="flex min-w-0 flex-wrap items-center gap-3 rounded-sm border border-border-default bg-surface-card p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-content-primary" title={item.file.name}>{item.file.name}</p>
              <p className="text-xs text-content-secondary">{Math.ceil(item.file.size / 1024)} KB</p>
              <span className="sr-only">Status: {statusDescription(status)}</span>
              {(status === "uploading" || status === "success" || status === "error") && (
                <FileUploadProgress value={item.progress} status={progressStatus} label={`Progresso de ${item.file.name}`} />
              )}
              {item.error && <p role="alert" className="mt-1 text-sm text-field-assistive-error">{item.error}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {actions?.(item, index)}
              {status === "error" && onRetry && <button type="button" onClick={() => onRetry(item, index)} aria-label={`Tentar novamente ${item.file.name}`} className="flex h-11 w-11 items-center justify-center rounded-sm text-content-secondary hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring"><MdRefresh aria-hidden="true" className="h-5 w-5" /></button>}
              {onRemove && <button type="button" onClick={() => onRemove(item, index)} aria-label={`Remover ${item.file.name}`} className="flex h-11 w-11 items-center justify-center rounded-sm text-content-secondary hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring"><MdClose aria-hidden="true" className="h-5 w-5" /></button>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default FileList;
