# Aran Metal — Kurumsal Web Sitesi + Yönetim Paneli

Next.js 16 (App Router) · Tailwind CSS v4 · Prisma (SQLite) · shadcn/ui (admin)

- **Site:** Türkçe / İngilizce (`/tr`, `/en`), "Forged Industrial Precision" tasarım sistemi
- **Admin paneli:** `/admin` — içerik, ürünler, teklif talepleri, yasal sayfalar, hesap

## Kurulum

```bash
npm install
npm run setup      # veritabanını oluşturur + başlangıç verisini (admin, ürünler, sayfalar) yükler
npm run dev        # http://localhost:3000
```

İlk admin kullanıcısı `.env` içindeki `ADMIN_EMAIL` / `ADMIN_PASSWORD` ile oluşturulur.
Giriş yaptıktan sonra **Hesap** sayfasından şifreyi değiştirin.

### Ortam değişkenleri (`.env`)

| Değişken | Açıklama |
| --- | --- |
| `DATABASE_URL` | Veritabanı bağlantısı (varsayılan SQLite: `file:./dev.db`) |
| `AUTH_SECRET` | Oturum imzalama anahtarı (en az 32 karakter, üretimde benzersiz olmalı) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Seed ile oluşturulan ilk admin |
| `NEXT_PUBLIC_SITE_URL` | Sitenin canlı adresi (SEO meta etiketleri) |

## Klasör yapısı

```
src/
├─ app/
│  ├─ [locale]/            # Site (root layout) — tr / en
│  │  ├─ page.tsx          # Anasayfa
│  │  ├─ products/         # Ürün listesi + [slug] detay
│  │  ├─ about/ logistics/ contact/ legal/[slug]/
│  │  └─ not-found.tsx
│  ├─ admin/               # Admin (ayrı root layout, shadcn/ui teması)
│  │  ├─ login/
│  │  └─ (panel)/          # Oturum gerektiren sayfalar (sidebar layout)
│  └─ media/[...path]/     # Admin'den yüklenen görselleri servis eder
├─ components/
│  ├─ site/                # Site bileşenleri (layout, sections, products, quote, ui)
│  ├─ admin/               # Admin bileşenleri (formlar, sidebar ...)
│  └─ ui/                  # shadcn/ui bileşenleri
├─ i18n/                   # Dil ayarları + arayüz sözlükleri (tr.ts, en.ts)
├─ lib/
│  ├─ content/schema.ts    # ⭐ Admin'den düzenlenebilen tüm alanların tanımı
│  ├─ content/queries.ts   # Veri okuma (varsayılanlarla birleştirme)
│  ├─ actions/             # Server action'lar (teklif formu + admin)
│  └─ auth/                # JWT oturum (jose) + bcrypt
├─ styles/site.css         # Tasarım sistemi token'ları
├─ styles/admin.css        # Admin teması
└─ proxy.ts                # Dil yönlendirme + admin koruması
```

## İçerik nasıl yönetilir?

- **Site İçeriği:** Tüm başlık, metin, görsel ve iletişim bilgileri TR/EN yan yana düzenlenir.
  Kaydedilen içerik anında sitede yayınlanır. Bir bölümü "Varsayılan içeriğe döndür" ile sıfırlayabilirsiniz.
- **Ürünler:** Ekle / düzenle / sil, sıralama, yayın durumu, stok, rozet ve teknik tablo alanları.
- **Teklif Talepleri:** Sitedeki formdan gelen talepler; durum (Yeni / İşlemde / Tamamlandı) ve iç not.
- **Yasal Sayfalar:** KVKK, gizlilik, kullanım koşulları (alt bilgide listelenir).

### Yeni düzenlenebilir alan eklemek

`src/lib/content/schema.ts` içinde ilgili bölüme bir satır ekleyin:

```ts
hero: {
  fields: {
    badge2: t("Yeni Rozet", "Türkçe varsayılan", "English default"),
  },
},
```

Admin formu otomatik olarak oluşur; bileşende `c.badge2` tipli olarak kullanılabilir.

Sabit arayüz metinleri (menü, form etiketleri vb.) `src/i18n/dictionaries/` altındadır.

## Canlıya alma

- **VPS / Node sunucusu (önerilen, SQLite ile):** `npm run build && npm start`.
  `prisma/dev.db` ve `storage/uploads/` klasörlerini kalıcı disk üzerinde tutun ve yedekleyin.
- **Vercel vb. sunucusuz ortam:** Dosya sistemi kalıcı olmadığı için
  1. `prisma/schema.prisma` içinde `provider = "postgresql"` yapıp bir PostgreSQL `DATABASE_URL` verin,
  2. görsel yüklemeyi (`src/lib/uploads.ts`) bir nesne depolamaya (S3, R2, Vercel Blob) taşıyın.

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` / `npm start` | Üretim derlemesi / sunucu |
| `npm run setup` | DB şeması + seed |
| `npm run db:studio` | Prisma Studio (veritabanı arayüzü) |
| `npm run lint` / `npm run typecheck` | Kod kontrolleri |
