"use client";

import { useSearchParams } from "next/navigation";
import { ProductCatalog, type ProductCatalogProps } from "./ProductCatalog";

/** ?category= parametresini okuyan sarmalayıcı (Suspense içinde kullanın). */
export function UrlProductCatalog(props: ProductCatalogProps) {
  const params = useSearchParams();
  const category = params.get("category");
  // Menüden başka bir kategori seçilince (aynı sayfadayken) filtre yeniden kurulur
  return <ProductCatalog key={category ?? "all"} {...props} initialCategory={category} syncWithUrl />;
}
