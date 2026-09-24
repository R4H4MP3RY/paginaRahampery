export const quoteStatuses = ["nueva", "en_proceso", "cotizada", "cerrada", "descartada"] as const;
export type QuoteStatus = (typeof quoteStatuses)[number];

export const statusLabels: Record<QuoteStatus, string> = {
  nueva: "Nueva",
  en_proceso: "En proceso",
  cotizada: "Cotizada",
  cerrada: "Cerrada",
  descartada: "Descartada",
};
