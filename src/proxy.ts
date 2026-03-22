import { auth } from "../auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const searchParams = url.searchParams.toString();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  const host = req.headers.get("host") ?? "";
  const domain = process.env.NEXT_PUBLIC_URL_DOMAIN; // e.g. localhost:3000 or milestack.com

  // ─────────────────────────────────────────
  // STEP 1: Extract subdomain (robust)
  // ─────────────────────────────────────────
  let subdomain: string | null = null;

  if (host && domain && host !== domain && host.endsWith(domain)) {
    const slug = host.replace(`.${domain}`, "");
    if (slug && slug !== "www") {
      subdomain = slug;
    }
  }

  if (subdomain) {
    console.log("Subdomain detected:", subdomain);
    requestHeaders.set("x-agency-slug", subdomain);
  }

  // ─────────────────────────────────────────
  // STEP 2: Public routes
  // ─────────────────────────────────────────
  const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/portal", "/api/auth"];
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // ─────────────────────────────────────────
  // STEP 3: Auth check
  // ─────────────────────────────────────────
  const isAuthenticated = !!req.auth;

  console.error("DEBUG: Middleware Path:", pathname);
  console.error("DEBUG: Is Public Route:", isPublicRoute);
  console.error("DEBUG: Is Authenticated:", isAuthenticated);

  if (!isAuthenticated && !isPublicRoute) {
    console.log("Redirecting to login...");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // ─────────────────────────────────────────
  // STEP 4: Inject user info
  // ─────────────────────────────────────────
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
