"use client";

import { useActionState, useState } from "react";
import { redeemReferral, type RedeemState } from "@/app/actions/redemptions";
import { Alert, Button, cn } from "@/components/ui";
import { Icon } from "@/components/icon";
import { SelectField, TextField } from "@/components/fields";
import { NIGERIAN_BANKS } from "@/lib/banks";

const OPTIONS = [
  {
    value: "cash",
    icon: "account_balance_wallet",
    title: "Cash",
    desc: "Transferred to your bank account.",
  },
  {
    value: "airtime",
    icon: "smartphone",
    title: "Airtime",
    desc: "Top-up sent to any number you choose.",
  },
  {
    value: "data",
    icon: "wifi",
    title: "Data Bundle",
    desc: "Data sent to any number you choose.",
  },
];

export type RedeemDefaults = {
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
};

export function RedeemForm({
  referralId,
  defaults,
  registeredPhone,
}: {
  referralId: string;
  defaults: RedeemDefaults;
  registeredPhone: string;
}) {
  const [state, action, pending] = useActionState<RedeemState, FormData>(
    redeemReferral,
    undefined,
  );
  const [sel, setSel] = useState("cash");
  const errs = state?.fieldErrors;

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

      {/* Reward Destination (ADR-0011). Which fields apply depends on the reward
          type, so only the relevant set is rendered — an unmounted input submits
          nothing, which is exactly what the discriminated union expects. */}
      {sel === "cash" ? (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Where should we send your cash?
          </p>
          <SelectField
            name="destinationBankName"
            label="Bank"
            icon="account_balance_wallet"
            placeholder="Choose your bank"
            options={NIGERIAN_BANKS}
            defaultValue={defaults.bankName ?? ""}
            error={errs?.destinationBankName}
          />
          <TextField
            name="destinationAccountNumber"
            label="Account number"
            inputMode="numeric"
            maxLength={10}
            placeholder="0123456789"
            defaultValue={defaults.accountNumber ?? ""}
            error={errs?.destinationAccountNumber}
          />
          <TextField
            name="destinationAccountName"
            label="Account name"
            placeholder="Exactly as your bank has it"
            defaultValue={defaults.accountName ?? ""}
            error={errs?.destinationAccountName}
          />
          <p className="text-xs text-slate-500">
            Double-check the account number — we can&apos;t reverse a transfer
            sent to the wrong account.
          </p>
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Which number should we send it to?
          </p>
          <TextField
            name="destinationPhone"
            label="Phone number"
            icon="call"
            inputMode="tel"
            defaultValue={registeredPhone}
            error={errs?.destinationPhone}
          />
          <p className="text-xs text-slate-500">
            This is your registered number. Change it to send to someone else.
          </p>
        </div>
      )}

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
