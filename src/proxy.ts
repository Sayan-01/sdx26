import { auth } from "../auth"; // Note: import root level auth
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const host = req.headers.get("host") ?? "";
  const domain = process.env.NEXT_PUBLIC_URL_DOMAIN; // e.g. localhost:3000

  //S1: Extract Subdomain

  let subdomain: string | null = null;
  if (host && domain && host !== domain && host.endsWith(domain)) {
    const slug = host.replace(`.${domain}`, "");
    if (slug && slug !== "www") {
      subdomain = slug;
    }
  }

  //S2: If subdomain not start with /api/internal and /_next and .ext
  if (subdomain && !pathname.startsWith("/api/internal") && !pathname.startsWith("/_next") && !pathname.includes(".")) {
    requestHeaders.set("x-agency-slug", subdomain);
    // get agencyId from subdomain
    const resolveUrl = new URL(`/api/internal/resolve-tenant?slug=${subdomain}`, req.url);
    try {
      const resolveRes = await fetch(resolveUrl.toString(), {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SECRET || "",
        },
      });
      if (resolveRes.ok) {
        const data = await resolveRes.json();
        if (data.agencyId) {
          requestHeaders.set("x-agency-id", data.agencyId);
        }
      } else if (resolveRes.status === 404) {
        // 4o4 if agency not found
        return new NextResponse("Agency tenant not found", { status: 404 });
      }
    } catch (err) {
      console.error("Failed to resolve tenant:", err);
    }
  }

  //S3: public route
  const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/portal", "/api/auth"];
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  //S4: Authentication check
  const isAuthenticated = !!req.auth;

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (req.auth?.user) {
    requestHeaders.set("x-user-id", req.auth.user.id ?? "");
    requestHeaders.set("x-user-role", req.auth.user.role ?? "");
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
