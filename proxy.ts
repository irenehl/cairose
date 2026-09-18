import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STATIC_PREFIXES = ["/_next", "/favicon", "/cairose-", "/tenants/", "/demo/"];

function platformRootDomain(): string {
  return process.env.PLATFORM_ROOT_DOMAIN ?? "cairose.local";
}

function tenantSlugFromHost(host: string): string | null {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  const root = platformRootDomain().toLowerCase();
  if (hostname === root || hostname === `www.${root}`) return null;
  if (hostname.endsWith(`.${root}`)) {
    const slug = hostname.slice(0, -(root.length + 1));
    if (slug && !slug.includes(".")) return slug;
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const slug = tenantSlugFromHost(request.headers.get("host") ?? "");
  if (!slug) return NextResponse.next();

  // Already on a path-based tenant route — leave it alone.
  if (pathname === `/t/${slug}` || pathname.startsWith(`/t/${slug}/`)) {
    return NextResponse.next();
  }

  // Platform chrome stays on the apex / panel host.
  if (
    pathname.startsWith("/panel") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/t/${slug}` : `/t/${slug}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
