import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/styles/site.css";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteFontVariables } from "@/lib/fonts";
import { getFooterPages, getSection } from "@/lib/content/queries";
import { SiteHeader } from "@/components/site/layout/SiteHeader";
import { SiteFooter } from "@/components/site/layout/SiteFooter";
import { MarketTicker } from "@/components/site/layout/MarketTicker";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const general = await getSection("general", locale);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");

  return {
    metadataBase: new URL(siteUrl),
    title: { default: general.seoTitle, template: `%s | ${general.companyName}` },
    description: general.seoDescription,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      siteName: general.companyName,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: ["/images/hero-foundry.jpg"],
    },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const [general, legalPages] = await Promise.all([getSection("general", locale), getFooterPages(locale)]);
  const categories = (["copper", "aluminum", "alloy", "plastic"] as const).map((key) => ({ key, label: dict.categories[key] }));

  return (
    <html lang={locale} className={siteFontVariables}>
      <head>
        {/* Material Symbols ikon fontu */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="bg-graphite font-sans text-body text-ink antialiased pb-[var(--ticker-h)]">
        <SiteHeader locale={locale} dict={dict} general={general} />
        <main className="w-full pt-[var(--header-h)] bg-paper min-h-[calc(100vh-80px)] flex flex-col">{children}</main>
        <SiteFooter locale={locale} dict={dict} general={general} categories={categories} legalPages={legalPages} />
        <MarketTicker locale={locale} label={dict.landing.tickerBrand} note={dict.landing.tickerLabel} />
      </body>
    </html>
  );
}
