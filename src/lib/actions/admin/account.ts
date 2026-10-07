"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, requireAdmin } from "@/lib/auth";
import type { ActionState } from "./types";

export async function updateAccount(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  const user = await db.adminUser.findUnique({ where: { id: session.userId } });
  if (!user) return { ok: false, message: "Kullanıcı bulunamadı." };
  if (!name) return { ok: false, message: "Ad zorunludur." };

  const data: { name: string; passwordHash?: string } = { name };

  if (next || current) {
    if (!(await bcrypt.compare(current, user.passwordHash))) return { ok: false, message: "Mevcut şifre hatalı." };
    if (next.length < 10) return { ok: false, message: "Yeni şifre en az 10 karakter olmalı." };
    if (next !== confirm) return { ok: false, message: "Yeni şifreler eşleşmiyor." };
    data.passwordHash = await bcrypt.hash(next, 12);
  }

  await db.adminUser.update({ where: { id: user.id }, data });
  await createSession({ userId: user.id, email: user.email, name });
  return { ok: true, message: data.passwordHash ? "Bilgiler ve şifre güncellendi." : "Bilgiler güncellendi.", nonce: Date.now() };
}
