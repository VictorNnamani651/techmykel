import "server-only";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { getAlertSender } from "@/lib/alerts";

interface NotificationInput {
  userId: string;
  type: string;
  entityType?: string | null;
  entityId?: string | null;
  message: string;
}

// Same resolution order as app/layout.tsx, so alert deep-links point at the
// deployed site rather than localhost in production.
function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  );
}

// Deep-link straight to the screen where the admin acts on this, so the alert is
// one tap from done. Redemptions have no per-id admin route, only the list.
function adminLink(entityType?: string | null, entityId?: string | null): string | null {
  if (entityType === "referral" && entityId) {
    return `${siteUrl()}/admin/referrals/${entityId}`;
  }
  if (entityType === "redemption") return `${siteUrl()}/admin/redemptions`;
  return null;
}

export async function notify(n: NotificationInput): Promise<void> {
  // Best-effort: a notification is non-critical, so a transient write failure
  // must never fail the primary action (verify, redeem, fulfil, etc.) that
  // already committed. The audit log remains the strict source of truth.
  try {
    await db.insert(notifications).values({
      userId: n.userId,
      type: n.type,
      entityType: n.entityType ?? null,
      entityId: n.entityId ?? null,
      message: n.message,
    });
  } catch (err) {
    console.error("notify() failed (non-fatal):", err);
  }

  // Push admin-bound notifications out of the app to the owner's phone. Routing
  // on the `admin.` type prefix keeps this a single seam: new admin.* types are
  // alerted automatically, and no call site needs to know a channel exists.
  //
  // TELEGRAM_CHAT_ID is one owner inbox, which is 1:1 with the single
  // admin V1 allows. Staff accounts (deferred, see docs/ROADMAP.md) would need a
  // per-user chat ID instead, or every admin row would ping the same chat.
  if (n.type.startsWith("admin.")) {
    try {
      const link = adminLink(n.entityType, n.entityId);
      await getAlertSender().send(link ? `${n.message}\n\n${link}` : n.message);
    } catch (err) {
      // Never fail the action for an undelivered alert — the in-app
      // notification above is already recorded and is the durable record.
      console.error("admin alert failed (non-fatal):", err);
    }
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return row?.count ?? 0;
}

export async function markAllRead(userId: string): Promise<void> {
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
}
