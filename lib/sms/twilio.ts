import "server-only";
import type { SmsSender } from "./index";

// Raw fetch (no SDK). Same call shape proven to deliver to NG in the smoke test.
export class TwilioSmsSender implements SmsSender {
  async send(to: string, body: string): Promise<{ id?: string }> {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;
    if (!sid || !token || !from) {
      throw new Error("Twilio env vars missing (TWILIO_ACCOUNT_SID/AUTH_TOKEN/PHONE_NUMBER).");
    }

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: body }),
      },
    );

    const json = (await res.json()) as { sid?: string; message?: string; code?: number };
    if (!res.ok) {
      throw new Error(`Twilio send failed (${res.status}, code ${json.code}): ${json.message}`);
    }
    return { id: json.sid };
  }
}
