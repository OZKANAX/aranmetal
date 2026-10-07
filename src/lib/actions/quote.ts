"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { hasLocale } from "@/i18n/config";

export type QuoteFormState = {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<"name" | "company" | "email" | "phone", "required" | "invalidEmail">>;
  /** Hata durumunda form alanlarını geri doldurmak için */
  values?: Record<string, string>;
};

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  email: z.string().trim().max(160).email(),
  phone: z.string().trim().min(7).max(40),
  product: z.string().trim().max(160).default(""),
  quantity: z.string().trim().max(120).default(""),
  message: z.string().trim().max(4000).default(""),
});

export async function submitQuote(_prev: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
  // Spam botları için gizli alan
  if (String(formData.get("website") ?? "").length > 0) return { status: "success" };

  const raw = Object.fromEntries(
    ["name", "company", "email", "phone", "product", "quantity", "message", "unit", "specification"].map((k) => [
      k,
      String(formData.get(k) ?? ""),
    ]),
  );
  // Anasayfa formu miktar birimini ve spesifikasyonu ayrı gönderir; kayıtta mevcut alanlara işlenir.
  const quantity = raw.quantity.trim() && raw.unit.trim() ? `${raw.quantity.trim()} ${raw.unit.trim()}` : raw.quantity;
  const spec = raw.specification.trim();
  const label = String(formData.get("specificationLabel") ?? "Spec");
  const message = spec ? [`${label}: ${spec}`, raw.message.trim()].filter(Boolean).join("\n\n") : raw.message;
  const parsed = schema.safeParse({ ...raw, quantity, message });

  if (!parsed.success) {
    const errors: QuoteFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<QuoteFormState["errors"]>;
      if (["name", "company", "email", "phone"].includes(key)) {
        errors[key] = key === "email" && raw.email ? "invalidEmail" : "required";
      }
    }
    return { status: "error", errors, values: raw };
  }

  const locale = String(formData.get("locale") ?? "tr");

  try {
    await db.quoteRequest.create({
      data: { ...parsed.data, locale: hasLocale(locale) ? locale : "tr" },
    });
  } catch (err) {
    console.error("Teklif talebi kaydedilemedi", err);
    return { status: "error", values: raw };
  }

  return { status: "success" };
}
