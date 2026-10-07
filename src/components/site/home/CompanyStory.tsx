import Link from "next/link";
import { Icon } from "../ui/Icon";

/**
 * Kurumsal hikâye: büyük cümle, asimetrik fotoğraf plakası ve künye.
 */
export function CompanyStory({
  title,
  paragraphs,
  image,
  facts,
  link,
  tag,
}: {
  title: string;
  paragraphs: string[];
  image: string;
  facts: { term: string; text: string }[];
  link: { href: string; label: string };
  tag: string[];
}) {
  return (
    <section aria-labelledby="story-title" className="bg-paper text-ink pb-20 lg:pb-32">
      <div className="page-x">
        <div className="border-t border-rule pt-20 lg:pt-32 grid grid-cols-1 lg:grid-cols-12 gap-x-8">
          <h2 id="story-title" className="lg:col-span-10 font-display text-title text-ink max-w-[20ch]">
            {title}
          </h2>
        </div>

        <div className="mt-12 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10">
          <div className="lg:col-span-7 -mx-4 sm:-mx-8 lg:mr-0 lg:ml-[calc(-3rem-max(0px,(100vw-1440px)/2))]">
            <div className="relative aspect-[16/10] lg:aspect-[4/3] overflow-hidden bg-paper-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <ul className="absolute right-4 bottom-4 lg:right-6 lg:bottom-6 border border-white/45 bg-graphite/80 font-mono text-data text-white divide-y divide-white/25">
                {tag.map((t) => (
                  <li key={t} className="px-3 py-1.5 tnum">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 flex flex-col">
            <div className="space-y-5 text-body text-ink-2 max-w-[60ch]">
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "text-lead text-ink" : undefined}>
                  {p}
                </p>
              ))}
            </div>

            <dl className="mt-10 border-t border-ink">
              {facts.map((f) => (
                <div key={f.term} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 border-b border-rule text-small">
                  <dt className="font-mono text-data text-ink-3 pt-0.5">{f.term}</dt>
                  <dd className="text-ink">{f.text}</dd>
                </div>
              ))}
            </dl>

            <Link href={link.href} className="group nav-line mt-8 self-start inline-flex items-center gap-2 text-small font-semibold text-ink">
              {link.label}
              <Icon name="arrow_forward" className="arrow-nudge text-[17px] text-ink" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
