import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultProducts as products } from "../src/lib/content/default-products";
import { defaultSlides as slides } from "../src/lib/content/default-slides";

const db = new PrismaClient();

const pages = [
  {
    slug: "kvkk",
    titleTr: "KVKK Aydınlatma Metni",
    titleEn: "Personal Data Protection Notice",
    bodyTr:
      "## Veri Sorumlusu\n\nAran Metal Sanayi ve Ticaret A.Ş. olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi işlemekteyiz.\n\n## İşlenen Veriler\n\n- Ad, soyad, firma adı\n- E-posta adresi ve telefon numarası\n- Teklif talebi içeriği\n\n## İşleme Amacı\n\nKişisel verileriniz, teklif taleplerinizin değerlendirilmesi ve sizinle iletişime geçilmesi amacıyla işlenmektedir.\n\n(Bu metin örnek amaçlıdır; hukuk danışmanınızla güncelleyiniz.)",
    bodyEn:
      "## Data Controller\n\nAran Metal Industry and Trade Inc. processes your personal data as data controller under Law No. 6698 on the Protection of Personal Data.\n\n## Data Processed\n\n- Name, surname, company name\n- E-mail address and phone number\n- Content of the quote request\n\n## Purpose\n\nYour personal data is processed to evaluate your quote requests and to contact you.\n\n(This text is a sample; please update it with your legal advisor.)",
  },
  {
    slug: "privacy",
    titleTr: "Gizlilik Bildirimi",
    titleEn: "Privacy Notice",
    bodyTr: "Web sitemizi ziyaret ettiğinizde yalnızca hizmetin sunulması için gerekli teknik veriler işlenir.\n\n(Bu metin örnek amaçlıdır.)",
    bodyEn: "When you visit our website, only the technical data required to provide the service is processed.\n\n(This text is a sample.)",
  },
  {
    slug: "terms",
    titleTr: "Kullanım Koşulları",
    titleEn: "Terms of Use",
    bodyTr: "Bu web sitesindeki içerikler bilgilendirme amaçlıdır. Fiyatlar ve stok durumu teklif aşamasında teyit edilir.\n\n(Bu metin örnek amaçlıdır.)",
    bodyEn: "The content on this website is for information purposes. Prices and stock availability are confirmed at the quotation stage.\n\n(This text is a sample.)",
  },
];



async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const existing = email ? await db.adminUser.findUnique({ where: { email } }) : null;
  if (!email || !password) {
    console.warn("! ADMIN_EMAIL / ADMIN_PASSWORD tanımlı değil, admin kullanıcısı oluşturulmadı.");
  } else if (!existing) {
    await db.adminUser.create({
      data: { email, name: process.env.ADMIN_NAME ?? "Admin", passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log(`✓ Admin kullanıcısı oluşturuldu: ${email}`);
  } else {
    console.log(`• Admin kullanıcısı zaten var: ${email}`);
  }

  for (const [i, p] of products.entries()) {
    await db.product.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, sortOrder: i } });
  }
  console.log(`✓ ${products.length} ürün hazır`);

  if ((await db.slide.count()) === 0) {
    await db.slide.createMany({ data: slides.map((sl, i) => ({ ...sl, sortOrder: i })) });
    console.log(`✓ ${slides.length} slayt eklendi`);
  }

  for (const p of pages) {
    await db.page.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }
  console.log(`✓ ${pages.length} sayfa hazır`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
