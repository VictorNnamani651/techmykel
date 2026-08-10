// Standalone Telegram alert smoke test — no project deps required (Node 18+).
// Usage:
//   1. Fill TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local
//      (get the chat ID with: node scripts/telegram-chat-id.mjs)
//   2. node scripts/telegram-smoke-test.mjs ["optional custom message"]
//
// Sends one message and prints Telegram's raw response, so we can see exactly
// what works (or which error comes back) before trusting it in the app.

import { readFileSync } from "node:fs";

// --- tiny .env.local loader (no dotenv dependency) ---
function loadEnv(path = ".env.local") {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    console.error(`Could not read ${path}. Create it with your TELEGRAM_* values.`);
    process.exit(1);
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

loadEnv();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!token || !chatId) {
  console.error(
    "Missing TELEGRAM_BOT_TOKEN and/or TELEGRAM_CHAT_ID in .env.local.",
  );
  console.error("Run: node scripts/telegram-chat-id.mjs");
  process.exit(1);
}

const text =
  process.argv[2] ??
  "Techmykel test alert — if you can read this, admin notifications are working.";

const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
});

const json = await res.json();
console.log(`HTTP ${res.status}`);
console.log(JSON.stringify(json, null, 2));

if (!res.ok || !json.ok) {
  console.error("\n✗ Send failed.");
  if (json.error_code === 400) {
    console.error("  400 usually means the chat ID is wrong, or the admin has");
    console.error("  never messaged the bot. Re-run scripts/telegram-chat-id.mjs.");
  }
  if (json.error_code === 401) {
    console.error("  401 means the bot token is wrong or was revoked.");
  }
  if (json.error_code === 403) {
    console.error("  403 means the admin blocked the bot, or deleted the chat.");
  }
  process.exit(1);
}

console.log("\n✓ Delivered. Check the admin's Telegram.");
