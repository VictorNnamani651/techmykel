import "server-only";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";

interface NotificationInput {
  userId: string;
  type: string;
  entityType?: string | null;
  entityId?: string | null;
  message: string;
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
