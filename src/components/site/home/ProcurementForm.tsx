"use client";

import { useActionState, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { submitQuote, type QuoteFormState } from "@/lib/actions/quote";
import { Icon } from "../ui/Icon";

const initialState: QuoteFormState = { status: "idle" };

type Option = { value: string; code: string };

/**
 * Tedarik talebi: önce malzeme ve miktar (talebin özü), sonra spesifikasyon, sonra iletişim.
 * Aynı sunucu aksiyonuna (submitQuote) gönderir.
 */
export function ProcurementForm({
  locale,
  form,
  labels,
  options,
  otherCode,
  successMessage,
}: {
  locale: Locale;
  form: Dictionary["form"];
  labels: Dictionary["landing"];
  options: Option[];
  otherCode: string;
  successMessage: string;
}) {
  const [state, action, pending] = useActionState(submitQuote, initialState);
  const err = state.errors ?? {};
  const v = state.values ?? {};
  const all = [...options, { value: form.otherProduct, code: otherCode }];
  const [product, setProduct] = useState(v.product || all[0]?.value || "");
  const [unit, setUnit] = useState(v.unit || labels.requestUnitMonthly);
  const errorText = (key: keyof typeof err) => (err[key] ? form[err[key]!] : null);

  if (state.status === "success") {
    return (
      <div role="status" className="border-t-2 border-copper-line pt-8">
        <p className="font-mono text-data text-copper-light">RFQ · {new Date().toISOString().slice(0, 10)}</p>
        <p className="mt-4 font-display text-heading text-white max-w-[20ch]">{successMessage}</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-12" noValidate={false}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="specificationLabel" value={labels.requestSpec} />
      {/* Bal küpü: gerçek kullanıcılar görmez */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {/* Malzeme */}
      <fieldset>
        <legend className="font-mono text-data text-steel mb-4">{labels.requestProduct}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border-l border-t border-graphite-rule">
          {all.map((o) => {
            const checked = product === o.value;
            return (
              <label
                key={o.value}
                className={`rq-option relative flex cursor-pointer flex-col justify-between gap-6 p-4 min-h-[6.5rem] border-r border-b border-graphite-rule ${
                  checked ? "bg-graphite-3 text-white" : "bg-graphite-2 text-on-navy-2 hover:bg-graphite-3 hover:text-white"
                } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-copper-line has-[:focus-visible]:-outline-offset-2`}
              >
                <input
                  type="radio"
                  name="product"
                  value={o.value}
                  checked={checked}
                  onChange={() => setProduct(o.value)}
                  className="sr-only"
                />
                <span className="flex items-start justify-between gap-3">
                  <span className={`font-mono text-data ${checked ? "text-white" : "text-steel"}`}>{o.code}</span>
                  <span
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors duration-200 ${
                      checked ? "border-bone bg-bone" : "border-steel"
                    }`}
                  >
                    {checked && <span className="w-1.5 h-1.5 bg-graphite" />}
                  </span>
                </span>
                <span className="text-body font-semibold leading-snug">{o.value}</span>
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 bottom-0 h-px bg-bone origin-left transition-transform duration-500 ease-out-quint ${checked ? "scale-x-100" : "scale-x-0"}`}
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Miktar ve spesifikasyon */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-x-10 gap-y-10">
        <div>
          <label htmlFor="rq-quantity" className="block font-mono text-data text-steel">
            {labels.requestQuantity}
          </label>
          <div className="rq-field mt-2 flex items-end gap-3 border-b border-graphite-rule">
            <input
              id="rq-quantity"
              name="quantity"
              inputMode="decimal"
              defaultValue={v.quantity}
              aria-describedby="rq-quantity-hint"
              autoComplete="off"
              className="w-full min-w-0 bg-transparent font-display tnum text-[clamp(2.5rem,2rem+2vw,3.5rem)] leading-none tracking-[-0.03em] font-[740] text-white focus:outline-none pb-2"
            />
            <span className="rq-field__line" aria-hidden="true" />
          </div>
          <p id="rq-quantity-hint" className="mt-2 text-caption text-steel">
            {labels.requestQuantityHint}
          </p>
          <div role="radiogroup" aria-label={labels.requestQuantity} className="mt-4 flex">
            {[labels.requestUnitMonthly, labels.requestUnitOnce].map((u) => (
              <label
                key={u}
                className={`cursor-pointer -ml-px first:ml-0 border px-3 h-9 inline-flex items-center text-caption font-semibold transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-copper-line ${
                  unit === u ? "border-alu bg-alu text-ink" : "border-graphite-rule text-on-navy-2 hover:text-white"
                }`}
              >
                <input type="radio" name="unit" value={u} checked={unit === u} onChange={() => setUnit(u)} className="sr-only" />
                {u}
              </label>
            ))}
          </div>
        </div>

        <RqField id="rq-spec" label={labels.requestSpec}>
          <input
            id="rq-spec"
            name="specification"
            defaultValue={v.specification}
            placeholder={labels.requestSpecPlaceholder}
            aria-describedby="rq-spec-hint"
            className="rq-input"
          />
          <p id="rq-spec-hint" className="mt-2 text-caption text-steel">
            {labels.requestSpecHint}
          </p>
        </RqField>
      </div>

      {/* İletişim */}
      <fieldset>
        <legend className="font-mono text-data text-steel mb-6">{labels.requestContact}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
          <RqField id="rq-name" label={`${form.name} *`} error={errorText("name")}>
            <input
              id="rq-name"
              name="name"
              defaultValue={v.name}
              required
              autoComplete="name"
              aria-invalid={!!err.name}
              placeholder={form.namePlaceholder}
              className="rq-input"
            />
          </RqField>
          <RqField id="rq-company" label={`${form.company} *`} error={errorText("company")}>
            <input
              id="rq-company"
              name="company"
              defaultValue={v.company}
              required
              autoComplete="organization"
              aria-invalid={!!err.company}
              placeholder={form.companyPlaceholder}
              className="rq-input"
            />
          </RqField>
          <RqField id="rq-email" label={`${form.email} *`} error={errorText("email")}>
            <input
              id="rq-email"
              name="email"
              type="email"
              defaultValue={v.email}
              required
              autoComplete="email"
              aria-invalid={!!err.email}
              placeholder={form.emailPlaceholder}
              className="rq-input"
            />
          </RqField>
          <RqField id="rq-phone" label={`${form.phone} *`} error={errorText("phone")}>
            <input
              id="rq-phone"
              name="phone"
              type="tel"
              defaultValue={v.phone}
              required
              autoComplete="tel"
              aria-invalid={!!err.phone}
              placeholder={form.phonePlaceholder}
              className="rq-input tnum"
            />
          </RqField>
          <RqField id="rq-message" label={form.message} className="sm:col-span-2">
            <textarea
              id="rq-message"
              name="message"
              defaultValue={v.message}
              rows={2}
              placeholder={form.messagePlaceholder}
              className="rq-input resize-none"
            />
          </RqField>
        </div>
      </fieldset>

      {state.status === "error" && (
        <p role="alert" className="flex items-center gap-3 border-t border-error-on-dark pt-4 text-small text-error-on-dark">
          <Icon name="error" className="text-[20px]" />
          {form.error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <button
          type="submit"
          disabled={pending}
          className="group btn-copper inline-flex h-16 items-center justify-between gap-6 px-7 text-body font-semibold disabled:cursor-wait disabled:opacity-70 sm:min-w-[22rem]"
        >
          <span>{pending ? form.sending : labels.requestSubmit}</span>
          {pending ? (
            <Icon name="progress_activity" className="text-[20px] animate-spin" />
          ) : (
            <Icon name="arrow_forward" className="arrow-nudge text-[20px]" />
          )}
        </button>
      </div>
    </form>
  );
}

function RqField({
  id,
  label,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-mono text-data text-steel">
        {label}
      </label>
      <div className="rq-field mt-2">
        {children}
        <span className="rq-field__line" aria-hidden="true" />
      </div>
      {error && <p className="mt-2 text-caption text-error-on-dark">{error}</p>}
    </div>
  );
}
