import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { LocalizedProduct } from "@/lib/content/queries";
import { BgImage } from "../ui/BgImage";
import { Icon } from "../ui/Icon";
import { quoteHref } from "../layout/nav";

export type ProductCardLabels = { getQuote: string; inStock: string; outOfStock: string };

/** Rapor plakası: fotoğraf, kod satırı, ad, açıklama, stok ve teklif. Kutu yok; üst çizgi ile ayrılır. */
export function ProductCard({
  product: p,
  locale,
  labels,
}: {
  product: LocalizedProduct;
  locale: Locale;
  labels: ProductCardLabels;
}) {
  const href = `/${locale}/products/${p.slug}`;
  return (
    <article className="group flex flex-col">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-paper-3" tabIndex={-1} aria-hidden="true">
        <BgImage src={p.image} className="transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]" />
        {p.badge && (
          <span
            className={`absolute bottom-3 left-3 px-2 py-1 text-caption font-semibold ${
              p.badgeHighlight ? "bg-copper text-white" : "bg-paper text-ink"
            }`}
          >
            {p.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-col flex-1 pt-5">
        <div className="flex items-baseline justify-between gap-3 text-caption text-ink-3">
          <span className="tnum font-semibold text-copper">{p.code}</span>
          <span>{p.subtitle}</span>
        </div>
        <h3 className="text-subheading text-ink mt-2">
          <Link href={href} className="hover:text-copper transition-colors">
            {p.name}
          </Link>
        </h3>
        <p className="text-small text-ink-2 mt-2 mb-5">{p.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-rule pt-4">
          <span className={`inline-flex items-center gap-2 text-caption ${p.inStock ? "text-success" : "text-ink-3"}`}>
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${p.inStock ? "bg-success" : "bg-ink-3"}`} />
            {p.inStock ? labels.inStock : labels.outOfStock}
          </span>
          <Link href={quoteHref(locale, p.slug)} className="text-link text-small">
            <span>{labels.getQuote}</span>
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </div>
    </article>
  );
}
