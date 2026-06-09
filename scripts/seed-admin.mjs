// Idempotent admin seeder. Self-contained (no TS/Drizzle) so it runs with plain node.
//   node scripts/seed-admin.mjs
// Reads ADMIN_PHONE, ADMIN_PASSWORD, (optional) ADMIN_NAME and DATABASE_URL from .env.local.
import { readFileSync } from "node:fs";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { neon } from "@neondatabase/serverless";

const scryptAsync = promisify(scrypt);

function loadEnvLocal(path = ".env.local") {
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* rely on ambient env */
  }
}

// Mirror of lib/password.ts hashSecret — keep formats identical.
async function hashSecret(secret) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(secret, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

// Mirror of lib/phone.ts normalizeNgPhone.
function normalizeNgPhone(input) {
  const digits = (input ?? "").replace(/\D/g, "");
  let national;
  if (digits.startsWith("234")) national = digits.slice(3);
  else if (digits.startsWith("0")) national = digits.slice(1);
  else national = digits;
  if (national.length !== 10 || !/^[789]/.test(national)) return null;
  return `+234${national}`;
}

loadEnvLocal();

const url = process.env.DATABASE_URL;
const rawPhone = process.env.ADMIN_PHONE;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Administrator";

if (!url) throw new Error("DATABASE_URL missing.");
if (!rawPhone || !password)
  throw new Error("ADMIN_PHONE and ADMIN_PASSWORD must be set in .env.local.");

const phone = normalizeNgPhone(rawPhone);
if (!phone) throw new Error(`ADMIN_PHONE is not a valid NG mobile number: ${rawPhone}`);

const sql = neon(url);
const passwordHash = await hashSecret(password);

const rows = await sql`
  insert into users (role, full_name, phone, password_hash, phone_verified_at)
  values ('admin', ${name}, ${phone}, ${passwordHash}, now())
  on conflict (phone) do update
    set role = 'admin',
        full_name = excluded.full_name,
        password_hash = excluded.password_hash,
        phone_verified_at = now()
  returning id, phone, role
`;

console.log("✅ Admin seeded:", rows[0]);
