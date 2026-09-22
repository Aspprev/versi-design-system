"use client";

import classNames from "classnames";
import { useId, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";

export interface FileRejection {
  file: File;
  reason: "type" | "size" | "count";
  message: string;
}

export interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  onFilesAccepted?: (files: File[]) => void;
  onFilesRejected?: (rejections: FileRejection[]) => void;
}

const acceptsFile = (file: File, accept?: string) => {
  if (!accept?.trim()) return true;
  return accept.split(",").map((item) => item.trim().toLowerCase()).some((rule) => {
    if (rule.endsWith("/*")) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    return file.type.toLowerCase() === rule;
  });
};

export function FileDropzone({
  accept,
  multiple = false,
  maxFiles = multiple ? Number.POSITIVE_INFINITY : 1,
  maxSize,
  disabled = false,
  label = "Selecionar arquivos",
  hint = "Arraste e solte os arquivos aqui ou use o teclado para selecionar.",
  error,
  className,
  onFilesAccepted,
  onFilesRejected,
}: FileDropzoneProps) {
  const inputId = useId();
  const messageId = `${inputId}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (fileList: FileList | File[]) => {
    if (disabled) return;
    const selected = Array.from(fileList);
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];
    selected.forEach((file, index) => {
      const reason = !acceptsFile(file, accept)
        ? "type"
        : maxSize !== undefined && file.size > maxSize
          ? "size"
          : index >= maxFiles
            ? "count"
            : undefined;
      if (!reason) accepted.push(file);
      else {
        const message = reason === "type"
          ? "Tipo de arquivo não permitido."
          : reason === "size"
            ? "O arquivo excede o tamanho máximo permitido."
            : "Quantidade máxima de arquivos excedida.";
        rejected.push({ file, reason, message });
      }
    });
    if (!multiple && accepted.length > 1) accepted.splice(1);
    if (accepted.length) onFilesAccepted?.(accepted);
    if (rejected.length) onFilesRejected?.(rejected);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) processFiles(event.target.files);
    event.target.value = "";
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    processFiles(event.dataTransfer.files);
  };
  const message = error || hint;

  return (
    <div
      onDragEnter={(event) => { event.preventDefault(); if (!disabled) setIsDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => { if (event.currentTarget === event.target) setIsDragging(false); }}
      onDrop={handleDrop}
      className={classNames(
        "flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed p-6 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        isDragging ? "border-action-primary bg-primary-1/10" : "border-border-default bg-surface-card hover:border-border-strong",
        disabled && "cursor-not-allowed opacity-60",
        Boolean(error) && "border-field-border-error",
        className,
      )}
    >
      <label htmlFor={inputId} className="flex cursor-pointer flex-col items-center focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring">
        <span className="font-semibold text-content-primary">{label}</span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          aria-describedby={message ? messageId : undefined}
          className="sr-only"
        />
      </label>
      {message && <span id={messageId} className={classNames("mt-1 text-sm", error ? "text-field-assistive-error" : "text-content-secondary")}>{message}</span>}
    </div>
  );
}

export default FileDropzone;
