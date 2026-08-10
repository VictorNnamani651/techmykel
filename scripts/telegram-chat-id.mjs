// Discover the admin's Telegram chat ID — no project deps required (Node 18+).
//
// A bot cannot start a conversation. The admin must message it first; only then
// does Telegram expose the chat ID that we send notifications to.
//
// Usage:
//   1. Put TELEGRAM_BOT_TOKEN in .env.local
//   2. On the ADMIN's phone: open Telegram, search the bot's @username, press
//      Start (or send it any message, e.g. "hi")
//   3. node scripts/telegram-chat-id.mjs
//   4. Copy the printed chat ID into .env.local as TELEGRAM_CHAT_ID
//
// Note: getUpdates only returns recent, unconsumed messages. If nothing shows
// up, have the admin send the bot another message and re-run.

import { readFileSync } from "node:fs";

// --- tiny .env.local loader (no dotenv dependency) ---
function loadEnv(path = ".env.local") {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    console.error(`Could not read ${path}. Add TELEGRAM_BOT_TOKEN to it first.`);
    process.exit(1);
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

loadEnv();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN missing from .env.local.");
  process.exit(1);
}

// Confirm the token is valid and show which bot it belongs to.
const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
const me = await meRes.json();
if (!me.ok) {
  console.error(
    `Token rejected by Telegram (${me.error_code}): ${me.description}`,
  );
  console.error("Check the token was copied whole, including the digits before the colon.");
  process.exit(1);
}
console.log(`Bot: @${me.result.username} (${me.result.first_name})\n`);

const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const data = await res.json();
if (!data.ok) {
  console.error(`getUpdates failed (${data.error_code}): ${data.description}`);
  process.exit(1);
}

// Collect distinct chats across whatever update types came back.
const chats = new Map();
for (const u of data.result) {
  const msg = u.message ?? u.edited_message ?? u.channel_post;
  const chat = msg?.chat;
  if (chat) chats.set(chat.id, chat);
}

if (chats.size === 0) {
  console.error("No messages found.\n");
  console.error(`Have the admin open Telegram, find @${me.result.username}, and press Start.`);
  console.error("Then run this script again.");
  process.exit(1);
}

console.log("Found these chats:\n");
for (const chat of chats.values()) {
  const who =
    chat.type === "private"
      ? [chat.first_name, chat.last_name].filter(Boolean).join(" ") +
        (chat.username ? ` (@${chat.username})` : "")
      : chat.title;
  console.log(`  TELEGRAM_CHAT_ID=${chat.id}    ${chat.type} — ${who}`);
}
console.log("\nCopy the matching line into .env.local.");
