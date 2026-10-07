/**
 * Varsayılan katalogda olup veritabanında olmayan ürünleri ekler (mevcut ürünlere dokunmaz).
 * Kullanım:  npx tsx --env-file=.env.local scripts/add-products.ts
 */
import { PrismaClient } from "@prisma/client";
import { defaultProducts } from "../src/lib/content/default-products";

const db = new PrismaClient();

async function main() {
  const existing = new Set((await db.product.findMany({ select: { slug: true } })).map((p) => p.slug));
  const max = await db.product.aggregate({ _max: { sortOrder: true } });
  let order = (max._max.sortOrder ?? 0) + 1;
  const missing = defaultProducts.filter((p) => !existing.has(p.slug));
  for (const p of missing) {
    await db.product.create({ data: { ...p, sortOrder: order++ } });
    console.log(`+ ${p.slug}`);
  }
  console.log(missing.length ? `✓ ${missing.length} ürün eklendi` : "Eklenecek ürün yok");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
