"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const text = {
  tr: { title: "Sayfa Bulunamadı", body: "Aradığınız sayfa taşınmış veya kaldırılmış olabilir.", back: "Anasayfaya Dön" },
  en: { title: "Page Not Found", body: "The page you are looking for may have been moved or removed.", back: "Back to Home" },
};

export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "tr";
  const t = text[locale];

  return (
    <section className="flex-1 w-full flex items-center bg-paper py-28">
      <div className="page-x">
        <p className="tnum text-heading font-semibold text-copper">404</p>
        <h1 className="text-title text-ink mt-4">{t.title}</h1>
        <p className="text-lead text-ink-2 mt-5 max-w-[48ch]">{t.body}</p>
        <Link
          href={`/${locale}`}
          className="mt-10 inline-flex h-12 items-center gap-2 rounded-[2px] bg-copper px-6 font-semibold text-white transition-colors hover:bg-copper-deep"
        >
          {t.back}
        </Link>
      </div>
    </section>
  );
}
