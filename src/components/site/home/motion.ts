"use client";

import { useEffect, useState, type RefObject } from "react";

/** Hareketi azalt tercihini izler. Sunucuda ve ilk çizimde `true` döner (hareketsiz güvenli varsayılan). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** Bir medya sorgusunu izler. Sunucuda `false`. */
export function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return match;
}

/** Eleman görünür alanda mı? `once` ile ilk görünüşte kilitlenir. */
export function useInView<T extends Element>(ref: RefObject<T | null>, { once = false, margin = "0px" } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, margin]);
  return inView;
}

/**
 * Bir bölümün kaydırma ilerlemesini (0..1) rAF ile ölçer ve `onProgress`'e verir.
 * Yalnız bölüm görünürken dinler; React render'ı tetiklemez.
 * `start`/`end`: bölümün üst kenarının viewport'a göre konumuna bağlı ilerleme aralığı.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onProgress: (p: number) => void,
  { enabled = true, mode = "through" }: { enabled?: boolean; mode?: "through" | "exit" | "pin" } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let frame = 0;
    let visible = false;

    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "exit") p = -r.top / r.height; // üst kenar viewport üstünden çıkarken
      else if (mode === "pin") p = -r.top / Math.max(1, r.height - vh); // yapışkan bölüm boyunca
      else p = (vh - r.top) / (vh + r.height); // görünür alana girişten çıkışa
      onProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(measure);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref, onProgress, enabled, mode]);
}
