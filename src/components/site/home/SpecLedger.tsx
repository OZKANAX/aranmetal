type Entry = { figure: string; unit: string; label: string; text: string };

/**
 * Güven bölümü: dört rakam, her biri bağlamıyla. Kart yok; bir defter gibi satırlar.
 * Sayısal rakamlar büyük, sözel olanlar bir kademe küçük dizilir.
 */
export function SpecLedger({ title, intro, entries }: { title: string; intro: string; entries: Entry[] }) {
  return (
    <section aria-labelledby="ledger-title" className="bg-paper text-ink section-y">
      <div className="page-x grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            <h2 id="ledger-title" className="font-display text-title text-ink max-w-[10ch]">
              {title}
            </h2>
            <p className="mt-6 text-body text-ink-2 max-w-[40ch]">{intro}</p>
          </div>
        </div>

        <dl className="lg:col-span-8 border-t-2 border-ink">
          {entries.map((e) => {
            const numeric = /^[\d.,+]+$/.test(e.figure);
            return (
              <div
                key={e.label}
                className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-x-10 gap-y-3 py-8 lg:py-10 border-b border-rule"
              >
                <dt className="order-2 sm:order-none sm:col-start-2 sm:row-start-1 self-end">
                  <span className="block font-mono text-data text-ink-3">{e.label}</span>
                  <span className="block mt-2 text-small text-ink-2 max-w-[42ch]">{e.text}</span>
                </dt>
                <dd
                  className={`order-1 sm:order-none sm:col-start-1 sm:row-start-1 font-display tnum text-ink ${
                    numeric
                      ? "text-[clamp(3.25rem,2rem+4.2vw,6rem)] leading-[0.9] tracking-[-0.04em] font-[780]"
                      : "text-[clamp(1.75rem,1.2rem+1.6vw,2.6rem)] leading-[1.02] tracking-[-0.025em] font-[740] self-end"
                  }`}
                >
                  {e.figure}
                  {e.unit && <span className="ml-1 text-[0.4em] align-top text-ink-3">{e.unit}</span>}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
