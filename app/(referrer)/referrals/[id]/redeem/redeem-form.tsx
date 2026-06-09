"use client";

import { useActionState, useState } from "react";
import { redeemReferral, type RedeemState } from "@/app/actions/redemptions";
import { Alert, Button, cn } from "@/components/ui";
import { Icon } from "@/components/icon";

const OPTIONS = [
  {
    value: "cash",
    icon: "account_balance_wallet",
    title: "Cash",
    desc: "Paid to you directly by the shop.",
  },
  {
    value: "airtime",
    icon: "smartphone",
    title: "Airtime",
    desc: "Top-up sent to your registered number.",
  },
  {
    value: "data",
    icon: "wifi",
    title: "Data Bundle",
    desc: "Data sent to your registered number.",
  },
];

export function RedeemForm({ referralId }: { referralId: string }) {
  const [state, action, pending] = useActionState<RedeemState, FormData>(
    redeemReferral,
    undefined,
  );
  const [sel, setSel] = useState("cash");

  return (
    <form action={action} className="space-y-4">
      {state?.error && <Alert variant="error">{state.error}</Alert>}
      <input type="hidden" name="referralId" value={referralId} />

      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <label
            key={o.value}
            className={cn(
              "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition",
              sel === o.value
                ? "border-brand bg-brand/5"
                : "border-slate-200 bg-white hover:bg-slate-50",
            )}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon name={o.icon} className="text-[24px]" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-slate-900">{o.title}</span>
              <span className="block text-sm text-slate-500">{o.desc}</span>
            </span>
            <input
              type="radio"
              name="rewardType"
              value={o.value}
              checked={sel === o.value}
              onChange={() => setSel(o.value)}
              className="h-5 w-5 accent-brand"
            />
          </label>
        ))}
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          "Submitting…"
        ) : (
          <>
            Confirm redemption <Icon name="arrow_forward" className="text-[18px]" />
          </>
        )}
      </Button>
    </form>
  );
}
