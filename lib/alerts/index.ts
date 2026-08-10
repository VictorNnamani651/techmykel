import "server-only";
import { ConsoleAlertSender } from "./console";
import { TelegramAlertSender } from "./telegram";

// Out-of-app alerts to the shop owner. Distinct from lib/notifications.ts, which
// records in-app notifications in the DB — this is the push to the admin's phone
// so they don't have to be looking at the dashboard.
//
// Pluggable in the same shape as lib/sms (ADR-0001). Telegram is the V1 channel:
// the admin is one known person, so it costs nothing and needs no per-message
// template approval, unlike the WhatsApp Business Platform. Swapping in WhatsApp
// later means adding a sender here, not touching any call site.
export interface AlertSender {
  send(text: string): Promise<{ id?: string }>;
}

let cached: AlertSender | null = null;

export function getAlertSender(): AlertSender {
  if (cached) return cached;
  const provider = (process.env.ALERT_PROVIDER ?? "console").toLowerCase();
  cached =
    provider === "telegram" ? new TelegramAlertSender() : new ConsoleAlertSender();
  return cached;
}
