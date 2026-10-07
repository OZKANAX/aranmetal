"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Sabit üst menü. Anasayfanın en üstünde hero'nun üzerinde saydamdır;
 * kaydırınca grafit zemine geçer ve biraz sıkışır (yalnız transform/opacity).
 */
export function HeaderFrame({ homeHref, children }: { homeHref: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === homeHref;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const overlay = isHome && !scrolled;

  return (
    <header className="site-header fixed -top-[10px] inset-x-0 z-50 h-[calc(var(--header-h)+10px)]" data-compact={scrolled}>
      <div
        aria-hidden="true"
        className={`site-header__bg absolute inset-0 bg-graphite/95 border-b border-graphite-rule ${overlay ? "opacity-0" : "opacity-100"}`}
      />
      {/* Hero üzerindeyken okunurluk için çok hafif üst gölgelik */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent pointer-events-none transition-opacity duration-500 ${overlay ? "opacity-100" : "opacity-0"}`}
      />
      <div className="site-header__inner relative page-x h-[var(--nav-h)] mt-[10px] flex items-center justify-between gap-8 text-on-navy">
        {children}
      </div>
    </header>
  );
}
