"use client";

import { useActionState, useState } from "react";
import {
  declineRedemption,
  fulfilRedemption,
  type AdminState,
} from "@/app/actions/admin";
import { Alert, FieldError, Input } from "@/components/ui";
import { Icon } from "@/components/icon";

export function RedemptionActions({ redemptionId }: { redemptionId: string }) {
  const [open, setOpen] = useState(false);
  const [dState, decline, dPending] = useActionState<AdminState, FormData>(
    declineRedemption,
    undefined,
  );

  if (open) {
    return (
      <form action={decline} className="space-y-2">
        <input type="hidden" name="redemptionId" value={redemptionId} />
        {dState?.error && <Alert variant="error">{dState.error}</Alert>}
        <Input name="reason" placeholder="Reason for declining" />
        <FieldError messages={dState?.fieldErrors?.reason} />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={dPending}
            className="flex-1 rounded-lg bg-danger py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            {dPending ? "Declining…" : "Confirm decline"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex gap-2">
      <form action={fulfilRedemption} className="flex-1">
        <input type="hidden" name="redemptionId" value={redemptionId} />
        <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-2 text-sm font-medium text-white transition hover:bg-brand-dark">
          <Icon name="check" className="text-[18px]" />
          Mark fulfilled
        </button>
      </form>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-danger px-3 py-2 text-sm font-medium text-danger transition hover:bg-danger hover:text-white"
      >
        Decline
      </button>
    </div>
  );
}
