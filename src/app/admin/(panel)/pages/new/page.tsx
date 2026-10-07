import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { PageForm } from "@/components/admin/PageForm";

export const metadata: Metadata = { title: "Yeni Sayfa" };

export default function NewPagePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Yeni Sayfa" />
      <PageForm />
    </div>
  );
}
