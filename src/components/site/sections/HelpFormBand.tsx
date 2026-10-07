import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { SectionContent } from "@/lib/content/schema";
import { QuoteForm } from "../quote/QuoteForm";
import { Icon } from "../ui/Icon";

/** Lacivert bantta iletişim/teklif formu: solda başlık ve iletişim kanalları, sağda form */
export function HelpFormBand({
  title,
  text,
  quote,
  general,
  locale,
  dict,
  productOptions,
}: {
  title: string;
  text: string;
  quote: SectionContent<"quote">;
  general: SectionContent<"general">;
  locale: Locale;
  dict: Dictionary;
  productOptions: string[];
}) {
  const channels = [
    { icon: "call", label: dict.contact.phoneLabel, value: general.phone, href: `tel:${general.phone.replace(/[^\d+]/g, "")}` },
    { icon: "mail", label: dict.contact.emailLabel, value: general.email, href: `mailto:${general.email}` },
    { icon: "location_on", label: dict.contact.addressLabel, value: general.address },
  ];

  return (
    <section className="w-full bg-navy-2 text-white section-y" id="quote-form">
      <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <h2 className="text-heading text-white">{title}</h2>
          <p className="text-lead text-on-navy-2 mt-5 max-w-[46ch]">{text}</p>
          <ul className="mt-10 border-t border-navy-rule">
            {channels.map((ch) => (
              <li key={ch.icon} className="flex items-start gap-4 py-5 border-b border-navy-rule">
                <Icon name={ch.icon} className="text-[22px] text-copper-light mt-0.5" />
                <div className="min-w-0">
                  <span className="block text-caption text-on-navy-2">{ch.label}</span>
                  {ch.href ? (
                    <a href={ch.href} className="tnum block text-body font-semibold text-white hover:text-copper-light transition-colors break-words">
                      {ch.value}
                    </a>
                  ) : (
                    <span className="block text-body text-white">{ch.value}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 bg-paper text-ink p-6 sm:p-10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]">
          <h3 className="text-subheading text-ink pb-6 mb-8 border-b border-rule-strong">{quote.formTitle}</h3>
          <QuoteForm
            locale={locale}
            labels={dict.form}
            productOptions={productOptions}
            successMessage={quote.successMessage}
          />
        </div>
      </div>
    </section>
  );
}
