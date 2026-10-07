import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSection } from "@/lib/content/queries";
import { PageHero } from "@/components/site/sections/PageHero";
import { CtaBand } from "@/components/site/sections/CtaBand";
import { BgImage } from "@/components/site/ui/BgImage";
import { Icon } from "@/components/site/ui/Icon";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const c = await getSection("aboutPage", locale);
  return { title: getDictionary(locale).nav.about, description: c.intro };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const [c, hero, cta] = await Promise.all([
    getSection("aboutPage", locale),
    getSection("hero", locale),
    getSection("cta", locale),
  ]);

  const values = [
    { icon: c.value1Icon, title: c.value1Title, text: c.value1Text },
    { icon: c.value2Icon, title: c.value2Title, text: c.value2Text },
    { icon: c.value3Icon, title: c.value3Title, text: c.value3Text },
  ].filter((v) => v.title);

  const stats = [
    { label: hero.stat1Label, value: hero.stat1Value },
    { label: hero.stat2Label, value: hero.stat2Value },
    { label: hero.stat3Label, value: hero.stat3Value },
  ];

  return (
    <>
      <PageHero
        title={c.title}
        intro={c.intro}
        breadcrumbs={[{ href: `/${locale}`, label: dict.common.home }, { label: dict.nav.about }]}
      />

      <section className="w-full bg-paper section-y">
        <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <figure className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden bg-paper-3">
              <BgImage src={c.heroImage} className="absolute inset-0" />
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-rule border-b border-rule">
              {stats
                .filter((s) => s.value)
                .map((s, i) => (
                  <div key={i} className="py-5 sm:px-5 first:sm:pl-0">
                    <dt className="sentence text-caption text-ink-3">{s.label}</dt>
                    <dd className="tnum text-body font-semibold text-ink mt-1">{s.value}</dd>
                  </div>
                ))}
            </dl>
          </figure>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="text-heading text-ink mb-8">{c.storyTitle}</h2>
            <div className="text-body text-ink-2 space-y-5">
              {c.storyText.split(/\n{2,}/).map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-paper-2 section-y">
        <div className="page-x grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {[
            { title: c.visionTitle, text: c.visionText },
            { title: c.missionTitle, text: c.missionText },
          ].map((b) => (
            <div key={b.title} className="border-t-2 border-ink pt-8">
              <h2 className="text-heading text-ink mb-5">{b.title}</h2>
              <p className="text-lead text-ink-2 max-w-[56ch]">{b.text}</p>
            </div>
          ))}
        </div>

        {values.length > 0 && (
          <div className="page-x grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-10 mt-20">
            {values.map((v, i) => (
              <div key={i} className="border-t border-rule-strong pt-6 flex flex-col gap-3">
                <Icon name={v.icon} className="text-[28px] text-copper" />
                <h3 className="text-subheading text-ink">{v.title}</h3>
                <p className="text-small text-ink-2">{v.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <CtaBand c={cta} locale={locale} />
    </>
  );
}
