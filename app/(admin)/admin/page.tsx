import Link from "next/link";
import { getAdminOverview } from "@/lib/queries";
import { fulfilRedemption } from "@/app/actions/admin";
import { Avatar, Card, EmptyState, StatCard, naira } from "@/components/ui";
import { Icon } from "@/components/icon";
import { timeAgo } from "@/lib/format";

export const metadata = { title: "Dashboard — Techmykel Admin" };

export default async function AdminDashboardPage() {
  const { counts, verifyQueue, fulfilQueue, openRedemptions, totalPaid } =
    await getAdminOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Today</h1>
        <p className="mt-1 text-sm text-slate-500">Action queue and overview.</p>
      </div>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Unverified" value={counts.unverified} icon="pending_actions" accent="slate" />
        <StatCard label="Pending" value={counts.pending} icon="hourglass_empty" accent="warning" />
        <StatCard label="Successful" value={counts.successful} icon="check_circle" accent="success" />
        <StatCard label="Open redemptions" value={openRedemptions} icon="redeem" accent="brand" />
        <StatCard label="Total paid" value={naira(totalPaid)} icon="payments" accent="info" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Referrals to verify */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              Referrals to verify
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-brand">
                {counts.unverified}
              </span>
            </h2>
            <Link href="/admin/referrals?status=unverified" className="text-sm font-medium text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {verifyQueue.length === 0 ? (
              <div className="p-6">
                <EmptyState icon="task_alt" title="Nothing to verify" />
              </div>
            ) : (
              verifyQueue.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={r.referredName} className="h-10 w-10" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{r.referredName}</p>
                      <p className="truncate text-xs text-slate-500">
                        Ref by {r.referrerName} · {timeAgo(r.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/referrals/${r.id}`}
                    className="rounded-lg border border-brand px-3 py-1.5 text-[13px] font-medium text-brand transition hover:bg-brand hover:text-white"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Redemptions to fulfil */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              Redemptions to fulfil
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                {openRedemptions}
              </span>
            </h2>
            <Link href="/admin/redemptions?status=requested" className="text-sm font-medium text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3 p-3">
            {fulfilQueue.length === 0 ? (
              <div className="p-3">
                <EmptyState icon="redeem" title="No redemptions waiting" />
              </div>
            ) : (
              fulfilQueue.map((r) => (
                <div key={r.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{r.referrerName}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs capitalize text-slate-500">
                        <Icon name="sell" className="text-[14px]" />
                        {r.rewardType} · for {r.referredName} · {timeAgo(r.requestedAt)}
                      </p>
                    </div>
                    <span className="font-semibold text-slate-900">{naira(r.amount)}</span>
                  </div>
                  <form action={fulfilRedemption}>
                    <input type="hidden" name="redemptionId" value={r.id} />
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2 text-sm font-medium text-white transition hover:bg-brand-dark">
                      Mark fulfilled
                      <Icon name="arrow_forward" className="text-[18px]" />
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
