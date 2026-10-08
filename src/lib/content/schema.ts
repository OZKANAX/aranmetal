/**
 * Admin panelinden düzenlenebilen içerik bölümlerinin tanımları.
 *
 * Yeni bir alan eklemek için ilgili bölüme bir satır eklemeniz yeterlidir:
 * admin formu ve sitedeki tipler otomatik olarak güncellenir.
 * `localized: true` alanlar TR/EN olarak ayrı ayrı girilir.
 */

export type FieldType = "text" | "textarea" | "image" | "icon" | "url";

type L = { tr: string; en: string };

export type FieldDef = {
  label: string;
  type: FieldType;
  localized: boolean;
  default: string | L;
  help?: string;
};

export type SectionDef = {
  title: string;
  description: string;
  group: "general" | "home" | "pages";
  fields: Record<string, FieldDef>;
};

const t = (label: string, tr: string, en: string, help?: string): FieldDef => ({
  label,
  type: "text",
  localized: true,
  default: { tr, en },
  help,
});
const ta = (label: string, tr: string, en: string, help?: string): FieldDef => ({
  label,
  type: "textarea",
  localized: true,
  default: { tr, en },
  help,
});
const plain = (label: string, value: string, type: FieldType = "text", help?: string): FieldDef => ({
  label,
  type,
  localized: false,
  default: value,
  help,
});
const img = (label: string, value: string) => plain(label, value, "image");
const icon = (label: string, value: string) =>
  plain(label, value, "icon", "Google Material Symbols ikon adı (örn: verified, local_shipping)");

export const sections = {
  general: {
    title: "Genel Ayarlar",
    description: "Firma bilgileri, iletişim, alt bilgi ve SEO ayarları.",
    group: "general",
    fields: {
      companyName: plain("Firma Adı", "Aran Metal"),
      companyTagline: t("Logo Altı Slogan", "Metalurji & Sanayi A.Ş.", "Metallurgy & Industry Inc."),
      email: plain("E-posta", "info@aranmetal.com"),
      phone: plain("Telefon", "+90 533 969 3039"),
      officePhone: plain("Ofis Telefonu", "+90 212 823 6776"),
      address: t(
        "Adres",
        "42 Maslak Multi Ofis 15/12, Maslak / Sarıyer / İstanbul",
        "42 Maslak Multi Office 15/12, Maslak / Sarıyer / Istanbul, Türkiye",
      ),
      workingHours: t("Çalışma Saatleri", "Hafta İçi: 08:30 - 18:00", "Weekdays: 08:30 - 18:00"),
      mapEmbedUrl: plain(
        "Harita Embed URL",
        "https://www.google.com/maps?q=Maslak+42+Istanbul&output=embed",
        "url",
        "Google Maps > Paylaş > Harita yerleştir bağlantısındaki src değeri",
      ),
      linkedin: plain("LinkedIn URL", "", "url"),
      instagram: plain("Instagram URL", "", "url"),
      whatsapp: plain("WhatsApp Numarası", "905339693039", "text", "Ülke koduyla, boşluksuz (örn: 905339693039)"),
      footerDescription: ta(
        "Alt Bilgi Açıklaması",
        "Yüksek saflıkta bakır katot, alaşımlı metaller ve endüstriyel hammadde tedariğinde küresel metalurji ve mühendislik ortağınız.",
        "Your global metallurgy and engineering partner for high-purity copper cathode, alloyed metals and industrial raw material supply.",
      ),
      footerStatus: plain("Alt Bilgi Durum Kodu", "REF // 09-MET-FACILITY-AKTİF"),
      copyright: t(
        "Telif Metni",
        "© 2026 ARAN METAL SANAYİ VE TİCARET A.Ş. TÜM HAKLARI SAKLIDIR.",
        "© 2026 ARAN METAL INDUSTRY AND TRADE INC. ALL RIGHTS RESERVED.",
      ),
      seoTitle: t(
        "SEO Başlığı",
        "Aran Metal | Bakır Katot, Alüminyum Külçe ve Billet Tedariği",
        "Aran Metal | Copper Cathode, Aluminium Ingot & Billet Supply",
      ),
      seoDescription: ta(
        "SEO Açıklaması",
        "Aran Metal; Grade-A bakır katot, alüminyum külçe, billet ve bakır filmaşin ürünlerinde LME bazlı fiyatlandırma, güçlü stok ve hızlı sevkiyat sunar.",
        "Aran Metal supplies Grade-A copper cathode, aluminium ingot, billet and copper wire rod with LME-based pricing, strong stock and fast delivery.",
      ),
    },
  },

  hero: {
    title: "Anasayfa — Hero Şeridi",
    description:
      "Slider üzerindeki durum şeridi ve alt istatistikler. Başlık/görsel alanları yalnızca hiç slayt yoksa kullanılır (slaytlar: Slider menüsü).",
    group: "home",
    fields: {
      statusBadge: t("Durum Rozeti", "LME VERİ GÜNCELLEMESİ // STOK HAZIR", "LME DATA UPDATE // STOCK READY"),
      code: plain("Kod", "KOD // ARAN-MET-TR"),
      location: t("Lokasyon Etiketi", "MASLAK / İSTANBUL OPERASYON MERKEZİ", "MASLAK / ISTANBUL OPERATIONS CENTER"),
      eyebrow: t("Üst Başlık", "// ENDÜSTRİYEL METAL & HAMMADDE TEDARİKİ", "// INDUSTRIAL METAL & RAW MATERIAL SUPPLY"),
      titleLine1: t("Başlık (1. satır)", "Bakır ve alüminyum,", "Copper and aluminium,"),
      titleHighlight: t("Başlık (2. satır)", "her partisi belgeli.", "certified by the lot."),
      titleLine2: t("Başlık (ek, isteğe bağlı)", "", ""),
      description: ta(
        "Açıklama",
        "Grade A bakır katot, P1020 alüminyum külçe, 6000 serisi billet ve bakır filmaşin. LME tescilli rafinerilerden tedarik, LME bazlı fiyat ve her sevkiyatta spektro analiz raporuyla İstanbul'dan teslim.",
        "Grade A copper cathode, P1020 aluminium ingot, 6000-series billet and copper wire rod. Sourced from LME-registered refineries, priced against the LME and delivered from Istanbul with a spectro analysis report on every shipment.",
      ),
      primaryCta: t("Birincil Buton", "Teklif İsteyin", "Request a Quote"),
      secondaryCta: t("İkincil Buton", "Ürünleri İnceleyin", "Explore Products"),
      backgroundImage: img("Arka Plan Görseli", "/images/product-copper-cathode.jpg"),
      backgroundVideo: plain(
        "Arka Plan Videosu",
        "",
        "url",
        "İsteğe bağlı MP4/WebM adresi (örn. /videos/hero.mp4). Sessiz döngüde oynar; görsel poster olarak kalır. Önerilen: 1920×1080, 10–20 sn, < 6 MB.",
      ),
      stat1Label: t("İstatistik 1 — Etiket", "TECRÜBE & KAPASİTE", "EXPERIENCE & CAPACITY"),
      stat1Value: t("İstatistik 1 — Değer", "30+ Yıllık Güven", "30+ Years of Trust"),
      stat2Label: t("İstatistik 2 — Etiket", "SAFLIK STANDARDI", "PURITY STANDARD"),
      stat2Value: t("İstatistik 2 — Değer", "%99.99 Bakır (Grade-A)", "99.99% Copper (Grade-A)"),
      stat3Label: t("İstatistik 3 — Etiket", "SEVKİYAT LOKASYONU", "SHIPPING LOCATION"),
      stat3Value: t("İstatistik 3 — Değer", "Maslak / İstanbul", "Maslak / Istanbul"),
      scrollLabel: t("Kaydırma Etiketi", "AŞAĞI KAYDIR", "SCROLL DOWN"),
    },
  },

  solution: {
    title: "Anasayfa — Çözüm Bandı",
    description: "Hero altındaki görselli vurgu alanı.",
    group: "home",
    fields: {
      ref: plain("Referans Etiketi", "REF // 09-MET-SPEC"),
      eyebrow: t("Üst Başlık", "Hassas Endüstriyel Çözüm", "Precision Industrial Solution"),
      title: t("Başlık", "Endüstrinize Özel Etkin Metal Çözümleri", "Effective Metal Solutions Tailored to Your Industry"),
      description: ta(
        "Açıklama",
        "Güncel LME (London Metal Exchange) bazlı rekabetçi fiyatlandırma, zengin stok güvencesi ve hızlı lojistik entegrasyonu ile sanayi taleplerinize anında yanıt.",
        "Instant response to your industrial demand with competitive pricing based on current LME (London Metal Exchange) data, rich stock assurance and fast logistics integration.",
      ),
      ctaLabel: t("Bağlantı Metni", "Ürün Seçiciyi Kullan", "Use Product Selector"),
      standardsNote: t("Standart Notu", "TÜM ASTM / EN / DIN STANDARTLARI", "ALL ASTM / EN / DIN STANDARDS"),
      image: img("Görsel", "/images/solution-bars.jpg"),
    },
  },

  corporate: {
    title: "Anasayfa — Kurumsal Kartlar",
    description: "“Biz Kimiz” ve “Tedarik ve Lojistik” kartları.",
    group: "home",
    fields: {
      eyebrow: t("Üst Başlık", "// KURUMSAL YAPI VE GÜÇLÜ TEDARİK", "// CORPORATE STRUCTURE & STRONG SUPPLY"),
      title: t("Başlık", "Metal Sanayisinin Güvenilir Dayanağı", "The Reliable Backbone of the Metal Industry"),
      intro: ta(
        "Giriş Metni",
        "Aran Metal olarak, farklı sektörlerin ihtiyaçlarına yönelik alüminyum ve metal ürünlerinin tedarikinde güvenilir çözümler sunuyoruz.",
        "At Aran Metal, we provide reliable solutions in the supply of aluminium and metal products for the needs of different sectors.",
      ),
      card1Tag: t("Kart 1 — Etiket", "01 // VİZYON & KAPASİTE", "01 // VISION & CAPACITY"),
      card1Title: t("Kart 1 — Başlık", "Biz Kimiz?", "Who We Are"),
      card1Text: ta(
        "Kart 1 — Metin",
        "Yenilikçi vizyonumuz, güçlü tedarik ağımız ve sürdürülebilir kalite anlayışımızla metal sanayisinin itici gücüyüz. Doğru zamanlama ve teknik hassasiyet temel ilkemizdir.",
        "With our innovative vision, strong supply network and sustainable quality approach, we are a driving force of the metal industry. Right timing and technical precision are our core principles.",
      ),
      card1Cta: t("Kart 1 — Bağlantı", "Kurumsal Detaylar", "Corporate Details"),
      card1Image: img("Kart 1 — Görsel", "/images/about-workshop.jpg"),
      card2Tag: t("Kart 2 — Etiket", "02 // SEVKİYAT & AĞ", "02 // SHIPPING & NETWORK"),
      card2Title: t("Kart 2 — Başlık", "Tedarik ve Lojistik", "Supply & Logistics"),
      card2Subtitle: t(
        "Kart 2 — Alt Başlık",
        "Güvenilir Depolama & Tam Zamanında Teslimat",
        "Reliable Storage & Just-in-Time Delivery",
      ),
      card2Text: ta(
        "Kart 2 — Metin",
        "Geniş ürün seçeneklerimiz ve güçlü tedarik ağımız ile ihtiyaçlarınıza hızlı ve profesyonel şekilde cevap veriyoruz. Uluslararası akreditasyonlu depolama sahaları.",
        "With our wide product range and strong supply network, we respond to your needs quickly and professionally. Internationally accredited storage facilities.",
      ),
      card2Cta: t("Kart 2 — Buton", "Hızlı Teklif İste", "Request a Quick Quote"),
      card2Image: img("Kart 2 — Görsel", "/images/logistics-map.jpg"),
    },
  },

  productsSection: {
    title: "Ürünler",
    description: "Anasayfadaki öne çıkan ürünler ve Ürünler sayfası başlıkları.",
    group: "home",
    fields: {
      eyebrow: t("Üst Başlık", "// ÜRÜN PORTFÖYÜ", "// PRODUCT PORTFOLIO"),
      title: t("Başlık", "Bakır Katot, Alüminyum ve Alaşımlar", "Copper Cathode, Aluminium and Alloys"),
      intro: ta(
        "Ürünler Sayfası Giriş Metni",
        "LME tescilli bakır katottan ekstrüzyon billetlerine kadar, sanayinizin ihtiyaç duyduğu tüm temel metal hammaddelerini tek noktadan tedarik edin.",
        "From LME-registered copper cathode to extrusion billets, source all the core metal raw materials your industry needs from a single point.",
      ),
      tableTitle: t("Tablo Başlığı", "Teknik Standartlar & Kimyasal Saflık Matrisi", "Technical Standards & Chemical Purity Matrix"),
      tableStandard: plain("Tablo Standart Notu", "ASTM B115 / EN 1978"),
    },
  },

  quote: {
    title: "Teklif Al Sayfası",
    description: "Teklif Al sayfası: başlık, form ve yanındaki avantaj listesi.",
    group: "pages",
    fields: {
      pageEyebrow: t("Sayfa Üst Başlığı", "// TEKLİF TALEBİ", "// REQUEST FOR QUOTATION"),
      pageTitle: t("Sayfa Başlığı", "Teklif Alın", "Request a Quote"),
      pageIntro: ta(
        "Sayfa Girişi",
        "Formu doldurun, satış mühendisimiz güncel LME fiyatı ve stok durumuyla birlikte en kısa sürede size dönüş yapsın.",
        "Fill in the form and our sales engineer will get back to you shortly with current LME pricing and stock availability.",
      ),
      eyebrow: t("Üst Başlık", "// TEDARİK VE STOK TAŞIMA LOJİSTİK", "// SUPPLY & STOCK LOGISTICS"),
      titleLine1: t("Başlık (1. satır)", "Güvenilir Tedarik,", "Reliable Supply,"),
      titleLine2: t("Başlık (2. satır)", "Güçlü Stok, Hızlı Çözüm", "Strong Stock, Fast Solutions"),
      description: ta(
        "Açıklama",
        "İhtiyacınız olan bakır ve alüminyum ürünlerini doğru zamanda, rekabetçi şartlarda ve güvenilir tedarik anlayışıyla sunuyoruz. Güncel stok durumu, özel ebatlar ve toplu alım talepleriniz için uzman ekibimize ulaşın.",
        "We deliver the copper and aluminium products you need at the right time, on competitive terms and with a reliable supply approach. Contact our expert team for current stock, custom sizes and bulk purchase requests.",
      ),
      feature1Icon: icon("Avantaj 1 — İkon", "verified"),
      feature1Title: t("Avantaj 1 — Başlık", "Uluslararası Kalite Sertifikasyonu", "International Quality Certification"),
      feature1Text: t(
        "Avantaj 1 — Metin",
        "Her sevkiyatta spektro analiz ve menşei belgeleri eksiksiz iletilir.",
        "Spectro analysis and certificates of origin are provided with every shipment.",
      ),
      feature2Icon: icon("Avantaj 2 — İkon", "local_shipping"),
      feature2Title: t("Avantaj 2 — Başlık", "Esnek Depolama ve Sevkiyat", "Flexible Storage & Shipping"),
      feature2Text: t(
        "Avantaj 2 — Metin",
        "İstanbul içi acil stok teslimi veya Türkiye geneli sigortalı filo lojistiği.",
        "Urgent stock delivery within Istanbul or insured fleet logistics across Türkiye.",
      ),
      feature3Icon: icon("Avantaj 3 — İkon", "trending_up"),
      feature3Title: t("Avantaj 3 — Başlık", "Anlık LME Metal Endeksleme", "Real-time LME Metal Indexing"),
      feature3Text: t(
        "Avantaj 3 — Metin",
        "Piyasa dalgalanmalarına karşı şeffaf ve rasyonel fiyatlama formülleri.",
        "Transparent and rational pricing formulas against market fluctuations.",
      ),
      formRef: plain("Form Referansı", "// FORM REF: RFQ-DIRECT"),
      formTitle: t("Form Başlığı", "Teklif Talep Formu", "Quote Request Form"),
      responseBadge: t("Yanıt Süresi Rozeti", "YANIT: < 2 SAAT", "RESPONSE: < 2 HOURS"),
      successMessage: ta(
        "Başarı Mesajı",
        "Talebiniz başarıyla alındı. Satış mühendisimiz 2 saat içinde sizinle irtibata geçecektir.",
        "Your request has been received. Our sales engineer will contact you within 2 hours.",
      ),
    },
  },

  cta: {
    title: "Teklif Çağrı Bandı (CTA)",
    description: "Sayfaların altında görünen “Teklif Alın” yönlendirme bandı.",
    group: "general",
    fields: {
      eyebrow: t("Üst Başlık", "// HIZLI TEKLİF", "// QUICK QUOTE"),
      title: t("Başlık", "Projeniz İçin Güncel Fiyat ve Stok Bilgisi Alın", "Get Current Pricing and Stock for Your Project"),
      text: ta(
        "Metin",
        "Bakır ve alüminyum ihtiyaçlarınızı iletin; LME bazlı teklifimizi 2 saat içinde size ulaştıralım.",
        "Share your copper and aluminium requirements; we will send our LME-based quotation within 2 hours.",
      ),
      primaryLabel: t("Birincil Buton", "Teklif Alın", "Get a Quote"),
      secondaryLabel: t("İkincil Buton", "Bize Ulaşın", "Contact Us"),
    },
  },

  contact: {
    title: "İletişim Sayfası",
    description: "İletişim sayfasının başlığı ve iletişim kartları.",
    group: "pages",
    fields: {
      eyebrow: t("Üst Başlık", "// BİZE ULAŞIN", "// CONTACT US"),
      title: t("Başlık", "Merkez Ofis & Operasyon", "Head Office & Operations"),
      description: ta(
        "Açıklama",
        "Satış, sözleşmeli hammadde temini ve finansman koşulları için Maslak merkez ofisimiz ile dilediğiniz zaman iletişime geçebilirsiniz.",
        "Contact our Maslak head office at any time for sales, contracted raw material supply and financing terms.",
      ),
    },
  },

  aboutPage: {
    title: "Hakkımızda Sayfası",
    description: "Hakkımızda sayfasının tüm metinleri.",
    group: "pages",
    fields: {
      eyebrow: t("Üst Başlık", "// KURUMSAL PROFİL", "// CORPORATE PROFILE"),
      title: t("Sayfa Başlığı", "Metal Sanayisinin Güvenilir Dayanağı", "The Reliable Backbone of the Metal Industry"),
      intro: ta(
        "Giriş",
        "Aran Metal; bakır, alüminyum ve alaşımlı metal hammaddelerinin tedariğinde sanayiye güç veren, İstanbul merkezli bir metalurji ve ticaret kuruluşudur.",
        "Aran Metal is an Istanbul-based metallurgy and trading company empowering industry through the supply of copper, aluminium and alloyed metal raw materials.",
      ),
      heroImage: img("Başlık Görseli", "/images/about-workshop.jpg"),
      storyTitle: t("Hikaye Başlığı", "Biz Kimiz?", "Who We Are"),
      storyText: ta(
        "Hikaye Metni",
        "Yenilikçi vizyonumuz, güçlü tedarik ağımız ve sürdürülebilir kalite anlayışımızla metal sanayisinin itici gücüyüz. Kablo, otomotiv, inşaat ve enerji sektörlerindeki üreticilere; LME endeksli şeffaf fiyatlandırma, sertifikalı ürün ve zamanında teslimat güvencesi sunuyoruz.\n\nDoğru zamanlama ve teknik hassasiyet temel ilkemizdir. Uzman kadromuz, her talebi şartname ve ebat gereksinimleriyle birlikte değerlendirerek en uygun tedarik modelini oluşturur.",
        "With our innovative vision, strong supply network and sustainable quality approach, we are a driving force of the metal industry. We offer manufacturers in the cable, automotive, construction and energy sectors LME-indexed transparent pricing, certified products and on-time delivery.\n\nRight timing and technical precision are our core principles. Our expert team evaluates each request together with its specification and size requirements to build the most suitable supply model.",
      ),
      visionTitle: t("Vizyon Başlığı", "Vizyonumuz", "Our Vision"),
      visionText: ta(
        "Vizyon Metni",
        "Bölgemizin en güvenilir ve en hızlı metal hammadde tedarik ortağı olmak.",
        "To be the most reliable and fastest metal raw material supply partner in our region.",
      ),
      missionTitle: t("Misyon Başlığı", "Misyonumuz", "Our Mission"),
      missionText: ta(
        "Misyon Metni",
        "Sanayicilerimize doğru ürünü, doğru zamanda ve rekabetçi koşullarla ulaştırarak üretimlerinin kesintisiz sürmesini sağlamak.",
        "To keep our industrial partners' production uninterrupted by delivering the right product at the right time on competitive terms.",
      ),
      value1Icon: icon("Değer 1 — İkon", "verified"),
      value1Title: t("Değer 1 — Başlık", "Kalite", "Quality"),
      value1Text: t("Değer 1 — Metin", "Sertifikalı, izlenebilir ve standartlara uygun ürünler.", "Certified, traceable and standard-compliant products."),
      value2Icon: icon("Değer 2 — İkon", "handshake"),
      value2Title: t("Değer 2 — Başlık", "Güven", "Trust"),
      value2Text: t("Değer 2 — Metin", "Şeffaf fiyatlama ve uzun soluklu iş ortaklıkları.", "Transparent pricing and long-term partnerships."),
      value3Icon: icon("Değer 3 — İkon", "bolt"),
      value3Title: t("Değer 3 — Başlık", "Hız", "Speed"),
      value3Text: t("Değer 3 — Metin", "Güçlü stok ve hızlı sevkiyat altyapısı.", "Strong stock and fast shipping infrastructure."),
    },
  },

  logisticsPage: {
    title: "Tedarik & Lojistik Sayfası",
    description: "Tedarik & Lojistik sayfasının tüm metinleri.",
    group: "pages",
    fields: {
      eyebrow: t("Üst Başlık", "// TEDARİK ZİNCİRİ & DEPOLAMA", "// SUPPLY CHAIN & STORAGE"),
      title: t("Sayfa Başlığı", "Güvenilir Depolama, Tam Zamanında Teslimat", "Reliable Storage, Just-in-Time Delivery"),
      intro: ta(
        "Giriş",
        "Geniş ürün seçeneklerimiz ve güçlü tedarik ağımız ile ihtiyaçlarınıza hızlı ve profesyonel şekilde cevap veriyoruz.",
        "With our wide product range and strong supply network, we respond to your needs quickly and professionally.",
      ),
      heroImage: img("Başlık Görseli", "/images/logistics-map.jpg"),
      processTitle: t("Süreç Başlığı", "Tedarik Sürecimiz", "Our Supply Process"),
      step1Title: t("Adım 1 — Başlık", "Talep & Şartname", "Request & Specification"),
      step1Text: t("Adım 1 — Metin", "Ürün, miktar, ebat ve kalite gereksinimleriniz alınır.", "Your product, quantity, size and quality requirements are collected."),
      step2Title: t("Adım 2 — Başlık", "LME Bazlı Teklif", "LME-based Quote"),
      step2Text: t("Adım 2 — Metin", "Güncel LME verileriyle şeffaf fiyat teklifi hazırlanır.", "A transparent quotation is prepared with current LME data."),
      step3Title: t("Adım 3 — Başlık", "Kalite Kontrol", "Quality Control"),
      step3Text: t("Adım 3 — Metin", "Spektro analiz ve menşei belgeleri hazırlanır.", "Spectro analysis and certificates of origin are prepared."),
      step4Title: t("Adım 4 — Başlık", "Sevkiyat", "Shipment"),
      step4Text: t("Adım 4 — Metin", "Depo teslim veya sigortalı filo ile adrese teslim.", "Ex-warehouse or delivered to your address by insured fleet."),
      capabilitiesTitle: t("Kabiliyetler Başlığı", "Lojistik Kabiliyetlerimiz", "Our Logistics Capabilities"),
      cap1Icon: icon("Kabiliyet 1 — İkon", "warehouse"),
      cap1Title: t("Kabiliyet 1 — Başlık", "Akredite Depolama", "Accredited Storage"),
      cap1Text: t("Kabiliyet 1 — Metin", "Uluslararası akreditasyonlu depolama sahaları.", "Internationally accredited storage facilities."),
      cap2Icon: icon("Kabiliyet 2 — İkon", "local_shipping"),
      cap2Title: t("Kabiliyet 2 — Başlık", "Sigortalı Filo", "Insured Fleet"),
      cap2Text: t("Kabiliyet 2 — Metin", "Türkiye geneli sigortalı karayolu taşımacılığı.", "Insured road transport across Türkiye."),
      cap3Icon: icon("Kabiliyet 3 — İkon", "schedule"),
      cap3Title: t("Kabiliyet 3 — Başlık", "Acil Teslimat", "Urgent Delivery"),
      cap3Text: t("Kabiliyet 3 — Metin", "İstanbul içi aynı gün stok teslimi.", "Same-day stock delivery within Istanbul."),
    },
  },
} satisfies Record<string, SectionDef>;

export type SectionKey = keyof typeof sections;
export type SectionContent<K extends SectionKey> = Record<keyof (typeof sections)[K]["fields"], string>;

export const sectionKeys = Object.keys(sections) as SectionKey[];

export function isSectionKey(value: string): value is SectionKey {
  return value in sections;
}
