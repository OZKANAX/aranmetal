"use client";

import { updateQuote } from "@/lib/actions/admin/quotes";
import { initialActionState } from "@/lib/actions/admin/types";
import { QUOTE_STATUSES, QUOTE_STATUS_LABELS } from "@/lib/quote-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Field, SubmitButton, useFormAction } from "./form/form-kit";

export function QuoteUpdateForm({ id, status, note }: { id: string; status: string; note: string }) {
  const [, onSubmit, pending] = useFormAction(updateQuote, initialActionState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Takip</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <input type="hidden" name="id" value={id} />
          <Field label="Durum">
            <div className="flex flex-wrap gap-2">
              {QUOTE_STATUSES.map((s) => (
                <label
                  key={s}
                  className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary"
                >
                  <input type="radio" name="status" value={s} defaultChecked={status === s} className="sr-only" />
                  {QUOTE_STATUS_LABELS[s]}
                </label>
              ))}
            </div>
          </Field>
          <Field label="İç Not" htmlFor="note" help="Yalnızca admin panelinde görünür.">
            <Textarea id="note" name="note" defaultValue={note} rows={4} placeholder="Görüşme notları, fiyat bilgisi..." />
          </Field>
          <div className="flex justify-end">
            <SubmitButton pending={pending}>Güncelle</SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
