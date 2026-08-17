import "server-only";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications, users } from "@/lib/db/schema";
import { getAlertSender } from "@/lib/alerts";
import { getSiteUrl as siteUrl } from "@/lib/site-url";

interface NotificationInput {
  userId: string;
  type: string;
  entityType?: string | null;
  entityId?: string | null;
  message: string;
}

type AdminNotificationInput = Omit<NotificationInput, "userId"> & {
  // Optional richer body for the out-of-app alert. The in-app notification
  // list renders `message` as a single line, so multi-line detail belongs
  // here and never in `message`. Omit the link - notifyAdmins() appends it.
  alertText?: string;
};

// Deep-link straight to the screen where the admin acts on this, so the alert is
// one tap from done. Redemptions have no per-id admin route, only the list.
function adminLink(entityType?: string | null, entityId?: string | null): string | null {
  if (entityType === "referral" && entityId) {
    return `${siteUrl()}/admin/referrals/${entityId}`;
  }
  if (entityType === "redemption") return `${siteUrl()}/admin/redemptions`;
  if (entityType === "referrer" && entityId) {
    return `${siteUrl()}/admin/referrers/${entityId}`;
  }
  return null;
}

// Records one in-app notification. Pure DB write — the out-of-app alert is the
// job of notifyAdmins(), because alerts are per *event* while notification rows
// are per *recipient*.
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
}

// Tells the shop owner something happened: an in-app notification row for every
// admin, plus exactly ONE out-of-app alert.
//
// The one-alert rule is the point of this helper. TELEGRAM_CHAT_ID is a single
// owner inbox, so dispatching per admin row would deliver the same message
// twice the moment a second admin exists — which it now does. Notification rows
// stay per-recipient (each admin has their own read state); the alert does not.
export async function notifyAdmins(a: AdminNotificationInput): Promise<void> {
  const admins = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "admin"));

  // alertText is alert-only and must never reach the notifications table.
  const { alertText, ...row } = a;
  await Promise.all(admins.map((admin) => notify({ userId: admin.id, ...row })));

  try {
    const link = adminLink(a.entityType, a.entityId);
    const body = alertText ?? a.message;
    await getAlertSender().send(
      link ? `${body}\n\nTap to see all the details:\n${link}` : body,
    );
  } catch (err) {
    // Never fail the action for an undelivered alert — the in-app notifications
    // above are already recorded and are the durable record.
    console.error("admin alert failed (non-fatal):", err);
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
