"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { resolveImageField } from "@/lib/uploads";
import { revalidateSite } from "./revalidate";
import type { ActionState } from "./types";

const CATEGORIES = ["copper", "aluminum", "alloy", "plastic", "other"] as const;

const schema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug en az 2 karakter olmalı.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  code: z.string().trim().min(1, "Ürün kodu zorunludur."),
  category: z.enum(CATEGORIES),
  badge: z.string().trim(),
  nameTr: z.string().trim().min(1, "Ürün adı (TR) zorunludur."),
  nameEn: z.string().trim(),
  subtitleTr: z.string().trim(),
  subtitleEn: z.string().trim(),
  descriptionTr: z.string().trim(),
  descriptionEn: z.string().trim(),
  detailsTr: z.string().trim(),
  detailsEn: z.string().trim(),
  specCode: z.string().trim(),
  specMaterialTr: z.string().trim(),
  specMaterialEn: z.string().trim(),
  specPurity: z.string().trim(),
  specFormTr: z.string().trim(),
  specFormEn: z.string().trim(),
  specUnitTr: z.string().trim(),
  specUnitEn: z.string().trim(),
  sortOrder: z.coerce.number().int().default(0),
});

function readForm(formData: FormData) {
  const raw: Record<string, string> = {};
  for (const key of Object.keys(schema.shape)) raw[key] = String(formData.get(key) ?? "");
  return raw;
}

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const parsed = schema.safeParse(readForm(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Geçersiz veri." };

  let image: string;
  try {
    image = await resolveImageField(formData, "image");
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Görsel yüklenemedi." };
  }
  if (!image) return { ok: false, message: "Ürün görseli zorunludur." };

  const data = {
    ...parsed.data,
    badge: parsed.data.badge || null,
    image,
    badgeHighlight: formData.get("badgeHighlight") === "on",
    inStock: formData.get("inStock") === "on",
    published: formData.get("published") === "on",
    showInSpecTable: formData.get("showInSpecTable") === "on",
  };

  const clash = await db.product.findUnique({ where: { slug: data.slug } });
  if (clash && clash.id !== id) return { ok: false, message: "Bu slug başka bir ürün tarafından kullanılıyor." };

  if (id) {
    await db.product.update({ where: { id }, data });
    revalidateSite();
    return { ok: true, message: "Ürün güncellendi.", nonce: Date.now() };
  }

  const created = await db.product.create({ data });
  revalidateSite();
  redirect(`/admin/products/${created.id}?created=1`);
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await db.product.delete({ where: { id } }).catch(() => null);
  revalidateSite();
  redirect("/admin/products");
}

export async function toggleProductPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return;
  await db.product.update({ where: { id }, data: { published: !product.published } });
  revalidateSite();
}

export async function moveProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = formData.get("dir") === "up" ? -1 : 1;

  const list = await db.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  const index = list.findIndex((p) => p.id === id);
  const target = index + dir;
  if (index < 0 || target < 0 || target >= list.length) return;

  [list[index], list[target]] = [list[target], list[index]];
  await db.$transaction(list.map((p, i) => db.product.update({ where: { id: p.id }, data: { sortOrder: i } })));
  revalidateSite();
}
