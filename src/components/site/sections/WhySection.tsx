import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { SectionContent } from "@/lib/content/schema";
import { BgImage } from "../ui/BgImage";
import { Icon } from "../ui/Icon";

/** Neden Aran Metal: solda metin + avantaj listesi, sağda fotoğraf */
export function WhySection({
  solution,
  quote,
  locale,
}: {
  solution: SectionContent<"solution">;
  quote: SectionContent<"quote">;
  locale: Locale;
}) {
  const features = [
    { icon: quote.feature1Icon, title: quote.feature1Title, text: quote.feature1Text },
    { icon: quote.feature2Icon, title: quote.feature2Title, text: quote.feature2Text },
    { icon: quote.feature3Icon, title: quote.feature3Title, text: quote.feature3Text },
  ].filter((f) => f.title);

  return (
    <section className="w-full bg-paper pt-20 lg:pt-28 pb-20 lg:pb-28" id="solutions">
      <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6">
          <h2 className="text-heading text-ink">{solution.title}</h2>
          <p className="text-lead text-ink-2 mt-6 max-w-[56ch]">{solution.description}</p>

          <ul className="mt-10 flex flex-col gap-7">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-copper/30 text-copper">
                  <Icon name={f.icon} className="text-[28px]" />
                </span>
                <div>
                  <h3 className="text-subheading text-ink">{f.title}</h3>
                  <p className="text-small text-ink-2 mt-1.5 max-w-[50ch]">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link href={`/${locale}/products`} className="text-link text-body mt-10">
            <span>{solution.ctaLabel}</span>
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>

        <figure className="lg:col-span-6">
          <div className="relative aspect-[5/4] overflow-hidden bg-paper-3">
            <BgImage src={solution.image} alt={solution.title} className="absolute inset-0" />
          </div>
          {solution.standardsNote && (
            <figcaption className="mt-3 text-caption tracking-[0.02em] text-ink-3">{solution.standardsNote}</figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
