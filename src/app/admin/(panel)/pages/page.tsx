import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Yasal Sayfalar" };

export default async function PagesAdminPage() {
  const pages = await db.page.findMany({ orderBy: { slug: "asc" } });

  return (
    <>
      <PageHeader title="Yasal Sayfalar" description="KVKK, gizlilik ve kullanım koşulları gibi metin sayfaları. Alt bilgide listelenir.">
        <Link href="/admin/pages/new" className={buttonVariants({ size: "lg" })}>
          <Plus />
          Yeni Sayfa
        </Link>
      </PageHeader>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead className="hidden md:table-cell">Adres</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="font-medium">{p.titleTr}</div>
                  <div className="text-xs text-muted-foreground">{p.titleEn}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">/tr/legal/{p.slug}</TableCell>
                <TableCell>{p.published ? <Badge>Yayında</Badge> : <Badge variant="secondary">Taslak</Badge>}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/pages/${p.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    <Pencil />
                    Düzenle
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
