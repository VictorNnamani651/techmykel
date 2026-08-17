import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DB = NeonHttpDatabase<typeof schema>;

// --- Transient-failure retry (ADR-0012) ---
//
// Neon scales the compute to zero after a period of inactivity. Waking it takes
// seconds, and on a low-traffic app the query that pays that cost is usually the
// session lookup at the very start of a request — so a visitor gets a crash
// page, refreshes, and it works. Network blips and 5xx responses look identical
// and are equally transient.
//
// ONLY READS ARE RETRIED, and that restriction is the important part. A write
// whose response was lost may well have been applied; replaying it would
// duplicate audit_log and notifications rows, which have no unique constraint to
// catch it. Reads are idempotent, and the cold-start failure lands on a read
// anyway. Do not "improve" this to retry everything.
const MAX_RETRIES = 2;
const BACKOFF_MS = [150, 600];

function isReadOnly(body: unknown): boolean {
  if (typeof body !== "string") return false;
  try {
    const parsed = JSON.parse(body);
    const statements = Array.isArray(parsed?.queries)
      ? parsed.queries
      : Array.isArray(parsed)
        ? parsed
        : [parsed];
    return (
      statements.length > 0 &&
      statements.every((st: { query?: unknown }) =>
        /^\s*(select|with)\b/i.test(String(st?.query ?? "")),
      )
    );
  } catch {
    return false; // can't tell what this is — don't risk replaying it
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

neonConfig.fetchFunction = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const attempts = isReadOnly(init?.body) ? MAX_RETRIES + 1 : 1;
  let lastErr: unknown;

  for (let i = 0; i < attempts; i++) {
    if (i > 0) await sleep(BACKOFF_MS[i - 1] ?? 600);
    try {
      const res = await fetch(input, init);
      // 5xx is a server-side failure worth another go. 4xx is deterministic —
      // bad SQL or bad credentials — so retrying only delays the real error.
      if (res.status >= 500 && i < attempts - 1) continue;
      return res;
    } catch (err) {
      lastErr = err;
      if (i === attempts - 1) throw err;
    }
  }
  throw lastErr;
};

// Lazily initialise so importing this module at build time (when DATABASE_URL
// may be absent) doesn't throw — the client is created on first actual use.
let instance: DB | null = null;

function getDb(): DB {
  if (instance) return instance;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local.");
  }
  instance = drizzle(neon(url), { schema });
  return instance;
}

export const db = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real as object, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
