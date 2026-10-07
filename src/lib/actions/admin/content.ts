"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { isSectionKey, sections, type FieldDef } from "@/lib/content/schema";
import { resolveImageField } from "@/lib/uploads";
import { revalidateSite } from "./revalidate";
import type { ActionState } from "./types";

export async function saveSection(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const key = String(formData.get("__section") ?? "");
  if (!isSectionKey(key)) return { ok: false, message: "Geçersiz bölüm." };

  const fields = sections[key].fields as Record<string, FieldDef>;
  const data: Record<string, string | { tr: string; en: string }> = {};

  try {
    for (const [name, def] of Object.entries(fields)) {
      if (def.localized) {
        data[name] = {
          tr: String(formData.get(`${name}.tr`) ?? "").trim(),
          en: String(formData.get(`${name}.en`) ?? "").trim(),
        };
      } else if (def.type === "image") {
        data[name] = await resolveImageField(formData, name);
      } else {
        data[name] = String(formData.get(name) ?? "").trim();
      }
    }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Kaydedilemedi." };
  }

  const json = JSON.stringify(data);
  await db.contentSection.upsert({ where: { key }, update: { data: json }, create: { key, data: json } });
  revalidateSite();
  return { ok: true, message: "İçerik kaydedildi ve sitede yayınlandı.", nonce: Date.now() };
}

export async function resetSection(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get("__section") ?? "");
  if (!isSectionKey(key)) return;
  await db.contentSection.deleteMany({ where: { key } });
  revalidateSite();
}
