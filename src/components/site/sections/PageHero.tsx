import Link from "next/link";
import { BgImage } from "../ui/BgImage";
import { Icon } from "../ui/Icon";

/** Alt sayfalar için başlık bloğu + breadcrumb; görsel varsa altında geniş plaka. */
export function PageHero({
  title,
  intro,
  image,
  breadcrumbs,
  meta,
}: {
  /** @deprecated üst başlık artık gösterilmiyor */
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string;
  breadcrumbs: { href?: string; label: string }[];
  meta?: React.ReactNode;
}) {
  return (
    <section className="w-full bg-paper">
      <div className="page-x pt-10 lg:pt-14 pb-12 lg:pb-16">
        <nav aria-label="Breadcrumb" className="mb-10 lg:mb-14">
          <ol className="flex flex-wrap items-center gap-1.5 text-caption text-ink-3">
            {breadcrumbs.map((b, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <Icon name="chevron_right" className="text-[16px] text-rule-strong" />}
                {b.href ? (
                  <Link href={b.href} className="hover:text-copper transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink">
                    {b.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <h1 className="lg:col-span-7 text-title text-ink">{title}</h1>
          {(intro || meta) && (
            <div className="lg:col-span-5 flex flex-col gap-4">
              {intro && <p className="text-lead text-ink-2 max-w-[52ch]">{intro}</p>}
              {meta}
            </div>
          )}
        </div>
      </div>
      {image ? (
        <div className="page-x">
          <div className="relative aspect-[16/7] sm:aspect-[21/7] overflow-hidden bg-paper-3">
            <BgImage src={image} className="absolute inset-0" />
          </div>
        </div>
      ) : (
        <div className="page-x">
          <div className="border-t border-rule" />
        </div>
      )}
    </section>
  );
}
