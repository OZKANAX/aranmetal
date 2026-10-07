import { FileText, GalleryHorizontalEnd, Inbox, LayoutDashboard, Package, PanelsTopLeft, UserCog } from "lucide-react";

export const adminNav = [
  { href: "/admin", label: "Gösterge Paneli", icon: LayoutDashboard, exact: true },
  { href: "/admin/slides", label: "Slider", icon: GalleryHorizontalEnd },
  { href: "/admin/content", label: "Site İçeriği", icon: PanelsTopLeft },
  { href: "/admin/products", label: "Ürünler", icon: Package },
  { href: "/admin/quotes", label: "Teklif Talepleri", icon: Inbox, badge: "quotes" as const },
  { href: "/admin/pages", label: "Yasal Sayfalar", icon: FileText },
  { href: "/admin/account", label: "Hesap", icon: UserCog },
];

/** Breadcrumb için segment etiketleri */
export const segmentLabels: Record<string, string> = {
  admin: "Panel",
  content: "Site İçeriği",
  slides: "Slider",
  products: "Ürünler",
  quotes: "Teklif Talepleri",
  pages: "Yasal Sayfalar",
  account: "Hesap",
  new: "Yeni",
};
