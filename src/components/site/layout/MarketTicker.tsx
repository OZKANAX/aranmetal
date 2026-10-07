"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

// TradingView'in ücretsiz gömülü şeridinde veri veren semboller (COMEX ve LME semboller ücretsiz gömmede kapalı).
// Bunlar broker CFD kotasyonlarıdır; LME resmi fiyatı değildir ve gecikmeli olabilir.
const SYMBOLS = {
  tr: [
    { proName: "CAPITALCOM:COPPER", title: "Bakır · USD/lb" },
    { proName: "CAPITALCOM:ALUMINUM", title: "Alüminyum · USD/t" },
    { proName: "CAPITALCOM:NICKEL", title: "Nikel · USD/t" },
    { proName: "FX_IDC:USDTRY", title: "USD/TRY" },
    { proName: "FX_IDC:EURTRY", title: "EUR/TRY" },
    { proName: "FX:EURUSD", title: "EUR/USD" },
  ],
  en: [
    { proName: "CAPITALCOM:COPPER", title: "Copper · USD/lb" },
    { proName: "CAPITALCOM:ALUMINUM", title: "Aluminium · USD/t" },
    { proName: "CAPITALCOM:NICKEL", title: "Nickel · USD/t" },
    { proName: "FX_IDC:USDTRY", title: "USD/TRY" },
    { proName: "FX_IDC:EURTRY", title: "EUR/TRY" },
    { proName: "FX:EURUSD", title: "EUR/USD" },
  ],
};

/**
 * Ekranın altına sabit piyasa şeridi: solda marka etiketi ve "gecikmeli referans" notu,
 * ortada TradingView ticker tape, sağda İstanbul saati. Widget tarayıcı boştayken yüklenir.
 */
export function MarketTicker({ locale, label, note }: { locale: Locale; label: string; note: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const load = () => {
      if (host.querySelector("script")) return;
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: SYMBOLS[locale],
        showSymbolLogo: false,
        isTransparent: true,
        displayMode: "compact",
        colorTheme: "dark",
        locale: locale === "tr" ? "tr" : "en",
      });
      host.appendChild(script);
    };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const id = idle(load);
    return () => {
      if (window.cancelIdleCallback && typeof id === "number") window.cancelIdleCallback(id);
      host.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
    };
  }, [locale]);

  return (
    <aside
      aria-label={label}
      className="fixed inset-x-0 bottom-0 z-40 flex h-[var(--ticker-h)] items-stretch bg-graphite/95 border-t border-graphite-rule text-on-navy-2"
    >
      <div className="hidden md:flex shrink-0 flex-col justify-center pl-4 sm:pl-8 lg:pl-12 pr-5 border-r border-graphite-rule">
        <span className="flex items-center gap-2 font-mono text-[0.625rem] text-gold whitespace-nowrap">
          <span aria-hidden="true" className="w-1.5 h-1.5 bg-gold" />
          {label}
        </span>
        <span className="font-mono text-[0.5625rem] text-steel whitespace-nowrap">{note}</span>
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div ref={ref} className="tradingview-widget-container h-[var(--ticker-h)]">
          <div className="tradingview-widget-container__widget" />
        </div>
      </div>
      <IstanbulClock locale={locale} />
    </aside>
  );
}

/** İstanbul saati (Europe/Istanbul). Sunucuda boş çizilir, istemcide dakikada bir değil saniyede bir güncellenir. */
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
