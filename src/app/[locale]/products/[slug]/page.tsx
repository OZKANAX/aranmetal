import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { db } from "@/lib/db";
import { getProductBySlug, getProducts } from "@/lib/content/queries";
import { formatPurity, parsePurity } from "@/lib/purity";
import { quoteHref } from "@/components/site/layout/nav";
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

/**
 * Ürün sayfası: üstte malzeme plakası (büyük fotoğraf ve damgalı parti etiketi) ile ürünün kimliği,
 * altında tam spesifikasyon tablosu ve açıklama, en altta aynı gruptaki diğer ürünler.
 */
export default async function ProductDetailPage({ params }: PageProps<"/[locale]/products/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const dict = getDictionary(locale);
  const products = await getProducts(locale);
  const sameGroup = products.filter((p) => p.category === product.category && p.id !== product.id);
  const others = sameGroup.length > 0 ? sameGroup : products.filter((p) => p.id !== product.id).slice(0, 4);
  const categoryLabel = dict.categories[product.category as keyof typeof dict.categories] ?? product.category;
  const purity = parsePurity(product.spec.purity);

  const specs = [
    { label: dict.spec.code, value: product.spec.code, mono: true },
    { label: dict.spec.material, value: product.spec.material },
    { label: dict.spec.purity, value: formatPurity(product.spec.purity, locale), mono: true },
    { label: dict.product.grade, value: product.badge ?? "", mono: true },
    { label: dict.spec.form, value: product.spec.form },
    { label: dict.spec.unit, value: product.spec.unit },
    { label: dict.product.stock, value: product.inStock ? dict.common.inStock.replace(/^[^:]+:\s*/, "") : dict.common.outOfStock.replace(/^[^:]+:\s*/, "") },
  ].filter((s) => s.value);

  // Açıklama zaten üstte; altta ayrıntı metni varsa o, yoksa açıklama gösterilir
  const paragraphs = (product.details ? product.details.split(/\n{2,}/) : [product.description]).filter(Boolean);

  return (
    <>
      {/* Malzeme plakası */}
      <section className="bg-graphite text-white -mt-[var(--header-h)] pt-[calc(var(--header-h)+2.5rem)] pb-16 lg:pb-24">
        <div className="page-x">
          <nav aria-label="breadcrumb" className="font-mono text-data text-steel">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  {dict.common.home}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-white transition-colors">
                  {dict.nav.products}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/${locale}/products?category=${product.category}`} className="hover:text-white transition-colors">
                  {categoryLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-on-navy">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10">
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden bg-graphite-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-graphite/50 via-transparent to-transparent" />
                <dl className="absolute left-4 bottom-4 lg:left-6 lg:bottom-6 border border-white/45 bg-graphite/80 font-mono text-data text-white">
                  <div className="px-3 py-1.5 border-b border-white/25">
                    <dt className="sr-only">{dict.spec.code}</dt>
                    <dd>{product.spec.code}</dd>
                  </div>
                  <div className="flex divide-x divide-white/25">
                    <div className="px-3 py-1.5">
                      <dt className="sr-only">{dict.spec.purity}</dt>
                      <dd className="tnum">{purity ? `${purity.element} ${purity.value}` : product.spec.purity}</dd>
                    </div>
                    {product.badge && (
                      <div className="px-3 py-1.5 text-alu">
                        <dt className="sr-only">{dict.product.grade}</dt>
                        <dd>{product.badge}</dd>
                      </div>
                    )}
                  </div>
                </dl>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <h1 className="font-display text-title text-white">{product.name}</h1>
              {product.subtitle && <p className="mt-2 text-body text-on-navy-2">{product.subtitle}</p>}

              <div className="mt-8 border-t border-graphite-rule pt-6">
                {purity ? (
                  <>
                    <p
                      className={`font-display tnum leading-[0.95] text-white ${
                        purity.value.includes("/") ? "text-[clamp(2.25rem,1.4rem+2.4vw,3.5rem)]" : "text-[clamp(3rem,1.8rem+3.6vw,5rem)]"
                      }`}
                    >
                      {locale === "tr" && <span className="text-[0.42em] align-top text-steel mr-1">%</span>}
                      {purity.value}
                      {locale !== "tr" && <span className="text-[0.42em] align-top text-steel ml-1">%</span>}
                    </p>
                    <p className="mt-3 font-mono text-data text-steel">
                      {purity.element} · {dict.landing.railMinimum}
                      {purity.note ? ` · ${purity.note}` : ""}
                    </p>
                  </>
                ) : (
                  <p className="font-display text-[clamp(2rem,1.4rem+2vw,3rem)] leading-none text-white">{product.spec.purity}</p>
                )}
              </div>

              <p className="mt-8 text-body text-on-navy-2 max-w-[52ch]">{product.description}</p>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href={quoteHref(locale, product.slug)}
                  className="group btn-copper inline-flex h-14 items-center gap-3 px-7 text-small font-semibold uppercase tracking-[0.12em]"
                >
                  {dict.product.requestQuote}
                  <Icon name="arrow_forward" className="arrow-nudge text-[18px]" />
                </Link>
                <span className={`inline-flex items-center gap-2 text-small ${product.inStock ? "text-white" : "text-on-navy-2"}`}>
                  <span aria-hidden="true" className={`h-2 w-2 ${product.inStock ? "bg-gold" : "border border-steel"}`} />
                  {product.inStock ? dict.common.inStock : dict.common.outOfStock}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spesifikasyon ve açıklama */}
      <section className="bg-paper text-ink section-y">
        <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-heading text-ink">{dict.product.details}</h2>
            <div className="mt-6 space-y-4 text-body text-ink-2 max-w-[60ch]">
              {paragraphs.map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="font-display text-heading text-ink">{dict.product.specifications}</h2>
            <dl className="mt-6 border-t-2 border-ink">
              {specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[minmax(0,11rem)_1fr] gap-4 py-4 border-b border-rule">
                  <dt className="font-mono text-data text-ink-3 pt-0.5">{s.label}</dt>
                  <dd className={`text-body text-ink ${s.mono ? "tnum font-semibold" : ""}`}>{s.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={`/${locale}/products#spec-table`}
              className="group nav-line mt-6 inline-flex items-center gap-2 text-small font-semibold text-ink"
            >
              {dict.landing.railSpecTable}
              <Icon name="arrow_forward" className="arrow-nudge text-[17px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Aynı gruptaki ürünler */}
      {others.length > 0 && (
        <section className="bg-paper-2 text-ink section-y">
          <div className="page-x">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-5">
              <h2 className="font-display text-heading text-ink">
                {sameGroup.length > 0 ? dict.product.sameGroup : dict.product.related}
              </h2>
              <Link href={`/${locale}/products`} className="group nav-line inline-flex items-center gap-2 text-small font-semibold text-ink">
                {dict.common.backToProducts}
                <Icon name="arrow_forward" className="arrow-nudge text-[17px]" />
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {others.map((p) => {
                const pp = parsePurity(p.spec.purity);
                return (
                  <li key={p.id}>
                    <Link href={`/${locale}/products/${p.slug}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden bg-paper-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-quint group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="mt-4 font-mono text-data text-ink-3">{p.spec.code}</p>
                      <p className="mt-1 font-display text-subheading text-ink group-hover:text-copper-deep transition-colors">{p.name}</p>
                      <p className="mt-1 text-small text-ink-2">{pp ? formatPurity(p.spec.purity, locale) : p.spec.purity}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
