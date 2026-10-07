import type { Locale } from "@/i18n/config";
import type { SectionContent } from "@/lib/content/schema";
import { quoteHref } from "../layout/nav";
import { ButtonLink } from "../ui/Button";

/** Sayfa sonlarında teklif sayfasına yönlendiren lacivert bant */
export function CtaBand({
  c,
  locale,
  showContact = true,
}: {
  c: SectionContent<"cta">;
  locale: Locale;
  showContact?: boolean;
}) {
  return (
    <section className="w-full bg-navy-2 text-white">
      <div className="page-x py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-7">
          <h2 className="text-heading text-white">{c.title}</h2>
          <p className="text-lead text-on-navy-2 mt-5 max-w-[56ch]">{c.text}</p>
        </div>
        <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
          <ButtonLink href={quoteHref(locale)} size="lg" trailingIcon="arrow_forward">
            {c.primaryLabel}
          </ButtonLink>
          {showContact && (
            <ButtonLink href={`/${locale}/contact`} variant="outlineOnDark" size="lg">
              {c.secondaryLabel}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
