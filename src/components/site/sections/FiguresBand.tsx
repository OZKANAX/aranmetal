import { Icon } from "../ui/Icon";

const icons = ["workspace_premium", "science", "location_on", "inventory_2"];

/** Kurumsal renk bandında anahtar bilgiler (admin: Hero istatistikleri) */
export function FiguresBand({ title, stats }: { title: string; stats: { label: string; value: string }[] }) {
  if (stats.length === 0) return null;
  return (
    <section className="w-full bg-navy-2 text-white" aria-label={title}>
      <dl
        className={`page-x grid grid-cols-1 sm:grid-cols-2 ${stats.length >= 3 ? "lg:grid-cols-3" : ""} ${stats.length >= 4 ? "xl:grid-cols-4" : ""} divide-y sm:divide-y-0 lg:divide-x divide-navy-rule`}
      >
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-4 py-12 lg:py-16 px-6">
            <Icon name={icons[i % icons.length]} className="order-1 text-[40px] text-copper-light" />
            <dt className="sentence order-3 text-small text-on-navy-2">{s.label}</dt>
            <dd className="tnum order-2 text-[1.75rem] leading-tight font-semibold tracking-[-0.01em]">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
