import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

function detectLocale(request: NextRequest): Locale {
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (fromCookie && hasLocale(fromCookie)) return fromCookie;

  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;
  // İlk tercih Türkçe ise TR, başka bir dil ise EN.
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("tr") ? "tr" : "en";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Admin paneli koruması ---
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const isLogin = pathname === "/admin/login";
    const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session && !isLogin) {
      const url = new URL("/admin/login", request.url);
      if (pathname !== "/admin") url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (session && isLogin) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  // --- Dil yönlendirmesi ---
  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) {
    const res = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      res.cookies.set(LOCALE_COOKIE, first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // _next, api, media, statik dosyalar ve metadata dosyaları hariç her şey
    "/((?!_next|api|media|images|brand|favicon.ico|icon.svg|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
