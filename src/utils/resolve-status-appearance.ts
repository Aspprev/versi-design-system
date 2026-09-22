export type StatusDomain =
  | "generic"
  | "beneficiary"
  | "document"
  | "loan"
  | "benefit"
  | "signature"
  | "participation"
  | "claim"
  | "payment"
  | "protocol"
  | "request";

export type StatusTone = "info" | "warning" | "success" | "danger" | "neutral";
export type StatusAppearance = "outline" | "soft" | "solid";

export interface ResolvedStatusAppearance {
  tone: StatusTone;
  appearance: StatusAppearance;
}

/**
 * Map owned by the consuming application. Keys are normalized with
 * `normalizeStatus` before lookup, so accented and differently-cased labels
 * can be used safely by consumers.
 */
export type StatusAppearanceMap = Readonly<
  Record<string, ResolvedStatusAppearance>
>;

export interface StatusResolverOptions {
  map?: StatusAppearanceMap;
  fallback?: ResolvedStatusAppearance;
}

const NORMALIZED_STATUS = {
  infoOutline: new Set(["ABERTO", "PAGO", "EM PAGAMENTO"]),
  infoSolid: new Set([
    "EM ANDAMENTO",
    "SOLICITADO",
    "NAO ASSINADO",
    "AGUARDANDO ASSINATURA",
  ]),
  warning: new Set([
    "EM ANALISE",
    "PENDENTE",
    "SUSPENSO",
    "AGUARDANDO PARTICIPANTE",
  ]),
  success: new Set([
    "DEFERIDO",
    "QUITADO",
    "LIBERADO",
    "ATIVO",
    "VIGENTE",
    "RESPONDIDO",
    "ASSINADO",
  ]),
  danger: new Set(["INDEFERIDO", "VENCIDO", "CANCELADO", "ERRO"]),
  neutral: new Set([
    "CONCLUIDO",
    "ENCERRADO",
    "FINALIZADO",
    "RENEGOCIADO",
    "INATIVO",
  ]),
};

export const normalizeStatus = (status: unknown): string =>
  String(status ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const resolveGenericStatus = (status: string): ResolvedStatusAppearance => {
  if (NORMALIZED_STATUS.infoOutline.has(status)) {
    return { tone: "info", appearance: "outline" };
  }
  if (NORMALIZED_STATUS.infoSolid.has(status)) {
    return { tone: "info", appearance: "solid" };
  }
  if (NORMALIZED_STATUS.warning.has(status)) {
    return { tone: "warning", appearance: "soft" };
  }
  if (NORMALIZED_STATUS.success.has(status)) {
    return { tone: "success", appearance: "solid" };
  }
  if (NORMALIZED_STATUS.danger.has(status)) {
    return { tone: "danger", appearance: "solid" };
  }
  if (NORMALIZED_STATUS.neutral.has(status)) {
    return { tone: "neutral", appearance: "solid" };
  }
  return { tone: "neutral", appearance: "outline" };
};

export const resolveStatusAppearance = (
  status: unknown,
  domain: StatusDomain = "generic",
  options?: StatusResolverOptions,
): ResolvedStatusAppearance => {
  const normalized = normalizeStatus(status);

  if (!normalized) {
    return options?.fallback ?? { tone: "neutral", appearance: "outline" };
  }

  const mappedAppearance = options?.map
    ? Object.entries(options.map).find(
        ([key]) => normalizeStatus(key) === normalized,
      )?.[1]
    : undefined;

  if (mappedAppearance) return mappedAppearance;

  if (domain === "beneficiary") {
    if (normalized === "VIGENTE") return { tone: "success", appearance: "solid" };
    if (normalized === "ENCERRADO") return { tone: "neutral", appearance: "solid" };
  }

  if (domain === "document") {
    if (["ANEXADO", "ASSINADO", "CONCLUIDO"].includes(normalized)) {
      return { tone: "success", appearance: "solid" };
    }
    if (normalized.includes("AGUARDANDO") || normalized === "PENDENTE") {
      return { tone: "warning", appearance: "soft" };
    }
    if (normalized === "BLOQUEADO") return { tone: "neutral", appearance: "solid" };
  }

  if (domain === "signature") {
    if (normalized === "ASSINADO") return { tone: "success", appearance: "solid" };
    if (normalized.includes("AGUARDANDO")) return { tone: "warning", appearance: "soft" };
    if (normalized === "NAO ASSINADO") return { tone: "info", appearance: "solid" };
  }

  if (domain === "benefit") {
    if (normalized === "EM PAGAMENTO") return { tone: "info", appearance: "outline" };
    if (normalized === "SUSPENSO") return { tone: "warning", appearance: "soft" };
  }

  if (domain === "participation") {
    return { tone: "neutral", appearance: "solid" };
  }

  if (domain === "payment") {
    if (["PAGO", "QUITADO", "LIBERADO"].includes(normalized)) {
      return { tone: "success", appearance: "solid" };
    }
    if (["EM PAGAMENTO", "AGUARDANDO PAGAMENTO"].includes(normalized)) {
      return { tone: "info", appearance: "outline" };
    }
    if (["VENCIDO", "ESTORNADO", "FALHOU"].includes(normalized)) {
      return { tone: "danger", appearance: "solid" };
    }
  }

  if (domain === "claim" || domain === "request" || domain === "protocol") {
    if (["RECEBIDO", "PROTOCOLADO", "EMITIDO"].includes(normalized)) {
      return { tone: "info", appearance: "outline" };
    }
    if (["EM ANALISE", "AGUARDANDO DOCUMENTACAO", "AGUARDANDO ANALISE"].includes(normalized)) {
      return { tone: "warning", appearance: "soft" };
    }
    if (["APROVADO", "CONCEDIDO", "ATENDIDO"].includes(normalized)) {
      return { tone: "success", appearance: "solid" };
    }
    if (["NEGADO", "ARQUIVADO", "RECUSADO"].includes(normalized)) {
      return { tone: "danger", appearance: "solid" };
    }
  }

  return options?.fallback ?? resolveGenericStatus(normalized);
};
