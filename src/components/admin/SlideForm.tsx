"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { Slide } from "@prisma/client";
import { saveSlide } from "@/lib/actions/admin/slides";
import { initialActionState } from "@/lib/actions/admin/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, LocalizedInput, SubmitButton, useFormAction } from "./form/form-kit";
import { ImageField } from "./form/ImageField";

const LINK_HELP = "Site içi sayfa için dil öneki olmadan yazın: /products, /quote, /products/bakir-katot. Harici bağlantı: https://...";

export function SlideForm({ slide, created }: { slide?: Slide; created?: boolean }) {
  const [state, onSubmit, pending] = useFormAction(saveSlide, initialActionState);

  useEffect(() => {
    if (created) toast.success("Slayt oluşturuldu.");
  }, [created]);

  const s = slide;
  const L = (tr?: string, en?: string) => ({ tr: tr ?? "", en: en ?? "" });

  return (
    <form onSubmit={onSubmit} key={state.nonce ?? 0} className="grid gap-6">
      {s && <input type="hidden" name="id" value={s.id} />}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="grid content-start gap-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Metinler</CardTitle>
              <CardDescription>Başlık iki satırdır: ikinci satır bakır renkte vurgulanır.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <LocalizedInput label="Üst Başlık" name={{ tr: "eyebrowTr", en: "eyebrowEn" }} values={L(s?.eyebrowTr, s?.eyebrowEn)} help="Örn: // ELEKTROLİTİK BAKIR" />
              <LocalizedInput label="Başlık (1. satır)" name={{ tr: "titleTr", en: "titleEn" }} values={L(s?.titleTr, s?.titleEn)} required />
              <LocalizedInput label="Başlık (vurgulu 2. satır)" name={{ tr: "highlightTr", en: "highlightEn" }} values={L(s?.highlightTr, s?.highlightEn)} />
              <LocalizedInput label="Açıklama" name={{ tr: "descriptionTr", en: "descriptionEn" }} values={L(s?.descriptionTr, s?.descriptionEn)} multiline />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Butonlar</CardTitle>
              <CardDescription>Buton metni boş bırakılırsa buton gösterilmez.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <LocalizedInput label="Birincil Buton Metni" name={{ tr: "primaryLabelTr", en: "primaryLabelEn" }} values={L(s?.primaryLabelTr, s?.primaryLabelEn)} />
              <Field label="Birincil Buton Bağlantısı" htmlFor="primaryHref" help={LINK_HELP}>
                <Input id="primaryHref" name="primaryHref" defaultValue={s?.primaryHref ?? "/quote"} />
              </Field>
              <LocalizedInput label="İkincil Buton Metni" name={{ tr: "secondaryLabelTr", en: "secondaryLabelEn" }} values={L(s?.secondaryLabelTr, s?.secondaryLabelEn)} />
              <Field label="İkincil Buton Bağlantısı" htmlFor="secondaryHref" help={LINK_HELP}>
                <Input id="secondaryHref" name="secondaryHref" defaultValue={s?.secondaryHref ?? "/products"} />
              </Field>
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Görsel</CardTitle>
              <CardDescription>Yatay, en az 1920×1080 px önerilir.</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageField label="Arka Plan Görseli *" name="image" defaultValue={s?.image ?? ""} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Yayın</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-accent/30">
                <input type="checkbox" name="published" defaultChecked={s?.published ?? true} className="size-4 accent-[var(--primary)]" />
                <span className="text-sm font-medium">Sitede göster</span>
              </label>
              {s && (
                <Field label="Sıralama" htmlFor="sortOrder" help="Küçük sayı önce gösterilir. Listeden oklarla da sıralayabilirsiniz.">
                  <Input id="sortOrder" name="sortOrder" type="number" defaultValue={s.sortOrder} />
                </Field>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 flex justify-end border-t bg-background/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <SubmitButton pending={pending}>{s ? "Değişiklikleri Kaydet" : "Slaytı Oluştur"}</SubmitButton>
      </div>
    </form>
  );
}
