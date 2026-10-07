import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { SectionContent } from "@/lib/content/schema";
import { BgImage } from "../ui/BgImage";
import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";

/** Anasayfa hakkımızda bloğu: arkasında bakır blok olan fotoğraf + metin */
export function AboutBlock({ c, locale }: { c: SectionContent<"corporate">; locale: Locale }) {
  return (
    <section className="w-full bg-paper-2 section-y" id="about">
      <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
        <div className="lg:col-span-6 relative pl-6 pt-6 sm:pl-10 sm:pt-10">
          <div aria-hidden="true" className="absolute left-0 top-0 h-[85%] w-[78%] bg-copper" />
          <div className="relative aspect-[4/3] overflow-hidden bg-paper-3 shadow-[0_24px_48px_-20px_rgba(15,30,46,0.35)]">
            <BgImage src={c.card1Image} className="absolute inset-0" />
          </div>
        </div>

        <div className="lg:col-span-6 lg:pl-4">
          <h2 className="text-heading text-ink">{c.title}</h2>
          {c.intro && <p className="text-lead font-medium text-ink mt-6 max-w-[54ch]">{c.intro}</p>}
          <p className="text-body text-ink-2 mt-5 max-w-[60ch]">{c.card1Text}</p>
          {c.card2Text && <p className="text-body text-ink-2 mt-4 max-w-[60ch]">{c.card2Text}</p>}

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-10">
            <ButtonLink href={`/${locale}/about`} trailingIcon="arrow_forward">
              {c.card1Cta}
            </ButtonLink>
            <Link href={`/${locale}/logistics`} className="text-link text-small">
              <span>{c.card2Title}</span>
              <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
