import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProducts, getSection } from "@/lib/content/queries";
import { PageHero } from "@/components/site/sections/PageHero";
import { ProductsSection } from "@/components/site/sections/ProductsSection";
import { CtaBand } from "@/components/site/sections/CtaBand";

export async function generateMetadata({ params }: PageProps<"/[locale]/products">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const c = await getSection("productsSection", locale);
  return { title: getDictionary(locale).nav.products, description: c.intro };
}

export default async function ProductsPage({ params }: PageProps<"/[locale]/products">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const [c, cta, products] = await Promise.all([
    getSection("productsSection", locale),
    getSection("cta", locale),
    getProducts(locale),
  ]);

  return (
    <>
      <PageHero
        title={c.title}
        intro={c.intro}
        image="/images/solution-bars.jpg"
        breadcrumbs={[{ href: `/${locale}`, label: dict.common.home }, { label: dict.nav.products }]}
      />
      <ProductsSection c={c} products={products} locale={locale} dict={dict} withUrlFilter showHeading={false} />
      <CtaBand c={cta} locale={locale} />
    </>
  );
}
