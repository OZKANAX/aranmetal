"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "../ui/Icon";
import { useReducedMotion, useScrollProgress } from "./motion";

export type HeroSlide = {
  id: string;
  /** Göstergedeki kısa ad, örn. "Bakır" */
  label: string;
  image: string;
  /** İsteğe bağlı arka plan videosu (MP4/WebM); görsel poster ve yedek olarak kalır */
  video?: string;
  /** Başlık satırları; son satır altın renkte dizilir */
  lines: string[];
  description: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string } | null;
};

const INTERVAL = 3000;
/** İlk slayt, açılış sekansı bitsin diye biraz daha uzun kalır */
const INTRO_EXTRA = 1500;

/**
 * Ana slider. İlk açılış sinematik sekansla gelir (karanlık yüzey → ışık bandı → fotoğraf →
 * başlık maskeden yükselir → açıklama → düğmeler). Sonra slaytlar sırayla değişir:
 * fotoğraf çapraz geçişle oturur, başlık yeniden maskeden yükselir.
 * Görünmezken, klavye odağı slider içindeyken ve "durdur" ile döngü durur; fare üzerine gelince durmaz.
 * Hareketi azalt: otomatik geçiş yok, kullanıcı göstergelerle değiştirir.
 */
export function Hero({
  slides,
  labels,
  scrollLabel,
  scrollTarget,
}: {
  slides: HeroSlide[];
  labels: { pause: string; play: string; slide: string };
  scrollLabel: string;
  scrollTarget: string;
}) {
  const n = slides.length;
  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [hold, setHold] = useState(false);
  const [paused, setPaused] = useState(false);
  // İlk slayt açılış gecikmeleriyle gelir; sonrakiler daha kısa
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.paused = String(!e.isIntersecting);
      setVisible(e.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = n > 1 && !reduced && visible && !hold && !paused;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => {
        setIntro(false);
        setActive((i) => (i + 1) % n);
      },
      intro ? INTERVAL + INTRO_EXTRA : INTERVAL,
    );
    return () => window.clearTimeout(id);
  }, [running, active, n, intro]);

  // Sonraki slayt görselleri geçişte takılmasın diye önceden çözülür (decode)
  useEffect(() => {
    const root = plateRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLImageElement>(".hero-slide img").forEach((img) => {
      img.decode?.().catch(() => {});
    });
  }, []);

  // Etkin slayttaki videoyu oynat, diğerlerini durdur
  useEffect(() => {
    const root = plateRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
      if (v.dataset.index === String(active) && visible) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, visible]);

  const onProgress = useCallback((p: number) => {
    const plate = plateRef.current;
    if (plate) {
      plate.style.setProperty("--p", p.toFixed(4));
      plate.dataset.scrolled = String(p > 0.001);
    }
    copyRef.current?.style.setProperty("--p", p.toFixed(4));
  }, []);
  useScrollProgress(sectionRef, onProgress, { enabled: !reduced, mode: "exit" });

  const go = (i: number) => {
    setIntro(false);
    setActive(((i % n) + n) % n);
  };

  const slide = slides[active];
  const lineDelay = intro ? 0.7 : 0.1;
  const leadDelay = intro ? 1.15 : 0.3;
  const actionsDelay = intro ? 1.4 : 0.45;
  const duration = intro ? INTERVAL + INTRO_EXTRA : INTERVAL;
  const headlineClass = "font-display text-[clamp(2.75rem,1.2rem+5.6vw,6.25rem)] leading-[1.02] text-white max-w-[16ch]";

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label={slides.map((s) => s.label).join(" · ")}
      className="hero relative isolate -mt-[var(--header-h)] h-[100svh] min-h-[620px] max-h-[1100px] overflow-hidden bg-graphite text-white"
      // Fare üzerine gelince durmaz. Yalnız klavyeyle (Tab) slider içindeki bir bağlantıya gelince durur.
      onFocusCapture={(e) => setHold((e.target as HTMLElement).matches(":focus-visible"))}
      onBlurCapture={() => setHold(false)}
    >
      <div ref={plateRef} className="hero-plate absolute inset-0">
        <div className="hero-intro absolute inset-0">
          {slides.map((s, i) => (
            <div key={s.id} className="hero-slide absolute inset-0" data-active={i === active} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt=""
                fetchPriority={i === 0 ? "high" : "low"}
                loading="eager"
                decoding={i === 0 ? "sync" : "async"}
                className="hero-slide__media absolute inset-0 h-full w-full object-cover"
              />
              {s.video && !reduced && (
                <video
                  data-index={i}
                  src={s.video}
                  poster={s.image}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? "metadata" : "none"}
                  className="hero-slide__media absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="hero-sweep pointer-events-none absolute inset-y-0 left-0 w-[70%]" />
        {/* Sıcak ton ve okunurluk */}
        <div aria-hidden="true" className="absolute inset-0 bg-[#2a120b]/45" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(23,17,14,0.55)_0%,rgba(23,17,14,0.25)_55%,rgba(23,17,14,0.7)_100%)]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-graphite to-transparent" />
      </div>

      <div
        ref={copyRef}
        className="hero-copy relative z-10 page-x flex h-full flex-col items-center justify-center text-center pt-[var(--nav-h)] pb-[calc(var(--ticker-h)+5rem)]"
      >
        {/* Sayfanın h1'i sabittir (ilk slayt); görünen başlık slayta göre değişir */}
        <h1 className="sr-only">{slides[0].lines.join(" ")}</h1>
        <div
          key={slide.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${labels.slide} ${active + 1} / ${n}: ${slide.label}`}
          className="flex flex-col items-center"
        >
          <p className={headlineClass}>
            <HeroLines lines={slide.lines} delay={lineDelay} />
          </p>
          <p className="hero-lead mt-7 lg:mt-9 max-w-[60ch] text-body sm:text-lead text-on-navy/85" style={{ animationDelay: `${leadDelay}s` }}>
            {slide.description}
          </p>
          <div
            className="hero-actions mt-9 lg:mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
            style={{ animationDelay: `${actionsDelay}s` }}
          >
            <Link
              href={slide.primary.href}
              className="group btn-copper inline-flex h-14 items-center gap-3 px-8 text-small font-semibold uppercase tracking-[0.12em]"
            >
              {slide.primary.label}
              <Icon name="arrow_forward" className="arrow-nudge text-[18px]" />
            </Link>
            {slide.secondary && (
              <Link href={slide.secondary.href} className="group nav-line inline-flex items-center gap-2 text-body font-semibold text-white">
                {slide.secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Slayt göstergeleri: malzeme adı ve süre çizgisi */}
      <div className="hero-rail__item absolute z-10 inset-x-0 bottom-[calc(var(--ticker-h)+1.25rem)]" style={{ animationDelay: "2s" }}>
        <div className="page-x flex items-end justify-between gap-6">
          {n > 1 ? (
            <div className="flex gap-5 sm:gap-8">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${labels.slide} ${i + 1}: ${s.label}`}
                  aria-current={i === active ? "true" : undefined}
                  className={`relative pb-3 text-left transition-colors duration-200 ${i === active ? "text-white" : "text-on-navy-2 hover:text-white"}`}
                >
                  <span className="block font-mono text-data text-gold tnum">{String(i + 1).padStart(2, "0")}</span>
                  <span className="block mt-0.5 text-caption sm:text-small font-medium whitespace-nowrap">{s.label}</span>
                  <span aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-px bg-white/20" />
                  {i === active && (
                    <span
                      key={`${active}-${String(intro)}`}
                      aria-hidden="true"
                      className="hero-progress absolute left-0 right-0 bottom-0 h-px bg-gold origin-left"
                      style={{ animationDuration: `${duration}ms`, animationPlayState: running ? "running" : "paused" }}
                    />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}

          <a
            href={scrollTarget}
            className="hidden lg:flex flex-col items-center gap-2 font-mono text-data text-on-navy-2 hover:text-white transition-colors"
          >
            {scrollLabel}
            <span aria-hidden="true" className="block h-8 w-px bg-gradient-to-b from-gold to-transparent" />
          </a>

          {n > 1 && !reduced ? (
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-label={paused ? labels.play : labels.pause}
              className="w-10 h-10 mr-[4.5rem] sm:mr-16 lg:mr-12 flex items-center justify-center border border-white/25 text-white hover:bg-white hover:text-ink transition-colors"
            >
              <Icon name={paused ? "play_arrow" : "pause"} className="text-[20px]" />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </section>
  );
}

function HeroLines({ lines, delay }: { lines: string[]; delay: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="hero-line block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <span className={i === lines.length - 1 && lines.length > 1 ? "text-gold" : undefined} style={{ animationDelay: `${delay + i * 0.12}s` }}>
            {line}
          </span>
        </span>
      ))}
    </>
  );
}
