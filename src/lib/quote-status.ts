export const QUOTE_STATUSES = ["new", "in_progress", "done"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  new: "Yeni",
  in_progress: "İşlemde",
  done: "Tamamlandı",
};
