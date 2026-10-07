"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidateSite } from "./revalidate";
import type { ActionState } from "./types";

export async function savePage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const slug = get("slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, message: "Slug yalnızca küçük harf, rakam ve tire içerebilir." };
  }
  if (!get("titleTr")) return { ok: false, message: "Başlık (TR) zorunludur." };

  const data = {
    slug,
    titleTr: get("titleTr"),
    titleEn: get("titleEn"),
    bodyTr: get("bodyTr"),
    bodyEn: get("bodyEn"),
    published: formData.get("published") === "on",
  };

  const clash = await db.page.findUnique({ where: { slug } });
  if (clash && clash.id !== id) return { ok: false, message: "Bu slug başka bir sayfa tarafından kullanılıyor." };

  if (id) {
    await db.page.update({ where: { id }, data });
    revalidateSite();
    return { ok: true, message: "Sayfa kaydedildi.", nonce: Date.now() };
  }
  const created = await db.page.create({ data });
  revalidateSite();
  redirect(`/admin/pages/${created.id}?created=1`);
}

export async function deletePage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await db.page.delete({ where: { id } }).catch(() => null);
  revalidateSite();
  redirect("/admin/pages");
}
