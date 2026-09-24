export type FileValidationReason =
  | "type"
  | "size"
  | "count"
  | "empty"
  | "invalid";

export interface FileRejectionContext {
  code: FileValidationReason;
  fileName: string;
  extension: string;
  size: number;
  maxSize?: number;
}

export type FileValidationMessage =
  | string
  | ((context: FileRejectionContext) => string);

export interface FileRejection {
  file: File;
  code: FileValidationReason;
  reason: FileValidationReason;
  fileName: string;
  extension: string;
  size: number;
  maxSize?: number;
  message: string;
}

export interface FileValidationOptions {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  messages?: Partial<Record<FileValidationReason, FileValidationMessage>>;
}

export interface FileValidationResult {
  accepted: File[];
  rejected: FileRejection[];
}

function acceptsFile(file: File, accept?: string) {
  if (!accept?.trim()) return true;

  return accept
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .some((rule) => {
      if (rule.endsWith("/*")) {
        return file.type.toLowerCase().startsWith(rule.slice(0, -1));
      }
      if (rule.startsWith(".")) {
        return file.name.toLowerCase().endsWith(rule);
      }
      return file.type.toLowerCase() === rule;
    });
}

function getExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.trim().toLowerCase();
  return extension && extension !== fileName.toLowerCase() ? extension : "";
}

function rejectionMessage(
  reason: FileValidationReason,
  context: FileRejectionContext,
  messages?: FileValidationOptions["messages"],
) {
  const customMessage = messages?.[reason];
  if (typeof customMessage === "function") return customMessage(context);
  if (typeof customMessage === "string") return customMessage;
  if (reason === "type") return "Tipo de arquivo não permitido.";
  if (reason === "size") return "O arquivo excede o tamanho máximo permitido.";
  if (reason === "empty") return "O arquivo está vazio.";
  if (reason === "invalid") return "O arquivo não é válido.";
  return "Quantidade máxima de arquivos excedida.";
}

function normalizeMaxFiles(options: FileValidationOptions) {
  if (options.multiple === false) return 1;
  if (options.maxFiles === undefined || !Number.isFinite(options.maxFiles)) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.max(1, Math.floor(options.maxFiles));
}

function normalizeMaxSize(maxSize?: number) {
  if (maxSize === undefined || !Number.isFinite(maxSize)) return undefined;
  return Math.max(0, maxSize);
}

export function validateFiles(
  files: readonly File[] | FileList,
  options: FileValidationOptions = {},
): FileValidationResult {
  const selected = Array.from(files);
  const maxFiles = normalizeMaxFiles(options);
  const maxSize = normalizeMaxSize(options.maxSize);
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];

  selected.forEach((file, index) => {
    const isInvalid =
      !file ||
      typeof file.name !== "string" ||
      !file.name.trim() ||
      typeof file.size !== "number" ||
      !Number.isFinite(file.size) ||
      file.size < 0;
    const reason: FileValidationReason | undefined = isInvalid
      ? "invalid"
      : file.size === 0
        ? "empty"
        : !acceptsFile(file, options.accept)
          ? "type"
          : maxSize !== undefined && file.size > maxSize
            ? "size"
            : index >= maxFiles
              ? "count"
              : undefined;

    if (reason) {
      const fileName = typeof file?.name === "string" ? file.name : "";
      const size = typeof file?.size === "number" && Number.isFinite(file.size)
        ? file.size
        : 0;
      const context: FileRejectionContext = {
        code: reason,
        fileName,
        extension: getExtension(fileName),
        size,
        maxSize,
      };
      rejected.push({
        file,
        ...context,
        reason,
        message: rejectionMessage(reason, context, options.messages),
      });
    } else {
      accepted.push(file);
    }
  });

  return { accepted, rejected };
}
