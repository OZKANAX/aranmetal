import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSection } from "@/lib/content/queries";
import { PageHero } from "@/components/site/sections/PageHero";
import { CtaBand } from "@/components/site/sections/CtaBand";
import { Icon } from "@/components/site/ui/Icon";

export async function generateMetadata({ params }: PageProps<"/[locale]/logistics">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const c = await getSection("logisticsPage", locale);
  return { title: getDictionary(locale).nav.logistics, description: c.intro };
}

export default async function LogisticsPage({ params }: PageProps<"/[locale]/logistics">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const [c, cta] = await Promise.all([getSection("logisticsPage", locale), getSection("cta", locale)]);

  const steps = [
    { title: c.step1Title, text: c.step1Text },
    { title: c.step2Title, text: c.step2Text },
    { title: c.step3Title, text: c.step3Text },
    { title: c.step4Title, text: c.step4Text },
  ].filter((s) => s.title);

  const caps = [
    { icon: c.cap1Icon, title: c.cap1Title, text: c.cap1Text },
    { icon: c.cap2Icon, title: c.cap2Title, text: c.cap2Text },
    { icon: c.cap3Icon, title: c.cap3Title, text: c.cap3Text },
  ].filter((s) => s.title);

  return (
    <>
      <PageHero
        title={c.title}
        intro={c.intro}
        image={c.heroImage}
        breadcrumbs={[{ href: `/${locale}`, label: dict.common.home }, { label: dict.nav.logistics }]}
      />

      <section className="w-full bg-paper section-y">
        <div className="page-x">
          <h2 className="text-heading text-ink mb-12 lg:mb-16 max-w-[24ch]">{c.processTitle}</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {steps.map((s, i) => (
              <li key={i} className="border-t-2 border-ink pt-6 flex flex-col gap-3">
                <span className="tnum text-heading font-semibold text-copper" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="text-subheading text-ink">{s.title}</h3>
                <p className="text-small text-ink-2">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="w-full bg-paper-2 section-y">
        <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-12">
          <h2 className="lg:col-span-4 text-heading text-ink">{c.capabilitiesTitle}</h2>
          <ul className="lg:col-span-8 border-t border-rule-strong">
            {caps.map((cap, i) => (
              <li key={i} className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_14rem_1fr] gap-x-6 gap-y-2 py-7 border-b border-rule">
                <Icon name={cap.icon} className="text-[26px] text-copper row-span-2 sm:row-span-1" />
                <h3 className="text-body font-semibold text-ink">{cap.title}</h3>
                <p className="text-small text-ink-2 col-start-2 sm:col-start-3">{cap.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand c={cta} locale={locale} />
    </>
  );
}
