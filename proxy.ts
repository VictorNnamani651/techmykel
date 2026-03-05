import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  // ── Protect /admin/* ────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "ADMIN") {
      // Authenticated but wrong role — send referrers to their dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ── Protect /dashboard/* ────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "REFERRER") {
      // Authenticated but wrong role — send admins to the admin area
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // ── Redirect authenticated users away from /login ───────────────────────────
  if (pathname === "/login" && session) {
    const destination = role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(destination, req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on all routes except static files, images, and _next internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
