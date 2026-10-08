"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { Icon } from "../ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { isActive } from "./NavLinks";
import type { NavItem } from "./nav";

export function MobileMenu({
  items,
  locale,
  labels,
  quote,
  contact,
}: {
  items: NavItem[];
  locale: Locale;
  labels: { menu: string; close: string };
  quote: { href: string; label: string };
  contact: { phone: string; officePhone?: string; email: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sayfa değişince menüyü kapat
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.menu}
        className="w-11 h-11 -mr-2 flex items-center justify-center text-white"
      >
        {/* İki çizgi; açıkken çarpıya döner */}
        <span aria-hidden="true" className="relative block w-6 h-3">
          <span
            className={`absolute left-0 right-0 h-px bg-current transition-transform duration-300 ease-out-quint ${open ? "top-1.5 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute left-0 right-0 h-px bg-current transition-transform duration-300 ease-out-quint ${open ? "top-1.5 -rotate-45" : "top-3"}`}
          />
        </span>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="menu-drop fixed inset-x-0 top-[var(--header-h)] bottom-0 z-50 bg-graphite overflow-y-auto border-t border-graphite-rule"
        >
          <nav
            className="page-x flex min-h-full flex-col pt-4 pb-10"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            {items.map((item) => {
              const active = isActive(pathname, item);
              return (
                <div key={item.href} className="border-b border-graphite-rule">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`font-display flex items-center justify-between py-4 text-[1.5rem] leading-tight font-bold tracking-[-0.02em] ${
                      active ? "text-copper-light" : "text-white"
                    }`}
                  >
                    {item.label}
                    <Icon name="arrow_forward" className="text-[20px] text-steel" />
                  </Link>
                  {item.children && (
                    <ul className="-mt-1 pb-4 flex flex-wrap gap-x-5 gap-y-1">
                      {item.children.slice(1).map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="inline-flex py-2 text-small text-on-navy-2 hover:text-white">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            <Link href={quote.href} className="group btn-copper mt-8 flex h-14 items-center justify-between px-5 text-body font-semibold">
              {quote.label}
              <Icon name="arrow_forward" className="arrow-nudge text-[20px]" />
            </Link>

            <div className="mt-auto pt-10 flex items-end justify-between gap-6">
              <div className="flex flex-col gap-1 text-small">
                {contact.officePhone && (
                  <a href={`tel:${contact.officePhone.replace(/[^\d+]/g, "")}`} className="tnum text-white py-1">
                    {contact.officePhone}
                  </a>
                )}
                <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="tnum text-white py-1">
                  {contact.phone}
                </a>
                <a href={`mailto:${contact.email}`} className="text-on-navy-2 py-1">
                  {contact.email}
                </a>
              </div>
              <LanguageSwitcher locale={locale} className="flex" />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
