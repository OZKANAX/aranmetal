import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

/**
 * Yüklenen görseller:
 * - BLOB_READ_WRITE_TOKEN varsa (Vercel) → Vercel Blob'a yüklenir, tam URL döner.
 * - Yoksa (kendi sunucunuz / IIS) → storage/uploads klasörüne yazılır ve /media/* rotasından servis edilir.
 */
export const UPLOAD_DIR = path.join(process.cwd(), "storage", "uploads");

const MAX_SIZE = 5 * 1024 * 1024;

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export async function saveImageUpload(file: File): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Desteklenmeyen dosya türü. JPG, PNG, WEBP, AVIF veya GIF yükleyin.");
  if (file.size > MAX_SIZE) throw new Error("Dosya boyutu 5 MB'ı aşamaz.");

  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/media/${name}`;
}

/** Form alanı için: dosya seçilmişse yükler, yoksa metin (URL) değerini döner. */
export async function resolveImageField(formData: FormData, name: string): Promise<string> {
  const file = formData.get(`${name}__file`);
  if (file instanceof File && file.size > 0) return saveImageUpload(file);
  return String(formData.get(name) ?? "").trim();
}
