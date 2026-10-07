import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, Mail, Phone, User } from "lucide-react";
import { db } from "@/lib/db";
import { deleteQuote } from "@/lib/actions/admin/quotes";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { QuoteStatusBadge } from "@/components/admin/QuoteStatusBadge";
import { QuoteUpdateForm } from "@/components/admin/QuoteUpdateForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Teklif Talebi" };

export default async function QuoteDetailPage({ params }: PageProps<"/admin/quotes/[id]">) {
  const { id } = await params;
  const q = await db.quoteRequest.findUnique({ where: { id } });
  if (!q) notFound();

  const contact = [
    { icon: User, label: "Ad Soyad", value: q.name },
    { icon: Building2, label: "Firma", value: q.company },
    { icon: Mail, label: "E-posta", value: q.email, href: `mailto:${q.email}` },
    { icon: Phone, label: "Telefon", value: q.phone, href: `tel:${q.phone.replace(/[^\d+]/g, "")}` },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={q.company}
        description={`${q.createdAt.toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })} · Dil: ${q.locale.toUpperCase()}`}
      >
        <QuoteStatusBadge status={q.status} />
        <ConfirmDelete action={deleteQuote} id={q.id} title="Talep silinsin mi?" />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid content-start gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Talep Detayı</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Ürün Grubu</div>
                  <div className="mt-1 font-medium">{q.product || "—"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Tahmini Miktar</div>
                  <div className="mt-1 font-medium">{q.quantity || "—"}</div>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Not / Şartname</div>
                <p className="mt-1 whitespace-pre-wrap rounded-md border bg-muted/40 p-3 text-sm">{q.message || "—"}</p>
              </div>
            </CardContent>
          </Card>
          <QuoteUpdateForm id={q.id} status={q.status} note={q.note} />
        </div>

        <Card className="content-start">
          <CardHeader>
            <CardTitle>İletişim</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {contact.map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <c.icon className="mt-0.5 size-4 text-primary" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className="break-all font-medium hover:text-primary">
                      {c.value}
                    </a>
                  ) : (
                    <div className="font-medium">{c.value}</div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
