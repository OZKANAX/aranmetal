import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocalizedProduct } from "@/lib/content/queries";
import { clean } from "../ui/Eyebrow";

/** Faaliyet raporu tablosu: sabit sütunlar, ince satır çizgileri, tablo rakamları. */
export function SpecTable({
  products,
  title,
  standard,
  labels,
}: {
  products: LocalizedProduct[];
  title: string;
  standard: string;
  labels: Dictionary["spec"];
}) {
  const rows = products.filter((p) => p.spec.show);
  if (rows.length === 0) return null;

  return (
    <div id="spec-table" className="mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b-2 border-ink">
        <h3 className="text-subheading text-ink">{clean(title)}</h3>
        {standard && <span className="text-caption text-ink-3">{clean(standard)}</span>}
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[720px] text-left text-small">
          <thead>
            <tr className="text-caption text-ink-3 border-b border-rule-strong">
              <th scope="col" className="py-3 pr-6 font-semibold">{labels.code}</th>
              <th scope="col" className="py-3 pr-6 font-semibold">{labels.material}</th>
              <th scope="col" className="py-3 pr-6 font-semibold">{labels.purity}</th>
              <th scope="col" className="py-3 pr-6 font-semibold">{labels.form}</th>
              <th scope="col" className="py-3 font-semibold text-right">{labels.unit}</th>
            </tr>
          </thead>
          <tbody className="text-ink">
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-rule hover:bg-paper-2 transition-colors">
                <td className="py-4 pr-6 font-semibold text-copper whitespace-nowrap">{p.spec.code}</td>
                <th scope="row" className="py-4 pr-6 font-semibold">{p.spec.material}</th>
                <td className="py-4 pr-6 whitespace-nowrap">{p.spec.purity}</td>
                <td className="py-4 pr-6 text-ink-2">{p.spec.form}</td>
                <td className="py-4 text-right text-ink-2 whitespace-nowrap">{p.spec.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
