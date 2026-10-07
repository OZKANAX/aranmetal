import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Yeni Ürün" };

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="Yeni Ürün" description="Kataloğa yeni bir ürün ekleyin." />
      <ProductForm />
    </>
  );
}
