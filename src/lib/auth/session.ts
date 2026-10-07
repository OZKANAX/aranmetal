// Edge/Node uyumlu JWT oturum yardımcıları (proxy.ts tarafından da kullanılır).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "aran_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

export type SessionPayload = { userId: string; email: string; name: string };

function getKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET ortam değişkeni en az 32 karakter olmalıdır.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}
