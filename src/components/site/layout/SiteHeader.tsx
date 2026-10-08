import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { SectionContent } from "@/lib/content/schema";
import { Icon } from "../ui/Icon";
import { HeaderFrame } from "./HeaderFrame";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { getNavItems, quoteHref } from "./nav";

export function SiteHeader({
  locale,
  dict,
  general,
}: {
  locale: Locale;
  dict: Dictionary;
  general: SectionContent<"general">;
}) {
  const items = getNavItems(locale, dict);

  return (
    <HeaderFrame homeHref={`/${locale}`}>
      <Link href={`/${locale}`} className="site-header__logo shrink-0" aria-label={general.companyName}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-dark.svg" alt="" className="h-[2.7rem] xl:h-12 w-auto" />
      </Link>

      <NavLinks items={items} />

      <div className="flex items-center gap-3 sm:gap-6">
        <LanguageSwitcher locale={locale} className="hidden sm:flex" />
        <Link
          href={quoteHref(locale)}
          className="group btn-copper max-[400px]:hidden inline-flex h-10 items-center gap-2 px-4 text-small font-semibold whitespace-nowrap"
        >
          {dict.nav.quote}
          <Icon name="arrow_forward" className="arrow-nudge text-[17px]" />
        </Link>
        <MobileMenu
          items={items}
          locale={locale}
          labels={{ menu: dict.nav.menu, close: dict.nav.close }}
          quote={{ href: quoteHref(locale), label: dict.nav.quote }}
          contact={{ phone: general.phone, email: general.email }}
        />
      </div>
    </HeaderFrame>
  );
}
