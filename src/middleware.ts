import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED = ["/dashboard", "/income", "/expenses", "/projects", "/invoices", "/clients", "/calendar", "/reports", "/settings", "/currency"];
const AUTH_ONLY = ["/login", "/register", "/forgot-password"];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

function stripLocale(pathname: string): string {
  for (const l of locales) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

export async function middleware(request: NextRequest) {
  // Skip API and static
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Refresh Supabase session first
  const { response: supaResponse, user } = await updateSession(request);

  // Run i18n middleware
  const intlResponse = intlMiddleware(request);
  // Merge cookies set by Supabase into the intl response
  for (const cookie of supaResponse.cookies.getAll()) {
    intlResponse.cookies.set(cookie.name, cookie.value);
  }

  // Auth gate
  const stripped = stripLocale(pathname);
  const isProtected = PROTECTED.some((p) => stripped === p || stripped.startsWith(`${p}/`));
  const isAuthPage = AUTH_ONLY.some((p) => stripped === p || stripped.startsWith(`${p}/`));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    const locale = pathname.split("/")[1];
    url.pathname = `/${locales.includes(locale as (typeof locales)[number]) ? locale : defaultLocale}/login`;
    return NextResponse.redirect(url);
  }
  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    const locale = pathname.split("/")[1];
    url.pathname = `/${locales.includes(locale as (typeof locales)[number]) ? locale : defaultLocale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
