import Link from "next/link";
import { notFound } from "next/navigation";
import { getReferrerForAdmin } from "@/lib/queries";
import { BackHeader } from "@/components/back-header";
import { Avatar, Badge, Card, EmptyState, StatCard, naira } from "@/components/ui";
import { Icon } from "@/components/icon";
import { formatDate } from "@/lib/format";
import { formatNgPhone } from "@/lib/phone";
import { ResetPasswordButton } from "../reset-password";

export const metadata = { title: "Referrer — Techmykel Admin" };

export default async function AdminReferrerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getReferrerForAdmin(id);
  if (!data) notFound();
  const { referrer, stats, convertedFrom, referrals, redemptions } = data;

  return (
    <div className="space-y-6">
      <BackHeader title="Referrer Details" href="/admin/referrers" />

      {/* Profile */}
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={referrer.fullName} className="h-12 w-12 text-base" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{referrer.fullName}</h2>
                {referrer.converted && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                    Converted
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">{formatNgPhone(referrer.phone)}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Joined {formatDate(referrer.createdAt)}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <ResetPasswordButton userId={referrer.id} />
          </div>
        </div>

        {convertedFrom && (
          <Link
            href={`/admin/referrals/${convertedFrom.id}`}
            className="mt-4 flex items-center gap-2 rounded-lg bg-brand/5 px-3 py-2.5 text-sm text-brand transition hover:bg-brand/10"
          >
            <Icon name="sync" className="text-[18px]" />
            Converted from referral — {convertedFrom.referredName}
            <Icon name="chevron_right" className="ml-auto text-[18px]" />
          </Link>
        )}
      </Card>

      {/* Lifetime stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Referrals" value={stats.total} icon="group" />
        <StatCard label="Successful" value={stats.successful} icon="task_alt" accent="success" />
        <StatCard label="Reward earned" value={naira(stats.earned)} icon="sell" accent="brand" />
        <StatCard label="Paid out" value={naira(stats.paidOut)} icon="payments" accent="info" />
      </div>

      {/* Their referrals */}
      <section>
        <h3 className="mb-3 font-semibold text-slate-900">Referrals</h3>
        {referrals.length === 0 ? (
          <EmptyState icon="group" title="No referrals yet" />
        ) : (
          <Card className="divide-y divide-slate-100">
            {referrals.map((r) => (
              <Link
                key={r.id}
                href={`/admin/referrals/${r.id}`}
                className="flex items-center justify-between gap-3 p-4 transition hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{r.referredName}</p>
                  <p className="truncate text-xs text-slate-500">
                    {formatNgPhone(r.referredPhone)} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm text-slate-700">{naira(r.rewardAmount)}</span>
                  <Badge status={r.status} />
                </div>
              </Link>
            ))}
          </Card>
        )}
      </section>

      {/* Their redemptions */}
      <section>
        <h3 className="mb-3 font-semibold text-slate-900">Redemptions</h3>
        {redemptions.length === 0 ? (
          <EmptyState icon="redeem" title="No redemptions yet" />
        ) : (
          <Card className="divide-y divide-slate-100">
            {redemptions.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium capitalize text-slate-900">
                    {r.rewardType} · {naira(r.amount)}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {r.referredName} · {formatDate(r.requestedAt)}
                  </p>
                </div>
                <Badge status={r.status} />
              </div>
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}
