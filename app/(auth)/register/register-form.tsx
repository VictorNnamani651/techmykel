"use client";

import { useActionState } from "react";
import { register, type FormState } from "@/app/actions/auth";
import { TextField } from "@/components/fields";
import { Alert, Button } from "@/components/ui";
import { Icon } from "@/components/icon";

export function RegisterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    register,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error && <Alert variant="error">{state.error}</Alert>}
      <TextField
        name="fullName"
        label="Full name"
        icon="person"
        placeholder="Victor Nnamani"
        autoComplete="name"
        required
        error={state?.fieldErrors?.fullName}
      />
      <TextField
        name="phone"
        label="Phone number"
        type="tel"
        inputMode="tel"
        icon="call"
        placeholder="0801 234 5678"
        autoComplete="tel"
        required
        error={state?.fieldErrors?.phone}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        icon="key"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
        error={state?.fieldErrors?.password}
      />
      <p className="text-xs text-slate-500">
        We&apos;ll text you a 6-digit code to confirm this is your number.
      </p>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          "Sending code…"
        ) : (
          <>
            Continue <Icon name="arrow_forward" className="text-[18px]" />
          </>
        )}
      </Button>
    </form>
  );
}
