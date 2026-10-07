import type { Locale } from "@/i18n/config";

export type Purity = {
  /** Element simgesi, örn. "Cu" */
  element: string;
  /** Sayısal değer, örn. "99.9935" */
  value: string;
  /** Parantez içi ek bilgi, örn. "101% IACS" */
  note: string;
};

/** "Cu ≥ %99.9935 (101% IACS)" gibi bir saflık metnini parçalar; sayısal değilse null. */
export function parsePurity(raw: string): Purity | null {
  const m = raw.match(/^\s*([A-Z][a-z]?)\s*(?:≥|>=)\s*%?\s*([\d.,]+)\s*%?\s*(?:\((.*)\))?\s*$/);
  if (!m) return null;
  return { element: m[1], value: m[2], note: m[3] ?? "" };
}

/** Yüzde işaretini dile göre yerleştirir: TR "%99.70", EN "99.70%". */
export function percent(value: string, locale: Locale) {
  return locale === "tr" ? `%${value}` : `${value}%`;
}

/** Saflık metnini dile uygun biçimde yeniden yazar: "Cu ≥ 99.9935%". */
export function formatPurity(raw: string, locale: Locale) {
  const p = parsePurity(raw);
  if (!p) return raw;
  return `${p.element} ≥ ${percent(p.value, locale)}${p.note ? ` (${p.note})` : ""}`;
}
