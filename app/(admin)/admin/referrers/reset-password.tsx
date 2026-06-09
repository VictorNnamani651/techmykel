"use client";

import { useActionState, useState } from "react";
import { resetReferrerPassword, type AdminState } from "@/app/actions/admin";
import { Alert, FieldError, Input } from "@/components/ui";

export function ResetPasswordButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<AdminState, FormData>(
    resetReferrerPassword,
    undefined,
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
      >
        Reset password
      </button>
    );
  }

  return (
    <form action={action} className="w-full space-y-2 sm:w-64">
      <input type="hidden" name="userId" value={userId} />
      {state?.ok && <Alert variant="success">{state.ok}</Alert>}
      {state?.error && <Alert variant="error">{state.error}</Alert>}
      <Input name="password" type="text" placeholder="Temporary password (min 8)" />
      <FieldError messages={state?.fieldErrors?.password} />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-lg bg-brand py-2 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          {pending ? "Setting…" : "Set password"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Close
        </button>
      </div>
    </form>
  );
}
