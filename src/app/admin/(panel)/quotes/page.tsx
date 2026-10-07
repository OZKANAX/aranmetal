import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { QUOTE_STATUSES, QUOTE_STATUS_LABELS } from "@/lib/quote-status";
import { PageHeader } from "@/components/admin/PageHeader";
import { QuoteStatusBadge } from "@/components/admin/QuoteStatusBadge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Teklif Talepleri" };

export default async function QuotesPage({ searchParams }: PageProps<"/admin/quotes">) {
  const { status } = await searchParams;
  const filter = typeof status === "string" && (QUOTE_STATUSES as readonly string[]).includes(status) ? status : undefined;

  const [quotes, counts] = await Promise.all([
    db.quoteRequest.findMany({ where: filter ? { status: filter } : undefined, orderBy: { createdAt: "desc" } }),
    db.quoteRequest.groupBy({ by: ["status"], _count: true }),
  ]);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;
  const total = counts.reduce((a, c) => a + c._count, 0);

  const tabs = [{ key: undefined, label: "Tümü", count: total }, ...QUOTE_STATUSES.map((s) => ({ key: s, label: QUOTE_STATUS_LABELS[s], count: countOf(s) }))];

  return (
    <>
      <PageHeader title="Teklif Talepleri" description="Web sitesindeki teklif formundan gelen talepler." />

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = filter === t.key;
          return (
            <Link
              key={t.label}
              href={t.key ? `/admin/quotes?status=${t.key}` : "/admin/quotes"}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                active ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent/40"
              }`}
            >
              {t.label}
              <span className="font-mono text-xs text-muted-foreground">{t.count}</span>
            </Link>
          );
        })}
      </div>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Firma / Kişi</TableHead>
              <TableHead className="hidden lg:table-cell">İletişim</TableHead>
              <TableHead className="hidden md:table-cell">Ürün / Miktar</TableHead>
              <TableHead className="hidden sm:table-cell">Tarih</TableHead>
              <TableHead>Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Bu filtrede talep yok.
                </TableCell>
              </TableRow>
            )}
            {quotes.map((q) => (
              <TableRow key={q.id} className={q.status === "new" ? "bg-primary/[0.03]" : ""}>
                <TableCell>
                  <Link href={`/admin/quotes/${q.id}`} className="font-medium hover:text-primary">
                    {q.company}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {q.name} · <span className="uppercase">{q.locale}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm">
                  <div>{q.email}</div>
                  <div className="text-xs text-muted-foreground">{q.phone}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  <div>{q.product || "—"}</div>
                  <div className="text-xs text-muted-foreground">{q.quantity}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {q.createdAt.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                </TableCell>
                <TableCell>
                  <QuoteStatusBadge status={q.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
