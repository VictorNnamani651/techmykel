import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { getReferrerOverview, listRedemptionsForReferrer } from "@/lib/queries";
import { cancelRedemption } from "@/app/actions/redemptions";
import { GuidanceBanner } from "@/components/guidance-banner";
import { Avatar, Badge, Card, EmptyState, naira } from "@/components/ui";
import { Icon } from "@/components/icon";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Redeem — Techmykel" };

const TYPE_ICON: Record<string, string> = {
  cash: "account_balance_wallet",
  airtime: "smartphone",
  data: "wifi",
};

export default async function RedemptionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { ready } = await getReferrerOverview(user.id);
  const reds = await listRedemptionsForReferrer(user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Redeem</h1>

      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-900">Ready to redeem</h2>
        {ready.length === 0 ? (
          <EmptyState icon="redeem" title="Nothing to redeem right now">
            Rewards from successful referrals appear here.
          </EmptyState>
        ) : (
          <Card className="divide-y divide-slate-100">
            {ready.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={r.referredName} />
                  <p className="truncate font-medium text-slate-900">{r.referredName}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-semibold text-slate-900">{naira(r.rewardAmount)}</span>
                  <Link
                    href={`/referrals/${r.id}/redeem`}
                    className="rounded-lg border border-brand px-3 py-1.5 text-[13px] font-medium text-brand transition hover:bg-brand hover:text-white"
                  >
                    Redeem
                  </Link>
                </div>
              </div>
            ))}
          </Card>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-900">Redemption history</h2>
        {reds.length === 0 ? (
          <EmptyState icon="history" title="No redemptions yet" />
        ) : (
          <div className="space-y-3">
            {reds.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon name={TYPE_ICON[r.rewardType]} className="text-[20px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium capitalize text-slate-900">
                        {r.rewardType} · {naira(r.amount)}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {r.referredName} · {formatDate(r.requestedAt)}
                      </p>
                    </div>
                  </div>
                  <Badge status={r.status} />
                </div>

                <div className="mt-3">
                  <GuidanceBanner kind="redemption" status={r.status} />
                </div>

                {r.status === "declined" && r.declineReason && (
                  <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-sm text-red-700">
                    Reason: {r.declineReason}
                  </p>
                )}

                {r.status === "requested" && (
                  <form action={cancelRedemption} className="mt-3 flex justify-end">
                    <input type="hidden" name="redemptionId" value={r.id} />
                    <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50">
                      Cancel
                    </button>
                  </form>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
