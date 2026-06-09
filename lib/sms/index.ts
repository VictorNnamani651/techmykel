import "server-only";
import { ConsoleSmsSender } from "./console";
import { TwilioSmsSender } from "./twilio";

export interface SmsSender {
  send(to: string, body: string): Promise<{ id?: string }>;
}

let cached: SmsSender | null = null;

// Pluggable per ADR-0001. SMS_PROVIDER=twilio in prod once confirmed; console in dev.
export function getSmsSender(): SmsSender {
  if (cached) return cached;
  const provider = (process.env.SMS_PROVIDER ?? "console").toLowerCase();
  cached = provider === "twilio" ? new TwilioSmsSender() : new ConsoleSmsSender();
  return cached;
}
