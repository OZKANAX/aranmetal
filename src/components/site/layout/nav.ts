import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export type NavLink = { href: string; label: string };
export type NavItem = NavLink & { exact?: boolean; children?: NavLink[]; match?: string[] };

export function getNavItems(locale: Locale, dict: Dictionary): NavItem[] {
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
    },
    { href: `/${locale}/logistics`, label: dict.nav.logistics },
    { href: `/${locale}/products#spec-table`, label: dict.nav.standards, match: [] },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];
}

export const quoteHref = (locale: Locale, productSlug?: string) =>
  `/${locale}/quote${productSlug ? `?product=${encodeURIComponent(productSlug)}` : ""}`;
