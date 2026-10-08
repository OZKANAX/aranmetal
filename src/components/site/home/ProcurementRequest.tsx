import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { SectionContent } from "@/lib/content/schema";
import { ProcurementForm } from "./ProcurementForm";

/** Teklif talebi bölümü: solda niyet ve doğrudan iletişim, sağda tedarik talebi formu. */
export function ProcurementRequest({
  id,
  locale,
  dict,
  general,
  successMessage,
  options,
}: {
  id: string;
  locale: Locale;
  dict: Dictionary;
  general: SectionContent<"general">;
  successMessage: string;
  options: { value: string; code: string }[];
}) {
  const l = dict.landing;
  const contacts = [
    ...(general.officePhone
      ? [{ term: dict.contact.officePhone, value: general.officePhone, href: `tel:${general.officePhone.replace(/[^\d+]/g, "")}` }]
      : []),
    { term: dict.contact.phone, value: general.phone, href: `tel:${general.phone.replace(/[^\d+]/g, "")}` },
    { term: dict.contact.email, value: general.email, href: `mailto:${general.email}` },
    { term: dict.contact.address, value: general.address },
    { term: dict.contact.hours, value: general.workingHours },
  ];

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="bg-graphite-2 text-white section-y">
      <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-14">
        <div className="lg:col-span-4 flex flex-col">
          <h2 id={`${id}-title`} className="font-display text-title text-white max-w-[12ch]">
            {l.requestTitle}
          </h2>
          <p className="mt-6 text-body text-on-navy-2 max-w-[44ch]">{l.requestIntro}</p>

          <h3 className="sr-only">{l.requestDirect}</h3>
          <dl className="mt-12 lg:mt-auto lg:pt-16 border-t border-graphite-rule">
            {contacts.map((c) => (
              <div key={c.term} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 border-b border-graphite-rule text-small">
                <dt className="font-mono text-data text-steel pt-0.5">{c.term}</dt>
                <dd className="text-on-navy">
                  {c.href ? (
                    <a href={c.href} className="tnum hover:text-copper-light transition-colors">
                      {c.value}
                    </a>
                  ) : (
                    c.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <ProcurementForm
            locale={locale}
            form={dict.form}
            labels={l}
            options={options}
            otherCode={locale === "tr" ? "DİĞER" : "OTHER"}
            successMessage={successMessage}
          />
        </div>
      </div>
    </section>
  );
}
