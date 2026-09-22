"use client";

import classNames from "classnames";
import { useId, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { validateFiles, type FileRejection } from "./validation";

export type { FileRejection } from "./validation";

export interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  onFilesAccepted?: (files: File[]) => void;
  onFilesRejected?: (rejections: FileRejection[]) => void;
}

export function FileDropzone({
  accept,
  multiple = false,
  maxFiles = multiple ? Number.POSITIVE_INFINITY : 1,
  maxSize,
  disabled = false,
  id,
  name,
  required = false,
  label = "Selecionar arquivos",
  hint = "Arraste e solte os arquivos aqui ou use o teclado para selecionar.",
  error,
  className,
  onFilesAccepted,
  onFilesRejected,
}: FileDropzoneProps) {
  const generatedInputId = useId();
  const inputId = id ?? generatedInputId;
  const messageId = `${inputId}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState<string>();

  const processFiles = (fileList: FileList | File[]) => {
    if (disabled) return;
    const { accepted, rejected } = validateFiles(fileList, {
      accept,
      maxFiles,
      maxSize,
      multiple,
    });
    setRejectionMessage(rejected.length ? rejected.map((item) => item.message).join(" ") : undefined);
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
  const hasError = Boolean(error || rejectionMessage);
  const message = error || rejectionMessage || hint;

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
        hasError && "border-field-border-error",
        className,
      )}
    >
      <label htmlFor={inputId} className="flex cursor-pointer flex-col items-center focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring">
        <span className="font-semibold text-content-primary">{label}</span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          onChange={handleInputChange}
          aria-describedby={message ? messageId : undefined}
          aria-invalid={hasError ? true : undefined}
          className="sr-only"
        />
      </label>
      {message && <span id={messageId} role={hasError ? "alert" : undefined} className={classNames("mt-1 text-sm", hasError ? "text-field-assistive-error" : "text-content-secondary")}>{message}</span>}
    </div>
  );
}

export default FileDropzone;
