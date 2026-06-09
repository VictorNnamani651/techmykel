"use client";

import { useActionState } from "react";
import {
  editRewardAmount,
  markFailed,
  markSuccessful,
  rejectReferral,
  verifyReferral,
  type AdminState,
} from "@/app/actions/admin";
import { Alert, Button, FieldError, Input, Label, naira } from "@/components/ui";
import { Icon } from "@/components/icon";
import type { ReferralStatus } from "@/lib/db/schema";

const REJECT_REASONS = [
  "Suspected fake referral",
  "Duplicate claim",
  "Customer was not referred by this referrer",
  "Other",
];

const selectCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function AdminReferralActions({
  referralId,
  status,
  rewardAmount,
  reason,
}: {
  referralId: string;
  status: ReferralStatus;
  rewardAmount: number | null;
  reason: string | null;
}) {
  if (status === "unverified")
    return <VerifyPanel referralId={referralId} />;
  if (status === "pending")
    return <PendingPanel referralId={referralId} rewardAmount={rewardAmount} />;
  return <ReadOnlyPanel status={status} rewardAmount={rewardAmount} reason={reason} />;
}

function PanelShell({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-brand/5 px-5 py-4">
        <Icon name={icon} className="text-[22px] text-brand" />
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-4 p-5">
        {description && <p className="text-sm text-slate-500">{description}</p>}
        {children}
      </div>
    </div>
  );
}

function VerifyPanel({ referralId }: { referralId: string }) {
  const [vState, verify, vPending] = useActionState<AdminState, FormData>(
    verifyReferral,
    undefined,
  );
  const [rState, reject, rPending] = useActionState<AdminState, FormData>(
    rejectReferral,
    undefined,
  );

  return (
    <PanelShell
      icon="verified"
      title="Verification Action"
      description="Review the service records. If the repair is complete and paid, verify this referral and set the reward. If it isn't genuine, reject it."
    >
      <div className="rounded-lg border border-slate-200 p-4">
        <p className="mb-3 font-semibold text-slate-800">Approve &amp; reward</p>
        <form action={verify} className="space-y-3">
          <input type="hidden" name="referralId" value={referralId} />
          {vState?.error && <Alert variant="error">{vState.error}</Alert>}
          <div>
            <Label htmlFor="rewardAmount">Reward amount (₦)</Label>
            <Input
              id="rewardAmount"
              name="rewardAmount"
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="1000"
              required
            />
            <FieldError messages={vState?.fieldErrors?.rewardAmount} />
          </div>
          <Button type="submit" disabled={vPending} className="w-full">
            {vPending ? "Verifying…" : "Verify & set reward"}
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> OR{" "}
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form action={reject} className="space-y-3">
        <input type="hidden" name="referralId" value={referralId} />
        {rState?.error && <Alert variant="error">{rState.error}</Alert>}
        <div>
          <Label htmlFor="reason">Rejection reason</Label>
          <select id="reason" name="reason" defaultValue="" className={selectCls}>
            <option value="" disabled>
              Select a reason…
            </option>
            {REJECT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <FieldError messages={rState?.fieldErrors?.reason} />
        </div>
        <button
          type="submit"
          disabled={rPending}
          className="w-full rounded-lg border border-danger py-2.5 text-sm font-medium text-danger transition hover:bg-danger hover:text-white disabled:opacity-50"
        >
          {rPending ? "Rejecting…" : "Reject referral"}
        </button>
      </form>
    </PanelShell>
  );
}

function PendingPanel({
  referralId,
  rewardAmount,
}: {
  referralId: string;
  rewardAmount: number | null;
}) {
  const [eState, edit, ePending] = useActionState<AdminState, FormData>(
    editRewardAmount,
    undefined,
  );
  const [fState, fail, fPending] = useActionState<AdminState, FormData>(
    markFailed,
    undefined,
  );

  return (
    <PanelShell
      icon="manage_history"
      title="Manage referral"
      description="The repair is underway. Mark it successful once completed and paid, or failed if it fell through. You can still adjust the reward while pending."
    >
      <form action={edit} className="space-y-3 rounded-lg border border-slate-200 p-4">
        <input type="hidden" name="referralId" value={referralId} />
        {eState?.ok && <Alert variant="success">{eState.ok}</Alert>}
        {eState?.error && <Alert variant="error">{eState.error}</Alert>}
        <Label htmlFor="rewardAmount">Reward amount (₦)</Label>
        <div className="flex gap-2">
          <Input
            id="rewardAmount"
            name="rewardAmount"
            type="number"
            min={1}
            defaultValue={rewardAmount ?? undefined}
            className="flex-1"
          />
          <Button type="submit" variant="secondary" disabled={ePending}>
            {ePending ? "Saving…" : "Save"}
          </Button>
        </div>
        <FieldError messages={eState?.fieldErrors?.rewardAmount} />
      </form>

      <form action={markSuccessful}>
        <input type="hidden" name="referralId" value={referralId} />
        <Button type="submit" className="w-full">
          <Icon name="check_circle" className="text-[18px]" />
          Mark successful
        </Button>
      </form>

      <form action={fail} className="space-y-3 border-t border-slate-100 pt-4">
        <input type="hidden" name="referralId" value={referralId} />
        {fState?.error && <Alert variant="error">{fState.error}</Alert>}
        <Label htmlFor="failReason">Mark failed — reason</Label>
        <Input
          id="failReason"
          name="reason"
          placeholder="e.g. customer didn't complete the repair"
        />
        <FieldError messages={fState?.fieldErrors?.reason} />
        <button
          type="submit"
          disabled={fPending}
          className="w-full rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          {fPending ? "Saving…" : "Mark failed"}
        </button>
      </form>
    </PanelShell>
  );
}

function ReadOnlyPanel({
  status,
  rewardAmount,
  reason,
}: {
  status: ReferralStatus;
  rewardAmount: number | null;
  reason: string | null;
}) {
  return (
    <PanelShell icon="lock" title="Outcome">
      <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
        <span className="text-sm text-slate-500">
          {status === "successful"
            ? "Reward (locked)"
            : status === "failed"
              ? "Referral failed"
              : "Referral rejected"}
        </span>
        <span className="font-semibold text-slate-900">
          {status === "successful" ? naira(rewardAmount) : "—"}
        </span>
      </div>
      {reason && (
        <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          <span className="font-medium">Reason:</span> {reason}
        </p>
      )}
    </PanelShell>
  );
}
