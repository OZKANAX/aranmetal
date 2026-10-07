"use client";

import { RotateCcw } from "lucide-react";
import { resetSection, saveSection } from "@/lib/actions/admin/content";
import { initialActionState } from "@/lib/actions/admin/types";
import type { FieldDef } from "@/lib/content/schema";
import type { StoredSection } from "@/lib/content/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, LocalizedInput, SubmitButton, useFormAction } from "./form/form-kit";
import { ImageField } from "./form/ImageField";

type L = { tr: string; en: string };

function valueOf(def: FieldDef, stored: StoredSection[string] | undefined): string | L {
  if (def.localized) {
    const d = def.default as L;
    const v = typeof stored === "object" && stored ? stored : null;
    return { tr: v?.tr ?? d.tr, en: v?.en ?? d.en };
  }
  return typeof stored === "string" ? stored : (def.default as string);
}

export function SectionForm({
  sectionKey,
  fields,
  stored,
}: {
  sectionKey: string;
  fields: Record<string, FieldDef>;
  stored: StoredSection;
}) {
  const [state, onSubmit, pending] = useFormAction(saveSection, initialActionState);

  return (
    <div className="grid gap-4">
      <form onSubmit={onSubmit} className="grid gap-4">
        <input type="hidden" name="__section" value={sectionKey} />
        <Card>
          <CardContent key={state.nonce ?? 0} className="grid gap-6">
            {Object.entries(fields).map(([name, def]) => {
              const value = valueOf(def, stored[name]);
              if (def.localized) {
                return (
                  <LocalizedInput
                    key={name}
                    label={def.label}
                    name={{ tr: `${name}.tr`, en: `${name}.en` }}
                    values={value as L}
                    multiline={def.type === "textarea"}
                    rows={(value as L).tr.length > 300 ? 8 : 3}
                    help={def.help}
                  />
                );
              }
              if (def.type === "image") {
                return <ImageField key={name} label={def.label} name={name} defaultValue={value as string} />;
              }
              return (
                <Field key={name} label={def.label} htmlFor={name} help={def.help}>
                  <div className="flex items-center gap-3">
                    {def.type === "icon" && (
                      <span className="material-symbols-outlined flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted text-primary">
                        {value as string}
                      </span>
                    )}
                    <Input id={name} name={name} defaultValue={value as string} type={def.type === "url" ? "url" : "text"} />
                  </div>
                </Field>
              );
            })}
          </CardContent>
        </Card>
        <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-2 border-t bg-background/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
          <SubmitButton pending={pending}>Kaydet ve Yayınla</SubmitButton>
        </div>
      </form>

      <form
        action={resetSection}
        onSubmit={(e) => {
          if (!confirm("Bu bölüm varsayılan içeriğe döndürülecek. Emin misiniz?")) e.preventDefault();
        }}
      >
        <input type="hidden" name="__section" value={sectionKey} />
        <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
          <RotateCcw />
          Varsayılan içeriğe döndür
        </Button>
      </form>
    </div>
  );
}
