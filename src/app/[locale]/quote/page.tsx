import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProducts, getSection } from "@/lib/content/queries";
import { PageHero } from "@/components/site/sections/PageHero";
import { QuoteSection } from "@/components/site/sections/QuoteSection";

export async function generateMetadata({ params }: PageProps<"/[locale]/quote">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const c = await getSection("quote", locale);
  return { title: c.pageTitle, description: c.pageIntro };
}

export default async function QuotePage({ params, searchParams }: PageProps<"/[locale]/quote">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const { product: productSlug } = await searchParams;

  const dict = getDictionary(locale);
  const [quote, products] = await Promise.all([getSection("quote", locale), getProducts(locale)]);
  // Ürün kartından gelindiyse o ürün seçili gelsin
  const selected = products.find((p) => p.slug === productSlug);

  return (
    <>
      <PageHero
        title={quote.pageTitle}
        intro={quote.pageIntro}
        breadcrumbs={[{ href: `/${locale}`, label: dict.common.home }, { label: quote.pageTitle }]}
      />
      <QuoteSection
        c={quote}
        locale={locale}
        dict={dict}
        productOptions={products.map((p) => p.name)}
        defaultProduct={selected?.name}
      />
    </>
  );
}
