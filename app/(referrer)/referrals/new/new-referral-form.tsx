"use client";

import { useActionState } from "react";
import { createReferral, type ReferralFormState } from "@/app/actions/referrals";
import { TextField } from "@/components/fields";
import { Alert, Button, FieldError, Label, Textarea } from "@/components/ui";
import { Icon } from "@/components/icon";

export function NewReferralForm() {
  const [state, action, pending] = useActionState<ReferralFormState, FormData>(
    createReferral,
    undefined,
  );

  return (
    <form action={action} className="space-y-5">
      {state?.error && <Alert variant="error">{state.error}</Alert>}

      <TextField
        name="referredName"
        label="Customer's name"
        placeholder="e.g. Jane Doe"
        autoComplete="off"
        required
        error={state?.fieldErrors?.referredName}
      />
      <TextField
        name="referredPhone"
        label="Customer's phone number"
        type="tel"
        inputMode="tel"
        icon="call"
        placeholder="0801 234 5678"
        autoComplete="off"
        required
        error={state?.fieldErrors?.referredPhone}
      />
      <div>
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          name="note"
          rows={3}
          placeholder="e.g. 'cracked iPhone screen'"
        />
        <FieldError messages={state?.fieldErrors?.note} />
      </div>

      <div className="flex items-start gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <Icon name="shield" className="text-[16px] text-slate-400" />
        <span>
          Each phone number can only be referred once. You can&apos;t refer your own
          number.
        </span>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          "Submitting…"
        ) : (
          <>
            Submit referral <Icon name="send" className="text-[18px]" />
          </>
        )}
      </Button>
    </form>
  );
}
