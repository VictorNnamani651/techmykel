// Delete a test account and everything hanging off it — no project deps (Node 18+).
//
// Usage:
//   node scripts/purge-test-user.mjs 07058309789          # dry run, shows what would go
//   node scripts/purge-test-user.mjs 07058309789 --yes    # actually delete
//
// Frees the phone for re-registration and frees any phones that account referred.
//
// WARNING: this deletes audit_log rows, which ADR-0003 says are append-only and
// immutable. That is acceptable for throwaway test accounts and NOT acceptable
// for real ones — the audit log is how payout disputes get settled. Check the
// dry run before passing --yes.

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

function loadEnv(path = ".env.local") {
  let raw;
  try { raw = readFileSync(path, "utf8"); }
  catch { console.error(`Could not read ${path}.`); process.exit(1); }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

// Mirrors lib/phone.ts so "07058309789", "7058309789" and "+2347058309789" all work.
function normalizeNgPhone(input) {
  const digits = (input ?? "").replace(/\D/g, "");
  let national;
  if (digits.startsWith("234")) national = digits.slice(3);
  else if (digits.startsWith("0")) national = digits.slice(1);
  else national = digits;
  if (national.length !== 10 || !/^[789]/.test(national)) return null;
  return `+234${national}`;
}

loadEnv();
const arg = process.argv[2];
const confirm = process.argv.includes("--yes");
if (!arg) {
  console.error("Usage: node scripts/purge-test-user.mjs <phone> [--yes]");
  process.exit(1);
}
const PHONE = normalizeNgPhone(arg);
if (!PHONE) { console.error(`"${arg}" is not a valid NG mobile number.`); process.exit(1); }

const sql = neon(process.env.DATABASE_URL);
const [user] = await sql`select id, full_name, role, phone_verified_at from users where phone=${PHONE}`;
if (!user) {
  console.log(`No account on ${PHONE} — already free to register.`);
  process.exit(0);
}
if (user.role === "admin") {
  console.error(`REFUSING: ${PHONE} is an ADMIN account ("${user.full_name}").`);
  console.error("Demote it first if you really mean to delete it.");
  process.exit(1);
}

const refs = await sql`select id, referred_name, referred_phone, status from referrals where referrer_id=${user.id}`;
const refIds = refs.map((r) => r.id);

const counts = {
  redemptions: refIds.length ? (await sql`select count(*)::int as n from redemptions where referral_id = any(${refIds}::uuid[])`)[0].n : 0,
  referrals: refs.length,
  notifications_own: (await sql`select count(*)::int as n from notifications where user_id=${user.id}`)[0].n,
  notifications_about: refIds.length ? (await sql`select count(*)::int as n from notifications where entity_id = any(${refIds}::uuid[])`)[0].n : 0,
  sessions: (await sql`select count(*)::int as n from sessions where user_id=${user.id}`)[0].n,
  audit_rows: (await sql`select count(*)::int as n from audit_log where actor_user_id=${user.id}`)[0].n,
  otp_codes: (await sql`select count(*)::int as n from otp_codes where phone=${PHONE}`)[0].n,
};

console.log(`Account: ${user.full_name} (${PHONE}) — ${user.role}, verified: ${user.phone_verified_at ? "yes" : "no"}`);
console.table([counts]);
if (refs.length) { console.log("Referrals that would go (their phones become referrable again):"); console.table(refs); }

if (!confirm) {
  console.log("\nDRY RUN — nothing deleted. Re-run with --yes to apply.");
  if (counts.audit_rows) console.log(`Note: ${counts.audit_rows} audit_log row(s) would be deleted (see ADR-0003).`);
  process.exit(0);
}

if (refIds.length) {
  await sql`delete from redemptions where referral_id = any(${refIds}::uuid[])`;
  await sql`delete from notifications where entity_id = any(${refIds}::uuid[])`;
  await sql`delete from audit_log where entity_id = any(${refIds}::uuid[])`;
}
await sql`delete from notifications where user_id=${user.id}`;
await sql`delete from sessions where user_id=${user.id}`;
await sql`delete from audit_log where actor_user_id=${user.id}`;
await sql`delete from referrals where referrer_id=${user.id}`;
await sql`delete from otp_codes where phone=${PHONE}`;
await sql`delete from users where id=${user.id}`;

console.log("\nDeleted. Freed numbers:");
for (const p of [PHONE, ...refs.map((r) => r.referred_phone)]) {
  const u = (await sql`select count(*)::int as n from users where phone=${p}`)[0].n;
  const r = (await sql`select count(*)::int as n from referrals where referred_phone=${p}`)[0].n;
  console.log(`  ${p}  account=${u ? "TAKEN" : "free"}  referred=${r ? "TAKEN" : "free"}`);
}
