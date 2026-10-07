import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocalizedProduct } from "@/lib/content/queries";
import type { SectionContent } from "@/lib/content/schema";
import { ProductCard } from "../products/ProductCard";
import { ButtonLink } from "../ui/Button";
import { SectionHeading } from "../ui/Eyebrow";

/** Anasayfa: ilk 4 ürün + Ürünler sayfasına bağlantı */
export function FeaturedProducts({
  c,
  products,
  locale,
  dict,
}: {
  c: SectionContent<"productsSection">;
  products: LocalizedProduct[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (products.length === 0) return null;

  return (
    <section className="w-full bg-paper section-y" id="products">
      <div className="page-x">
        <SectionHeading title={c.title} intro={c.intro}>
          <ButtonLink href={`/${locale}/products`} variant="secondary" trailingIcon="arrow_forward">
            {dict.common.backToProducts}
          </ButtonLink>
        </SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          {products.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              locale={locale}
              labels={{ getQuote: dict.common.getQuote, inStock: dict.common.inStock, outOfStock: dict.common.outOfStock }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
