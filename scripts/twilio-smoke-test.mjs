// Standalone Twilio SMS smoke test — no project deps required (Node 18+).
// Usage:
//   1. Fill TWILIO_* values in .env.local
//   2. node scripts/twilio-smoke-test.mjs +234XXXXXXXXXX
//
// It sends one SMS and prints Twilio's raw response so we can see exactly
// what works (or which error code comes back) before wiring SMS into the app.

import { readFileSync } from "node:fs";

// --- tiny .env.local loader (no dotenv dependency) ---
function loadEnv(path = ".env.local") {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    console.error(`Could not read ${path}. Create it with your TWILIO_* values.`);
    process.exit(1);
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

loadEnv();

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_PHONE_NUMBER;
const to = process.argv[2];

if (!sid || !token || !from) {
  console.error("Missing TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_PHONE_NUMBER in .env.local");
  process.exit(1);
}
if (!to) {
  console.error("Pass a destination number, e.g. node scripts/twilio-smoke-test.mjs +2348012345678");
  process.exit(1);
}

const body = new URLSearchParams({
  To: to,
  From: from,
  Body: "Techmykel referral platform — Twilio smoke test. If you got this, SMS works.",
});

const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
  method: "POST",
  headers: {
    Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body,
});

const json = await res.json();
console.log("HTTP", res.status);
console.log(JSON.stringify(json, null, 2));

if (res.ok) {
  console.log(`\n✅ Accepted by Twilio. SID: ${json.sid}, status: ${json.status}`);
  console.log("Note: 'queued'/'accepted' means Twilio took it — check your phone for actual delivery.");
} else {
  console.log(`\n❌ Twilio rejected it. code=${json.code} — ${json.message}`);
  console.log("Common: 20003 = bad/expired credentials; 21408 = geo-permission for Nigeria not enabled; 21608 = trial, recipient not verified.");
}
