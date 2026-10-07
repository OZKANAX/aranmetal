import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSection } from "@/lib/content/queries";
import { PageHero } from "@/components/site/sections/PageHero";
import { ContactStrip } from "@/components/site/sections/ContactStrip";
import { CtaBand } from "@/components/site/sections/CtaBand";
import { Icon } from "@/components/site/ui/Icon";
import { buttonClass } from "@/components/site/ui/Button";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const c = await getSection("contact", locale);
  return { title: getDictionary(locale).nav.contact, description: c.description };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const [contact, general, cta] = await Promise.all([
    getSection("contact", locale),
    getSection("general", locale),
    getSection("cta", locale),
  ]);

  return (
    <>
      <PageHero
        title={contact.title}
        intro={contact.description}
        breadcrumbs={[{ href: `/${locale}`, label: dict.common.home }, { label: dict.nav.contact }]}
      />
      <ContactStrip c={contact} general={general} dict={dict} />

      {general.mapEmbedUrl && (
        <section className="w-full bg-paper pb-24 lg:pb-32">
          <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 h-[420px] bg-paper-3 overflow-hidden">
              <iframe
                src={general.mapEmbedUrl}
                title={general.address}
                className="w-full h-full border-0 grayscale-[0.4]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="border-t-2 border-ink pt-6">
                <h2 className="text-caption text-ink-3">{dict.contact.hours}</h2>
                <p className="text-subheading text-ink mt-3">{general.workingHours}</p>
              </div>
              {general.whatsapp && (
                <a
                  href={`https://wa.me/${general.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`self-start ${buttonClass("secondary", "md")}`}
                >
                  <Icon name="chat" className="text-[20px] text-copper" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <CtaBand c={cta} locale={locale} showContact={false} />
    </>
  );
}
