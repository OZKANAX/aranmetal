import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { SectionContent } from "@/lib/content/schema";
import { Icon } from "../ui/Icon";
import { quoteHref } from "./nav";

const linkClass = "text-small text-on-navy-2 hover:text-white transition-colors";

export function SiteFooter({
  locale,
  dict,
  general,
  categories,
  legalPages,
}: {
  locale: Locale;
  dict: Dictionary;
  general: SectionContent<"general">;
  categories: { key: string; label: string }[];
  legalPages: { slug: string; title: string }[];
}) {
  const l = dict.landing;
  const socials = [
    { href: general.linkedin, label: "LinkedIn" },
    { href: general.instagram, label: "Instagram" },
  ].filter((s) => s.href);
  const [first, ...rest] = l.footerStatement.split(". ");

  return (
    <footer className="w-full bg-graphite text-on-navy">
      <div className="page-x">
        {/* Kapanış cümlesi ve tek eylem */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 pt-20 lg:pt-28 pb-16 lg:pb-20 border-b border-graphite-rule">
          <p className="lg:col-span-9 font-display text-[clamp(2.5rem,1.2rem+4.6vw,5.5rem)] leading-[0.98] tracking-[-0.035em] font-[760] text-white">
            {first}
            {rest.length > 0 && "."}
            {rest.length > 0 && (
              <>
                <br />
                <span className="text-steel">{rest.join(". ")}</span>
              </>
            )}
          </p>
          <div className="lg:col-span-3 flex lg:justify-end lg:items-end">
            <Link href={quoteHref(locale)} className="group btn-copper inline-flex h-14 items-center gap-3 px-6 text-body font-semibold">
              {dict.nav.quote}
              <Icon name="arrow_forward" className="arrow-nudge text-[20px]" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-x-8 gap-y-12 py-16">
          <div className="col-span-2 md:col-span-3 lg:col-span-3 flex flex-col gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-dark.svg" alt={general.companyName} className="h-11 w-auto self-start" />
            <p className="text-small text-on-navy-2 max-w-[38ch]">{general.footerDescription}</p>
            {socials.length > 0 && (
              <div className="flex gap-5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small font-semibold text-on-navy hover:text-copper-light transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterColumn title={l.footerCompany} className="lg:col-span-2 lg:col-start-5">
            <Link href={`/${locale}/about`} className={linkClass}>
              {dict.nav.about}
            </Link>
            <Link href={`/${locale}/logistics`} className={linkClass}>
              {dict.nav.logistics}
            </Link>
            <Link href={`/${locale}/contact`} className={linkClass}>
              {dict.nav.contact}
            </Link>
            <Link href={quoteHref(locale)} className={linkClass}>
              {dict.nav.quote}
            </Link>
          </FooterColumn>

          <FooterColumn title={dict.footer.categories} className="lg:col-span-2">
            {categories.map((c) => (
              <Link key={c.key} href={`/${locale}/products?category=${c.key}`} className={linkClass}>
                {c.label}
              </Link>
            ))}
            <Link href={`/${locale}/products`} className={linkClass}>
              {dict.home.allProducts}
            </Link>
          </FooterColumn>

          <FooterColumn title={l.footerMarkets} className="lg:col-span-2">
            {l.regions.map((r) => (
              <span key={r.id} className="text-small text-on-navy-2">
                {r.name}
              </span>
            ))}
          </FooterColumn>

          <FooterColumn title={l.footerStandards} className="lg:col-span-2">
            <Link href={`/${locale}/products#spec-table`} className={linkClass}>
              {l.footerSpecTable}
            </Link>
            <span className="font-mono text-data text-steel">ASTM B115 · EN 1978</span>
            <span className="font-mono text-data text-steel">LME Grade A · P1020</span>
          </FooterColumn>
        </div>

        {/* İletişim satırı */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 py-8 border-t border-graphite-rule">
          <FooterFact term={dict.contact.address}>
            <address className="not-italic">{general.address}</address>
          </FooterFact>
          <FooterFact term={dict.contact.phone}>
            <a href={`tel:${general.phone.replace(/[^\d+]/g, "")}`} className="tnum hover:text-copper-light transition-colors">
              {general.phone}
            </a>
          </FooterFact>
          <FooterFact term={dict.contact.email}>
            <a href={`mailto:${general.email}`} className="hover:text-copper-light transition-colors">
              {general.email}
            </a>
          </FooterFact>
          <FooterFact term={dict.contact.hours}>{general.workingHours}</FooterFact>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 border-t border-graphite-rule">
          <span className="text-caption text-steel">{general.copyright}</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalPages.map((p) => (
              <Link key={p.slug} href={`/${locale}/legal/${p.slug}`} className="text-caption text-steel hover:text-white transition-colors">
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <h2 className="font-mono text-data text-steel mb-2">{title}</h2>
      {children}
    </div>
  );
}

function FooterFact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="text-small text-on-navy">
      <p className="font-mono text-data text-steel mb-1.5">{term}</p>
      {children}
    </div>
  );
}
