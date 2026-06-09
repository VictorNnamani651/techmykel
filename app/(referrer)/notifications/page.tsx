import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/dal";
import { markNotificationsRead } from "@/app/actions/notifications";
import { Card, EmptyState, cn } from "@/components/ui";
import { Icon } from "@/components/icon";
import { timeAgo } from "@/lib/format";

export const metadata = { title: "Alerts — Techmykel" };

function iconFor(type: string): string {
  if (type.includes("redemption")) return "redeem";
  if (type.includes("success")) return "check_circle";
  if (type.includes("verified")) return "verified";
  if (type.includes("reject") || type.includes("fail")) return "info";
  return "campaign";
}

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const list = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(100);

  const hasUnread = list.some((n) => !n.readAt);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alerts</h1>
        {hasUnread && (
          <form action={markNotificationsRead}>
            <button className="text-sm font-medium text-brand transition hover:underline">
              Mark all read
            </button>
          </form>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState icon="notifications" title="No alerts yet">
          Updates about your referrals and rewards will appear here.
        </EmptyState>
      ) : (
        <Card className="divide-y divide-slate-100">
          {list.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-4",
                !n.readAt && "bg-brand/5",
              )}
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon name={iconFor(n.type)} className="text-[20px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800">{n.message}</p>
                <p className="mt-0.5 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.readAt && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
