"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "./motion";

type Labels = {
  title: string;
  intro: string;
  copper: string;
  aluminium: string;
  copperContract: string;
  aluminiumContract: string;
  caption: string;
  marker: string;
  steps: { term: string; text: string }[];
  result: string;
  resultText: string;
};

const W = 1200;
const H = 300;
const POINTS = 72;
const STEP = W / (POINTS - 1);

/** Tohumlu sözde rastgele üreteç: sunucu ve istemci aynı eğriyi çizer. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ortalamaya dönen rastgele yürüyüş: temsili bir piyasa çizgisi (gerçek veri değildir). */
function makeSeries(seed: number, vol: number) {
  const rnd = mulberry32(seed);
  let v = 0.5;
  let drift = 0;
  const next = () => {
    drift = drift * 0.86 + (rnd() - 0.5) * vol;
    v += drift + (0.5 - v) * 0.04;
    v = Math.min(0.9, Math.max(0.1, v));
    return v;
  };
  const initial = Array.from({ length: POINTS + 1 }, next);
  return { initial, next };
}

function toPath(values: number[]) {
  return values.map((v, i) => `${i === 0 ? "M" : "L"}${(i * STEP).toFixed(1)} ${(H - v * H).toFixed(1)}`).join("");
}

/**
 * LME bölümü: fiyatın nasıl kurulduğunu anlatır. Çizgi temsilidir ve öyle etiketlenir;
 * sitede hiçbir fiyat rakamı gösterilmez. Görünürken çizgi yavaşça ilerler.
 */
export function LmeSection({ labels }: { labels: Labels }) {
  const [metal, setMetal] = useState<"copper" | "aluminium">("copper");
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(chartRef, { once: true, margin: "0px 0px -20% 0px" });
  const visible = useInView(chartRef);
  const [drawn, setDrawn] = useState(false);

  const seriesMaker = useMemo(
    () => ({ copper: makeSeries(7, 0.055), aluminium: makeSeries(31, 0.04) }),
    [],
  );
  const [values, setValues] = useState(() => seriesMaker.copper.initial);

  // Metal değişince çizgiyi yeniden çiz
  const [lastMetal, setLastMetal] = useState(metal);
  if (lastMetal !== metal) {
    setLastMetal(metal);
    setValues(seriesMaker[metal].initial);
    setDrawn(false);
  }

  useEffect(() => {
    if (!seen || drawn) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    return () => cancelAnimationFrame(id);
  }, [seen, drawn]);

  // Canlı his: görünürken çizgi bir adım sola kayar, yeni nokta eklenir
  useEffect(() => {
    if (reduced || !visible || !drawn) return;
    const g = groupRef.current;
    if (!g) return;
    let timer = 0;
    const tick = () => {
      g.style.transition = "transform 2400ms linear";
      g.style.transform = `translateX(${-STEP}px)`;
      timer = window.setTimeout(() => {
        g.style.transition = "none";
        g.style.transform = "translateX(0)";
        setValues((prev) => [...prev.slice(1), seriesMaker[metal].next()]);
        timer = window.setTimeout(tick, 40);
      }, 2400);
    };
    timer = window.setTimeout(tick, 2200);
    return () => {
      window.clearTimeout(timer);
      g.style.transition = "none";
      g.style.transform = "translateX(0)";
    };
  }, [reduced, visible, drawn, metal, seriesMaker]);

  const path = toPath(values);
  const contract = metal === "copper" ? labels.copperContract : labels.aluminiumContract;

  return (
    <section ref={sectionRef} aria-labelledby="lme-title" className="bg-paper text-ink section-y overflow-hidden">
      <div className="page-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6">
          <h2 id="lme-title" className="lg:col-span-7 font-display text-title text-ink max-w-[16ch]">
            {labels.title}
          </h2>
          <p className="lg:col-span-4 lg:col-start-9 self-end text-body text-ink-2 max-w-[56ch]">{labels.intro}</p>
        </div>

        {/* Metal seçimi */}
        <div className="mt-14 lg:mt-20 flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-4">
          <div role="radiogroup" aria-label={labels.title} className="flex">
            {(["copper", "aluminium"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={metal === m}
                onClick={() => setMetal(m)}
                className={`h-10 px-4 -ml-px first:ml-0 border text-small font-semibold transition-colors duration-200 ${
                  metal === m ? "bg-ink border-ink text-paper" : "border-rule-strong text-ink-2 hover:text-ink hover:border-ink"
                }`}
              >
                {m === "copper" ? labels.copper : labels.aluminium}
              </button>
            ))}
          </div>
          <p key={contract} className="figure-in font-mono text-data text-ink-2">
            {contract}
          </p>
        </div>

        {/* Temsili piyasa çizgisi */}
        <div ref={chartRef} className="relative mt-2">
          <svg
            data-drawn={drawn}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="lme-reveal block w-full h-[180px] sm:h-[240px] lg:h-[300px]"
            role="img"
            aria-label={`${contract}. ${labels.caption}`}
          >
            {[0.25, 0.5, 0.75].map((y) => (
              <line key={y} x1="0" x2={W} y1={H * y} y2={H * y} stroke="var(--color-rule)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
            <g ref={groupRef}>
              <path
                key={metal}
                d={path}
                fill="none"
                stroke={metal === "copper" ? "var(--color-copper)" : "var(--color-ink-2)"}
                strokeWidth="2"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            {/* Sağ kenar: sipariş günü */}
            <line x1={W} x2={W} y1="0" y2={H} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="font-mono text-data text-ink-3">{labels.caption}</p>
          <p className="font-mono text-data text-ink">{labels.marker}</p>
        </div>

        {/* Fiyatın kuruluşu */}
        <ol className="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1.15fr] items-stretch">
          {labels.steps.map((s, i) => (
            <PriceTerm key={s.term} term={s.term} text={s.text} operator={i === 0 ? null : "+"} />
          ))}
          <li className="contents">
            <Operator symbol="=" />
            <div className="border-t-2 border-ink pt-5 pb-2">
              <p className="font-display text-subheading font-[800] text-ink">{labels.result}</p>
              <p className="mt-3 text-small text-ink-2 max-w-[34ch]">{labels.resultText}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

function PriceTerm({ term, text, operator }: { term: string; text: string; operator: string | null }) {
  return (
    <li className="contents">
      {operator && <Operator symbol={operator} />}
      <div className="border-t border-ink pt-5 pb-2">
        <p className="font-display text-subheading text-ink">{term}</p>
        <p className="mt-3 text-small text-ink-2 max-w-[34ch]">{text}</p>
      </div>
    </li>
  );
}

function Operator({ symbol }: { symbol: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex items-center lg:items-start justify-start lg:justify-center py-3 lg:py-0 lg:pt-4 lg:px-5 xl:px-8 font-display text-[2rem] leading-none font-light text-ink-3"
    >
      {symbol}
    </span>
  );
}
