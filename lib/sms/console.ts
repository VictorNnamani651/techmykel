import "server-only";
import type { SmsSender } from "./index";

// Dev sender: prints the message (incl. OTP codes) to the server console.
export class ConsoleSmsSender implements SmsSender {
  async send(to: string, body: string): Promise<{ id?: string }> {
    console.log(`\n📲 [SMS → ${to}]\n${body}\n`);
    return { id: `console-${Date.now()}` };
  }
}
