"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { LocalizedProduct } from "@/lib/content/queries";
import { ProductCard, type ProductCardLabels } from "./ProductCard";

type Filter = { key: string; label: string };

export type ProductCatalogProps = Parameters<typeof ProductCatalog>[0];

export function ProductCatalog({
  products,
  filters,
  locale,
  labels,
  initialCategory,
  syncWithUrl = false,
  header,
  empty,
}: {
  products: LocalizedProduct[];
  filters: Filter[];
  locale: Locale;
  labels: ProductCardLabels;
  initialCategory?: string | null;
  /** Filtre değiştikçe ?category= parametresini günceller */
  syncWithUrl?: boolean;
  header?: React.ReactNode;
  /** Seçili grupta ürün yoksa gösterilecek metin ve teklif bağlantısı */
  empty?: { text: string; cta: string; href: string };
}) {
  const [active, setActive] = useState(
    initialCategory && filters.some((f) => f.key === initialCategory) ? initialCategory : "all",
  );

  const visible = active === "all" ? products : products.filter((p) => p.category === active);

  function select(key: string) {
    setActive(key);
    if (syncWithUrl) {
      const url = new URL(window.location.href);
      if (key === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", key);
      window.history.replaceState(null, "", url);
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        {header}
        <div className="flex flex-wrap gap-x-7 gap-y-2 border-b border-rule md:border-0" role="tablist">
          {filters.map((f) => {
            const on = active === f.key;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => select(f.key)}
                className={`relative py-2 text-small font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-copper after:transition-transform after:duration-300 after:ease-out-expo after:origin-left ${
                  on ? "text-ink after:scale-x-100" : "text-ink-3 hover:text-ink after:scale-x-0"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 && empty ? (
        <div className="border-t border-ink py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <p className="text-body text-ink-2 max-w-[56ch]">{empty.text}</p>
          <Link href={empty.href} className="group btn-copper inline-flex h-12 items-center gap-2.5 px-5 text-small font-semibold self-start">
            {empty.cta}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} labels={labels} />
          ))}
        </div>
      )}
    </>
  );
}
