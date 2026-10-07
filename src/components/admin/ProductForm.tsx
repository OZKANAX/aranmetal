"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { Product } from "@prisma/client";
import { saveProduct } from "@/lib/actions/admin/products";
import { initialActionState } from "@/lib/actions/admin/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, LocalizedInput, SubmitButton, useFormAction } from "./form/form-kit";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { ImageField } from "./form/ImageField";

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-input/30 px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function Check({ name, label, defaultChecked, help }: { name: string; label: string; defaultChecked: boolean; help?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-accent/30">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 size-4 accent-[var(--primary)]" />
      <span className="grid gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        {help && <span className="text-xs text-muted-foreground">{help}</span>}
      </span>
    </label>
  );
}

function slugify(text: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
  return text
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]/g, (c) => map[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({ product, created }: { product?: Product; created?: boolean }) {
  const [state, onSubmit, pending] = useFormAction(saveProduct, initialActionState);

  useEffect(() => {
    if (created) toast.success("Ürün oluşturuldu.");
  }, [created]);

  const p = product;
  const L = (tr?: string, en?: string) => ({ tr: tr ?? "", en: en ?? "" });

  return (
    <form onSubmit={onSubmit} className="grid gap-6" key={state.nonce ?? 0}>
      {p && <input type="hidden" name="id" value={p.id} />}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="grid content-start gap-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ürün Bilgileri</CardTitle>
              <CardDescription>Kartlarda ve ürün detay sayfasında gösterilir.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <LocalizedInput
                label="Ürün Adı"
                name={{ tr: "nameTr", en: "nameEn" }}
                values={L(p?.nameTr, p?.nameEn)}
                required
              />
              <LocalizedInput
                label="Alt Başlık (kategori etiketi)"
                name={{ tr: "subtitleTr", en: "subtitleEn" }}
                values={L(p?.subtitleTr, p?.subtitleEn)}
                help="Örn: Elektrolitik Bakır"
              />
              <LocalizedInput
                label="Kısa Açıklama"
                name={{ tr: "descriptionTr", en: "descriptionEn" }}
                values={L(p?.descriptionTr, p?.descriptionEn)}
                multiline
              />
              <LocalizedInput
                label="Detaylı Açıklama"
                name={{ tr: "detailsTr", en: "detailsEn" }}
                values={L(p?.detailsTr, p?.detailsEn)}
                multiline
                rows={6}
                help="Ürün detay sayfasında gösterilir. Paragrafları boş satırla ayırın."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teknik Özellikler</CardTitle>
              <CardDescription>“Teknik Standartlar” tablosunda ve ürün detayında gösterilir.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Tablo Kodu" htmlFor="specCode" help="Boş bırakılırsa ürün kodu kullanılır.">
                  <Input id="specCode" name="specCode" defaultValue={p?.specCode} />
                </Field>
                <Field label="Saflık / Alaşım Oranı" htmlFor="specPurity">
                  <Input id="specPurity" name="specPurity" defaultValue={p?.specPurity} placeholder="Cu ≥ %99.9935" />
                </Field>
              </div>
              <LocalizedInput label="Malzeme Tanımı" name={{ tr: "specMaterialTr", en: "specMaterialEn" }} values={L(p?.specMaterialTr, p?.specMaterialEn)} />
              <LocalizedInput label="Form / Boyut" name={{ tr: "specFormTr", en: "specFormEn" }} values={L(p?.specFormTr, p?.specFormEn)} />
              <LocalizedInput label="Lojistik Birimi" name={{ tr: "specUnitTr", en: "specUnitEn" }} values={L(p?.specUnitTr, p?.specUnitEn)} />
              <Check name="showInSpecTable" label="Teknik standartlar tablosunda göster" defaultChecked={p?.showInSpecTable ?? true} />
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Yayın</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Check name="published" label="Sitede yayınla" defaultChecked={p?.published ?? true} />
              <Check name="inStock" label="Stokta mevcut" defaultChecked={p?.inStock ?? true} help="Kapalıysa “Stok: Sorunuz” yazar." />
              <Field label="Sıralama" htmlFor="sortOrder" help="Küçük sayı önce gösterilir.">
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={p?.sortOrder ?? 0} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kimlik</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Field label="Ürün Kodu *" htmlFor="code">
                <Input id="code" name="code" defaultValue={p?.code} placeholder="CU-CAT-99" required />
              </Field>
              <Field label="URL (slug) *" htmlFor="slug" help="Örn: bakir-katot → /tr/products/bakir-katot">
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={p?.slug}
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  onFocus={(e) => {
                    if (e.currentTarget.value) return;
                    const name = (e.currentTarget.form?.elements.namedItem("nameTr") as HTMLInputElement | null)?.value;
                    if (name) e.currentTarget.value = slugify(name);
                  }}
                />
              </Field>
              <Field label="Kategori" htmlFor="category">
                <select id="category" name="category" defaultValue={p?.category ?? "copper"} className={selectClass}>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Rozet" htmlFor="badge" help="Görselin sağ üstünde gösterilir. Örn: Grade-A">
                <Input id="badge" name="badge" defaultValue={p?.badge ?? ""} />
              </Field>
              <Check name="badgeHighlight" label="Rozeti bakır renkte vurgula" defaultChecked={p?.badgeHighlight ?? false} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Görsel</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageField label="Ürün Görseli *" name="image" defaultValue={p?.image ?? ""} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-2 border-t bg-background/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <SubmitButton pending={pending}>{p ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}</SubmitButton>
      </div>
    </form>
  );
}
