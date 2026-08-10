import "server-only";
import type { AlertSender } from "./index";

// Raw fetch (no SDK) — the Bot API is a single POST, same style as lib/sms/twilio.
//
// A bot cannot open a conversation, so TELEGRAM_CHAT_ID is discovered once
// by having the admin message the bot and running scripts/telegram-chat-id.mjs.
export class TelegramAlertSender implements AlertSender {
  async send(text: string): Promise<{ id?: string }> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      throw new Error(
        "Telegram env vars missing (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID).",
      );
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        // Deliberately no parse_mode: message bodies interpolate user-supplied
        // names and phone numbers, and an stray _ or * would make Telegram
        // reject the whole send as malformed markup.
        disable_web_page_preview: true,
      }),
    });

    const json = (await res.json()) as {
      ok?: boolean;
      result?: { message_id?: number };
      error_code?: number;
      description?: string;
    };
    if (!res.ok || !json.ok) {
      throw new Error(
        `Telegram send failed (${res.status}, code ${json.error_code}): ${json.description}`,
      );
    }
    return { id: json.result?.message_id?.toString() };
  }
}
