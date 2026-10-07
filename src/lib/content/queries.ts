import "server-only";
import { cache } from "react";
import type { Product, Page, Slide } from "@prisma/client";
import { db } from "@/lib/db";
import type { Locale } from "@/i18n/config";
import { sections, type FieldDef, type SectionContent, type SectionKey } from "./schema";
import { defaultProducts } from "./default-products";

type StoredValue = string | { tr?: string; en?: string };
export type StoredSection = Record<string, StoredValue>;

/** Veritabanındaki ham bölüm verisini okur (admin formu için). */
export async function getStoredSection(key: SectionKey): Promise<StoredSection> {
  try {
    const row = await db.contentSection.findUnique({ where: { key } });
    return row ? (JSON.parse(row.data) as StoredSection) : {};
  } catch {
    return {};
  }
}

const getAllStored = cache(async (): Promise<Record<string, StoredSection>> => {
  try {
    const rows = await db.contentSection.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, JSON.parse(r.data) as StoredSection]));
  } catch {
    // Veritabanı henüz hazır değilse varsayılan içerikle çalış.
    return {};
  }
});

/** Bir bölümün verilen dildeki içeriğini, eksik alanları varsayılanlarla doldurarak döner. */
export async function getSection<K extends SectionKey>(key: K, locale: Locale): Promise<SectionContent<K>> {
  const stored = (await getAllStored())[key] ?? {};
  const fields = sections[key].fields as Record<string, FieldDef>;
  const out: Record<string, string> = {};

  for (const [name, def] of Object.entries(fields)) {
    const value = stored[name];
    if (def.localized) {
      const fallback = def.default as { tr: string; en: string };
      const v = typeof value === "object" && value ? value : {};
      out[name] = v[locale]?.trim() ? v[locale]! : v.tr?.trim() ? v.tr! : fallback[locale];
    } else {
      out[name] = typeof value === "string" ? value : (def.default as string);
    }
  }
  return out as SectionContent<K>;
}

// ---------- Ürünler ----------

export type LocalizedProduct = {
  id: string;
  slug: string;
  code: string;
  category: string;
  badge: string | null;
  badgeHighlight: boolean;
  image: string;
  inStock: boolean;
  name: string;
  subtitle: string;
  description: string;
  details: string;
  spec: {
    show: boolean;
    code: string;
    material: string;
    purity: string;
    form: string;
    unit: string;
  };
};

function pick(tr: string, en: string, locale: Locale) {
  return locale === "en" && en.trim() ? en : tr;
}

export function localizeProduct(p: Product, locale: Locale): LocalizedProduct {
  return {
    id: p.id,
    slug: p.slug,
    code: p.code,
    category: p.category,
    badge: p.badge,
    badgeHighlight: p.badgeHighlight,
    image: p.image,
    inStock: p.inStock,
    name: pick(p.nameTr, p.nameEn, locale),
    subtitle: pick(p.subtitleTr, p.subtitleEn, locale),
    description: pick(p.descriptionTr, p.descriptionEn, locale),
    details: pick(p.detailsTr, p.detailsEn, locale),
    spec: {
      show: p.showInSpecTable,
      code: p.specCode || p.code,
      material: pick(p.specMaterialTr, p.specMaterialEn, locale) || pick(p.nameTr, p.nameEn, locale),
      purity: p.specPurity,
      form: pick(p.specFormTr, p.specFormEn, locale),
      unit: pick(p.specUnitTr, p.specUnitEn, locale),
    },
  };
}

const getPublishedProducts = cache(async () => {
  try {
    return await db.product.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    // Veritabanına ulaşılamıyorsa varsayılan katalogla çalış.
    const now = new Date(0);
    return defaultProducts.map(
      (p, i): Product => ({
        id: p.slug,
        badgeHighlight: false,
        inStock: true,
        detailsTr: "",
        detailsEn: "",
        showInSpecTable: true,
        published: true,
        sortOrder: i,
        createdAt: now,
        updatedAt: now,
        ...p,
      }),
    );
  }
});

export async function getProducts(locale: Locale) {
  return (await getPublishedProducts()).map((p) => localizeProduct(p, locale));
}

export async function getProductBySlug(slug: string, locale: Locale) {
  const p = (await getPublishedProducts()).find((x) => x.slug === slug);
  return p ? localizeProduct(p, locale) : null;
}

// ---------- Serbest sayfalar ----------

export async function getPage(slug: string, locale: Locale) {
  let page: Page | null = null;
  try {
    page = await db.page.findUnique({ where: { slug } });
  } catch {
    return null;
  }
  if (!page || !page.published) return null;
  return {
    slug: page.slug,
    title: pick(page.titleTr, page.titleEn, locale),
    body: pick(page.bodyTr, page.bodyEn, locale),
    updatedAt: page.updatedAt,
  };
}

export async function getFooterPages(locale: Locale) {
  try {
    const pages = await db.page.findMany({ where: { published: true }, orderBy: { slug: "asc" } });
    return pages.map((p) => ({ slug: p.slug, title: pick(p.titleTr, p.titleEn, locale) }));
  } catch {
    return [];
  }
}

// ---------- Slider ----------

export type LocalizedSlide = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primary: { label: string; href: string } | null;
  secondary: { label: string; href: string } | null;
};

/** Site içi yolları dile göre öneklendirir: "/products" -> "/tr/products". Tam URL'ler olduğu gibi kalır. */
export function localizeHref(href: string, locale: Locale) {
  if (!href) return "";
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

export async function getSlides(locale: Locale): Promise<LocalizedSlide[]> {
  let rows: Slide[] = [];
  try {
    rows = await db.slide.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  } catch {
    return [];
  }
  return rows.map((s) => {
    const btn = (tr: string, en: string, href: string) => {
      const label = pick(tr, en, locale);
      return label && href ? { label, href: localizeHref(href, locale) } : null;
    };
    return {
      id: s.id,
      image: s.image,
      eyebrow: pick(s.eyebrowTr, s.eyebrowEn, locale),
      title: pick(s.titleTr, s.titleEn, locale),
      highlight: pick(s.highlightTr, s.highlightEn, locale),
      description: pick(s.descriptionTr, s.descriptionEn, locale),
      primary: btn(s.primaryLabelTr, s.primaryLabelEn, s.primaryHref),
      secondary: btn(s.secondaryLabelTr, s.secondaryLabelEn, s.secondaryHref),
    };
  });
}
