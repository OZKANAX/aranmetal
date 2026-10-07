import { readFile } from "node:fs/promises";
import path from "node:path";
import { IMAGE_TYPES, UPLOAD_DIR } from "@/lib/uploads";

const MIME_BY_EXT = Object.fromEntries(Object.entries(IMAGE_TYPES).map(([mime, ext]) => [ext, mime]));

export async function GET(_req: Request, ctx: RouteContext<"/media/[...path]">) {
  const { path: segments } = await ctx.params;
  const name = segments.join("/");

  // Yalnızca düz dosya adlarına izin ver (dizin gezintisini engelle).
  if (!/^[a-z0-9-]+\.[a-z0-9]+$/i.test(name)) return new Response("Not found", { status: 404 });

  const mime = MIME_BY_EXT[path.extname(name).slice(1).toLowerCase()];
  if (!mime) return new Response("Not found", { status: 404 });

  try {
    const data = await readFile(path.join(UPLOAD_DIR, name));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
