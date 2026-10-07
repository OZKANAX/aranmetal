import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { deletePage } from "@/lib/actions/admin/pages";
import { PageHeader } from "@/components/admin/PageHeader";
import { PageForm } from "@/components/admin/PageForm";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Sayfayı Düzenle" };

export default async function EditPagePage({ params, searchParams }: PageProps<"/admin/pages/[id]">) {
  const { id } = await params;
  const { created } = await searchParams;
  const page = await db.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={page.titleTr} description={`/tr/legal/${page.slug}`}>
        <a href={`/tr/legal/${page.slug}`} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "lg" })}>
          <ExternalLink />
          Sitede Gör
        </a>
        <ConfirmDelete action={deletePage} id={page.id} title="Sayfa silinsin mi?" />
      </PageHeader>
      <PageForm page={page} created={created === "1"} />
    </div>
  );
}
