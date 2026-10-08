# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Satınalma / tedarik ekipleri:** kablo, iletken, döküm, enjeksiyon ve profil üreticilerinin satınalma müdürleri ve tedarik sorumluları. Masaüstünde, ofiste, birkaç tedarikçiyi karşılaştırırken siteye gelir; ürün spesifikasyonu, saflık/standart, stok ve teslim şekli bilgisini arar, sonra teklif ister.
- **Kurumsal paydaşlar:** bankalar, yatırımcılar, büyük gruplar ve potansiyel iş ortakları. Firmanın ölçeğini, ciddiyetini ve yönetişimini değerlendirir. Kullanıcı bu iki kitleyi eşit ağırlıkta tanımladı.

## Product Purpose

Aran Metal Sanayi ve Ticaret A.Ş.'nin kurumsal web sitesi. Bakır katot, alüminyum külçe, billet, bakır filmaşin ve alaşım hammaddelerinin tedarikçisi olarak firmayı tanıtır, ürünleri teknik spesifikasyonlarıyla listeler ve teklif talebi toplar. Başarı: nitelikli teklif talebi ve kurumsal güven izlenimi.

## Positioning

İstanbul (Maslak) merkezli metal hammadde tedarikçisi; LME tescilli rafinerilerden Grade-A bakır katot, P1020 alüminyum külçe, 6000 serisi homojenize billet; spektro analiz raporlu teslim, depolama ve sevkiyat.

## Operating Context

- Next.js uygulaması, TR/EN iki dilli (`/tr`, `/en`).
- Sayfa içerikleri, slider ve ürünler admin panelinden yönetilir; site tasarımı bu içeriklerin değişebileceğini varsaymalı.
- Teklif formu sunucu aksiyonuyla admin paneline düşer.

## Capabilities and Constraints

- Kapsam (bu tasarım turu): yalnızca genel site. Admin paneli değişmez.
- Ürün kategorileri: bakır, alüminyum, alaşımlar.
- Hedef pazarlar (yön): Türkiye merkez; Avrupa, Orta Doğu, Kuzey Afrika, Orta Asya.
- Fiyat ve stok teklif aşamasında teyit edilir; teklif fiyatı sitede yayınlanmaz.
- Ekranın altına sabit piyasa şeridi (kullanıcı kararı, 2026-10-08): LME bakır, alüminyum, nikel, çinko, kurşun (USD/ton) ve USD/TRY, EUR/TRY, EUR/USD; kaynak Metals.Dev API (lisanslı), sunucuda 8 saatte bir yenilenir, "gecikmeli referans" olarak etiketlenir. Libre (USD/lb) gösterilmez. Investing.com sayfası parse edilmez (kullanım koşulları ve bot koruması).

## Brand Commitments

- Logo: "Aran" logotipi ve üçgen işaret, bakır-kahve degrade; altında "ARAN METAL" geniş aralıklı yazı (`Logo.jpeg`, `aran_metal_logo_2026-Vector.pdf`, `aran-metal/public/brand/`).
- Resmi ad: Aran Metal Sanayi ve Ticaret A.Ş.
- Görsel yön (kullanıcı tarafından bağlayıcı, 2026-10-07): uluslararası metal ticareti / endüstriyel grup markası; koyu kömür-grafit zemin, fırçalanmış alüminyum ve logo bakırı vurgu, açık bölümlerde kırık beyaz. Sinematik tam ekran hero, editoryal ürün kompozisyonu, LME bağlantılı fiyatlama anlatımı, tedarik zinciri ve lojistik haritası. 2026-10-01 tarihli nilkablo.com.tr yapı referansının yerini alır. SaaS, kripto, neon, cam efekti, kart ızgarası görünümü istenmez.

## Evidence on Hand

- Ürün ve atölye fotoğrafları: `aran-metal/public/images/`.
- Seed içerikleri: ürün açıklamaları, KVKK/gizlilik metinleri (örnek metin olarak işaretli).
- "30+ yıllık tecrübe" kullanıcı tarafından doğrulandı (2026-10-07); kuruluş yılı bilinmiyor.
- LME fiyat API'si yok: teklif fiyatı sitede gösterilmez; LME bölümü fiyatın nasıl oluştuğunu anlatır, grafik çizgisi temsili olarak etiketlenir. Tek istisna alttaki LME referans şerididir (gecikmeli).
- Mevcut görseller yapay zekâ ile üretilmiş ve bazılarında "ARAN METAL" etiketleri ile tarayıcı çubuğu kalıntıları var; gerçek fotoğrafla değiştirilmeleri önerilir.
- Müşteri referansları, sertifika belgeleri, ciro/hacim rakamları sitede yok; uydurulmamalı.

## Product Principles

1. Önce güven: kim olduğumuz, ne sattığımız ve nasıl ulaşılacağı ilk bakışta net olmalı.
2. Spesifikasyon bir kanıttır: saflık, standart, form ve birim her zaman açıkça okunmalı.
3. Teklif istemek tek adım uzaklıkta olmalı.
4. İddialar doğrulanabilir olmalı; kanıtlanmayan rakam ya da referans eklenmez.
