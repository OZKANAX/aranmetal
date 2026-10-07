"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { Page } from "@prisma/client";
import { savePage } from "@/lib/actions/admin/pages";
import { initialActionState } from "@/lib/actions/admin/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, LocalizedInput, SubmitButton, useFormAction } from "./form/form-kit";

export function PageForm({ page, created }: { page?: Page; created?: boolean }) {
  const [state, onSubmit, pending] = useFormAction(savePage, initialActionState);

  useEffect(() => {
    if (created) toast.success("Sayfa oluşturuldu.");
  }, [created]);

  return (
    <form onSubmit={onSubmit} key={state.nonce ?? 0} className="grid gap-6">
      {page && <input type="hidden" name="id" value={page.id} />}
      <Card>
        <CardContent className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="URL (slug) *" htmlFor="slug" help="Örn: kvkk → /tr/legal/kvkk">
              <Input id="slug" name="slug" defaultValue={page?.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
            </Field>
            <label className="flex cursor-pointer items-center gap-3 self-end rounded-md border p-2.5">
              <input type="checkbox" name="published" defaultChecked={page?.published ?? true} className="size-4 accent-[var(--primary)]" />
              <span className="text-sm font-medium">Yayında (alt bilgide göster)</span>
            </label>
          </div>
          <LocalizedInput label="Başlık" name={{ tr: "titleTr", en: "titleEn" }} values={{ tr: page?.titleTr ?? "", en: page?.titleEn ?? "" }} required />
          <LocalizedInput
            label="İçerik"
            name={{ tr: "bodyTr", en: "bodyEn" }}
            values={{ tr: page?.bodyTr ?? "", en: page?.bodyEn ?? "" }}
            multiline
            rows={18}
            help='Biçimlendirme: "## " ile başlayan satır başlık, "- " ile başlayan satırlar madde listesi olur. Paragrafları boş satırla ayırın.'
          />
        </CardContent>
      </Card>
      <div className="sticky bottom-0 z-10 -mx-4 flex justify-end border-t bg-background/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <SubmitButton pending={pending}>{page ? "Kaydet" : "Sayfayı Oluştur"}</SubmitButton>
      </div>
    </form>
  );
}
