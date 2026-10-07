import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { deleteProduct } from "@/lib/actions/admin/products";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Ürünü Düzenle" };

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const { created } = await searchParams;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <>
      <PageHeader title={product.nameTr} description={`${product.code} · /${product.slug}`}>
        <a
          href={`/tr/products/${product.slug}`}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          <ExternalLink />
          Sitede Gör
        </a>
        <ConfirmDelete
          action={deleteProduct}
          id={product.id}
          title="Ürün silinsin mi?"
          description={`“${product.nameTr}” kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        />
      </PageHeader>
      <ProductForm product={product} created={created === "1"} />
    </>
  );
}
