import "server-only";
import type { AlertSender } from "./index";

// Dev sender: prints the alert to the server console instead of pinging the
// owner's real phone on every local test.
export class ConsoleAlertSender implements AlertSender {
  async send(text: string): Promise<{ id?: string }> {
    console.log(`\n🔔 [ADMIN ALERT]\n${text}\n`);
    return { id: `console-${Date.now()}` };
  }
}
