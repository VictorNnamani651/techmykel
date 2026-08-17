import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { getReferralForReferrer } from "@/lib/queries";
import { BackHeader } from "@/components/back-header";
import { naira } from "@/components/ui";
import { formatNgPhone } from "@/lib/phone";
import { RedeemForm } from "./redeem-form";

export const metadata = { title: "Redeem reward — Techmykel" };

export default async function RedeemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const data = await getReferralForReferrer(id, user.id);
  if (!data) notFound();
  if (data.referral.status !== "successful" || data.active) {
    redirect(`/referrals/${id}`);
  }

  return (
    <div className="space-y-5">
      <BackHeader title="Redeem reward" href={`/referrals/${id}`} />
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Choose how to get your {naira(data.referral.rewardAmount)}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          The amount is the same — pick how you&apos;d like it delivered.
        </p>
      </div>
      <RedeemForm
        referralId={id}
        defaults={{
          bankName: user.destinationBankName,
          accountNumber: user.destinationAccountNumber,
          accountName: user.destinationAccountName,
        }}
        registeredPhone={formatNgPhone(user.phone)}
      />
    </div>
  );
}
