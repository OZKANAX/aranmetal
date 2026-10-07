import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { SectionContent } from "@/lib/content/schema";
import { QuoteForm } from "../quote/QuoteForm";
import { Icon } from "../ui/Icon";

export function QuoteSection({
  c,
  locale,
  dict,
  productOptions,
  defaultProduct,
}: {
  c: SectionContent<"quote">;
  locale: Locale;
  dict: Dictionary;
  productOptions: string[];
  defaultProduct?: string;
}) {
  const features = [
    { icon: c.feature1Icon, title: c.feature1Title, text: c.feature1Text },
    { icon: c.feature2Icon, title: c.feature2Title, text: c.feature2Text },
    { icon: c.feature3Icon, title: c.feature3Title, text: c.feature3Text },
  ].filter((f) => f.title);

  return (
    <section className="w-full bg-paper pt-16 lg:pt-20 pb-24 lg:pb-32" id="quote-form">
      <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <h2 className="text-heading text-ink">
            {c.titleLine1} {c.titleLine2}
          </h2>
          <p className="text-body text-ink-2 mt-5">{c.description}</p>
          <ul className="mt-10 border-t border-rule">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-4 py-5 border-b border-rule">
                <Icon name={f.icon} className="text-[24px] text-copper mt-0.5" />
                <div>
                  <h3 className="text-body font-semibold text-ink">{f.title}</h3>
                  <p className="text-small text-ink-2 mt-1">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 bg-paper-2 p-6 sm:p-10 lg:p-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3 pb-6 mb-8 border-b border-rule-strong">
            <h3 className="text-subheading text-ink">{c.formTitle}</h3>
            {c.responseBadge && <span className="sentence text-caption text-ink-3">{c.responseBadge}</span>}
          </div>
          <QuoteForm
            locale={locale}
            labels={dict.form}
            productOptions={productOptions}
            defaultProduct={defaultProduct}
            successMessage={c.successMessage}
          />
        </div>
      </div>
    </section>
  );
}
