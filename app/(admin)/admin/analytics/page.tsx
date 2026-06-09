import { getAnalytics } from "@/lib/queries";
import { Card, StatCard, cn, naira } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata = { title: "Analytics — Techmykel Admin" };

const STATUS_BAR: Record<string, string> = {
  unverified: "bg-slate-400",
  pending: "bg-amber-400",
  successful: "bg-emerald-500",
  failed: "bg-slate-300",
  rejected: "bg-red-400",
};

const TYPE_META: Record<string, { icon: string; label: string }> = {
  cash: { icon: "account_balance_wallet", label: "Cash" },
  airtime: { icon: "smartphone", label: "Airtime" },
  data: { icon: "wifi", label: "Data" },
};

export default async function AdminAnalyticsPage() {
  const a = await getAnalytics();

  const maxStatus = Math.max(1, ...Object.values(a.byStatus));
  const maxDay = Math.max(1, ...a.overTime.map((d) => d.count));
  const fulfilledCount = a.byType.cash.count + a.byType.airtime.count + a.byType.data.count;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Promotion performance at a glance.</p>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total referrals" value={a.total} icon="group" accent="brand" />
        <StatCard label="Conversion rate" value={`${a.conversionRate}%`} icon="trending_up" accent="success" />
        <StatCard label="Reward cost" value={naira(a.rewardCost)} icon="payments" accent="warning" />
        <StatCard label="Total paid out" value={naira(a.totalPaid)} icon="check_circle" accent="info" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Referrals by status */}
        <Card className="p-5">
          <h2 className="mb-4 font-semibold text-slate-900">Referrals by status</h2>
          <div className="space-y-3">
            {(Object.keys(a.byStatus) as Array<keyof typeof a.byStatus>).map((s) => (
              <div key={s}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="capitalize text-slate-600">{s}</span>
                  <span className="font-semibold text-slate-900">{a.byStatus[s]}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full", STATUS_BAR[s])}
                    style={{ width: `${(a.byStatus[s] / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Referrals over time */}
        <Card className="p-5">
          <h2 className="mb-4 font-semibold text-slate-900">Referrals this week</h2>
          <div className="flex h-40 items-end justify-between gap-2">
            {a.overTime.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-brand/80"
                    style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }}
                    title={`${d.count}`}
                  />
                </div>
                <span className="text-xs text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Redemptions by type */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Redemptions by type</h2>
          <span className="text-sm text-slate-400">{fulfilledCount} fulfilled</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(Object.keys(a.byType) as Array<keyof typeof a.byType>).map((t) => {
            const data = a.byType[t];
            const pct = fulfilledCount ? Math.round((data.count / fulfilledCount) * 100) : 0;
            return (
              <div key={t} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon name={TYPE_META[t].icon} className="text-[18px]" />
                  </span>
                  <span className="font-medium text-slate-700">{TYPE_META[t].label}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{pct}%</p>
                <p className="text-xs text-slate-500">{naira(data.sum)} total</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Referrers */}
      <Card className="flex items-center justify-between p-5">
        <div>
          <h2 className="font-semibold text-slate-900">Referrers</h2>
          <p className="mt-1 text-sm text-slate-500">
            {a.convertedReferrers} of {a.totalReferrers} started as referred customers
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-brand">{a.totalReferrers}</p>
          <p className="text-xs text-slate-400">total referrers</p>
        </div>
      </Card>
    </div>
  );
}
