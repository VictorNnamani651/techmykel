import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { getReferralForReferrer, getTimeline } from "@/lib/queries";
import { BackHeader } from "@/components/back-header";
import { Timeline } from "@/components/timeline";
import { Badge, Card, naira } from "@/components/ui";
import { Icon } from "@/components/icon";
import { formatDate } from "@/lib/format";
import { formatNgPhone as fmtPhone } from "@/lib/phone";

export const metadata = { title: "Referral details — Techmykel" };

export default async function ReferralDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const data = await getReferralForReferrer(id, user.id);
  if (!data) notFound();
  const { referral, redemptions, active } = data;

  const timeline = await getTimeline([referral.id, ...redemptions.map((r) => r.id)]);
  const canRedeem = referral.status === "successful" && !active;

  return (
    <div className="space-y-5 pb-4">
      <BackHeader title="Referral Details" href="/referrals" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{referral.referredName}</h2>
          <div className="mt-2">
            <Badge status={referral.status} />
          </div>
        </div>
        {referral.rewardAmount != null && (
          <div className="text-right">
            <p className="text-xs text-slate-500">
              {referral.status === "successful" ? "Reward" : "Potential reward"}
            </p>
            <p className="text-xl font-bold text-brand">{naira(referral.rewardAmount)}</p>
          </div>
        )}
      </div>

      <Card className="p-5">
        <h3 className="border-b border-slate-100 pb-3 text-base font-semibold text-slate-900">
          Customer Details
        </h3>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-xs text-slate-500">Phone Number</dt>
            <dd className="text-slate-900">{fmtPhone(referral.referredPhone)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Date Created</dt>
            <dd className="text-slate-900">{formatDate(referral.createdAt)}</dd>
          </div>
          {referral.note && (
            <div>
              <dt className="text-xs text-slate-500">Note</dt>
              <dd className="mt-1 rounded-lg bg-brand/5 p-3 text-sm text-slate-700">
                {referral.note}
              </dd>
            </div>
          )}
        </dl>
      </Card>

      {active && (
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Icon name="redeem" className="text-[20px] text-brand" />
            <span className="capitalize">Redemption — {active.rewardType}</span>
          </div>
          <Badge status={active.status} />
        </Card>
      )}

      <Card className="p-5">
        <h3 className="mb-4 text-base font-semibold text-slate-900">Status History</h3>
        <Timeline entries={timeline} />
      </Card>

      {canRedeem && (
        <Link
          href={`/referrals/${referral.id}/redeem`}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-[0.98]"
        >
          <Icon name="redeem" className="text-[20px]" />
          Redeem reward
        </Link>
      )}
    </div>
  );
}
