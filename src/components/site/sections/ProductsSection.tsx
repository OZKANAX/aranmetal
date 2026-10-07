import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocalizedProduct } from "@/lib/content/queries";
import type { SectionContent } from "@/lib/content/schema";
import { ProductCatalog } from "../products/ProductCatalog";
import { UrlProductCatalog } from "../products/UrlProductCatalog";
import { SpecTable } from "../products/SpecTable";

export function ProductsSection({
  c,
  products,
  locale,
  dict,
  withUrlFilter = false,
  showHeading = true,
}: {
  c: SectionContent<"productsSection">;
  products: LocalizedProduct[];
  locale: Locale;
  dict: Dictionary;
  /** Ürünler sayfasında ?category= ile filtre */
  withUrlFilter?: boolean;
  showHeading?: boolean;
}) {
  // Bilinen gruplar sabit sırada; ürünü olmayan plastik de listelenir (boş durum + teklif bağlantısı)
  const known = ["copper", "aluminum", "alloy", "plastic"];
  const present = new Set(products.map((p) => p.category));
  const categories = [
    ...known.filter((k) => present.has(k) || k === "plastic"),
    ...[...present].filter((k) => !known.includes(k)),
  ];
  const filters = [
    { key: "all", label: dict.common.all },
    ...categories.map((key) => ({ key, label: dict.categories[key as keyof Dictionary["categories"]] ?? key })),
  ];

  const header = showHeading ? <h2 className="text-heading text-ink">{c.title}</h2> : <div />;

  const catalogProps = {
    products,
    filters,
    empty: { text: dict.common.emptyCategory, cta: dict.nav.quote, href: `/${locale}/quote` },
    locale,
    header,
    labels: { getQuote: dict.common.getQuote, inStock: dict.common.inStock, outOfStock: dict.common.outOfStock },
  };

  return (
    <section className="w-full bg-paper section-y" id="products">
      <div className="page-x">
        {withUrlFilter ? (
          <Suspense fallback={<ProductCatalog {...catalogProps} />}>
            <UrlProductCatalog {...catalogProps} />
          </Suspense>
        ) : (
          <ProductCatalog {...catalogProps} />
        )}
        <SpecTable products={products} title={c.tableTitle} standard={c.tableStandard} labels={dict.spec} />
      </div>
    </section>
  );
}
