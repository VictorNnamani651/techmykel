import { BackHeader } from "@/components/back-header";
import { Card } from "@/components/ui";
import { Icon } from "@/components/icon";
import { NewReferralForm } from "./new-referral-form";

export const metadata = { title: "Refer a customer — Techmykel" };

export default function NewReferralPage() {
  return (
    <div className="space-y-5">
      <BackHeader title="Refer a customer" href="/referrals" />

      <div className="flex items-start gap-3 rounded-xl border border-brand/20 bg-brand/5 p-4">
        <Icon name="info" className="text-[22px] text-brand" />
        <p className="text-sm text-slate-600">
          Tell us who you&apos;ve sent to the shop. The owner will confirm when they
          arrive.
        </p>
      </div>

      <Card className="p-5">
        <NewReferralForm />
      </Card>
    </div>
  );
}
