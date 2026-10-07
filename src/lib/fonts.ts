import { Archivo, EB_Garamond, Hanken_Grotesk, JetBrains_Mono, Martian_Mono, Space_Grotesk } from "next/font/google";

// Genel site: Archivo — başlıklar geniş (wdth 125) "damga" sesiyle, metin normal genişlikte.
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Parti verisi (ürün kodu, saflık, standart, koordinat) için yalnızca ölçü yazısı.
export const martianMono = Martian_Mono({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-martian",
  display: "swap",
});

// Başlıklar: klasik, yüksek kontrastlı serif (ticaret evi / yıllık rapor sesi).
export const ebGaramond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-ebgaramond",
  display: "swap",
});

export const siteFontVariables = `${archivo.variable} ${martianMono.variable} ${ebGaramond.variable}`;

// Admin paneli (ayrı tasarım dili)
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const fontVariables = `${spaceGrotesk.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`;
