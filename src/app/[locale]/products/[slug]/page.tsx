import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { db } from "@/lib/db";
import { getProductBySlug, getProducts, getSection } from "@/lib/content/queries";
import { quoteHref } from "@/components/site/layout/nav";
import { PageHero } from "@/components/site/sections/PageHero";
import { CtaBand } from "@/components/site/sections/CtaBand";
import { ProductCard } from "@/components/site/products/ProductCard";
import { BgImage } from "@/components/site/ui/BgImage";
import { ButtonLink } from "@/components/site/ui/Button";
import { Icon } from "@/components/site/ui/Icon";

export async function generateStaticParams() {
  try {
    const products = await db.product.findMany({ where: { published: true }, select: { slug: true } });
    return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const product = await getProductBySlug(slug, locale);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.image] },
  };
}

export default async function ProductDetailPage({ params }: PageProps<"/[locale]/products/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const dict = getDictionary(locale);
  const [cta, products] = await Promise.all([getSection("cta", locale), getProducts(locale)]);
  const others = products.filter((p) => p.id !== product.id).slice(0, 4);
  const categoryLabel = dict.categories[product.category as keyof typeof dict.categories] ?? product.category;

  const specs = [
    { label: dict.spec.code, value: product.spec.code, mono: true },
    { label: dict.spec.material, value: product.spec.material },
    { label: dict.spec.purity, value: product.spec.purity, mono: true },
    { label: dict.spec.form, value: product.spec.form },
    { label: dict.spec.unit, value: product.spec.unit, mono: true },
  ].filter((s) => s.value);

  return (
    <>
      <PageHero
        title={product.name}
        intro={product.description}
        breadcrumbs={[
          { href: `/${locale}`, label: dict.common.home },
          { href: `/${locale}/products`, label: dict.nav.products },
          { label: product.name },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-ink-3">
            <span className="tnum font-semibold text-copper">{product.code}</span>
            <span>{product.subtitle || categoryLabel}</span>
            <span className={`inline-flex items-center gap-2 ${product.inStock ? "text-success" : "text-ink-3"}`}>
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-success" : "bg-ink-3"}`} />
              {product.inStock ? dict.common.inStock : dict.common.outOfStock}
            </span>
          </div>
        }
      />

      <section className="w-full bg-paper pt-12 lg:pt-16 pb-24 lg:pb-32">
        <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 relative aspect-[4/3] bg-paper-3 overflow-hidden">
            <BgImage src={product.image} alt={product.name} className="absolute inset-0" />
            {product.badge && (
              <span
                className={`absolute bottom-4 left-4 px-2.5 py-1 text-caption font-semibold ${
                  product.badgeHighlight ? "bg-copper text-white" : "bg-paper text-ink"
                }`}
              >
                {product.badge}
              </span>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-10">
            {specs.length > 0 && (
              <div>
                <h2 className="text-subheading text-ink pb-4 border-b-2 border-ink">{dict.product.specifications}</h2>
                <dl>
                  {specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-[minmax(0,11rem)_1fr] gap-4 py-4 border-b border-rule">
                      <dt className="text-small text-ink-3">{s.label}</dt>
                      <dd className={`tnum text-small text-ink ${s.mono ? "font-semibold" : ""}`}>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.details && (
              <div className="text-body text-ink-2 space-y-4">
                {product.details.split(/\n{2,}/).map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href={quoteHref(locale, product.slug)} size="lg" trailingIcon="arrow_forward">
                {dict.product.requestQuote}
              </ButtonLink>
              <Link href={`/${locale}/products`} className="inline-flex items-center gap-1.5 text-small font-semibold text-ink-2 hover:text-copper transition-colors">
                <Icon name="arrow_back" className="text-[18px]" />
                {dict.common.backToProducts}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="w-full bg-paper-2 section-y">
          <div className="page-x">
            <h2 className="text-heading text-ink mb-12">{dict.product.related}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
              {others.map((p) => (
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
      )}

      <CtaBand c={cta} locale={locale} />
    </>
  );
}
