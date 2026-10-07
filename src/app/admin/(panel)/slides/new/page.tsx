import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { SlideForm } from "@/components/admin/SlideForm";

export const metadata: Metadata = { title: "Yeni Slayt" };

export default function NewSlidePage() {
  return (
    <>
      <PageHeader title="Yeni Slayt" description="Anasayfa slider'ına yeni bir slayt ekleyin." />
      <SlideForm />
    </>
  );
}
