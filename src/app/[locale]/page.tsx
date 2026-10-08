import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProducts, getSection, getSlides } from "@/lib/content/queries";
import { quoteHref } from "@/components/site/layout/nav";
import { Hero, type HeroSlide } from "@/components/site/home/Hero";
import { LotRail } from "@/components/site/home/LotRail";
import { LmeSection } from "@/components/site/home/LmeSection";
import { SupplyRoute } from "@/components/site/home/SupplyRoute";
import { SpecLedger } from "@/components/site/home/SpecLedger";
import { CompanyStory } from "@/components/site/home/CompanyStory";
import { ProcurementRequest } from "@/components/site/home/ProcurementRequest";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const l = dict.landing;
  const [hero, solution, general, quote, products, dbSlides] = await Promise.all([
    getSection("hero", locale),
    getSection("solution", locale),
    getSection("general", locale),
    getSection("quote", locale),
    getProducts(locale),
    getSlides(locale),
  ]);

  // Slider: admin'de slayt varsa onlar, yoksa bakır / alüminyum / plastik varsayılanları
  const [copper, aluminium, plastic] = l.heroSlides;
  const defaultSlides: HeroSlide[] = [
    {
      id: copper.id,
      label: copper.label,
      image: hero.backgroundImage,
      video: hero.backgroundVideo || undefined,
      lines: [hero.titleLine1, `${hero.titleHighlight} ${hero.titleLine2}`.trim()].filter(Boolean),
      description: hero.description,
      primary: { label: hero.primaryCta, href: "#request" },
      secondary: { label: hero.secondaryCta, href: "#materials" },
    },
    {
      id: aluminium.id,
      label: aluminium.label,
      image: "/images/product-aluminum-ingot.jpg",
      lines: aluminium.lines ?? [],
      description: aluminium.description ?? "",
      primary: { label: hero.primaryCta, href: "#request" },
      secondary: { label: dict.categories.aluminum, href: `/${locale}/products?category=aluminum` },
    },
    {
      id: plastic.id,
      label: plastic.label,
      image: "/images/product-plastic-granules.jpg",
      lines: plastic.lines ?? [],
      description: plastic.description ?? "",
      primary: { label: hero.primaryCta, href: "#request" },
      secondary: { label: dict.categories.plastic, href: `/${locale}/products?category=plastic` },
    },
  ];
  const slides: HeroSlide[] =
    dbSlides.length > 0
      ? dbSlides.map((sl) => ({
          id: sl.id,
          label: sentence(sl.eyebrow.replace(/^[\s/]+/, "")) || sl.title,
          image: sl.image,
          lines: [sl.title, sl.highlight].filter(Boolean),
          description: sl.description,
          primary: sl.primary ?? { label: hero.primaryCta, href: "#request" },
          secondary: sl.secondary,
        }))
      : defaultSlides;

  const firstPlastic = products.find((p) => p.category === "plastic");
  const railProducts = products.filter((p) => p.category !== "plastic" || p === firstPlastic);

  return (
    <>
      <Hero
        slides={slides}
        labels={{ pause: dict.slider.pause, play: dict.slider.play, slide: dict.slider.slide }}
        scrollLabel={l.heroScroll}
        scrollTarget="#materials"
      />

      <LotRail
        id="materials"
        locale={locale}
        // Rayda her metal ürün ve plastik gruptan yalnız ilki (ray uzamasın; tamamı ürünler sayfasında)
        products={railProducts.map((p) => ({
          slug: p.slug,
          name: p.name,
          subtitle: p.subtitle,
          code: p.spec.code,
          badge: p.badge,
          image: p.image,
          // Varsayılan billet görselinde sol üstteki tabela kadraj dışına itilir
          focus: p.image === "/images/product-aluminum-billet.jpg" ? "88% 60%" : undefined,
          inStock: p.inStock,
          purity: p.spec.purity,
          material: p.spec.material,
          form: p.spec.form,
          unit: p.spec.unit,
          quoteHref: quoteHref(locale, p.slug),
          detailHref: `/${locale}/products/${p.slug}`,
        }))}
        labels={{
          title: l.railTitle,
          intro: l.railIntro,
          specTable: l.railSpecTable,
          specTableHref: `/${locale}/products#spec-table`,
          request: l.railRequest,
          details: l.railDetails,
          prev: l.railPrev,
          next: l.railNext,
          minimum: l.railMinimum,
          material: dict.spec.material,
          form: dict.spec.form,
          unit: dict.spec.unit,
          stock: locale === "tr" ? "Stok" : "Stock",
          inStock: locale === "tr" ? "Mevcut" : "Available",
          outOfStock: locale === "tr" ? "Talep üzerine" : "On request",
          code: l.railCode,
          purity: l.railPurity,
          grade: l.railGrade,
        }}
      />

      <LmeSection
        labels={{
          title: l.lmeTitle,
          intro: l.lmeIntro,
          copper: l.lmeCopper,
          aluminium: l.lmeAluminium,
          copperContract: l.lmeCopperContract,
          aluminiumContract: l.lmeAluminiumContract,
          caption: l.lmeCaption,
          marker: l.lmeMarker,
          steps: l.lmeSteps,
          result: l.lmeResult,
          resultText: l.lmeResultText,
        }}
      />

      <SupplyRoute
        labels={{
          title: l.routeTitle,
          intro: l.routeIntro,
          hub: l.routeHub,
          hubNote: l.routeHubNote,
          caption: l.routeCaption,
          regions: l.regions,
          chain: l.chain,
        }}
      />

      <SpecLedger title={l.ledgerTitle} intro={l.ledgerIntro} entries={l.ledger} />

      <CompanyStory
        title={l.storyTitle}
        paragraphs={l.storyParagraphs}
        image={solution.image === "/images/solution-bars.jpg" ? "/images/story-bars.jpg" : solution.image}
        tag={l.storyTag}
        facts={l.storyFacts}
        link={{ href: `/${locale}/about`, label: l.storyLink }}
      />

      <ProcurementRequest
        id="request"
        locale={locale}
        dict={dict}
        general={general}
        successMessage={quote.successMessage}
        options={[
          ...products.map((p) => ({ value: p.name, code: p.spec.code })),
          // Plastik ürün henüz girilmemişse grup olarak sunulur
          ...(products.some((p) => p.category === "plastic") ? [] : [{ value: dict.categories.plastic, code: "PLASTIC" }]),
        ]}
      />
    </>
  );
}

/** Büyük harfle girilmiş kısa etiketi cümle düzenine çevirir: "ELEKTROLİTİK BAKIR" → "Elektrolitik bakır". */
function sentence(text: string) {
  const t = text.trim();
  if (!t || t !== t.toLocaleUpperCase("tr")) return t;
  const lower = t.toLocaleLowerCase("tr");
  return lower.charAt(0).toLocaleUpperCase("tr") + lower.slice(1);
}
