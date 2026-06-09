import { notFound } from "next/navigation";
import { getReferralForAdmin, getTimeline } from "@/lib/queries";
import { BackHeader } from "@/components/back-header";
import { Timeline } from "@/components/timeline";
import { Avatar, Badge, Card, naira } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { formatNgPhone } from "@/lib/phone";
import { AdminReferralActions } from "./admin-referral-actions";

export const metadata = { title: "Referral — Techmykel Admin" };

export default async function AdminReferralDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getReferralForAdmin(id);
  if (!data) notFound();
  const { referral, redemptions } = data;
  const timeline = await getTimeline([referral.id, ...redemptions.map((r) => r.id)]);

  return (
    <div className="space-y-6">
      <BackHeader title="Referral Details" href="/admin/referrals" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Summary */}
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={referral.referredName} className="h-12 w-12 text-base" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{referral.referredName}</h2>
                  <p className="text-sm text-slate-500">Referred by {referral.referrerName}</p>
                </div>
              </div>
              <Badge status={referral.status} />
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <Field label="Customer phone" value={formatNgPhone(referral.referredPhone)} />
              <Field label="Referrer phone" value={formatNgPhone(referral.referrerPhone)} />
              <Field label="Date submitted" value={formatDate(referral.createdAt)} />
              <Field
                label="Reward"
                value={referral.rewardAmount != null ? naira(referral.rewardAmount) : "Not set"}
              />
              {referral.note && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-slate-500">Note</dt>
                  <dd className="mt-1 rounded-lg bg-brand/5 p-3 text-sm text-slate-700">
                    {referral.note}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Stateful action panel */}
          <AdminReferralActions
            referralId={referral.id}
            status={referral.status}
            rewardAmount={referral.rewardAmount}
            reason={referral.reason}
          />

          {/* Redemptions on this referral */}
          {redemptions.length > 0 && (
            <Card className="p-5">
              <h3 className="mb-3 font-semibold text-slate-900">Redemptions</h3>
              <div className="space-y-2">
                {redemptions.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm"
                  >
                    <span className="capitalize text-slate-700">{r.rewardType}</span>
                    <Badge status={r.status} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Timeline */}
        <Card className="h-fit p-5">
          <h3 className="mb-4 font-semibold text-slate-900">Status History</h3>
          <Timeline entries={timeline} />
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-slate-900">{value}</dd>
    </div>
  );
}
