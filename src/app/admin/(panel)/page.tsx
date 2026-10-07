import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Inbox, Package, PanelsTopLeft } from "lucide-react";
import { db } from "@/lib/db";
import { sectionKeys } from "@/lib/content/schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { QuoteStatusBadge } from "@/components/admin/QuoteStatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Gösterge Paneli" };

export default async function DashboardPage() {
  const [productCount, publishedCount, quoteCount, newQuotes, pageCount, editedSections, recent] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { published: true } }),
    db.quoteRequest.count(),
    db.quoteRequest.count({ where: { status: "new" } }),
    db.page.count(),
    db.contentSection.count(),
    db.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { label: "Yeni Teklif Talebi", value: newQuotes, sub: `Toplam ${quoteCount} talep`, icon: Inbox, href: "/admin/quotes?status=new", accent: true },
    { label: "Ürünler", value: productCount, sub: `${publishedCount} yayında`, icon: Package, href: "/admin/products" },
    { label: "İçerik Bölümleri", value: sectionKeys.length, sub: `${editedSections} özelleştirildi`, icon: PanelsTopLeft, href: "/admin/content" },
    { label: "Yasal Sayfalar", value: pageCount, sub: "KVKK, gizlilik vb.", icon: FileText, href: "/admin/pages" },
  ];

  return (
    <>
      <PageHeader title="Gösterge Paneli" description="Sitenizin genel durumu ve son teklif talepleri." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <Card className={`h-full transition-colors group-hover:border-primary/50 ${s.accent && s.value > 0 ? "border-primary/40 bg-primary/5" : ""}`}>
              <CardHeader>
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="font-heading text-3xl tabular-nums">{s.value}</CardTitle>
                <CardAction>
                  <s.icon className="size-5 text-primary" />
                </CardAction>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">{s.sub}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Son Teklif Talepleri</CardTitle>
          <CardDescription>Web sitesindeki formdan gelen talepler.</CardDescription>
          <CardAction>
            <Link href="/admin/quotes" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Tümü <ArrowRight />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Henüz teklif talebi yok.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firma / Kişi</TableHead>
                  <TableHead className="hidden md:table-cell">Ürün</TableHead>
                  <TableHead className="hidden sm:table-cell">Tarih</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>
                      <Link href={`/admin/quotes/${q.id}`} className="font-medium hover:text-primary">
                        {q.company}
                      </Link>
                      <div className="text-xs text-muted-foreground">{q.name}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{q.product || "—"}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </>
  );
}
