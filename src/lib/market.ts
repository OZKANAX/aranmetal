import "server-only";

/**
 * Alt piyasa şeridi verisi: Metals.Dev API (LME endüstriyel metaller, USD/ton) ve döviz kurları.
 * Tek istek tüm metalleri ve kurları döndürür. Sonuç sunucuda önbelleğe alınır; varsayılan
 * yenileme 8 saattir (ayda ~90 istek, ücretsiz plan 100). MARKET_REVALIDATE_SECONDS ile değiştirilebilir.
 */

export type MarketItem = {
  key: string;
  /** Sözlükteki etiket anahtarı (copper, aluminium, ...) */
  label: string;
  value: number;
  /** "metal" → USD/t, "fx" → kur */
  kind: "metal" | "fx";
};

export type MarketData = { items: MarketItem[]; updatedAt: string | null };

type LatestResponse = {
  status?: string;
  metals?: Record<string, number>;
  currencies?: Record<string, number>;
  timestamps?: { metal?: string; currency?: string };
};

const METALS: { key: string; label: string }[] = [
  { key: "lme_copper", label: "copper" },
  { key: "lme_aluminum", label: "aluminium" },
  { key: "lme_nickel", label: "nickel" },
  { key: "lme_zinc", label: "zinc" },
  { key: "lme_lead", label: "lead" },
];

const REVALIDATE = Number(process.env.MARKET_REVALIDATE_SECONDS) || 8 * 60 * 60;

export async function getMarketData(): Promise<MarketData | null> {
  const key = process.env.METALS_DEV_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `${process.env.METALS_DEV_BASE_URL ?? "https://api.metals.dev"}/v1/latest?api_key=${encodeURIComponent(key)}&currency=USD&unit=mt`,
      { headers: { Accept: "application/json" }, next: { revalidate: REVALIDATE, tags: ["market"] } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as LatestResponse;
    if (data.status && data.status !== "success") return null;

    const items: MarketItem[] = [];
    for (const m of METALS) {
      const v = data.metals?.[m.key];
      if (typeof v === "number" && v > 0) items.push({ key: m.key, label: m.label, value: v, kind: "metal" });
    }

    // Kurlar "1 birim döviz = x USD" olarak gelir
    const c = data.currencies ?? {};
    if (c.TRY > 0) items.push({ key: "usdtry", label: "USD/TRY", value: 1 / c.TRY, kind: "fx" });
    if (c.TRY > 0 && c.EUR > 0) items.push({ key: "eurtry", label: "EUR/TRY", value: c.EUR / c.TRY, kind: "fx" });
    if (c.EUR > 0) items.push({ key: "eurusd", label: "EUR/USD", value: c.EUR, kind: "fx" });

    if (items.length === 0) return null;
    return { items, updatedAt: data.timestamps?.metal ?? null };
  } catch {
    return null;
  }
}
