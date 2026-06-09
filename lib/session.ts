import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import type { UserRole } from "@/lib/db/schema";

const COOKIE = "session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set. Add it to .env.local.");
  return new TextEncoder().encode(secret);
}

export interface SessionData {
  sessionId: string;
  userId: string;
  role: UserRole;
}

// Create a DB session and set a jose-signed {sid, role} cookie.
export async function createSession(userId: string, role: UserRole): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const [row] = await db
    .insert(sessions)
    .values({ userId, role, expiresAt })
    .returning({ id: sessions.id });

  const token = await new SignJWT({ sid: row.id, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

// Authoritative, DB-backed session read (used by the DAL). Cached per request.
export const getSession = cache(async (): Promise<SessionData | null> => {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  let sid: string | undefined;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    sid = typeof payload.sid === "string" ? payload.sid : undefined;
  } catch {
    return null;
  }
  if (!sid) return null;

  const [row] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sid), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!row) return null;
  return { sessionId: row.id, userId: row.userId, role: row.role };
});

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
      if (typeof payload.sid === "string") {
        await db.delete(sessions).where(eq(sessions.id, payload.sid));
      }
    } catch {
      // ignore — clearing the cookie below is enough
    }
  }
  store.delete(COOKIE);
}
