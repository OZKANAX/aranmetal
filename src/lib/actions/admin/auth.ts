"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) return { error: "E-posta ve şifre zorunludur." };

  let user;
  try {
    user = await db.adminUser.findUnique({ where: { email } });
  } catch (err) {
    console.error("Giriş: veritabanına ulaşılamadı", err);
    return { error: "Veritabanına bağlanılamadı. DATABASE_URL ayarını kontrol edin." };
  }
  // Kullanıcı yoksa da hash karşılaştırması yaparak zamanlama farkını azalt
  const valid = await bcrypt.compare(password, user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
  if (!user || !valid) return { error: "E-posta veya şifre hatalı." };

  await createSession({ userId: user.id, email: user.email, name: user.name });
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
