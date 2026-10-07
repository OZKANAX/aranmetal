import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { db } from "@/lib/db";
import { getPage } from "@/lib/content/queries";
import { PageHero } from "@/components/site/sections/PageHero";

export async function generateStaticParams() {
  try {
    const pages = await db.page.findMany({ where: { published: true }, select: { slug: true } });
    return locales.flatMap((locale) => pages.map((p) => ({ locale, slug: p.slug })));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps<"/[locale]/legal/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const page = await getPage(slug, locale);
  return page ? { title: page.title } : {};
}

/** Basit metin biçimi: "## " ile başlayan satırlar başlık, "- " maddeler, boş satır paragraf ayırır. */
function renderBody(body: string) {
  return body.split(/\n{2,}/).map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i}>{trimmed.slice(3)}</h2>;
    const lines = trimmed.split("\n");
    if (lines.every((l) => l.trim().startsWith("- "))) {
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>{l.trim().slice(2)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="whitespace-pre-line">
        {trimmed}
      </p>
    );
  });
}

export default async function LegalPage({ params }: PageProps<"/[locale]/legal/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const page = await getPage(slug, locale);
  if (!page) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={page.title}
        breadcrumbs={[{ href: `/${locale}`, label: dict.common.home }, { label: page.title }]}
      />
      <section className="w-full bg-paper pt-14 pb-24 lg:pb-32">
        <div className="page-x grid grid-cols-1 lg:grid-cols-12">
          <article className="lg:col-span-8 prose-report">{renderBody(page.body)}</article>
        </div>
      </section>
    </>
  );
}
