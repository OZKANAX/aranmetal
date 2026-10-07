import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { sections, sectionKeys } from "@/lib/content/schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Site İçeriği" };

const groups = [
  { key: "general", title: "Genel" },
  { key: "home", title: "Anasayfa Bölümleri" },
  { key: "pages", title: "Alt Sayfalar" },
] as const;

export default async function ContentIndexPage() {
  const rows = await db.contentSection.findMany({ select: { key: true, updatedAt: true } });
  const updated = new Map(rows.map((r) => [r.key, r.updatedAt]));

  return (
    <>
      <PageHeader
        title="Site İçeriği"
        description="Sitedeki metinleri ve görselleri Türkçe ve İngilizce olarak düzenleyin."
      />
      <div className="grid gap-8">
        {groups.map((g) => (
          <section key={g.key}>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">{g.title}</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {sectionKeys
                .filter((k) => sections[k].group === g.key)
                .map((k) => {
                  const s = sections[k];
                  const date = updated.get(k);
                  return (
                    <Link
                      key={k}
                      href={`/admin/content/${k}`}
                      className="group flex items-start justify-between gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent/40"
                    >
                      <div className="min-w-0">
                        <div className="font-medium">{s.title}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline">{Object.keys(s.fields).length} alan</Badge>
                          {date ? (
                            <span className="text-xs text-muted-foreground">
                              Güncellendi: {date.toLocaleDateString("tr-TR")}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Varsayılan içerik</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
