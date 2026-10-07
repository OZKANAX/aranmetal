/**
 * Ana slider'daki tüm slaytları siler ve varsayılan bakır / alüminyum / plastik slaytlarını ekler.
 * Kullanım:  npx tsx --env-file=.env.local scripts/reset-slides.ts
 * Dikkat: DATABASE_URL canlı veritabanını gösteriyorsa canlı siteyi değiştirir.
 */
import { PrismaClient } from "@prisma/client";
import { defaultSlides } from "../src/lib/content/default-slides";

const db = new PrismaClient();

async function main() {
  const before = await db.slide.findMany({ select: { titleTr: true, highlightTr: true } });
  console.log(`Mevcut ${before.length} slayt:`, before.map((s) => `${s.titleTr} ${s.highlightTr}`.trim()));
  await db.$transaction([
    db.slide.deleteMany(),
    db.slide.createMany({ data: defaultSlides.map((s, i) => ({ ...s, sortOrder: i })) }),
  ]);
  console.log(`✓ ${defaultSlides.length} yeni slayt eklendi`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
