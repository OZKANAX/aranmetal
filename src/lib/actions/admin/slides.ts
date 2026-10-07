"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { resolveImageField } from "@/lib/uploads";
import { revalidateSite } from "./revalidate";
import type { ActionState } from "./types";

const TEXT_FIELDS = [
  "eyebrowTr",
  "eyebrowEn",
  "titleTr",
  "titleEn",
  "highlightTr",
  "highlightEn",
  "descriptionTr",
  "descriptionEn",
  "primaryLabelTr",
  "primaryLabelEn",
  "primaryHref",
  "secondaryLabelTr",
  "secondaryLabelEn",
  "secondaryHref",
] as const;

export async function saveSlide(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const text = Object.fromEntries(TEXT_FIELDS.map((k) => [k, String(formData.get(k) ?? "").trim()])) as Record<
    (typeof TEXT_FIELDS)[number],
    string
  >;
  if (!text.titleTr) return { ok: false, message: "Başlık (TR) zorunludur." };

  let image: string;
  try {
    image = await resolveImageField(formData, "image");
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Görsel yüklenemedi." };
  }
  if (!image) return { ok: false, message: "Slayt görseli zorunludur." };

  const data = {
    ...text,
    image,
    published: formData.get("published") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };

  if (id) {
    await db.slide.update({ where: { id }, data });
    revalidateSite();
    return { ok: true, message: "Slayt güncellendi.", nonce: Date.now() };
  }

  if (!formData.has("sortOrder")) data.sortOrder = await db.slide.count();
  const created = await db.slide.create({ data });
  revalidateSite();
  redirect(`/admin/slides/${created.id}?created=1`);
}

export async function deleteSlide(formData: FormData) {
  await requireAdmin();
  await db.slide.delete({ where: { id: String(formData.get("id") ?? "") } }).catch(() => null);
  revalidateSite();
  redirect("/admin/slides");
}

export async function toggleSlidePublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const slide = await db.slide.findUnique({ where: { id } });
  if (!slide) return;
  await db.slide.update({ where: { id }, data: { published: !slide.published } });
  revalidateSite();
}

export async function moveSlide(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = formData.get("dir") === "up" ? -1 : 1;

  const list = await db.slide.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  const index = list.findIndex((s) => s.id === id);
  const target = index + dir;
  if (index < 0 || target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];
  await db.$transaction(list.map((s, i) => db.slide.update({ where: { id: s.id }, data: { sortOrder: i } })));
  revalidateSite();
}
