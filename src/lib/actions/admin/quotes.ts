"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { QUOTE_STATUSES } from "@/lib/quote-status";
import type { ActionState } from "./types";

export async function updateQuote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!(QUOTE_STATUSES as readonly string[]).includes(status)) return { ok: false, message: "Geçersiz durum." };

  await db.quoteRequest.update({ where: { id }, data: { status, note } });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Talep güncellendi." };
}

export async function deleteQuote(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await db.quoteRequest.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin", "layout");
  redirect("/admin/quotes");
}
