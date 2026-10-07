"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAP_H, MAP_W, project } from "./map-geometry";
import { useInView, useReducedMotion, useScrollProgress } from "./motion";

type Region = { id: string; name: string; note: string };
type Labels = {
  title: string;
  intro: string;
  hub: string;
  hubNote: string;
  caption: string;
  regions: Region[];
  chain: { term: string; text: string }[];
};

const HUB: [number, number] = [28.98, 41.01];
// Pazarların temsili noktaları (boylam, enlem)
const REGION_POINTS: Record<string, [number, number]> = {
  europe: [9.5, 49.5],
  "middle-east": [46.7, 24.7],
  "north-africa": [7.5, 33.2],
  "central-asia": [66.0, 41.3],
};

function arc(from: [number, number], to: [number, number]) {
  const [x1, y1] = project(...from);
  const [x2, y2] = project(...to);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  // Kontrol noktası: rota orta noktasından dik yönde, yukarı doğru kavis
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bend = len * 0.2;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${(mx + nx * bend).toFixed(1)} ${(my + ny * bend).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

const pct = ([x, y]: [number, number]) => ({ left: `${(x / MAP_W) * 100}%`, top: `${(y / MAP_H) * 100}%` });

/**
 * Tedarik ve lojistik: İstanbul merkezinden dört pazara uzanan rotalar (harita) ve
 * kaynaktan müşteriye zincir. Bakır çizgi kaydırma ile zincir boyunca ilerler.
 */
export function SupplyRoute({ labels }: { labels: Labels }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const chainRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(mapRef, { once: true, margin: "0px 0px -25% 0px" });
  const visible = useInView(mapRef);
  const [active, setActive] = useState<string | null>(null);
  const [reached, setReached] = useState(reduced ? labels.chain.length : 0);

  // Harita dışarıdayken SMIL hareketini durdur
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (visible) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [visible]);

  const n = labels.chain.length;
  const onChain = useCallback(
    (p: number) => {
      // Zincir, bölüm görünür alanın ortasından geçerken dolar
      const t = Math.min(1, Math.max(0, (p - 0.3) / 0.35));
      chainRef.current?.style.setProperty("--chain", t.toFixed(3));
      setReached(Math.min(n, Math.floor(t * (n - 1) + 1.0001)));
    },
    [n],
  );
  useScrollProgress(chainRef, onChain, { enabled: !reduced });

  const hubXY = project(...HUB);
  const activeRegion = labels.regions.find((r) => r.id === active);

  return (
    <section aria-labelledby="route-title" className="bg-graphite text-white section-y overflow-hidden">
      <div className="page-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6">
          <h2 id="route-title" className="lg:col-span-6 font-display text-title text-white max-w-[14ch]">
            {labels.title}
          </h2>
          <p className="lg:col-span-4 lg:col-start-9 self-end text-body text-on-navy-2 max-w-[52ch]">{labels.intro}</p>
        </div>

        <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-8">
          {/* Harita */}
          <figure className="lg:col-span-9 m-0">
            <div
              ref={mapRef}
              data-routes={seen || reduced ? "drawn" : "idle"}
              className="relative w-full aspect-[1000/660] bg-[#1c1511] border border-graphite-rule overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/map-land.svg" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full" />
              <svg
                ref={svgRef}
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {/* 10° ızgara */}
                {Array.from({ length: 10 }, (_, i) => -10 + i * 10).map((lon) => {
                  const [x] = project(lon, 0);
                  return <line key={`lon${lon}`} x1={x} x2={x} y1={0} y2={MAP_H} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
                })}
                {[20, 30, 40, 50, 60].map((lat) => {
                  const [, y] = project(0, lat);
                  return <line key={`lat${lat}`} x1={0} x2={MAP_W} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
                })}

                {labels.regions.map((r, i) => {
                  const d = arc(HUB, REGION_POINTS[r.id] ?? HUB);
                  const dim = active && active !== r.id;
                  return (
                    <g key={r.id} style={{ opacity: dim ? 0.28 : 1, transition: "opacity 300ms var(--ease-out-quart)" }}>
                      <path
                        d={d}
                        pathLength={1}
                        className="route-path"
                        fill="none"
                        stroke="var(--color-copper-line)"
                        strokeWidth={active === r.id ? 2.2 : 1.4}
                        style={{ transitionDelay: `${0.15 + i * 0.18}s` }}
                      />
                      {!reduced && (
                        <rect width="5" height="5" x="-2.5" y="-2.5" fill="#f2d2bd">
                          <animateMotion dur={`${5.5 + i * 0.7}s`} begin={`${2 + i * 0.4}s`} repeatCount="indefinite" path={d} />
                        </rect>
                      )}
                    </g>
                  );
                })}
                {/* Merkez */}
                <rect x={hubXY[0] - 5} y={hubXY[1] - 5} width="10" height="10" fill="var(--color-copper-line)" />
                <rect x={hubXY[0] - 11} y={hubXY[1] - 11} width="22" height="22" fill="none" stroke="var(--color-copper-line)" strokeWidth="1" />
              </svg>

              {/* Etiketler HTML: harita küçülünce okunur kalır */}
              <div className="absolute pointer-events-none" style={pct(hubXY)}>
                <div className="translate-x-4 -translate-y-[130%] sm:translate-x-5 whitespace-nowrap">
                  <p className="font-mono text-[0.625rem] sm:text-data text-white">{labels.hub}</p>
                  <p className="hidden sm:block font-mono text-[0.625rem] text-steel">41.0° N · 29.0° E</p>
                </div>
              </div>
              {labels.regions.map((r) => {
                const xy = project(...(REGION_POINTS[r.id] ?? HUB));
                return (
                  <button
                    key={r.id}
                    type="button"
                    onMouseEnter={() => setActive(r.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(r.id)}
                    onBlur={() => setActive(null)}
                    onClick={() => setActive((v) => (v === r.id ? null : r.id))}
                    aria-pressed={active === r.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 p-2"
                    style={pct(xy)}
                  >
                    <span
                      className={`block w-2 h-2 border transition-colors duration-200 ${active === r.id ? "bg-white border-white" : "bg-graphite border-alu"}`}
                    />
                    <span
                      className={`font-mono text-[0.625rem] sm:text-data whitespace-nowrap transition-colors duration-200 ${active === r.id ? "text-white" : "text-alu"}`}
                    >
                      {r.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <figcaption className="mt-3 font-mono text-data text-steel">{labels.caption}</figcaption>
          </figure>

          {/* Pazarlar */}
          <div className="lg:col-span-3 flex flex-col">
            <p className="font-mono text-data text-steel pb-3 border-b border-graphite-rule">{labels.hubNote} · {labels.hub}</p>
            <ul>
              {labels.regions.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(r.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(r.id)}
                    onBlur={() => setActive(null)}
                    className={`w-full text-left py-4 border-b border-graphite-rule transition-colors duration-200 ${active === r.id ? "text-white" : "text-on-navy-2"}`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-body font-semibold">{r.name}</span>
                      <span
                        aria-hidden="true"
                        className={`h-px w-8 bg-copper-line origin-right transition-transform duration-300 ease-out-quint ${active === r.id ? "scale-x-100" : "scale-x-0"}`}
                      />
                    </span>
                    <span className="block mt-1 text-small text-steel">{r.note}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="sr-only" aria-live="polite">
              {activeRegion ? `${activeRegion.name}: ${activeRegion.note}` : ""}
            </p>
          </div>
        </div>

        {/* Zincir: kaynak → müşteri */}
        <ol
          ref={chainRef}
          className="relative mt-20 lg:mt-28 grid grid-cols-1 lg:grid-cols-5 gap-y-8 lg:gap-x-8 pl-8 lg:pl-0 lg:pt-10"
          style={{ ["--chain" as string]: reduced ? 1 : 0 }}
        >
          {/* Ray ve bakır dolgu */}
          <span aria-hidden="true" className="absolute left-[5px] top-1 bottom-1 w-px lg:left-0 lg:right-0 lg:top-[5px] lg:bottom-auto lg:w-auto lg:h-px bg-graphite-rule" />
          <span aria-hidden="true" className="chain-fill absolute left-[5px] top-1 bottom-1 w-px lg:left-0 lg:right-0 lg:top-[5px] lg:bottom-auto lg:w-auto lg:h-px bg-copper-line" />
          {labels.chain.map((c, i) => (
            <li key={c.term} className="relative">
              <span
                aria-hidden="true"
                data-reached={i < reached}
                className="chain-node absolute -left-8 top-1 lg:left-0 lg:-top-10 lg:mt-px w-[11px] h-[11px] border border-steel bg-graphite"
              />
              <p className="font-display text-subheading text-white">{c.term}</p>
              <p className="mt-2 text-small text-on-navy-2 max-w-[30ch]">{c.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
