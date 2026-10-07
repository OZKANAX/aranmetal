"use client";

import { useActionState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { submitQuote, type QuoteFormState } from "@/lib/actions/quote";
import { Icon } from "../ui/Icon";

const initialState: QuoteFormState = { status: "idle" };

export function QuoteForm({
  locale,
  labels,
  productOptions,
  defaultProduct,
  successMessage,
}: {
  locale: Locale;
  labels: Dictionary["form"];
  productOptions: string[];
  defaultProduct?: string;
  successMessage: string;
}) {
  const [state, action, pending] = useActionState(submitQuote, initialState);
  const err = state.errors ?? {};
  const v = state.values ?? {};
  const errorText = (key: keyof typeof err) => (err[key] ? labels[err[key]!] : null);

  if (state.status === "success") {
    return (
      <div role="status" className="bg-paper border-t-2 border-success p-6 text-ink flex items-start gap-3 text-body">
        <Icon name="check_circle" className="text-[24px] text-success" />
        <span>{successMessage}</span>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      {/* Bal küpü: gerçek kullanıcılar görmez */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label={`${labels.name} *`} error={errorText("name")}>
          <input name="name" defaultValue={v.name} required autoComplete="name" placeholder={labels.namePlaceholder} className="field" />
        </Field>
        <Field label={`${labels.company} *`} error={errorText("company")}>
          <input name="company" defaultValue={v.company} required autoComplete="organization" placeholder={labels.companyPlaceholder} className="field" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label={`${labels.email} *`} error={errorText("email")}>
          <input name="email" defaultValue={v.email} type="email" required autoComplete="email" placeholder={labels.emailPlaceholder} className="field" />
        </Field>
        <Field label={`${labels.phone} *`} error={errorText("phone")}>
          <input name="phone" defaultValue={v.phone} type="tel" required autoComplete="tel" placeholder={labels.phonePlaceholder} className="field" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label={labels.product}>
          <select name="product" defaultValue={v.product ?? defaultProduct ?? productOptions[0]} className="field">
            {productOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
            <option>{labels.otherProduct}</option>
          </select>
        </Field>
        <Field label={labels.quantity}>
          <input name="quantity" defaultValue={v.quantity} placeholder={labels.quantityPlaceholder} className="field" />
        </Field>
      </div>
      <Field label={labels.message}>
        <textarea name="message" defaultValue={v.message} rows={3} placeholder={labels.messagePlaceholder} className="field resize-none" />
      </Field>

      {state.status === "error" && (
        <div role="alert" className="bg-paper border-t-2 border-error p-4 text-error flex items-center gap-3 text-small">
          <Icon name="error" className="text-[20px]" />
          <span>{labels.error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-14 rounded-[2px] bg-copper hover:bg-copper-deep disabled:opacity-60 disabled:cursor-wait text-white px-6 text-body font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {pending && <Icon name="progress_activity" className="text-[20px] animate-spin" />}
        <span>{pending ? labels.sending : labels.submit}</span>
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string | null; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-small font-medium text-ink">{label}</span>
      {children}
      {error && <span className="text-caption text-error">{error}</span>}
    </label>
  );
}
