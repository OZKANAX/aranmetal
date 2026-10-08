"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { MarketData } from "@/lib/market";

type Labels = {
  brand: string;
  note: string;
  updated: string;
  unit: string;
  metals: Record<string, string>;
};

/**
 * Ekranın altına sabit piyasa şeridi: solda marka ve kaynak notu, ortada akan LME fiyatları
 * (USD/ton) ve kurlar, sağda İstanbul saati. Veri sunucuda alınır ve önbelleğe konur;
 * bu bileşen yalnız gösterir. Üzerine gelince akış durur; hareketi azalt tercihinde akmaz.
 */
export function MarketTicker({ locale, data, labels }: { locale: Locale; data: MarketData; labels: Labels }) {
  const tag = locale === "tr" ? "tr-TR" : "en-GB";
  const metal = new Intl.NumberFormat(tag, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fx = new Intl.NumberFormat(tag, { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  const updated = data.updatedAt
    ? new Date(data.updatedAt).toLocaleString(tag, {
        timeZone: "Europe/Istanbul",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const items = data.items.map((it) => (
    <li key={it.key} className="flex items-baseline gap-2 px-5 whitespace-nowrap border-r border-graphite-rule">
      <span className="text-[0.6875rem] text-on-navy-2">
        {it.kind === "metal" ? `LME ${labels.metals[it.label] ?? it.label}` : it.label}
      </span>
      <span className="font-mono text-[0.75rem] text-white tnum">
        {it.kind === "metal" ? metal.format(it.value) : fx.format(it.value)}
      </span>
      {it.kind === "metal" && <span className="font-mono text-[0.625rem] text-steel">{labels.unit}</span>}
    </li>
  ));

  return (
    <aside
      aria-label={labels.brand}
      className="fixed inset-x-0 bottom-0 z-40 flex h-[var(--ticker-h)] items-stretch bg-graphite/95 border-t border-graphite-rule text-on-navy-2"
    >
      <div className="hidden md:flex shrink-0 flex-col justify-center pl-4 sm:pl-8 lg:pl-12 pr-5 border-r border-graphite-rule">
        <span className="flex items-center gap-2 font-mono text-[0.625rem] text-gold whitespace-nowrap">
          <span aria-hidden="true" className="w-1.5 h-1.5 bg-gold" />
          {labels.brand}
        </span>
        <span className="font-mono text-[0.5625rem] text-steel whitespace-nowrap">
          {labels.note}
          {updated ? ` · ${labels.updated} ${updated}` : ""}
        </span>
      </div>

      {/* Akan liste: aynı liste iki kez dizilir, yarısı kadar kaydırılınca kesintisiz döner */}
      <div className="market-marquee relative min-w-0 flex-1 overflow-hidden">
        <div className="market-track flex h-full w-max items-center">
          <ul className="flex items-center">{items}</ul>
          <ul className="flex items-center" aria-hidden="true">
            {items}
          </ul>
        </div>
      </div>

      <IstanbulClock locale={locale} />
    </aside>
  );
}

/** İstanbul saati (Europe/Istanbul). Sunucuda boş çizilir, istemcide saniyede bir güncellenir. */
function IstanbulClock({ locale }: { locale: Locale }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  const tag = locale === "tr" ? "tr-TR" : "en-GB";
  const time = now?.toLocaleTimeString(tag, { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now?.toLocaleDateString(tag, { timeZone: "Europe/Istanbul", day: "2-digit", month: "short", weekday: "short" });

  return (
    <div className="hidden sm:flex shrink-0 items-center gap-3 pl-5 pr-4 sm:pr-8 lg:pr-12 border-l border-graphite-rule font-mono text-[0.6875rem] whitespace-nowrap">
      <span className="text-steel uppercase">{date ?? "—"}</span>
      <time className="tnum text-white min-w-[4.6rem]">{time ?? "--:--:--"}</time>
      <span className="text-steel">IST</span>
    </div>
  );
}
