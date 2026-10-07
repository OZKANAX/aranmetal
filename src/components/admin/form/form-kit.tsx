"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/actions/admin/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * useActionState + onSubmit. React'in form action'larından sonra yaptığı otomatik
 * sıfırlamayı önler; böylece hata durumunda girilen veriler kaybolmaz.
 * Başarılı kayıtta formu `key={state.nonce}` ile yeniden kurun.
 */
export function useFormAction(
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>,
  initial: ActionState,
) {
  const [state, dispatch, pending] = useActionState(action, initial);
  useActionToast(state);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => dispatch(formData));
  };
  return [state, onSubmit, pending] as const;
}

/** Server action sonucunu toast olarak gösterir. */
export function useActionToast(state: ActionState) {
  const last = useRef<ActionState | null>(null);
  useEffect(() => {
    if (state === last.current || state.ok === null) return;
    last.current = state;
    if (state.ok) toast.success(state.message ?? "Kaydedildi.");
    else toast.error(state.message ?? "Bir hata oluştu.");
  }, [state]);
}

export function SubmitButton({ children = "Kaydet", pending: forced }: { children?: React.ReactNode; pending?: boolean }) {
  const { pending } = useFormStatus();
  const busy = forced ?? pending;
  return (
    <Button type="submit" size="lg" disabled={busy}>
      {busy ? <Loader2 className="animate-spin" /> : <Save />}
      {children}
    </Button>
  );
}

export function Field({
  label,
  htmlFor,
  help,
  children,
}: {
  label: string;
  htmlFor?: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}

function LangTag({ lang }: { lang: "tr" | "en" }) {
  return (
    <span className="pointer-events-none absolute right-2 top-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-muted-foreground">
      {lang}
    </span>
  );
}

/** TR ve EN değerlerini yan yana düzenlemek için alan çifti. */
export function LocalizedInput({
  label,
  name,
  values,
  multiline = false,
  help,
  rows = 3,
  required = false,
}: {
  label: string;
  /** Form alanı adları: `${name}.tr` / `${name}.en` veya `${name}Tr` / `${name}En` */
  name: { tr: string; en: string };
  values: { tr: string; en: string };
  multiline?: boolean;
  help?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label>
        {label}
        {required && <span className="text-primary">*</span>}
      </Label>
      <div className="grid gap-2 md:grid-cols-2">
        {(["tr", "en"] as const).map((lang) => (
          <div key={lang} className="relative">
            {multiline ? (
              <Textarea
                name={name[lang]}
                defaultValue={values[lang]}
                rows={rows}
                className="pr-10"
                aria-label={`${label} (${lang.toUpperCase()})`}
                required={required && lang === "tr"}
              />
            ) : (
              <Input
                name={name[lang]}
                defaultValue={values[lang]}
                className="pr-10"
                aria-label={`${label} (${lang.toUpperCase()})`}
                required={required && lang === "tr"}
              />
            )}
            <LangTag lang={lang} />
          </div>
        ))}
      </div>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}
