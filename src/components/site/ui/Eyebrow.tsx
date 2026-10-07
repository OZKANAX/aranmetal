/** Admin içeriğinden gelen eski "// " öneklerini temizler. */
export const clean = (s?: string | null) => (s ?? "").replace(/^\s*\/\/\s*/, "").replace(/\s*\/\/\s*/g, " · ").trim();

/** Bölüm başlığı: solda başlık, sağda giriş metni veya eylem. */
export function SectionHeading({
  title,
  intro,
  children,
  className = "",
}: {
  title: string;
  intro?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-12 lg:mb-16 ${className}`}>
      <h2 className="lg:col-span-7 text-heading text-ink">{title}</h2>
      {(intro || children) && (
        <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-5">
          {intro && <p className="text-lead text-ink-2 lg:text-left max-w-[52ch]">{intro}</p>}
          {children}
        </div>
      )}
    </div>
  );
}

/** Tamamı büyük harfle girilmiş başlıkları Türkçe kurallarıyla cümle düzenine çevirir; karışık yazılmışlara dokunmaz. */
export function sentenceCase(s: string, locale: string, capitalizeFirst = true) {
  const tag = locale === "tr" ? "tr-TR" : "en-US";
  if (!s || s !== s.toLocaleUpperCase(tag) || s === s.toLocaleLowerCase(tag)) return s;
  const lower = s.toLocaleLowerCase(tag);
  return capitalizeFirst ? lower.charAt(0).toLocaleUpperCase(tag) + lower.slice(1) : lower;
}
