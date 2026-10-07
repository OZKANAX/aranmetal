import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { moveProduct, toggleProductPublished } from "@/lib/actions/admin/products";
import { PageHeader } from "@/components/admin/PageHeader";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Ürünler" };

const categoryLabel = Object.fromEntries(PRODUCT_CATEGORIES.map((c) => [c.value, c.label]));

export default async function ProductsAdminPage() {
  const products = await db.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });

  return (
    <>
      <PageHeader title="Ürünler" description="Ürün kataloğunu ve teknik tabloyu yönetin.">
        <Link href="/admin/products/new" className={buttonVariants({ size: "lg" })}>
          <Plus />
          Yeni Ürün
        </Link>
      </PageHeader>

      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Görsel</TableHead>
              <TableHead>Ürün</TableHead>
              <TableHead className="hidden md:table-cell">Kategori</TableHead>
              <TableHead className="hidden lg:table-cell">Stok</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Henüz ürün yok.
                </TableCell>
              </TableRow>
            )}
            {products.map((p, i) => (
              <TableRow key={p.id}>
                <TableCell>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="h-10 w-14 rounded object-cover" />
                </TableCell>
                <TableCell>
                  <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-primary">
                    {p.nameTr}
                  </Link>
                  <div className="font-mono text-xs text-muted-foreground">
                    {p.code} · {p.nameEn || "— EN eksik"}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{categoryLabel[p.category] ?? p.category}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm">{p.inStock ? "Mevcut" : "Sorunuz"}</TableCell>
                <TableCell>
                  {p.published ? <Badge>Yayında</Badge> : <Badge variant="secondary">Taslak</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <form action={moveProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="dir" value="up" />
                      <Button type="submit" variant="ghost" size="icon-sm" disabled={i === 0} aria-label="Yukarı taşı">
                        <ArrowUp />
                      </Button>
                    </form>
                    <form action={moveProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="dir" value="down" />
                      <Button type="submit" variant="ghost" size="icon-sm" disabled={i === products.length - 1} aria-label="Aşağı taşı">
                        <ArrowDown />
                      </Button>
                    </form>
                    <form action={toggleProductPublished}>
                      <input type="hidden" name="id" value={p.id} />
                      <Button type="submit" variant="ghost" size="icon-sm" aria-label={p.published ? "Yayından kaldır" : "Yayınla"}>
                        {p.published ? <EyeOff /> : <Eye />}
                      </Button>
                    </form>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      <Pencil />
                      Düzenle
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
