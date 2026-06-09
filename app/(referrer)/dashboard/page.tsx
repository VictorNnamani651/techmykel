import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { getReferrerOverview } from "@/lib/queries";
import { Avatar, Card, EmptyState, StatCard, naira } from "@/components/ui";
import { Icon } from "@/components/icon";

export const metadata = { title: "Home — Techmykel" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { counts, ready, readyTotal } = await getReferrerOverview(user.id);
  const firstName = user.fullName.split(" ")[0];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hi, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here is an overview of your referrals today.
          </p>
        </div>
        <Link
          href="/referrals/new"
          className="hidden items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark md:inline-flex"
        >
          <Icon name="add" className="text-[18px]" />
          New referral
        </Link>
      </div>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Awaiting review" value={counts.unverified} icon="pending_actions" accent="slate" />
        <StatCard label="In progress" value={counts.pending} icon="sync" accent="warning" />
        <StatCard label="Successful" value={counts.successful} icon="check_circle" accent="success" />
        <div className="col-span-2 flex flex-col justify-between overflow-hidden rounded-xl bg-brand p-4 text-white shadow-md md:col-span-1">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-xs font-medium text-white/70">Rewards ready to redeem</span>
            <Icon name="redeem" className="text-[20px] text-white/80" />
          </div>
          <span className="text-2xl font-bold">{naira(readyTotal)}</span>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-900">Rewards ready</h2>
        {ready.length === 0 ? (
          <EmptyState icon="redeem" title="No rewards ready yet">
            Successful referrals that you can redeem will show up here.
          </EmptyState>
        ) : (
          <Card className="divide-y divide-slate-100">
            {ready.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={r.referredName} />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{r.referredName}</p>
                    {r.note && (
                      <p className="truncate text-xs text-slate-500">{r.note}</p>
                    )}
                  </div>
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

      {/* Mobile FAB */}
      <Link
        href="/referrals/new"
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-dark active:scale-95 md:hidden"
      >
        <Icon name="add" className="text-[20px]" />
        New referral
      </Link>
    </div>
  );
}
