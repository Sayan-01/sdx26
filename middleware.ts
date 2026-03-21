import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

// ─────────────────────────────────────────
// Route categories
// ─────────────────────────────────────────
const PUBLIC_ROUTES = ["/login", "/signup", "/api/auth"];
const PORTAL_ROUTES = ["/portal"];
const SETUP_ROUTE = "/setup-agency";
const DASHBOARD_ROUTES = ["/dashboard", "/projects", "/settings"];

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // ─────────────────────────────────────────
  // Skip static files
  // ─────────────────────────────────────────
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const res = NextResponse.next({
    request: { headers: new Headers(req.headers) },
  });

  // ─────────────────────────────────────────
  // STEP 1: Subdomain → agencyId resolve
  // pixel-studio.milestack.com → agencyId
  // localhost:3000 → skip (dev mode)
  // ─────────────────────────────────────────
  const host = req.headers.get("host") ?? "";
  const isLocalhost = host.includes("localhost");
  const parts = host.split(".");
  const hasSubdomain = !isLocalhost && parts.length >= 3;
  const slug = hasSubdomain ? parts[0] : null;

  if (slug) {
    try {
      const tenantRes = await fetch(`${req.nextUrl.origin}/api/internal/resolve-tenant?slug=${slug}`, {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SECRET ?? "",
        },
      });

      if (!tenantRes.ok) {
        // Unknown slug → redirect to main site
        return NextResponse.redirect(new URL("https://milestack.com/not-found"));
      }

      const { agencyId } = await tenantRes.json();
      res.headers.set("x-agency-id", agencyId);
      res.headers.set("x-agency-slug", slug);
    } catch {
      return NextResponse.redirect(new URL("https://milestack.com"));
    }
  }

  // ─────────────────────────────────────────
  // STEP 2: Portal routes — client magic link session
  // NextAuth session নেই, আলাদা cookie আছে
  // ─────────────────────────────────────────
  const isPortalRoute = PORTAL_ROUTES.some((r) => pathname.startsWith(r));

  if (isPortalRoute) {
    const clientSession = req.cookies.get("client_session")?.value;

    // Portal entry page (/portal/:token) — session নেই তো ঠিক আছে
    // Page নিজেই token verify করবে এবং session set করবে
    // তাই redirect না করে শুধু header set করো
    if (clientSession) {
      res.headers.set("x-client-session", clientSession);
    }

    return res;
  }

  // ─────────────────────────────────────────
  // STEP 3: Public routes — no auth needed
  // ─────────────────────────────────────────
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  if (isPublicRoute) return res;

  // ─────────────────────────────────────────
  // STEP 4: All other routes → must have NextAuth session
  // ─────────────────────────────────────────
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─────────────────────────────────────────
  // STEP 5: Logged in but agency not set up yet
  // Signup flow: user তৈরি হয়েছে, agency এখনো হয়নি
  // agencyId = null → শুধু /setup-agency তে যেতে পারবে
  // ─────────────────────────────────────────
  const agencyId = session.user?.agencyId;

  if (!agencyId && pathname !== SETUP_ROUTE) {
    return NextResponse.redirect(new URL(SETUP_ROUTE, req.url));
  }

  // ─────────────────────────────────────────
  // STEP 6: Agency আছে কিন্তু /setup-agency তে যাচ্ছে
  // Already set up → dashboard-এ redirect
  // ─────────────────────────────────────────
  if (agencyId && pathname === SETUP_ROUTE) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ─────────────────────────────────────────
  // STEP 7: Inject user info into headers
  // API routes এগুলো read করবে getAgencyId(), getUserId() দিয়ে
  // ─────────────────────────────────────────
  res.headers.set("x-user-id", session.user?.id ?? "");
  res.headers.set("x-user-role", session.user?.role ?? "");

  // agencyId: subdomain থেকে আসলে সেটা priority পাবে
  // না হলে session থেকে নাও
  if (!res.headers.get("x-agency-id")) {
    res.headers.set("x-agency-id", agencyId ?? "");
  }

  return res;
});

export const config = {
  matcher: [
    // সব routes — static files বাদে
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
