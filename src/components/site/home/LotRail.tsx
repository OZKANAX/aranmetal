"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { parsePurity } from "@/lib/purity";
import { Icon } from "../ui/Icon";
import { useMedia, useReducedMotion, useScrollProgress } from "./motion";

export type RailProduct = {
  slug: string;
  name: string;
  subtitle: string;
  code: string;
  badge: string | null;
  image: string;
  /** CSS object-position, örn. "80% 50%" */
  focus?: string;
  inStock: boolean;
  purity: string;
  material: string;
  form: string;
  unit: string;
  quoteHref: string;
  detailHref: string;
};

type Labels = {
  title: string;
  intro: string;
  specTable: string;
  specTableHref: string;
  request: string;
  details: string;
  prev: string;
  next: string;
  minimum: string;
  material: string;
  form: string;
  unit: string;
  stock: string;
  inStock: string;
  outOfStock: string;
  code: string;
  purity: string;
  grade: string;
};

/**
 * Parti şeridi: her kare bir malzeme. Masaüstünde dikey kaydırma şeridi yatay taşır
 * (bölüm yapışkan kalır, kareler sabit adımla geçer). Mobilde ve hareketi azalt
 * tercihinde aynı şerit, kullanıcının kaydırdığı yatay bir listeye dönüşür.
 */
export function LotRail({ id, products, labels, locale }: { id: string; products: RailProduct[]; labels: Labels; locale: Locale }) {
  const n = products.length;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const wide = useMedia("(min-width: 1024px)");
  const pinned = wide && !reduced && n > 1;
  const [active, setActive] = useState(0);

  // Yapışkan mod: kaydırma ilerlemesi şeridi yatay taşır
  const onProgress = useCallback(
    (p: number) => {
      const track = trackRef.current;
      if (!track) return;
      track.style.transform = `translate3d(${(-p * (n - 1) * 100).toFixed(3)}vw,0,0)`;
      setActive(Math.min(n - 1, Math.round(p * (n - 1))));
    },
    [n],
  );
  useScrollProgress(sectionRef, onProgress, { enabled: pinned, mode: "pin" });

  // Yapışkan mod: kaydırma durduğunda şerit en yakın kareye oturur (kareler arasında kalmaz)
  useEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    if (!section) return;
    let timer = 0;
    const settle = () => {
      const r = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      const p = -r.top / span;
      if (p <= 0.002 || p >= 0.998) return;
      const target = Math.round(p * (n - 1)) / (n - 1);
      const delta = (target - p) * span;
      if (Math.abs(delta) > 3) window.scrollBy({ top: delta, behavior: "smooth" });
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [pinned, n]);

  // Serbest mod: liste kaydırıldıkça etkin kareyi bul
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (pinned) return;
    track.style.transform = "";
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const first = track.firstElementChild as HTMLElement | null;
        const w = first?.offsetWidth ?? track.clientWidth;
        setActive(Math.min(n - 1, Math.max(0, Math.round(track.scrollLeft / w))));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pinned, n]);

  const goTo = (i: number) => {
    const idx = Math.min(n - 1, Math.max(0, i));
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (pinned) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const span = section.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + (span * idx) / (n - 1), behavior: "smooth" });
    } else {
      const frame = track.children[idx] as HTMLElement | undefined;
      track.scrollTo({ left: frame?.offsetLeft ?? 0, behavior: reduced ? "auto" : "smooth" });
    }
  };

  if (n === 0) return null;

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative bg-graphite text-white"
      style={pinned ? { height: `${n * 100}vh` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-[calc(100vh-var(--ticker-h))] flex-col overflow-hidden pt-[var(--nav-h)]" : "flex flex-col"}>
        {/* Bölüm başlığı ve şerit kontrolleri */}
        <div className={`page-x grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6 ${pinned ? "pt-8 pb-6" : "pt-20 lg:pt-28 pb-10"}`}>
          <div className="lg:col-span-6">
            <h2 id={`${id}-title`} className={`font-display text-white ${pinned ? "text-heading" : "text-title"}`}>
              {labels.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-end gap-4">
            <p className="text-body text-on-navy-2 max-w-[52ch]">{labels.intro}</p>
            <Link href={labels.specTableHref} className="group nav-line self-start inline-flex items-center gap-2 text-small font-semibold text-white">
              {labels.specTable}
              <Icon name="arrow_forward" className="arrow-nudge text-[17px] text-on-navy" />
            </Link>
          </div>
        </div>

        <div className="page-x flex items-center justify-between gap-6 border-t border-graphite-rule">
          <div role="tablist" aria-label={labels.title} className="flex gap-6 lg:gap-9 overflow-x-auto no-scrollbar -mb-px">
            {products.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-controls={`${id}-frame-${i}`}
                onClick={() => goTo(i)}
                className={`relative shrink-0 py-4 text-left transition-colors duration-200 ${active === i ? "text-white" : "text-steel hover:text-on-navy"}`}
              >
                <span className="block font-mono text-data">{p.code}</span>
                <span className="block text-small font-medium mt-0.5 whitespace-nowrap">{p.name}</span>
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 top-0 h-px bg-bone origin-left transition-transform duration-500 ease-out-quint ${active === i ? "scale-x-100" : "scale-x-0"}`}
                />
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <span className="font-mono text-data text-steel tnum" aria-live="polite">
              {active + 1} / {n}
            </span>
            <div className="flex">
              <RailButton label={labels.prev} icon="arrow_back" disabled={active === 0} onClick={() => goTo(active - 1)} />
              <RailButton label={labels.next} icon="arrow_forward" disabled={active === n - 1} onClick={() => goTo(active + 1)} />
            </div>
          </div>
        </div>

        {/* Şerit */}
        <div className={pinned ? "relative flex-1 min-h-0" : "relative"}>
          <div
            ref={trackRef}
            className={
              pinned
                ? "flex h-full will-change-transform"
                : "flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain no-scrollbar scroll-px-4 sm:scroll-px-8"
            }
          >
            {products.map((p, i) => (
              <LotFrame
                key={p.slug}
                id={`${id}-frame-${i}`}
                product={p}
                index={i}
                total={n}
                active={active === i}
                pinned={pinned}
                labels={labels}
                locale={locale}
              />
            ))}
            {!pinned && <div aria-hidden="true" className="w-4 sm:w-8 lg:w-12 shrink-0" />}
          </div>
        </div>
      </div>
    </section>
  );
}

function RailButton({ label, icon, disabled, onClick }: { label: string; icon: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="group w-11 h-11 flex items-center justify-center border border-graphite-rule -ml-px text-white hover:bg-white hover:text-ink disabled:text-graphite-rule disabled:hover:bg-transparent disabled:cursor-default transition-colors duration-200"
    >
      <Icon name={icon} className="text-[20px]" />
    </button>
  );
}

function LotFrame({
  id,
  product: p,
  index,
  total,
  active,
  pinned,
  labels,
  locale,
}: {
  id: string;
  product: RailProduct;
  index: number;
  total: number;
  active: boolean;
  pinned: boolean;
  labels: Labels;
  locale: Locale;
}) {
  const purity = parsePurity(p.purity);
  const plateRef = useRef<HTMLDivElement>(null);

  // İmleç ışığı: malzemeyi incelerken yüzeyde gezinen yansıma
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = plateRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.style.setProperty("--mxn", (x * 2 - 1).toFixed(3));
    el.style.setProperty("--myn", (y * 2 - 1).toFixed(3));
  };

  const rows = [
    { term: labels.material, value: p.material },
    { term: labels.form, value: p.form },
    { term: labels.unit, value: p.unit },
    { term: labels.stock, value: p.inStock ? labels.inStock : labels.outOfStock, optional: true },
  ].filter((r) => r.value);

  return (
    <article
      id={id}
      role="tabpanel"
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${total}: ${p.name}`}
      data-active={active}
      className={`lot-frame shrink-0 ${
        pinned ? "w-screen h-full" : "w-[88vw] sm:w-[78vw] lg:w-[72vw] snap-start first:ml-0"
      }`}
    >
      <div
        className={`h-full ${pinned ? "page-x grid grid-cols-12 gap-x-8 pt-8 pb-10" : "pl-4 sm:pl-8 lg:pl-12 pt-8 pb-16 flex flex-col gap-8"}`}
      >
        {/* Malzeme plakası */}
        <div
          ref={plateRef}
          onPointerMove={onPointerMove}
          className={`relative overflow-hidden bg-graphite-3 ${pinned ? "col-span-7 h-full" : "aspect-[4/3] sm:aspect-[16/10]"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            decoding="async"
            className="lot-frame__img absolute inset-0 h-full w-full object-cover"
            style={p.focus ? { objectPosition: p.focus } : undefined}
          />
          <div aria-hidden="true" className="lot-light absolute inset-0 pointer-events-none" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-graphite/60 via-transparent to-transparent" />
          {/* Parti etiketi malzemenin üzerine damgalanır: kod / saflık / sınıf */}
          <dl className="absolute left-4 bottom-4 lg:left-6 lg:bottom-6 border border-white/45 bg-graphite/80 font-mono text-data text-white">
            <div className="px-3 py-1.5 border-b border-white/25">
              <dt className="sr-only">{labels.code}</dt>
              <dd>{p.code}</dd>
            </div>
            <div className="flex divide-x divide-white/25">
              <div className="px-3 py-1.5">
                <dt className="sr-only">{labels.purity}</dt>
                <dd className="tnum">{purity ? `${purity.element} ${purity.value}` : p.purity}</dd>
              </div>
              {p.badge && (
                <div className="px-3 py-1.5 text-alu">
                  <dt className="sr-only">{labels.grade}</dt>
                  <dd>{p.badge}</dd>
                </div>
              )}
            </div>
          </dl>
        </div>

        {/* Parti etiketi */}
        <div className={`flex flex-col ${pinned ? "col-span-5 pl-2 xl:pl-6 justify-between min-h-0" : "pr-4 sm:pr-8"}`}>
          <div>
            <h3 className="font-display text-heading text-white">{p.name}</h3>
            {p.subtitle && <p className="lot-optional mt-1.5 text-small text-on-navy-2">{p.subtitle}</p>}

            <div className="mt-5 lg:mt-7">
              {purity ? (
                <>
                  <p className="font-display tnum text-[clamp(3rem,min(1.8rem+4vw,10vh),5.5rem)] leading-[0.9] tracking-[-0.035em] font-[760] text-white">
                    {locale === "tr" && <span className="text-[0.42em] align-top text-steel mr-1">%</span>}
                    {purity.value}
                    {locale !== "tr" && <span className="text-[0.42em] align-top text-steel ml-1">%</span>}
                  </p>
                  <p className="mt-3 font-mono text-data text-steel">
                    {purity.element} · {labels.minimum}
                    {purity.note ? ` · ${purity.note}` : ""} · {p.code}
                  </p>
                </>
              ) : (
                <p className="font-display text-[clamp(2rem,1.4rem+2vw,3rem)] leading-none tracking-[-0.03em] font-[740] text-white">
                  {p.purity}
                </p>
              )}
            </div>
          </div>

          <div>
            <dl className="mt-8 lg:mt-6">
              {rows.map((r) => (
                <div key={r.term} className={`lot-spec-row ${"optional" in r ? "lot-optional" : ""} grid grid-cols-[8.5rem_1fr] gap-4 py-2.5 border-t border-graphite-rule/70 text-small`}>
                  <dt className="text-steel">{r.term}</dt>
                  <dd className="text-on-navy transition-colors duration-200">{r.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link
                href={p.quoteHref}
                tabIndex={pinned && !active ? -1 : undefined}
                className="group btn-copper inline-flex h-12 items-center gap-2.5 px-5 text-small font-semibold"
              >
                {labels.request}
                <Icon name="arrow_forward" className="arrow-nudge text-[18px]" />
              </Link>
              <Link
                href={p.detailHref}
                tabIndex={pinned && !active ? -1 : undefined}
                className="group nav-line inline-flex items-center gap-2 text-small font-semibold text-white"
              >
                {labels.details}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
