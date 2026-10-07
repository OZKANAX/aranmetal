import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteSlide } from "@/lib/actions/admin/slides";
import { PageHeader } from "@/components/admin/PageHeader";
import { SlideForm } from "@/components/admin/SlideForm";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export const metadata: Metadata = { title: "Slaytı Düzenle" };

export default async function EditSlidePage({ params, searchParams }: PageProps<"/admin/slides/[id]">) {
  const { id } = await params;
  const { created } = await searchParams;
  const slide = await db.slide.findUnique({ where: { id } });
  if (!slide) notFound();

  return (
    <>
      <PageHeader title={`${slide.titleTr} ${slide.highlightTr}`.trim()} description="Anasayfa slider'ı">
        <ConfirmDelete action={deleteSlide} id={slide.id} title="Slayt silinsin mi?" />
      </PageHeader>
      <SlideForm slide={slide} created={created === "1"} />
    </>
  );
}
