import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Next 16: middleware is now "proxy". Optimistic auth ONLY (no DB) — the
// authoritative check is verifySession() in the DAL, run inside pages/actions.

const AUTH_ROUTES = ["/login", "/register"];
const REFERRER_ROUTES = ["/dashboard", "/referrals", "/redemptions", "/notifications"];
const ADMIN_PREFIX = "/admin";

function key() {
  return new TextEncoder().encode(process.env.SESSION_SECRET ?? "");
}

async function readRole(token: string | undefined): Promise<"admin" | "referrer" | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    const role = payload.role;
    return role === "admin" || role === "referrer" ? role : null;
  } catch {
    return null;
  }
}

function matches(path: string, routes: string[]): boolean {
  return routes.some((r) => path === r || path.startsWith(`${r}/`));
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const role = await readRole(req.cookies.get("session")?.value);

  const home = (r: "admin" | "referrer") => (r === "admin" ? "/admin" : "/dashboard");

  // Logged-in users shouldn't see the auth pages.
  if (matches(path, AUTH_ROUTES) && role) {
    return NextResponse.redirect(new URL(home(role), req.nextUrl));
  }

  const isAdminArea = path === ADMIN_PREFIX || path.startsWith(`${ADMIN_PREFIX}/`);
  if (isAdminArea) {
    if (!role) return NextResponse.redirect(new URL("/login", req.nextUrl));
    if (role !== "admin") return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (matches(path, REFERRER_ROUTES)) {
    if (!role) return NextResponse.redirect(new URL("/login", req.nextUrl));
    if (role !== "referrer") return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
