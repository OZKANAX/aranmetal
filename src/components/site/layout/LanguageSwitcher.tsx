"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeLabels, switchLocalePath, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ locale, className = "" }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  return (
    <div className={`items-center font-mono text-data ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden="true" className="mx-1 h-3 w-px bg-graphite-rule" />}
          <Link
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-label={localeLabels[l]}
            aria-current={l === locale ? "true" : undefined}
            className={`uppercase px-1.5 py-2 transition-colors ${l === locale ? "text-white" : "text-steel hover:text-white"}`}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
