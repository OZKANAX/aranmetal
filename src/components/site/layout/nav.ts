import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export type NavLink = { href: string; label: string };
/** Açılır menüde başlık (kategori) ve altındaki ürün bağlantıları */
export type NavGroup = NavLink & { items: NavLink[] };
export type NavItem = NavLink & { exact?: boolean; children?: NavLink[]; groups?: NavGroup[]; match?: string[] };

/** Menüde gösterilecek ürün özeti */
export type NavProduct = { slug: string; name: string; category: string };

const CATEGORY_ORDER = ["copper", "aluminum", "alloy", "plastic"] as const;

export function getNavItems(locale: Locale, dict: Dictionary, products: NavProduct[] = []): NavItem[] {
  // Ürünü olan kategoriler, her biri kendi ürünleriyle
  const groups: NavGroup[] = CATEGORY_ORDER.map((key) => ({
    href: `/${locale}/products?category=${key}`,
    label: dict.categories[key],
    items: products
      .filter((p) => p.category === key)
      .map((p) => ({ href: `/${locale}/products/${p.slug}`, label: p.name })),
  })).filter((g) => g.items.length > 0);

  return [
    { href: `/${locale}/about`, label: dict.nav.corporate },
    {
      href: `/${locale}/products`,
      label: dict.nav.products,
      children: [
        { href: `/${locale}/products`, label: dict.home.allProducts },
        { href: `/${locale}/products?category=copper`, label: dict.categories.copper },
        { href: `/${locale}/products?category=aluminum`, label: dict.categories.aluminum },
        { href: `/${locale}/products?category=alloy`, label: dict.categories.alloy },
        { href: `/${locale}/products?category=plastic`, label: dict.categories.plastic },
      ],
      groups,
    },
    { href: `/${locale}/logistics`, label: dict.nav.logistics },
    { href: `/${locale}/products#spec-table`, label: dict.nav.standards, match: [] },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];
}

export const quoteHref = (locale: Locale, productSlug?: string) =>
  `/${locale}/quote${productSlug ? `?product=${encodeURIComponent(productSlug)}` : ""}`;
