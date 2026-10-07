"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { LocalizedSlide } from "@/lib/content/queries";
import { buttonClass } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { sentenceCase } from "../ui/Eyebrow";

export type QuickLink = { href: string; label: string; icon: string };

type Labels = { prev: string; next: string; slide: string; pause: string; play: string };

const DURATION = 7000;

export function HeroSlider({
  slides,
  quickLinks,
  labels,
  ariaLabel,
  locale,
}: {
  slides: LocalizedSlide[];
  quickLinks: QuickLink[];
  labels: Labels;
  ariaLabel: string;
  locale: string;
}) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [stopped, setStopped] = useState(false);
  const touchX = useRef<number | null>(null);

  const count = slides.length;
  const multiple = count > 1;
  const paused = hovered || stopped;

  const go = (i: number) => setIndex((i + count) % count);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section aria-roledescription="carousel" aria-label={ariaLabel} className="w-full bg-paper">
      <div
        className="relative overflow-hidden bg-navy h-[72svh] min-h-[520px] max-h-[760px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={(e) => {
          if (!multiple) return;
          if (e.key === "ArrowRight") next();
          if (e.key === "ArrowLeft") prev();
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null || !multiple) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
          touchX.current = null;
        }}
      >
        {/* Fotoğraf katmanları */}
        {slides.map((s, i) => (
          <div
            key={s.id}
            aria-hidden="true"
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <div
              key={i === index ? `active-${index}` : "idle"}
              className={`absolute inset-0 bg-cover bg-center ${i === index ? "plate-settle" : ""}`}
              style={{ backgroundImage: `url("${s.image.replace(/"/g, "%22")}")` }}
            />
          </div>
        ))}

        {/* Okunabilirlik perdesi */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

        <div className="relative h-full page-x flex flex-col justify-center pb-20 lg:pb-24">
          {/* Slayt metinleri: hepsi aynı hücrede üst üste */}
          <div className="grid">
            {slides.map((s, i) => {
              const active = i === index;
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <div
                  key={s.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${labels.slide} ${i + 1} / ${count}`}
                  inert={!active}
                  className="[grid-area:1/1] max-w-[46rem]"
                >
                  <div
                    className={`transition-[opacity,transform] duration-1000 ease-out-expo ${
                      active ? "opacity-100 translate-y-0 delay-200" : "opacity-0 translate-y-6"
                    }`}
                  >
                    <Heading className="text-display text-white">
                      {sentenceCase(s.title, locale)}
                      {s.highlight && (
                        <>
                          {" "}
                          <span className="text-copper-light">{sentenceCase(s.highlight, locale, false)}</span>
                        </>
                      )}
                    </Heading>
                  </div>
                  <div
                    className={`transition-[opacity,transform] duration-1000 ease-out-expo ${
                      active ? "opacity-100 translate-y-0 delay-400" : "opacity-0 translate-y-6"
                    }`}
                  >
                    {s.description && <p className="text-lead text-white/85 max-w-[44ch] mt-6">{s.description}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-8">
                      {s.primary && (
                        <Link href={s.primary.href} className={buttonClass("primary", "lg")}>
                          <span>{s.primary.label}</span>
                          <Icon name="arrow_forward" className="text-[18px] transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />
                        </Link>
                      )}
                      {s.secondary && (
                        <Link href={s.secondary.href} className={buttonClass("outlineOnDark", "lg")}>
                          {s.secondary.label}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slayt kontrolleri: sağ alt */}
        {multiple && (
          <div className="absolute inset-x-0 bottom-24 lg:bottom-28 hidden md:block">
            <div className="page-x flex justify-end">
              <div className="flex items-center gap-5 text-white">
                <span className="tnum text-small text-white/70">
                  <span className="text-white font-semibold">{pad(index + 1)}</span> / {pad(count)}
                </span>
                <div className="flex items-center gap-1.5">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`${labels.slide} ${i + 1}`}
                      aria-current={i === index ? "true" : undefined}
                      className="group relative h-8 w-12 flex items-center"
                    >
                      <span className="block h-[2px] w-full bg-white/25 group-hover:bg-white/50 transition-colors overflow-hidden">
                        {i === index && (
                          <span
                            key={index}
                            className="slide-progress block h-full w-full bg-copper-light"
                            style={{
                              ["--slide-duration" as string]: `${DURATION}ms`,
                              animationPlayState: paused ? "paused" : "running",
                            }}
                            onAnimationEnd={next}
                          />
                        )}
                        {i < index && <span className="block h-full w-full bg-white/60" />}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <ControlButton label={stopped ? labels.play : labels.pause} onClick={() => setStopped((v) => !v)} icon={stopped ? "play_arrow" : "pause"} />
                  <ControlButton label={labels.prev} onClick={prev} icon="arrow_back" />
                  <ControlButton label={labels.next} onClick={next} icon="arrow_forward" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hızlı erişim: slider'ın altına biner */}
      {quickLinks.length > 0 && (
        <div className="page-x relative z-10 -mt-14 lg:-mt-16">
          <nav className="grid grid-cols-1 sm:grid-cols-3 bg-paper shadow-[0_20px_40px_-16px_rgba(15,30,46,0.25)] border-t-2 border-copper divide-y sm:divide-y-0 sm:divide-x divide-rule">
            {quickLinks.map((q) => (
              <Link key={q.href} href={q.href} className="group flex items-center gap-4 px-6 py-5 lg:px-8 lg:py-7 hover:bg-paper-2 transition-colors">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-copper-tint text-copper transition-colors group-hover:bg-copper group-hover:text-white">
                  <Icon name={q.icon} className="text-[24px]" />
                </span>
                <span className="text-body font-semibold text-ink">{q.label}</span>
                <Icon name="arrow_forward" className="ml-auto text-[20px] text-ink-3 transition-transform duration-300 ease-out-expo group-hover:translate-x-1 group-hover:text-copper" />
              </Link>
            ))}
          </nav>
        </div>
      )}
    </section>
  );
}

function ControlButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex w-10 h-10 items-center justify-center rounded-full border border-white/30 text-white hover:border-white hover:bg-white/10 transition-colors"
    >
      <Icon name={icon} className="text-[20px]" />
    </button>
  );
}
